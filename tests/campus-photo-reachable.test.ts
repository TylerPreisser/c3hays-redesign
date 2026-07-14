// @vitest-environment jsdom
/**
 * v8 iter-2 D1 — the campus PHOTO must be hit-testable so EditBridge shows the
 * "Change image" chip (not just "Recolor"). The gradient + content overlays
 * (`absolute inset-0`) sat ABOVE the <Image> and swallowed the pointer, so
 * elementFromPoint always hit an overlay → only the card-bg Recolor was reachable.
 *
 * FIX (mirrors MeetGrowServe): the decorative gradient overlay is `pointer-events:none`
 * (clicks fall through to the photo → Change-image), and the content wrapper is anchored
 * to the BOTTOM only (`inset-x-0 bottom-0`, not full `inset-0`) so the photo zone above
 * it is free for the image while its own empty area still yields the card-bg Recolor —
 * BOTH reachable.
 *
 * RED-FIRST: currently the gradient overlay has no pointer-events and the content
 * wrapper is full-bleed `inset-0`.
 */
import { describe, it, expect, beforeAll } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";

let html = "";
beforeAll(async () => {
  if (typeof window !== "undefined" && !window.matchMedia) {
    // @ts-expect-error minimal jsdom stub (gsap ScrollTrigger reads matchMedia)
    window.matchMedia = () => ({ matches: false, media: "", onchange: null, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent() { return false; } });
  }
  const { default: LocationsSection } = await import("@/components/home/LocationsSection");
  html = renderToStaticMarkup(createElement(LocationsSection, {}));
});

describe("D1 — campus photo is reachable (Change-image), card-bg still recolorable", () => {
  it("the dark gradient overlay is click-through (pointer-events:none)", () => {
    // the specific campus scrim gradient must carry pointer-events:none
    expect(html).toMatch(/linear-gradient\(to top, rgba\(10,10,10,0\.9\)[^"]*pointer-events:\s*none/);
  });
  it("the content overlay is anchored bottom-only so the photo zone is exposed", () => {
    expect(html).toMatch(/class="absolute inset-x-0 bottom-0 flex flex-col justify-end"/);
    // and it is NO LONGER the full-bleed inset-0 that blocked the whole photo
    expect(html).not.toMatch(/class="absolute inset-0 flex flex-col justify-end"/);
  });
});
