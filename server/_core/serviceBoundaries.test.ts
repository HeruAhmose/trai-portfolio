import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

const config = vi.hoisted(() => ({
  appId: "test-app",
  cookieSecret: "test-session-secret",
  databaseUrl: "",
  oAuthServerUrl: "",
  ownerOpenId: "",
  isProduction: false,
  forgeApiUrl: "",
  forgeApiKey: "synthetic-test-key",
}));
vi.mock("./env", () => ({ ENV: config }));

// Only the transport fixtures use HTTP loopback. The production HTTPS/origin
// validators are separately exercised below, without this test-only override.
vi.mock("./trustedOrigins", async importOriginal => {
  const actual = await importOriginal<typeof import("./trustedOrigins")>();
  const forFixture = (raw: string, resolve: (raw: string) => string) =>
    /^http:\/\/127\.0\.0\.1:\d+$/.test(raw) ? raw : resolve(raw);
  return {
    ...actual,
    resolveTrustedForgeOrigin: (raw: string) =>
      forFixture(raw, actual.resolveTrustedForgeOrigin),
    resolveTrustedOAuthOrigin: (raw: string) =>
      forFixture(raw, actual.resolveTrustedOAuthOrigin),
  };
});

let origin: Server;
let destination: Server;
let destinationUrl: string;
let redirectedRequests = 0;
let mode: "success" | "redirect" = "success";
const received: { url: string; body: string }[] = [];
let sdk: typeof import("./sdk").sdk;

async function listen(server: Server) {
  await new Promise<void>(resolve => server.listen(0, "127.0.0.1", resolve));
  return `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
}

beforeAll(async () => {
  vi.stubEnv("NO_PROXY", "127.0.0.1");
  destination = createServer((_req, res) => {
    redirectedRequests++;
    res.writeHead(200, { "content-type": "application/json" });
    res.end('{"escaped":true}');
  });
  destinationUrl = await listen(destination);
  origin = createServer(async (req, res) => {
    let body = "";
    for await (const chunk of req) body += chunk;
    received.push({ url: req.url ?? "", body });
    if (mode === "redirect") {
      res.writeHead(307, { location: `${destinationUrl}/must-not-receive` });
      res.end();
    } else {
      res.writeHead(200, { "content-type": "application/json" });
      res.end('{"ok":true,"accessToken":"synthetic-token","platforms":[]}');
    }
  });
  config.forgeApiUrl = config.oAuthServerUrl = await listen(origin);
  sdk = (await import("./sdk")).sdk;
});

beforeEach(() => {
  mode = "success";
  redirectedRequests = 0;
  received.length = 0;
});
afterAll(async () => {
  vi.unstubAllEnvs();
  await Promise.all(
    [origin, destination].map(
      server =>
        new Promise<void>((resolve, reject) => {
          server.close(error => (error ? reject(error) : resolve()));
          server.closeAllConnections();
        })
    )
  );
});

const calls = [
  {
    name: "LLM",
    path: "/v1/chat/completions",
    invoke: async () =>
      (await import("./llm")).invokeLLM({
        messages: [
          { role: "user", content: "https://untrusted.invalid/private" },
        ],
      }),
  },
  {
    name: "Maps",
    path: "/v1/maps/proxy/maps/api/geocode/json",
    invoke: async () =>
      (await import("./map")).makeRequest("/maps/api/geocode/json", {
        address: "https://untrusted.invalid/private",
      }),
  },
  {
    name: "OAuth code",
    path: "/webdev.v1.WebDevAuthPublicService/ExchangeToken",
    invoke: () =>
      sdk.exchangeCodeForToken(
        "synthetic-code",
        btoa("https://untrusted.invalid/callback")
      ),
  },
  {
    name: "OAuth token",
    path: "/webdev.v1.WebDevAuthPublicService/GetUserInfo",
    invoke: () => sdk.getUserInfo("https://untrusted.invalid/token"),
  },
  {
    name: "OAuth JWT",
    path: "/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt",
    invoke: () => sdk.getUserInfoWithJwt("https://untrusted.invalid/jwt"),
  },
];

describe.each(calls)("$name transport", ({ path, invoke }) => {
  it("keeps untrusted payload values on the configured service endpoint", async () => {
    await invoke();
    expect(received).toHaveLength(1);
    expect(new URL(received[0].url, config.forgeApiUrl).pathname).toBe(path);
    expect(redirectedRequests).toBe(0);
  });
  it("rejects a real 307 without sending anything to the redirect destination", async () => {
    mode = "redirect";
    await expect(invoke()).rejects.toThrow();
    expect(received).toHaveLength(1);
    expect(redirectedRequests).toBe(0);
  });
});

it.each([
  "/../../admin",
  "/maps/api/../../admin",
  "/maps/api/%2e%2e/admin",
  "/maps/api/geocode/json?key=override",
  "//untrusted.invalid",
  "/maps/api/\\admin",
])(
  "rejects endpoint navigation before making a request: %s",
  async endpoint => {
    const { makeRequest } = await import("./map");
    await expect(makeRequest(endpoint)).rejects.toThrow(/endpoint/);
    expect(received).toHaveLength(0);
  }
);

it.each([
  "",
  "http://example.com",
  "https://user:pass@example.com",
  "https://example.com/path",
  "https://example.com?target=other",
  "https://example.com#fragment",
  "not-a-url",
])(
  "production origin validators reject unsafe configuration: %s",
  async value => {
    const actual =
      await vi.importActual<typeof import("./trustedOrigins")>(
        "./trustedOrigins"
      );
    expect(() => actual.resolveTrustedForgeOrigin(value)).toThrow();
    expect(() => actual.resolveTrustedOAuthOrigin(value)).toThrow();
  }
);

it("production origin validators preserve a valid operator-selected HTTPS service", async () => {
  const actual =
    await vi.importActual<typeof import("./trustedOrigins")>(
      "./trustedOrigins"
    );
  expect(
    actual.resolveTrustedForgeOrigin(" https://service.example:8443/ ")
  ).toBe("https://service.example:8443");
  expect(actual.resolveTrustedOAuthOrigin("https://auth.example/")).toBe(
    "https://auth.example"
  );
});
