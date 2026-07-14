// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest";
import { stampReveals, REVEAL_ATTRS } from "@/lib/reveal";

/**
 * Website Editor v6 — R6 (6b): the reveal STAMPING logic.
 *
 * Proves the render-pass contract the live player relies on: the stored per-path anim
 * map is stamped onto the right element (composite tile → its data-cms-bg CONTAINER,
 * section → its data-section wrapper), once, and cleared presets are skipped. The
 * IntersectionObserver reveal + reduced-motion guard are the CSS/visual layer
 * (screenshot acceptance); this locks the pure DOM logic.
 */
describe("v6 R6 6b — stampReveals", () => {
  beforeEach(() => { document.body.innerHTML = ""; });

  it("stamps data-anim onto a data-cms element by its raw path", () => {
    document.body.innerHTML = `<p data-cms="t:getintouch-heading">Hi</p>`;
    const stamped = stampReveals(document, { "t:getintouch-heading": "fadeInUp" });
    expect(stamped.length).toBe(1);
    expect(document.querySelector('[data-cms="t:getintouch-heading"]')!.getAttribute("data-anim")).toBe("fadeInUp");
  });

  it("COMPOSITE TILE: stamps the data-cms-bg CONTAINER, not its children (subtree rides one reveal)", () => {
    document.body.innerHTML = `<a data-cms-bg="tile:kids"><span data-cms="t:kids-title">Kids</span></a>`;
    stampReveals(document, { "tile:kids": "popIn" });
    expect(document.querySelector('[data-cms-bg="tile:kids"]')!.getAttribute("data-anim")).toBe("popIn");
    // the inner text region must NOT be stamped for the tile's path
    expect(document.querySelector('[data-cms="t:kids-title"]')!.hasAttribute("data-anim")).toBe(false);
  });

  it("stamps a whole SECTION on its data-section wrapper (keyed by section id)", () => {
    document.body.innerHTML = `<div data-section="hero"><h1>Hero</h1></div>`;
    stampReveals(document, { hero: "slideUp" });
    expect(document.querySelector('[data-section="hero"]')!.getAttribute("data-anim")).toBe("slideUp");
  });

  it("prefers data-cms-bg over data-section when a value could match both (priority order)", () => {
    expect(REVEAL_ATTRS.indexOf("data-cms-bg")).toBeLessThan(REVEAL_ATTRS.indexOf("data-section"));
  });

  it("skips cleared ('' ) presets and unknown paths, and never double-stamps", () => {
    document.body.innerHTML = `<div data-cms-bg="g:footer" data-anim="fadeIn"></div><p data-cms="t:x">x</p>`;
    const stamped = stampReveals(document, { "t:x": "", "bg:missing": "popIn", "g:footer": "slideDown" });
    expect(stamped.length).toBe(0); // t:x cleared, bg:missing absent, g:footer already stamped
    expect(document.querySelector('[data-cms-bg="g:footer"]')!.getAttribute("data-anim")).toBe("fadeIn"); // unchanged
    expect(document.querySelector('[data-cms="t:x"]')!.hasAttribute("data-anim")).toBe(false);
  });

  it("tolerates a null/undefined map", () => {
    expect(stampReveals(document, null)).toEqual([]);
    expect(stampReveals(document, undefined)).toEqual([]);
  });
});
