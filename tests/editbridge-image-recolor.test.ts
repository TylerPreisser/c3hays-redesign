// @vitest-environment jsdom
/**
 * v7 R7 (U4) — images are NOT recolorable. Hovering an image must NOT reveal the
 * purple "🎨 Recolor" chip (#c3-bg-handle). The real repro: a [data-cms-img] sits
 * INSIDE a [data-cms-bg] wrapper (e.g. MeetGrowServe pillar photo), so hovering the
 * image bubbles to the bg and shows recolor. A bare recolorable tile still shows it.
 *
 * RED-FIRST: onOver currently shows the chip for ANY [data-cms-bg] ancestor, images included.
 */
import { describe, it, expect, afterEach } from "vitest";
import { mountEditor, type EditorHarness } from "./editbridge-harness";

let h: EditorHarness | null = null;
afterEach(async () => { if (h) { await h.unmount(); h = null; } });

const chip = () => document.getElementById("c3-bg-handle") as HTMLElement;

describe("R7 — no recolor control over images", () => {
  it("hovering an image inside a recolorable wrapper keeps the recolor chip hidden", async () => {
    h = await mountEditor(`<div data-cms-bg="pillar.bg"><div data-cms-img="pillar.image"><img src="/a.webp"></div></div>`);
    const img = document.querySelector('[data-cms-img="pillar.image"] img') as HTMLElement;
    img.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    expect(chip().style.display).toBe("none");
  });

  it("still shows the recolor chip over a bare (non-image) recolorable tile", async () => {
    h = await mountEditor(`<div data-cms-bg="card.bg"><p>text</p></div>`);
    const tile = document.querySelector('[data-cms-bg="card.bg"]') as HTMLElement;
    tile.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    expect(chip().style.display).toBe("inline-flex");
  });
});
