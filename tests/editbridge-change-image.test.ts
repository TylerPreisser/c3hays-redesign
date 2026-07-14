// @vitest-environment jsdom
/**
 * v7 R12 (U13a) — a DISCOVERABLE per-image affordance. Hovering an image reveals a
 * "🖼 Change image" chip; clicking it opens the image Inspector (posts the same
 * cms:select{kind:"image"} the image-click posts). Makes swapping/uploading a photo
 * obvious for Kale rather than a hidden click-the-photo gesture. It replaces the
 * (removed, R7) recolor chip over images and must not appear over non-images.
 */
import { describe, it, expect, afterEach } from "vitest";
import { mountEditor, type EditorHarness } from "./editbridge-harness";

let h: EditorHarness | null = null;
afterEach(async () => { if (h) { await h.unmount(); h = null; } });

const chip = () => document.getElementById("c3-img-handle") as HTMLElement;

describe("R12 — Change image chip", () => {
  it("appears on image hover and is labeled for changing the image", async () => {
    h = await mountEditor(`<div data-cms-bg="p.bg"><div data-cms-img="nt26.image"><img src="/a.webp"></div></div>`);
    const img = document.querySelector('[data-cms-img="nt26.image"] img') as HTMLElement;
    img.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    expect(chip().style.display).toBe("inline-flex");
    expect(chip().textContent).toMatch(/change image/i);
  });

  it("clicking it opens the image Inspector (posts cms:select kind=image)", async () => {
    h = await mountEditor(`<div data-cms-img="nt26.image"><img src="/a.webp"></div>`);
    const img = document.querySelector('[data-cms-img="nt26.image"] img') as HTMLElement;
    img.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    chip().dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    expect(h!.messages.some((m: any) => m?.type === "cms:select" && m.kind === "image" && m.path === "nt26.image")).toBe(true);
  });

  it("does NOT appear over a non-image element", async () => {
    h = await mountEditor(`<div data-cms-bg="card.bg"><p>text</p></div>`);
    const tile = document.querySelector('[data-cms-bg="card.bg"]') as HTMLElement;
    tile.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    expect(chip().style.display).toBe("none");
  });
});
