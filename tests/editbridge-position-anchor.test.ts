// @vitest-environment jsdom
/**
 * v8 iter-2 D17 — EditBridge must NOT clobber an already-positioned element's
 * position. It used to inject `[data-cms-img],…{ position:relative }`. Inner-page
 * heroes tag the full-bleed wrapper `<div class="absolute inset-0" data-cms-img="…">`;
 * that blanket rule (injected AFTER Tailwind, equal specificity → later wins) turned
 * the wrapper `relative`, so `inset-0` stopped stretching it → wrapper collapsed to
 * 0×0 → the `<Image fill>` child rendered 0×0 → the hero went BLANK in the editor.
 *
 * FIX: anchor the marching-ants `::after` by making only STATIC elements `relative`
 * (done in JS at tag time via computed-position check); elements already
 * absolute/fixed/sticky/relative keep their own position.
 *
 * RED-FIRST: with the blanket CSS rule, the absolute hero wrapper computes `relative`.
 */
import { describe, it, expect, afterEach } from "vitest";
import { mountEditor, type EditorHarness } from "./editbridge-harness";

let h: EditorHarness | null = null;
let authorStyle: HTMLStyleElement | null = null;
afterEach(async () => { if (h) { await h.unmount(); h = null; } if (authorStyle) { authorStyle.remove(); authorStyle = null; } });

describe("D17 — position rule does not clobber already-positioned elements", () => {
  it("an absolute inner-page hero wrapper keeps position:absolute when tagged", async () => {
    // Emulate Tailwind's `.absolute { position:absolute }` (present BEFORE EditBridge's
    // injected stylesheet, so the collision reproduces order-faithfully).
    authorStyle = document.createElement("style");
    authorStyle.textContent = `.absolute{position:absolute}`;
    document.head.appendChild(authorStyle);

    h = await mountEditor(`<section style="position:relative"><div class="absolute" data-cms-img="about-hero-bg" id="hero"></div><span data-cms="t:x" id="txt">hi</span></section>`);
    const hero = document.getElementById("hero")!;
    const txt = document.getElementById("txt")!;
    // D17 core: the full-bleed wrapper must NOT be forced to relative (else it collapses).
    expect(getComputedStyle(hero).position).toBe("absolute");
    // Static text still gets anchored so its ants ::after aligns to it.
    expect(getComputedStyle(txt).position).toBe("relative");
  });
});
