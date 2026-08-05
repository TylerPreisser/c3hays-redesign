import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

// The tests/ directory has existed since the initial commit but vitest was never a
// dependency in ANY commit — so all 41 files were dead letters. That is exactly how the
// site.social truth guard (tests/no-vimeo-no-podcast.test.ts) sat unexecuted while
// cec38a8 rewrote the values it guards. A guard that cannot run is not a guard.
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  // React 19 automatic runtime: the app's tsconfig uses "jsx": "preserve" for Next, so
  // esbuild needs to be told how to transform .tsx here.
  esbuild: { jsx: "automatic" },
  test: {
    environment: "node", // jsdom is opt-in per file via `// @vitest-environment jsdom`
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
  },
});
