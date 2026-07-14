import path from "node:path";

/**
 * Website Editor v6: lightweight vitest for c3hays LOGIC that deserves a unit test
 * (per the architect's test-infra call) — e.g. the reveal stamping. Pure-visual units
 * (component look, footer, seamless flow) stay on the 1440/1920 screenshot bar.
 *
 * Plain-object config (no `vitest/config` import) so it loads even though the
 * toolchain is borrowed from the sibling c3-backend node_modules.
 */
export default {
  test: { environment: "jsdom", include: ["tests/**/*.test.ts"] },
  resolve: { alias: { "@": path.resolve(process.cwd(), "src") } },
};
