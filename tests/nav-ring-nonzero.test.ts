// @vitest-environment jsdom
/**
 * v8 D3 (regression) — selecting a NAV link that ALSO owns the brand
 * `.nav-link-underline::after` must still produce a full-size marching-ants ring,
 * not the collapsed 0×2px sliver caused by the author `::after` colliding with the
 * editor's `::after`.
 *
 * jsdom cannot compute a real pseudo-element rect, so the LITERAL non-zero rectangle
 * is asserted by the Playwright DOM probe at 1440/1920. This unit locks the two
 * invariants that MAKE the rect non-zero:
 *   (1) the nav link is genuinely selectable (gets .cms-sel + posts cms:select), and
 *   (2) the editor's ants `::after` forces width/height with !important so the
 *       co-resident author `::after {width:0;height:2px}` cannot win those props.
 *
 * RED-FIRST: pre-fix the ants rule declares no width/height and no !important, so the
 * author `width:0` leaks in and (2) fails.
 */
import { describe, it, expect, afterEach } from "vitest";
import { mountEditor, editorStylesheet, type EditorHarness } from "./editbridge-harness";

let h: EditorHarness | null = null;
afterEach(async () => { if (h) { await h.unmount(); h = null; } });

describe("D3 — nav selection ring survives the .nav-link-underline::after collision", () => {
  it("nav link with the competing author ::after is selectable AND keeps forced geometry", async () => {
    // Reproduce the real cascade: inject the exact author rule from globals.css that
    // collapses the box (width:0; height:2px; bottom:-2px).
    const author = document.createElement("style");
    author.textContent = `.nav-link-underline::after{content:"";position:absolute;bottom:-2px;left:0;width:0;height:2px;background:var(--color-teal);}`;
    document.head.appendChild(author);

    h = await mountEditor(`<header><a data-cms-link="nav.home" class="nav-link-underline" href="/">Home</a></header>`);
    const link = document.querySelector('[data-cms-link="nav.home"]') as HTMLElement;
    link.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    // (1) genuinely selectable
    expect(link.classList.contains("cms-sel")).toBe(true);

    // (2) the ants overlay forces its geometry with !important so the author width:0/
    // height:2px cannot collapse the ring (this is what makes the live rect non-zero).
    const css = (editorStylesheet()?.textContent || "").replace(/\s+/g, " ");
    const block = (css.match(/\.cms-sel::after\s*\{[^}]*repeating-linear-gradient[^}]*\}/) || [""])[0];
    expect(block).toMatch(/width\s*:\s*auto\s*!important/);
    expect(block).toMatch(/height\s*:\s*auto\s*!important/);
    expect(block).toMatch(/(?:top|inset)\s*:\s*-3px\s*!important/);

    author.remove();
  });
});
