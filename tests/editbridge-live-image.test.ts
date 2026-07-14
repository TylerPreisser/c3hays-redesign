// @vitest-environment jsdom
/**
 * v7 R9 (U8) — c3hays side: the cms:setImg preview shim repaints an ON-SCREEN,
 * already-in-view <img> immediately (src swapped in place), with NO iframe reload —
 * the DOM node is mutated, not remounted. This is the receiving half of the live
 * in-place update (the c3-backend HomeEditor now sends it without reloading).
 */
import { describe, it, expect, afterEach } from "vitest";
import { mountEditor, type EditorHarness } from "./editbridge-harness";

let h: EditorHarness | null = null;
afterEach(async () => { if (h) { await h.unmount(); h = null; } });

const setImg = (path: string, src: string) =>
  window.dispatchEvent(new MessageEvent("message", { data: { source: "c3editor", type: "cms:setImg", path, src } }));

describe("R9 — in-view image updates in place via cms:setImg", () => {
  it("swaps the visible <img> src with no remount", async () => {
    h = await mountEditor(`<section data-section="nt26"><div data-cms-img="nt26.image"><img src="http://localhost/old.webp" srcset="http://localhost/old.webp 1x"></div></section>`);
    const img = document.querySelector('[data-cms-img="nt26.image"] img') as HTMLImageElement;
    const before = img; // same node reference must survive (no remount)
    setImg("nt26.image", "http://localhost/new.webp");
    expect(img.getAttribute("src")).toBe("http://localhost/new.webp");
    // srcset is cleared so it can't override the swap; still the SAME element (in place)
    expect(img.getAttribute("srcset")).toBeNull();
    expect(document.querySelector('[data-cms-img="nt26.image"] img')).toBe(before);
  });
});
