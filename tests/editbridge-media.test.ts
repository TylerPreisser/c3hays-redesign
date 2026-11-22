// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import { mountEditor, flush, type EditorHarness } from "./editbridge-harness";

/** The canvas shows an uploaded photo through the same /media path a visitor gets, not Studio's address. */
let h: EditorHarness | null = null;
afterEach(async () => { if (h) { await h.unmount(); h = null; } });
const PAGE = `<main><div data-cms-img="hero.bg"><img src="/images/exterior.webp" alt=""></div><div data-cms-img="other"><img src="/images/a.webp" alt=""></div></main>`;
const STUDIO = "https://c3-studio-staging.preissersolutions.com";

describe("editor:apply for an image", () => {
  it("an upload on Studio's address is shown as /media/<name>", async () => {
    h = await mountEditor(PAGE, { mode: "edit" });
    await h.send("editor:apply", { path: "hero.bg", value: `${STUDIO}/api/media/aB3dEfGhIj-crowd.jpg` });
    await flush(50);
    expect(document.querySelector("[data-cms-img='hero.bg'] img")!.getAttribute("src")).toBe("/media/aB3dEfGhIj-crowd.jpg");
  });
  it("a relative upload path too; any other address is shown as given", async () => {
    h = await mountEditor(PAGE, { mode: "edit" });
    await h.send("editor:apply", { path: "hero.bg", value: "/uploads/aB3dEfGhIj-crowd.jpg" });
    await h.send("editor:apply", { path: "other", value: "https://images.example.org/x.jpg" });
    await flush(50);
    expect(document.querySelector("[data-cms-img='hero.bg'] img")!.getAttribute("src")).toBe("/media/aB3dEfGhIj-crowd.jpg");
    expect(document.querySelector("[data-cms-img='other'] img")!.getAttribute("src")).toBe("https://images.example.org/x.jpg");
  });
});
