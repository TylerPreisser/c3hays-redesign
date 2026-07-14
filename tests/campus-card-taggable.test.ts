// @vitest-environment jsdom
/**
 * v8 D1 + D5 — every "Our Churches" element must be a selectable editable component.
 * The campus cards were unreachable: the card wrapper had no `data-cms-bg` and its
 * <Image> had no `data-cms-img`, so EditBridge's bg/image selection paths never fired.
 * D5 also requires the NW-Kansas map tile and the teal chooser card to be selectable.
 *
 * We render the REAL LocationsSection to static markup and assert the CMS tags exist —
 * a structural guarantee independent of the editor. The live click-selection is then
 * proven by the Playwright DOM probe at 1440/1920.
 *
 * RED-FIRST: before the fix none of these attributes are emitted.
 */
import { describe, it, expect, beforeAll } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { locations } from "@/data/locations";

let html = "";
beforeAll(async () => {
  // LocationsSection imports gsap's ScrollTrigger, which calls window.matchMedia at
  // module-eval; jsdom lacks it. Stub before the (dynamic) import of the component.
  if (typeof window !== "undefined" && !window.matchMedia) {
    // @ts-expect-error minimal jsdom stub
    window.matchMedia = () => ({ matches: false, media: "", onchange: null, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent() { return false; } });
  }
  const { default: LocationsSection } = await import("@/components/home/LocationsSection");
  html = renderToStaticMarkup(createElement(LocationsSection, {}));
});

describe("D1 — campus cards are selectable editable components", () => {
  it.each(locations.map((l) => l.id))("campus card %s has data-cms-bg + its image has data-cms-img", (id) => {
    expect(html).toContain(`data-cms-bg="t:campus-${id}"`);
    expect(html).toContain(`data-cms-img="campus-${id}-photo"`);
  });
});

describe("D5 — the map tile and the teal chooser card are selectable", () => {
  it("NW-Kansas map container is a recolorable bg tile", () => {
    expect(html).toContain('data-cms-bg="t:findcampus-map"');
  });
  it("teal chooser card wrapper is a recolorable bg tile", () => {
    expect(html).toContain('data-cms-bg="t:findcampus-card"');
  });
});
