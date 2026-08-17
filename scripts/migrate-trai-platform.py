from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]


def read(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


def write(path: str, text: str) -> None:
    target = ROOT / path
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(text, encoding="utf-8")


def replace(path: str, old: str, new: str, required: bool = True) -> None:
    text = read(path)
    if old not in text:
        if required:
            raise SystemExit(f"expected pattern missing in {path}: {old[:100]!r}")
        return
    write(path, text.replace(old, new))


# Remove obsolete vendor-owned files and rename generic auth contracts.
(ROOT / "client/public/__manus__/debug-collector.js").unlink()
(ROOT / "client/src/components/ManusDialog.tsx").unlink()
(ROOT / "server/_core/types/manusTypes.ts").rename(ROOT / "server/_core/types/oauthTypes.ts")

replace("client/src/_core/hooks/useAuth.ts", "manus-runtime-user-info", "trai-runtime-user-info", required=False)
replace("server/_core/sdk.ts", 'from "./types/manusTypes";', 'from "./types/oauthTypes";')
replace("server/_core/sdk.ts", "Create a session token for a Manus user openId", "Create a session token for an authenticated user openId")
replace("client/src/pages/ApiDocsPage.tsx", "Use Manus OAuth for protected endpoints.", "Use OAuth 2.0 session authentication for protected endpoints.")
replace("drizzle/schema.ts", "Manus OAuth identifier (openId) returned from the OAuth callback.", "OAuth identifier (openId) returned from the configured identity provider.")
replace("server/auth.logout.test.ts", 'loginMethod: "manus"', 'loginMethod: "oauth"')
replace("server/routers/features.ts", "provider: 'Manus OAuth'", "provider: 'OAuth 2.0'")
replace("server/routers/features.ts", "description: 'Use Manus OAuth for protected endpoints'", "description: 'Use OAuth 2.0 session authentication for protected endpoints'")
replace("server/_core/dataApi.ts", 'q: "manus"', 'q: "portfolio"')
replace("server/_core/map.ts", "Google Maps API Integration for Manus WebDev Templates", "Google Maps API integration for the TRAI application")
replace("server/_core/notification.ts", "through the Manus Notification Service.", "through the configured notification service.")
replace("server/storage.ts", "Preconfigured storage helpers for Manus WebDev templates", "Storage helpers for the TRAI application")
replace("MERGE.md", "v10 had reintroduced `/manus-storage/` paths that do not exist in the", "v10 had reintroduced legacy remote storage paths that do not exist in the")

# Remove the obsolete vendor-host compatibility layer from the organism protocol.
organism = read("client/public/trai-organism-v5.js")
organism = organism.replace('  var legacyHost = ["manus", "computer"].join(".");\n', "")
organism, helper_count = re.subn(
    r'\n  function isLegacyHost\(hostname\) \{.*?\n  \}\n',
    "\n",
    organism,
    count=1,
    flags=re.S,
)
organism, first_call_count = re.subn(
    r'\n    if \(isLegacyHost\(url\.hostname\)\) \{\n      return state\.worlds\.get\("peoples"\) \|\| null;\n    \}\n',
    "\n",
    organism,
    count=1,
)
organism, second_call_count = re.subn(
    r'\n    if \(isLegacyHost\(url\.hostname\)\) \{\n      var peoples = state\.worlds\.get\("peoples"\);\n      if \(peoples && peoples\.url\) \{\n        anchor\.href = peoples\.url;\n        anchor\.dataset\.traiWorld = "peoples";\n        anchor\.dataset\.traiLegacyRewritten = "true";\n      \}\n      return;\n    \}\n',
    "\n",
    organism,
    count=1,
)
if (helper_count, first_call_count, second_call_count) != (1, 1, 1):
    raise SystemExit(
        f"legacy-host removal counts unexpected: helper={helper_count} first={first_call_count} second={second_call_count}"
    )
if "isLegacyHost" in organism or "legacyHost" in organism:
    raise SystemExit("legacy host compatibility code remains")
write("client/public/trai-organism-v5.js", organism)

# Replace dead remote image routes with local TRAI-owned production assets.
mela = read("client/src/pages/MelaNation.tsx")
for old, new in {
    "/manus-storage/melanation-vision_5ef466eb.webp": "/media/tamerian/living-circuit.jpg",
    "/manus-storage/melanation-vision2_5d0c730a.webp": "/media/tamerian/chamber-rendering.jpg",
    "/manus-storage/melanation-vision3_d5b70061.webp": "/media/tamerian/honeycomb.jpg",
    "/manus-storage/melanation-vision4_65ca4327.webp": "/media/tamerian/helix-lab.jpg",
}.items():
    if old not in mela:
        raise SystemExit(f"missing Mela Nation asset path: {old}")
    mela = mela.replace(old, new)
write("client/src/pages/MelaNation.tsx", mela)

# Upgrade the domain page from a fake random result to deterministic hostname validation.
domain = read("client/src/pages/DomainConfiguration.tsx")
domain = domain.replace("// Simulate domain check", "// Validate syntax locally; registrar availability is checked separately.")
domain = domain.replace("await new Promise((resolve) => setTimeout(resolve, 1500));", "await new Promise((resolve) => setTimeout(resolve, 150));")
domain = domain.replace(
    "// Mock check - in production, call actual API\n    const isAvailable = Math.random() > 0.3;",
    "const isAvailable = /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\\.)+[a-z]{2,63}$/i.test(domain.trim());",
)
old_records = """      setDnsRecords([
        { type: 'A', value: '203.0.113.42' },
        { type: 'CNAME', value: 'manus.space' },
        { type: 'TXT', value: 'v=spf1 include:manus.space ~all' },
      ]);"""
new_records = """      const deploymentHost = import.meta.env.VITE_SITE_URL
        ? new URL(import.meta.env.VITE_SITE_URL).hostname
        : window.location.hostname;
      setDnsRecords([
        { type: 'CNAME', value: deploymentHost },
        { type: 'TXT', value: 'trai-domain-verification=<token-from-hosting-provider>' },
      ]);"""
if old_records not in domain:
    raise SystemExit("expected legacy DNS records missing")
domain = domain.replace(old_records, new_records)
domain = domain.replace("Step 1: Check Domain Availability", "Step 1: Validate Domain Format")
domain = domain.replace("Checking domain availability...", "Validating domain format...")
domain = domain.replace("is available!", "is ready for DNS configuration.")
domain = domain.replace("is already taken", "is not a valid hostname")
domain = domain.replace(
    "Add the following DNS records to your domain provider:",
    "Use these deployment-neutral examples as a starting point; confirm the exact records and verification token with your hosting provider:",
)
write("client/src/pages/DomainConfiguration.tsx", domain)

# Keep integration expectations provider-neutral.
test = read("server/__tests__/completeIntegration.test.ts")
test = test.replace("{ type: 'CNAME', value: 'manus.space' },", "{ type: 'CNAME', value: 'trai.org' },")
write("server/__tests__/completeIntegration.test.ts", test)

# Replace the old single-vendor sandbox fact rule with the stronger zero-vendor CI guard.
facts = read("scripts/check-facts.mjs")
facts = re.sub(r"^\s*\{ re: /manus\\\.computer/i, why: 'temporary sandbox URL' \},\n", "", facts, flags=re.M)
write("scripts/check-facts.mjs", facts)

# Provider origins are explicit configuration, HTTPS-only, and origin-only.
write(
    "server/_core/trustedOrigins.ts",
    '''function parseServiceOrigin(raw: string, label: string): URL {
  const value = raw.trim();
  if (!value) throw new Error(`${label} is not configured`);

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${label} must be an absolute URL`);
  }

  if (url.protocol !== "https:") throw new Error(`${label} must use HTTPS`);
  if (url.username || url.password) throw new Error(`${label} must not contain embedded credentials`);
  if (url.pathname !== "/" || url.search || url.hash) throw new Error(`${label} must be an origin only`);
  return url;
}

export function resolveTrustedForgeOrigin(raw: string): string {
  return parseServiceOrigin(raw, "BUILT_IN_FORGE_API_URL").origin;
}

export function resolveTrustedOAuthOrigin(raw: string): string {
  return parseServiceOrigin(raw, "OAUTH_SERVER_URL").origin;
}
''',
)
replace(
    "server/_core/llm.ts",
    'const configured = ENV.forgeApiUrl?.trim() || "https://forge.manus.im";\n  const origin = resolveTrustedForgeOrigin(configured);',
    'const configured = ENV.forgeApiUrl?.trim();\n  if (!configured) {\n    throw new Error("BUILT_IN_FORGE_API_URL is not configured");\n  }\n  const origin = resolveTrustedForgeOrigin(configured);',
)
replace("server/_core/storageProxy.ts", 'app.get("/manus-storage/*key"', 'app.get("/api/storage/*key"')
replace(
    "server/_core/vite.ts",
    """  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };""",
    """  const serverOptions = {
    ...viteConfig.server,
    middlewareMode: true,
    hmr: { server },
  };""",
)

# First-party dev observer: metadata only; bounded, redacted, no bodies/headers/query values/form values/replay.
write(
    "tooling/trai-dev-observer.js",
    r'''(function () {
  "use strict";
  if (window.__TRAI_DEV_OBSERVER__) return;
  var ENDPOINT = "/__trai_dev__/telemetry";
  var MAX = 100;
  var store = { console: [], network: [], ui: [] };
  var sensitive = /password|passcode|token|secret|authorization|cookie|session|api.?key|credential/i;

  function safeString(value) {
    var text = String(value == null ? "" : value);
    return text.length > 500 ? text.slice(0, 500) + "…" : text;
  }
  function sanitize(value, depth) {
    if (depth > 4) return "[max-depth]";
    if (value == null || typeof value === "boolean" || typeof value === "number") return value;
    if (typeof value === "string") return safeString(value);
    if (value instanceof Error) return { name: value.name, message: safeString(value.message) };
    if (Array.isArray(value)) return value.slice(0, 50).map(function (item) { return sanitize(item, depth + 1); });
    if (typeof value === "object") {
      var out = {};
      Object.keys(value).slice(0, 50).forEach(function (key) {
        out[key] = sensitive.test(key) ? "[redacted]" : sanitize(value[key], depth + 1);
      });
      return out;
    }
    return safeString(value);
  }
  function push(bucket, entry) {
    store[bucket].push(entry);
    if (store[bucket].length > MAX) store[bucket].splice(0, store[bucket].length - MAX);
  }

  ["log", "info", "warn", "error", "debug"].forEach(function (level) {
    var original = console[level];
    if (typeof original !== "function") return;
    console[level] = function () {
      try {
        push("console", { at: Date.now(), level: level, args: Array.prototype.slice.call(arguments).map(function (arg) { return sanitize(arg, 0); }) });
      } catch (_) {}
      return original.apply(console, arguments);
    };
  });

  var originalFetch = window.fetch;
  if (typeof originalFetch === "function") {
    window.fetch = async function (input, init) {
      var started = performance.now();
      var method = (init && init.method) || (input && input.method) || "GET";
      var url;
      try { url = new URL(typeof input === "string" ? input : input.url, location.href); } catch (_) { url = null; }
      try {
        var response = await originalFetch.apply(this, arguments);
        if (url && url.pathname !== ENDPOINT) push("network", { at: Date.now(), method: method, path: url.pathname, status: response.status, durationMs: Math.round(performance.now() - started) });
        return response;
      } catch (error) {
        if (url && url.pathname !== ENDPOINT) push("network", { at: Date.now(), method: method, path: url.pathname, error: safeString(error && error.message), durationMs: Math.round(performance.now() - started) });
        throw error;
      }
    };
  }

  function ignored(target) {
    return target instanceof Element && !!target.closest('.trai-no-record,[data-trai-observe="off"],[data-private]');
  }
  document.addEventListener("click", function (event) {
    var target = event.target;
    if (!(target instanceof Element) || ignored(target)) return;
    push("ui", { at: Date.now(), kind: "click", tag: target.tagName.toLowerCase(), role: target.getAttribute("role"), label: safeString(target.getAttribute("aria-label") || "") });
  }, true);
  document.addEventListener("input", function (event) {
    var target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) || ignored(target)) return;
    push("ui", { at: Date.now(), kind: "input", tag: target.tagName.toLowerCase(), type: target.getAttribute("type") || null, valueLength: String(target.value || "").length });
  }, true);

  async function flush() {
    if (!store.console.length && !store.network.length && !store.ui.length) return;
    var payload = { console: store.console.splice(0), network: store.network.splice(0), ui: store.ui.splice(0) };
    try {
      await originalFetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), keepalive: true });
    } catch (_) {}
  }
  setInterval(flush, 3000);
  window.addEventListener("pagehide", flush);
  window.__TRAI_DEV_OBSERVER__ = { flush: flush };
})();
''',
)

write(
    "vite.config.ts",
    r'''import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { defineConfig, type Plugin, type ViteDevServer } from "vite";

const PROJECT_ROOT = import.meta.dirname;
const OBSERVER_PATH = path.join(PROJECT_ROOT, "tooling", "trai-dev-observer.js");
const LOG_DIR = path.join(PROJECT_ROOT, ".trai-dev-logs");
const MAX_REQUEST_BYTES = 128 * 1024;
const MAX_LOG_BYTES = 1 * 1024 * 1024;
const SENSITIVE_KEY = /password|passcode|token|secret|authorization|cookie|session|api.?key|credential/i;
type TelemetryBucket = "console" | "network" | "ui";

function sanitizeTelemetry(value: unknown, depth = 0): unknown {
  if (depth > 4) return "[max-depth]";
  if (value === null || typeof value === "boolean" || typeof value === "number") return value;
  if (typeof value === "string") return value.length > 500 ? `${value.slice(0, 500)}…` : value;
  if (Array.isArray(value)) return value.slice(0, 100).map((item) => sanitizeTelemetry(item, depth + 1));
  if (typeof value === "object") {
    const output: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value as Record<string, unknown>).slice(0, 100)) {
      output[key] = SENSITIVE_KEY.test(key) ? "[redacted]" : sanitizeTelemetry(item, depth + 1);
    }
    return output;
  }
  return String(value).slice(0, 500);
}

function appendTelemetry(bucket: TelemetryBucket, entries: unknown[]) {
  if (!entries.length) return;
  fs.mkdirSync(LOG_DIR, { recursive: true });
  const logPath = path.join(LOG_DIR, `${bucket}.log`);
  const lines = entries.slice(0, 100).map((entry) => JSON.stringify({ at: new Date().toISOString(), event: sanitizeTelemetry(entry) }));
  fs.appendFileSync(logPath, `${lines.join("\n")}\n`, "utf8");
  if (fs.statSync(logPath).size > MAX_LOG_BYTES) {
    const data = fs.readFileSync(logPath);
    fs.writeFileSync(logPath, data.subarray(Math.floor(data.length * 0.5)));
  }
}

function vitePluginTraiDevObservatory(): Plugin {
  return {
    name: "trai-dev-observatory",
    apply: "serve",
    transformIndexHtml(html) {
      return { html, tags: [{ tag: "script", attrs: { src: "/__trai_dev__/observer.js", defer: true }, injectTo: "head" }] };
    },
    configureServer(server: ViteDevServer) {
      server.middlewares.use("/__trai_dev__/observer.js", (req, res, next) => {
        if (req.method !== "GET") return next();
        res.writeHead(200, { "Content-Type": "text/javascript; charset=utf-8", "Cache-Control": "no-store" });
        res.end(fs.readFileSync(OBSERVER_PATH, "utf8"));
      });
      server.middlewares.use("/__trai_dev__/telemetry", (req, res, next) => {
        if (req.method !== "POST") return next();
        const contentType = String(req.headers["content-type"] || "").split(";", 1)[0].trim().toLowerCase();
        if (contentType !== "application/json") {
          res.writeHead(415, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ ok: false, error: "json-required" }));
          return;
        }
        const host = req.headers.host;
        const origin = req.headers.origin;
        if (origin && host) {
          try {
            if (new URL(origin).host !== host) throw new Error("origin-mismatch");
          } catch {
            res.writeHead(403, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ ok: false, error: "same-origin-required" }));
            return;
          }
        }
        let body = "";
        let bytes = 0;
        let rejected = false;
        req.on("data", (chunk: Buffer) => {
          if (rejected) return;
          bytes += chunk.length;
          if (bytes > MAX_REQUEST_BYTES) {
            rejected = true;
            res.writeHead(413, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ ok: false, error: "payload-too-large" }));
            req.destroy();
            return;
          }
          body += chunk.toString("utf8");
        });
        req.on("end", () => {
          if (rejected) return;
          try {
            const payload = JSON.parse(body || "{}") as Record<string, unknown>;
            for (const bucket of ["console", "network", "ui"] as const) {
              const entries = payload[bucket];
              if (Array.isArray(entries)) appendTelemetry(bucket, entries);
            }
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ ok: true }));
          } catch {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ ok: false, error: "invalid-json" }));
          }
        });
      });
    },
  };
}

function manualChunks(id: string): string | undefined {
  const normalizedId = id.replace(/\\/g, "/");
  if (!normalizedId.includes("/node_modules/")) return undefined;
  if (normalizedId.includes("/node_modules/react/") || normalizedId.includes("/node_modules/react-dom/") || normalizedId.includes("/node_modules/scheduler/")) return "vendor-react";
  if (normalizedId.includes("/node_modules/framer-motion/")) return "vendor-motion";
  if (normalizedId.includes("/node_modules/@tanstack/") || normalizedId.includes("/node_modules/@trpc/") || normalizedId.includes("/node_modules/superjson/")) return "vendor-data";
  if (normalizedId.includes("/node_modules/@react-three/")) return "vendor-react-three";
  if (normalizedId.includes("/node_modules/three/examples/")) return "vendor-three-addons";
  if (normalizedId.includes("/node_modules/three/")) return "vendor-three-core";
  return undefined;
}

const extraAllowedHosts = (process.env.TRAI_VITE_ALLOWED_HOSTS || "").split(",").map((host) => host.trim()).filter(Boolean);

export default defineConfig({
  plugins: [react(), tailwindcss(), vitePluginTraiDevObservatory()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: { output: { manualChunks } },
  },
  server: {
    host: true,
    allowedHosts: ["localhost", "127.0.0.1", ...extraAllowedHosts],
    fs: { strict: true, deny: ["**/.*"] },
  },
});
''',
)

env = read(".env.example")
if "TRAI_VITE_ALLOWED_HOSTS=" not in env:
    env += "\n# Optional comma-separated dev-server hostnames beyond localhost.\nTRAI_VITE_ALLOWED_HOSTS=\n"
write(".env.example", env)

ignore = read(".gitignore")
if ".trai-dev-logs/" not in ignore:
    ignore += "\n.trai-dev-logs/\n"
write(".gitignore", ignore)
