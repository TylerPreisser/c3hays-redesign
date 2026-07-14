// @vitest-environment jsdom
/**
 * v8 D3 — the marching-ants `::after` overlay must OWN its geometry so that NO author
 * `::after` on the same element (e.g. globals.css `.nav-link-underline::after` which
 * declares `width:0;height:2px;bottom:-2px`) can leak in and collapse the ring to a
 * 0×2px sliver. The ants rule previously set only `inset:-3px` and declared NO
 * width/height, so a competing author `width:0`/`height:2px` won for those props and
 * the selection box vanished.
 *
 * DETERMINISTIC BACKSTOP: jsdom cannot compute `::after` geometry (getComputedStyle on
 * a pseudo returns ""), so the true non-zero RECT is verified by the Playwright DOM
 * probe at 1440/1920. Here we assert the CSS CONTRACT: the injected ants rule forces
 * top/right/bottom/left AND width/height with `!important`, which beats any author
 * `::after` regardless of specificity or declaration order.
 *
 * RED-FIRST: before the fix the ants `::after` uses `inset:-3px` (no !important, no
 * width/height), so every assertion below fails.
 */
import { describe, it, expect, afterEach } from "vitest";
import { mountEditor, editorStylesheet, type EditorHarness } from "./editbridge-harness";

let h: EditorHarness | null = null;
afterEach(async () => { if (h) { await h.unmount(); h = null; } });

/** Extract the single CSS block that styles the marching-ants `::after` overlay. */
function antsGeometryBlock(css: string): string {
  // The hover/selected `::after` rule that carries the repeating-linear-gradient ants.
  const norm = css.replace(/\s+/g, " ");
  const m = norm.match(/\.cms-sel::after\s*\{[^}]*repeating-linear-gradient[^}]*\}/);
  return m ? m[0] : "";
}

describe("D3 — ants ::after geometry is forced with !important (defeats author ::after leak)", () => {
  it("forces all four insets and width/height with !important on the ants overlay", async () => {
    h = await mountEditor(`<a data-cms-link="nav.home" class="nav-link-underline" href="/">Home</a>`);
    const css = (editorStylesheet()?.textContent || "").replace(/\s+/g, " ");
    const block = antsGeometryBlock(css);
    expect(block).not.toBe("");
    // Geometry pinned so an author width:0/height:2px cannot leak through.
    expect(block).toMatch(/top\s*:\s*-3px\s*!important/);
    expect(block).toMatch(/right\s*:\s*-3px\s*!important/);
    expect(block).toMatch(/bottom\s*:\s*-3px\s*!important/);
    expect(block).toMatch(/left\s*:\s*-3px\s*!important/);
    expect(block).toMatch(/width\s*:\s*auto\s*!important/);
    expect(block).toMatch(/height\s*:\s*auto\s*!important/);
  });
});
