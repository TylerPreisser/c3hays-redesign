// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import { mountEditor, flush, key, type EditorHarness } from "./editbridge-harness";

/** cms:select carries the element's current text; a pick marker is selected by a click or Enter/Space, never by focus alone. */
let h: EditorHarness | null = null;
afterEach(async () => { if (h) { await h.unmount(); h = null; } });
const PAGE = `
  <main>
    <h1 data-cms="t:hero.headline">  Welcome   home.  </h1>
    <p data-cms-pick="fact:service_times:hays">Join us, Saturdays at 5:00 PM and Sundays at 8:00 AM.</p>
    <p data-cms-pick="fact:events">${"Long text ".repeat(60)}</p>
  </main>`;
const $ = (s: string) => document.querySelector(s) as HTMLElement;
const click = (el: HTMLElement) => el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));

describe("cms:select carries the text", () => {
  it("a click on a pick carries its trimmed, space-collapsed text; a field carries its text too", async () => {
    h = await mountEditor(PAGE, { mode: "edit" });
    click($("[data-cms-pick='fact:service_times:hays']"));
    expect(h.of("cms:select").pop()).toMatchObject({ path: "fact:service_times:hays", kind: "text", text: "Join us, Saturdays at 5:00 PM and Sundays at 8:00 AM." });
    click($("[data-cms='t:hero.headline']"));
    expect(h.of("cms:select").pop()).toMatchObject({ path: "t:hero.headline", text: "Welcome home." });
  });
  it("the text is capped", async () => {
    h = await mountEditor(PAGE, { mode: "edit" });
    click($("[data-cms-pick='fact:events']"));
    const t = h.of("cms:select").pop()!.text as string;
    expect(t.length).toBeLessThanOrEqual(200);
    expect(t.startsWith("Long text")).toBe(true);
  });
});

describe("a pick is not selected by focus alone", () => {
  it("focusing a pick (Tab, a programmatic focus, a click that lands elsewhere) sends no cms:select; Enter and Space then do", async () => {
    h = await mountEditor(PAGE, { mode: "edit" });
    const pk = $("[data-cms-pick='fact:service_times:hays']");
    const before = h.of("cms:select").length;
    pk.focus();
    pk.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    await flush(50);
    expect(h.of("cms:select").length).toBe(before);
    await key(pk, "Enter");
    expect(h.of("cms:select").filter((x) => x.path === "fact:service_times:hays").length).toBe(1);
    await key(pk, " ");
    expect(h.of("cms:select").filter((x) => x.path === "fact:service_times:hays").length).toBeGreaterThanOrEqual(1);
  });
  it("a text field still selects on focus (its caret is in it)", async () => {
    h = await mountEditor(PAGE, { mode: "edit" });
    const f = $("[data-cms='t:hero.headline']");
    f.focus();
    f.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    await flush(50);
    expect(h.of("cms:select").some((x) => x.path === "t:hero.headline")).toBe(true);
  });
});
