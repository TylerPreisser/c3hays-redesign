// @vitest-environment jsdom
/**
 * v8 P4 — selecting/hovering a NAV link must NOT paint a SOLID GREEN BOX over the
 * label. Nav links carry `.nav-link-underline`, whose author `::after` sets
 * `background-color: var(--color-teal)` (globals.css). The editor's ants overlay
 * (D3 fix) pins the box to full size with `inset:-3px` + `width/height:auto`
 * `!important`, so that leaked solid teal fills the whole rectangle and covers the
 * text — unreadable. The ants themselves are drawn with `background-IMAGE`, so the
 * fix is to force `background-color: transparent !important` in the overlay: the
 * marching-ants ring survives, the label stays visible.
 *
 * jsdom cannot paint a real pseudo-element, so this unit locks the CSS invariant that
 * MAKES the live box readable (a Playwright DOM probe at 1440 asserts the rendered
 * text is visible + the ring non-zero). The companion D3 test (nav-ring-nonzero)
 * proves this fix does NOT regress the forced non-zero geometry.
 *
 * RED-FIRST: pre-fix the ants `::after` block declared NO background-color at all, so
 * the author teal leaked through and this assertion fails.
 */
import { describe, it, expect, afterEach } from "vitest";
import { mountEditor, editorStylesheet, type EditorHarness } from "./editbridge-harness";

let h: EditorHarness | null = null;
afterEach(async () => { if (h) { await h.unmount(); h = null; } });

describe("P4 — nav selection ants overlay resets background-color to transparent", () => {
  it("the marching-ants ::after forces background-color transparent (kills the leaked teal box)", async () => {
    // Reproduce the real cascade: the exact author rule from globals.css that paints
    // the solid teal fill (background-color: var(--color-teal)).
    const author = document.createElement("style");
    author.textContent = `.nav-link-underline::after{content:"";position:absolute;bottom:-2px;left:0;width:0;height:2px;background-color:var(--color-teal);}`;
    document.head.appendChild(author);

    h = await mountEditor(`<header><a data-cms-link="nav.about" class="nav-link-underline" href="/about">About</a></header>`);
    const link = document.querySelector('[data-cms-link="nav.about"]') as HTMLElement;
    link.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(link.classList.contains("cms-sel")).toBe(true);

    const css = (editorStylesheet()?.textContent || "").replace(/\s+/g, " ");
    // The ants overlay block (the one carrying the repeating-linear-gradient ants).
    const block = (css.match(/::after\s*\{[^}]*repeating-linear-gradient[^}]*\}/) || [""])[0];
    expect(block).toBeTruthy();
    // (fix) background-color forced transparent so the leaked teal cannot fill the box…
    expect(block).toMatch(/background-color\s*:\s*transparent\s*!important/);
    // …while the ants (background-IMAGE) are still present → ring keeps rendering.
    expect(block).toMatch(/background-image\s*:[^;]*repeating-linear-gradient/);

    author.remove();
  });
});
