import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { defineConfig, type Plugin, type ViteDevServer } from "vite";

const PROJECT_ROOT = import.meta.dirname;
const OBSERVER_PATH = path.join(
  PROJECT_ROOT,
  "tooling",
  "trai-dev-observer.js"
);
const LOG_DIR = path.join(PROJECT_ROOT, ".trai-dev-logs");
const MAX_REQUEST_BYTES = 128 * 1024;
const MAX_LOG_BYTES = 1 * 1024 * 1024;
const SENSITIVE_KEY =
  /password|passcode|token|secret|authorization|cookie|session|api.?key|credential/i;
type TelemetryBucket = "console" | "network" | "ui";

function sanitizeTelemetry(value: unknown, depth = 0): unknown {
  if (depth > 4) return "[max-depth]";
  if (value === null || typeof value === "boolean" || typeof value === "number")
    return value;
  if (typeof value === "string")
    return value.length > 500 ? `${value.slice(0, 500)}…` : value;
  if (Array.isArray(value))
    return value.slice(0, 100).map(item => sanitizeTelemetry(item, depth + 1));
  if (typeof value === "object") {
    const output: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(
      value as Record<string, unknown>
    ).slice(0, 100)) {
      output[key] = SENSITIVE_KEY.test(key)
        ? "[redacted]"
        : sanitizeTelemetry(item, depth + 1);
    }
    return output;
  }
  return String(value).slice(0, 500);
}

function appendTelemetry(bucket: TelemetryBucket, entries: unknown[]) {
  if (!entries.length) return;
  fs.mkdirSync(LOG_DIR, { recursive: true });
  const logPath = path.join(LOG_DIR, `${bucket}.log`);
  const lines = entries
    .slice(0, 100)
    .map(entry =>
      JSON.stringify({
        at: new Date().toISOString(),
        event: sanitizeTelemetry(entry),
      })
    );
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
      return {
        html,
        tags: [
          {
            tag: "script",
            attrs: { src: "/__trai_dev__/observer.js", defer: true },
            injectTo: "head",
          },
        ],
      };
    },
    configureServer(server: ViteDevServer) {
      server.middlewares.use("/__trai_dev__/observer.js", (req, res, next) => {
        if (req.method !== "GET") return next();
        res.writeHead(200, {
          "Content-Type": "text/javascript; charset=utf-8",
          "Cache-Control": "no-store",
        });
        res.end(fs.readFileSync(OBSERVER_PATH, "utf8"));
      });
      server.middlewares.use("/__trai_dev__/telemetry", (req, res, next) => {
        if (req.method !== "POST") return next();
        const contentType = String(req.headers["content-type"] || "")
          .split(";", 1)[0]
          .trim()
          .toLowerCase();
        if (contentType !== "application/json") {
          res.writeHead(415, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ ok: false, error: "json-required" }));
          return;
        }
        const host = req.headers.host;
        const origin = req.headers.origin;
        if (origin && host) {
          try {
            if (new URL(origin).host !== host)
              throw new Error("origin-mismatch");
          } catch {
            res.writeHead(403, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ ok: false, error: "same-origin-required" })
            );
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
  if (
    normalizedId.includes("/node_modules/react/") ||
    normalizedId.includes("/node_modules/react-dom/") ||
    normalizedId.includes("/node_modules/scheduler/")
  )
    return "vendor-react";
  if (normalizedId.includes("/node_modules/framer-motion/"))
    return "vendor-motion";
  if (
    normalizedId.includes("/node_modules/@tanstack/") ||
    normalizedId.includes("/node_modules/@trpc/") ||
    normalizedId.includes("/node_modules/superjson/")
  )
    return "vendor-data";
  if (normalizedId.includes("/node_modules/@react-three/"))
    return "vendor-react-three";
  if (normalizedId.includes("/node_modules/three/examples/"))
    return "vendor-three-addons";
  if (normalizedId.includes("/node_modules/three/")) return "vendor-three-core";
  return undefined;
}

const extraAllowedHosts = (process.env.TRAI_VITE_ALLOWED_HOSTS || "")
  .split(",")
  .map(host => host.trim())
  .filter(Boolean);

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
