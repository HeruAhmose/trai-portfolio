import { defineConfig } from "vitest/config";
import path from "path";

const templateRoot = path.resolve(import.meta.dirname);

export default defineConfig({
  root: templateRoot,
  resolve: {
    alias: {
      "@": path.resolve(templateRoot, "client", "src"),
      "@shared": path.resolve(templateRoot, "shared"),
      "@assets": path.resolve(templateRoot, "attached_assets"),
    },
  },
  test: {
    environment: "node",
    include: [
      "server/**/*.test.ts",
      "server/**/*.spec.ts",
      // Only this data test, not the wider client/** suite -- the other
      // client-side *.test.ts files are pre-existing, dormant, and
      // untriaged (some may need a jsdom environment). Widening this
      // pattern is a separate decision from fixing the fabricated data
      // this test guards against.
      "client/src/components/__tests__/SearchablePatentClaims.test.ts",
    ],
  },
});
