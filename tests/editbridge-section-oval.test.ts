// @vitest-environment jsdom
/**
 * v7 R5 (U3) — the on-canvas green "▚ Edit section" oval (#c3-sec-handle, top-left)
 * is GONE. Section editing happens by clicking the section's card in the RIGHT rail
 * (SectionDock in c3-backend already sets secSel), not a floating pill on the canvas.
 *
 * RED-FIRST: EditBridge currently creates #c3-sec-handle and shows it on section hover.
 */
import { describe, it, expect, afterEach } from "vitest";
import { mountEditor, type EditorHarness } from "./editbridge-harness";

let h: EditorHarness | null = null;
afterEach(async () => { if (h) { await h.unmount(); h = null; } });

describe("R5 — no on-canvas section oval", () => {
  it("does not create the #c3-sec-handle pill in edit mode", async () => {
    h = await mountEditor(`<section data-section="mission"><h2 data-cms="mission.html">Hi</h2></section>`);
    expect(document.getElementById("c3-sec-handle")).toBeNull();
  });

  it("hovering a section does NOT reveal any 'Edit section' oval", async () => {
    h = await mountEditor(`<section data-section="mission"><h2 data-cms="mission.html">Hi</h2></section>`);
    const sec = document.querySelector('[data-section="mission"]') as HTMLElement;
    sec.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    // no element anywhere advertises the section-edit pill
    const pill = Array.from(document.querySelectorAll("button")).find((b) => /Edit section/i.test(b.textContent || ""));
    expect(pill).toBeUndefined();
    expect(document.getElementById("c3-sec-handle")).toBeNull();
  });
});
