// @vitest-environment jsdom
/**
 * B1 — the "Our Churches" NW-Kansas map tile was only a recolorable bg tile
 * (`data-cms-bg="t:findcampus-map"` wrapping a hardcoded <svg>, NO image element), so
 * EditBridge could only offer *Recolor*, never *Change image* — the map "thought it was
 * a tile". FIX: layer a swappable `<Image data-cms-img="findcampus-map-photo">` in the
 * tile (mirrors the campus-card pattern) so Change-image is offered, with the SVG map as
 * the default/fallback when no photo is set, and the outer data-cms-bg kept for Recolor.
 *
 * Structural guarantee (the live dual-chip hover is a Playwright job): the render carries
 * BOTH tags AND still emits the default SVG map.
 *
 * RED-FIRST: before the fix there is no `data-cms-img="findcampus-map-photo"`.
 */
import { describe, it, expect, beforeAll } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";

let html = "";
beforeAll(async () => {
  // LocationsSection imports gsap's ScrollTrigger (reads window.matchMedia at module-eval).
  if (typeof window !== "undefined" && !window.matchMedia) {
    // @ts-expect-error minimal jsdom stub
    window.matchMedia = () => ({ matches: false, media: "", onchange: null, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent() { return false; } });
  }
  const { default: LocationsSection } = await import("@/components/home/LocationsSection");
  html = renderToStaticMarkup(createElement(LocationsSection, {}));
});

describe("B1 — the map tile is a swappable image AND a recolorable tile", () => {
  it("carries a data-cms-img so EditBridge offers Change-image on the map", () => {
    expect(html).toContain('data-cms-img="findcampus-map-photo"');
  });
  it("keeps the outer data-cms-bg so Recolor still works too", () => {
    expect(html).toContain('data-cms-bg="t:findcampus-map"');
  });
  it("still renders the stylized SVG map as the default fallback", () => {
    expect(html).toContain("Map of C3 campuses across northwest Kansas");
  });
});
