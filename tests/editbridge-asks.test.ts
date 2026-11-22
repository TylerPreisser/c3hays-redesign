// @vitest-environment jsdom
/**
 * What the editor asks of the page in edit mode: select-only markers (menu, announcement, service-time line) tell Studio
 * what was picked and are never editable text; Tab walks the editable things (the site's own controls step aside); the
 * save, review, undo and escape keys reach Studio; the first keystroke is announced at once.
 */
import { describe, it, expect, afterEach } from "vitest";
import { mountEditor, flush, typeInto, key, type EditorHarness } from "./editbridge-harness";

let h: EditorHarness | null = null;
afterEach(async () => { if (h) { await h.unmount(); h = null; } });

const PAGE = `
  <a class="skip-link" href="#main">Skip to main content</a>
  <header>
    <div data-cms-pick="announcement:ann_1"><strong>Marriage Night</strong><a href="/connect/">Sign up</a></div>
    <ul data-cms-pick="nav:menu"><li><a href="/about/">About</a></li><li><a href="/watch/">Watch</a></li></ul>
    <button type="button">Menu</button>
  </header>
  <main id="main">
    <h1 data-cms="t:hero.headline">Welcome home.</h1>
    <p data-cms-pick="t:campus-hays-info">5790 230th Ave · Sunday 9:00 AM</p>
    <p data-cms="t:hero.body">Join us.</p>
    <a href="/give/">Give</a>
  </main>`;
const $ = (s: string) => document.querySelector(s) as HTMLElement;
const lastSelect = () => h!.of("cms:select").pop();

describe("select-only markers", () => {
  it("a click on the menu, the announcement or a service-time line selects it; none is editable text", async () => {
    h = await mountEditor(PAGE, { mode: "edit" });
    $("[data-cms-pick='nav:menu'] a").dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    expect(lastSelect()).toMatchObject({ path: "nav:menu", kind: "text" });
    $("[data-cms-pick='announcement:ann_1'] strong").dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    expect(lastSelect()).toMatchObject({ path: "announcement:ann_1", kind: "text" });
    $("[data-cms-pick='t:campus-hays-info']").dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    expect(lastSelect()).toMatchObject({ path: "t:campus-hays-info", kind: "text" });
    expect(document.querySelectorAll("[data-cms-pick][contenteditable]").length).toBe(0);
    await typeInto($("[data-cms-pick='t:campus-hays-info']"), "11:00");
    await flush(400);
    expect(h.of("cms:edit")).toHaveLength(0);
  });
  it("a link inside the menu does not navigate away from the canvas", async () => {
    h = await mountEditor(PAGE, { mode: "edit" });
    const ev = new MouseEvent("click", { bubbles: true, cancelable: true });
    $("[data-cms-pick='nav:menu'] a").dispatchEvent(ev);
    expect(ev.defaultPrevented).toBe(true);
  });
});

describe("keyboard reach in edit mode", () => {
  it("the site's own links and controls leave the tab order; editable fields and markers join it; view mode gives it all back", async () => {
    h = await mountEditor(PAGE, { mode: "edit" });
    for (const sel of [".skip-link", "header button", "[data-cms-pick='nav:menu'] a", "main > a"]) expect($(sel).getAttribute("tabindex")).toBe("-1");
    for (const sel of ["[data-cms='t:hero.headline']", "[data-cms-pick='nav:menu']", "[data-cms-pick='announcement:ann_1']", "[data-cms-pick='t:campus-hays-info']"]) expect($(sel).getAttribute("tabindex")).toBe("0");
    await h.send("editor:mode", { mode: "view" });
    await flush(0);
    expect($(".skip-link").hasAttribute("tabindex")).toBe(false);
    expect($("[data-cms-pick='nav:menu']").hasAttribute("tabindex")).toBe(false);
  });
  it("a visitor's page (view or visitor mode from the start) never gets a changed tab order", async () => {
    h = await mountEditor(PAGE, { mode: "visitor" });
    expect(document.querySelectorAll("[tabindex]").length).toBe(0);
  });
  it("Enter on a focused marker selects it", async () => {
    h = await mountEditor(PAGE, { mode: "edit" });
    const m = $("[data-cms-pick='nav:menu']");
    m.focus();
    await key(m, "Enter");
    expect(h.of("cms:select").filter((x) => x.path === "nav:menu").length).toBeGreaterThan(0);
  });
});

describe("keys that belong to Studio reach it", () => {
  it("Cmd/Ctrl+Enter, Cmd/Ctrl+S and Esc are forwarded; the browser's save is cancelled; Cmd+Z only outside a field", async () => {
    h = await mountEditor(PAGE, { mode: "edit" });
    const body = document.body;
    await key(body, "Enter", { metaKey: true });
    await key(body, "s", { ctrlKey: true });
    await key(body, "z", { metaKey: true });
    await key(body, "Escape");
    expect(h.of("cms:key").map((m) => m.key)).toEqual(["Enter", "s", "z", "Escape"]);
    const save = new KeyboardEvent("keydown", { key: "s", metaKey: true, bubbles: true, cancelable: true });
    body.dispatchEvent(save);
    expect(save.defaultPrevented).toBe(true);
    const field = $("[data-cms='t:hero.headline']");
    field.focus();
    const before = h.of("cms:key").length;
    await key(field, "z", { metaKey: true }); // the field's own undo
    expect(h.of("cms:key").length).toBe(before);
  });
});

describe("the first keystroke is announced at once", () => {
  it("cms:input comes on the first input event of a burst, before the save, and once", async () => {
    h = await mountEditor(PAGE, { mode: "edit" });
    const el = $("[data-cms='t:hero.headline']");
    el.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    await typeInto(el, "A");
    expect(h.of("cms:input")).toEqual([expect.objectContaining({ path: "t:hero.headline" })]);
    expect(h.of("cms:edit")).toHaveLength(0);
    await typeInto(el, "B");
    expect(h.of("cms:input")).toHaveLength(1);
    await flush(400);
    expect(h.of("cms:edit")).toHaveLength(1);
    await typeInto(el, "C"); // a new burst after the save
    expect(h.of("cms:input")).toHaveLength(2);
  });
});
