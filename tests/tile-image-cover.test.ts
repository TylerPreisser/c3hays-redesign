// @vitest-environment jsdom
/**
 * Phase 3 — swappable tile images must FILL their tile (crop-to-cover), never
 * letterbox with black bars. Two guarantees:
 *   1. globals.css carries a site-wide rule forcing `img[data-cms-img]` (excluding
 *      logos) to object-fit:cover + full size — so EVERY swapped tile image covers.
 *   2. The "Our churches" map tile's default SVG uses preserveAspectRatio="…slice"
 *      so the empty/default state covers the tile too (no bars behind the map).
 */
import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "fs";
import path from "path";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";

describe("Phase 3 — global tile-image cover rule", () => {
  const css = readFileSync(path.resolve(process.cwd(), "src/app/globals.css"), "utf8");
  it("forces content/tile images to object-fit:cover", () => {
    expect(css).toMatch(/img\[data-cms-img\]/);
    expect(css).toMatch(/object-fit:\s*cover/);
  });
  it("excludes logos so wordmarks are never squashed", () => {
    expect(css).toMatch(/:not\(\[data-cms-img\^="g:logo"\]\)/);
  });
});

describe("Phase 3 — map tile default state covers (no black bars)", () => {
  let html = "";
  beforeAll(async () => {
    if (typeof window !== "undefined" && !window.matchMedia) {
      // @ts-expect-error minimal jsdom stub for gsap ScrollTrigger module-eval
      window.matchMedia = () => ({ matches: false, media: "", onchange: null, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent() { return false; } });
    }
    const { default: LocationsSection } = await import("@/components/home/LocationsSection");
    html = renderToStaticMarkup(createElement(LocationsSection, {}));
  });
  it("map SVG uses preserveAspectRatio slice so it fills the tile", () => {
    expect(html).toContain('preserveAspectRatio="xMidYMid slice"');
  });
});
