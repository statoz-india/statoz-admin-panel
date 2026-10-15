import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const root = path.resolve(__dirname);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: /^@\//, replacement: `${root}/` }],
  },
  test: {
    include: ["tests/**/*.test.{ts,tsx}"],
    // Server code (route handlers, scrapers, engines) runs in Node; component
    // and hook tests opt into jsdom with a `@vitest-environment jsdom` docblock.
    environment: "node",
    setupFiles: ["tests/setup.ts"],
    // Route modules read this at import time.
    env: { API_BASE_URL: "https://backend.test/api/v1" },
    clearMocks: true,
    restoreMocks: true,
    unstubGlobals: true,
    unstubEnvs: true,
    coverage: {
      provider: "v8",
      reporter: ["text-summary", "html", "lcov"],
      include: ["app/**/*.{ts,tsx}", "lib/**/*.ts", "components/**/*.tsx"],
      exclude: ["**/*.d.ts"],
      // Floors a little under today's numbers: CI fails if new logic lands
      // untested or coverage drops. Raise them as coverage grows.
      thresholds: {
        lines: 35,
        branches: 60,
        functions: 45,
        "app/api/utils/**": { lines: 95, branches: 85, functions: 95 },
        "app/api/**/*proxy.ts": { lines: 95, branches: 90, functions: 95 },
        "app/api/**/route.ts": { lines: 55, branches: 50, functions: 90 },
        "app/interface/**": { lines: 95, branches: 95, functions: 95 },
        "app/utils/**": { lines: 80, branches: 85, functions: 85 },
        "app/constants/**": { lines: 95, branches: 95, functions: 95 },
        "app/store/**": { lines: 90, branches: 85, functions: 90 },
      },
    },
  },
});
