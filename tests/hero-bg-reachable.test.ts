// @vitest-environment jsdom
/**
 * v8 iter-2 D3 caveat — the home hero BACKGROUND (`<Image data-cms-img="hero.bg">`) sits
 * under the scrim overlays + the centered content column, so elementFromPoint never hit
 * the photo and it couldn't be swapped. FIX: the scrim overlays are
 * `pointer-events:none`, and the content column is `pointer-events:none` with its H1/CTA
 * children re-enabled (`pointer-events:auto`) — empty hero areas fall through to the
 * photo (Change-image reachable) while the headline stays editable and the CTAs clickable.
 *
 * RED-FIRST: none of the hero overlays carry pointer-events today.
 *
 * D169 RECONCILIATION (2026-08-05): the vertical-scrim case matched the literal
 * `rgba(10,10,10,0.6)` gradient string. That colour was retuned to the `#1b1c1c` page
 * base (`rgba(27,28,28,0.58) → #1b1c1c`) so the hero dissolves into the section under
 * it — a paint change that cannot affect hit-testing, yet it failed a hit-testing
 * guard. Worse, the grep was ALSO too weak in the other direction: it passed as long as
 * ONE known gradient was click-through, so a NEW scrim added over the photo would have
 * sailed through and re-broken Change-image. Replaced with the structural invariant:
 * every overlay stacked over the photo inside the hero's media layer is click-through,
 * whatever it is painted with.
 */
import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import Hero from "@/components/home/Hero";

const html = renderToStaticMarkup(createElement(Hero, {})); // defaults → classic variant

function dom(markup: string): HTMLElement {
  const host = document.createElement("div");
  host.innerHTML = markup;
  return host;
}

/** The hero media layer: the wrapper that holds the swappable hero.bg photo. */
function mediaLayer(host: HTMLElement): HTMLElement {
  const img = host.querySelector('[data-cms-img="hero.bg"]');
  expect(img, "hero.bg image is missing — nothing to swap").not.toBeNull();
  return img!.parentElement as HTMLElement;
}

describe("D3 — home hero background photo is reachable for swap", () => {
  it("EVERY overlay stacked over the photo is click-through", () => {
    const host = dom(html);
    const layer = mediaLayer(host);
    // Siblings of the photo inside the media layer are, by construction, the scrims
    // painted over it (vertical grade + vignette). Any one of them left hit-testable
    // swallows the click that must reach the photo.
    const overlays = Array.from(layer.children).filter(
      (el) => el.getAttribute("data-cms-img") !== "hero.bg",
    ) as HTMLElement[];
    expect(overlays.length).toBeGreaterThan(0);
    for (const el of overlays) {
      expect(
        el.style.pointerEvents,
        `hero overlay is hit-testable and will swallow Change-image: ${el.getAttribute("style")}`,
      ).toBe("none");
    }
  });

  it("the photo itself stays hit-testable (it is the swap target)", () => {
    const img = dom(html).querySelector('[data-cms-img="hero.bg"]') as HTMLElement;
    expect(img.style.pointerEvents).not.toBe("none");
  });

  it("the content column is click-through with interactive children re-enabled", () => {
    const host = dom(html);
    const column = host.querySelector(".relative.z-10") as HTMLElement;
    expect(column).not.toBeNull();
    expect(column.style.pointerEvents).toBe("none");
    // …and the editable headline + the CTA row opt back IN, or nothing is clickable.
    const heading = host.querySelector('[data-cms="hero.heading"]') as HTMLElement;
    expect(heading.style.pointerEvents).toBe("auto");
    const cta = host.querySelector('[data-cms-link="hero.cta"]');
    expect(cta).not.toBeNull();
    expect((cta!.closest('[style*="pointer-events:auto"]'))).not.toBeNull();
  });
});
