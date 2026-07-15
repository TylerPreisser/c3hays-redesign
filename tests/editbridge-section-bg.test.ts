// @vitest-environment jsdom
/**
 * Website Editor v8 polish — P6: a SECTION background edit must paint LIVE in the
 * preview. The editor posts cms:setStyle {path:<sectionId>, background, scope:"section"};
 * EditBridge must inject a `[data-section=id]>*{background:… !important}` shim rule
 * (routed through buildBgCss's sections arg — the same selector the published page.tsx
 * emits). A tile edit (no scope) still paints a `[data-cms-bg=key]` rule, unchanged.
 *
 * RED-FIRST: before P6, cms:setStyle only fed buildBgCss's tile arg, so a section-scoped
 * message produced a [data-cms-bg=mission] rule that matched nothing.
 */
import { describe, it, expect, afterEach } from "vitest";
import { mountEditor, type EditorHarness } from "./editbridge-harness";

let h: EditorHarness | null = null;
afterEach(async () => { if (h) { await h.unmount(); h = null; } });

const shim = () => (document.getElementById("c3-shim-bg") as HTMLStyleElement)?.textContent || "";
const postFromEditor = (msg: Record<string, unknown>) =>
  window.dispatchEvent(new MessageEvent("message", { data: { source: "c3editor", ...msg } }));

describe("P6 — section-scoped cms:setStyle paints a [data-section]>* shim rule", () => {
  it("scope:'section' emits a [data-section=id]>* background rule", async () => {
    h = await mountEditor(`<div data-section="mission"><h2 data-cms="mission.html">hi</h2></div>`);
    postFromEditor({ type: "cms:setStyle", path: "mission", background: "#6b6c6c", scope: "section" });
    expect(shim()).toContain('[data-section="mission"]>*{background:#6b6c6c !important}');
  });

  it("clearing (empty background) removes the section rule", async () => {
    h = await mountEditor(`<div data-section="mission"><h2 data-cms="mission.html">hi</h2></div>`);
    postFromEditor({ type: "cms:setStyle", path: "mission", background: "#6b6c6c", scope: "section" });
    postFromEditor({ type: "cms:setStyle", path: "mission", background: "", scope: "section" });
    expect(shim()).not.toContain("data-section");
  });

  it("a tile edit (no scope) still paints a [data-cms-bg] rule — unchanged", async () => {
    h = await mountEditor(`<div data-cms-bg="tile.x"><p>t</p></div>`);
    postFromEditor({ type: "cms:setStyle", path: "tile.x", background: "#1cc3af" });
    expect(shim()).toContain('[data-cms-bg="tile.x"]{background:#1cc3af !important}');
    expect(shim()).not.toContain("data-section");
  });
});
