// @vitest-environment jsdom
/**
 * The edit bridge's v2 canvas contract.
 *   site -> editor: {v:2, source:"c3site", type: cms:ready | cms:select | cms:edit | cms:section, ...}
 *   editor -> site: {v:2, source:"c3editor", type: editor:mode | editor:apply | editor:select, ...}
 * The bridge posts only to Studio's origin and accepts only from it, from window.parent, with v 2.
 */
import { describe, it, expect, afterEach } from "vitest";
import { mountEditor, flush, stubRect, selectText, typeInto, key, STUDIO, type EditorHarness } from "./editbridge-harness";

let h: EditorHarness | null = null;
afterEach(async () => { if (h) { await h.unmount(); h = null; } });

const PAGE = `
  <header><nav><a href="/about/">About</a><a href="/locations/">Locations</a></nav></header>
  <section data-section="hero">
    <h1 data-cms="t:hero.headline">Welcome home.</h1>
    <p data-cms="t:hero.body">Join us <b>Sunday</b>.</p>
    <div data-cms-img="hero.image"><img src="/a.jpg" alt=""></div>
    <a data-cms-link="hero.cta" href="/visit/"><span data-cms-link-label>Plan a visit</span></a>
  </section>
  <section data-section="mission"><p data-cms="t:mission.body">We love Hays.</p></section>`;

describe("cms:ready", () => {
  it("is posted once on load, versioned, to Studio's origin and never to *", async () => {
    h = await mountEditor(PAGE);
    const ready = h.posts.filter((p) => p.message.type === "cms:ready");
    expect(ready).toHaveLength(1);
    const m = ready[0].message;
    expect(m).toMatchObject({ v: 2, source: "c3site", type: "cms:ready", draftServed: true, mode: "view" });
    expect(Number.isNaN(Date.parse(m.asOf))).toBe(false);
    expect(h.posts.every((p) => p.targetOrigin === STUDIO)).toBe(true);
  });

  it("reports draftServed:false when the site fell back to the published copy", async () => {
    h = await mountEditor(PAGE, { draft: "fallback" });
    expect(h.of("cms:ready")[0].draftServed).toBe(false);
  });

  it("reports draftServed:false when the mark is missing (not proven is not served)", async () => {
    h = await mountEditor(PAGE, { draft: null });
    expect(h.of("cms:ready")[0].draftServed).toBe(false);
  });
});

describe("who the bridge listens to", () => {
  const edit = { mode: "edit" };
  const attacks: [string, Parameters<EditorHarness["send"]>[2]][] = [
    ["a wrong origin", { origin: "https://evil.example" }],
    ["Studio's origin from a window that is not the parent", { from: "other" }],
    ["a null source", { from: null }],
    ["v:1", { v: 1 }],
    ["no v", { v: undefined, data: { source: "c3editor", type: "editor:mode", mode: "edit" } }],
    ["a spoofed source (c3site)", { source: "c3site" }],
    ["no source", { data: { v: 2, type: "editor:mode", mode: "edit" } }],
    ["a string payload", { data: "editor:mode" }],
  ];
  for (const [name, over] of attacks) {
    it(`ignores editor:mode and editor:apply from ${name}`, async () => {
      h = await mountEditor(PAGE);
      await h.send("editor:mode", edit, over);
      await h.send("editor:apply", { path: "t:hero.headline", value: "Hacked" }, over);
      expect(document.querySelectorAll("[contenteditable]").length).toBe(0);
      expect(document.querySelector('[data-cms="t:hero.headline"]')!.textContent).toBe("Welcome home.");
    });
  }

  it("control: the same messages from the real Studio window DO change things", async () => {
    h = await mountEditor(PAGE);
    await h.send("editor:mode", edit);
    await h.send("editor:apply", { path: "t:hero.headline", value: "Hello" });
    expect(document.querySelectorAll("[contenteditable=true]").length).toBeGreaterThan(0);
    expect(document.querySelector('[data-cms="t:hero.headline"]')!.textContent).toBe("Hello");
  });

  it("with no Studio origin configured the bridge stays off and posts nothing", async () => {
    const saved = process.env.NEXT_PUBLIC_CMS_URL;
    delete process.env.NEXT_PUBLIC_CMS_URL;
    const { act, createElement } = await import("react");
    const { createRoot } = await import("react-dom/client");
    const EditBridge = (await import("@/components/cms/EditBridge")).default;
    const msgs: unknown[] = [];
    Object.defineProperty(window, "parent", { configurable: true, value: { postMessage: (m: unknown) => msgs.push(m) } });
    Object.defineProperty(window, "location", { configurable: true, value: { ...window.location, search: "?cmsEdit=1" } });
    document.body.innerHTML = PAGE;
    const host = document.createElement("div"); document.body.appendChild(host);
    let root: any;
    await act(async () => { root = createRoot(host); root.render(createElement(EditBridge)); });
    expect(msgs).toHaveLength(0);
    await act(async () => { root.unmount(); });
    process.env.NEXT_PUBLIC_CMS_URL = saved;
  });
});

describe("editor:mode", () => {
  it("edit makes text editable, view removes it, visitor removes the editor chrome", async () => {
    h = await mountEditor(PAGE);
    await h.send("editor:mode", { mode: "edit" });
    expect(document.querySelectorAll("[data-cms][contenteditable=true]").length).toBe(3);
    await h.send("editor:mode", { mode: "view" });
    expect(document.querySelectorAll("[contenteditable]").length).toBe(0);
    await h.send("editor:mode", { mode: "visitor" });
    expect(document.getElementById("c3-sel-ring")).toBeNull();
    expect(document.documentElement.hasAttribute("data-cms-edit")).toBe(false);
  });

  it("answers with cms:ready carrying the mode now in force", async () => {
    h = await mountEditor(PAGE);
    await h.send("editor:mode", { mode: "edit" });
    const last = h.of("cms:ready").at(-1);
    expect(last).toMatchObject({ v: 2, source: "c3site", mode: "edit", draftServed: true });
  });

  it("an unknown mode is ignored", async () => {
    h = await mountEditor(PAGE);
    await h.send("editor:mode", { mode: "admin" });
    expect(document.querySelectorAll("[contenteditable]").length).toBe(0);
    expect(h.of("cms:ready")).toHaveLength(1);
  });

  it("never makes a fallback (published) page editable, whatever the editor asks", async () => {
    h = await mountEditor(PAGE, { draft: "fallback" });
    await h.send("editor:mode", { mode: "edit" });
    expect(document.querySelectorAll("[contenteditable]").length).toBe(0);
    expect(h.of("cms:ready").at(-1)).toMatchObject({ draftServed: false, mode: "view" });
  });
});

describe("cms:select and editor:select", () => {
  it("a click posts kind and box for text, image, link and section", async () => {
    h = await mountEditor(PAGE, { mode: "edit" });
    const q = (s: string) => document.querySelector(s) as HTMLElement;
    stubRect(q('[data-cms-img="hero.image"]'), { left: 10, top: 20, width: 300, height: 200 });
    stubRect(q('[data-cms-link="hero.cta"]'), { left: 10, top: 240, width: 120, height: 40 });
    stubRect(q('[data-cms="t:hero.headline"]'), { left: 10, top: 300, width: 500, height: 60 });
    stubRect(q('[data-section="mission"]'), { left: 0, top: 400, width: 1000, height: 300 });
    q('[data-cms-img="hero.image"] img').dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    q('[data-cms-link="hero.cta"] span').dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    q('[data-cms="t:hero.headline"]').dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    q('[data-section="mission"]').dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    const sel = h.of("cms:select");
    expect(sel.map((m) => [m.kind, m.path])).toEqual([
      ["image", "hero.image"], ["link", "hero.cta"], ["text", "t:hero.headline"], ["section", "mission"],
    ]);
    expect(sel[0]).toMatchObject({ v: 2, source: "c3site", box: { x: 10, y: 20, width: 300, height: 200 } });
    expect(sel[1]).toMatchObject({ label: "Plan a visit", href: "/visit/" });
  });

  it("editor:select rings the field and answers with its kind and box", async () => {
    h = await mountEditor(PAGE, { mode: "edit" });
    const hl = document.querySelector('[data-cms="t:hero.headline"]') as HTMLElement;
    stubRect(hl, { left: 5, top: 6, width: 70, height: 30 });
    await h.send("editor:select", { path: "t:hero.headline" });
    expect(hl.classList.contains("cms-sel")).toBe(true);
    expect(h.of("cms:select").at(-1)).toMatchObject({ path: "t:hero.headline", kind: "text", echo: true, box: { x: 5, y: 6, width: 70, height: 30 } });
    await h.send("editor:select", { path: "mission" });
    expect(h.of("cms:select").at(-1)).toMatchObject({ path: "mission", kind: "section", echo: true });
    expect(hl.classList.contains("cms-sel")).toBe(false);
  });

  it("editor:select with an unknown path posts nothing and does not throw", async () => {
    h = await mountEditor(PAGE, { mode: "edit" });
    const before = h.messages.length;
    await h.send("editor:select", { path: 'no"such[path]' });
    expect(h.messages.length).toBe(before);
  });
});

describe("cms:edit and editor:apply", () => {
  it("typing posts {path, value} once, with the allow-listed markup only", async () => {
    h = await mountEditor(PAGE, { mode: "edit" });
    const p = document.querySelector('[data-cms="t:hero.body"]') as HTMLElement;
    p.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    p.innerHTML = 'Join us <span style="color:red">Sunday</span><script>x</script> <u>now</u>';
    await typeInto(p, "!");
    await flush(400);
    const edits = h.of("cms:edit");
    expect(edits).toHaveLength(1);
    expect(edits[0]).toMatchObject({ v: 2, source: "c3site", path: "t:hero.body" });
    expect(edits[0].value).toBe("Join us Sunday now!");
    expect("html" in edits[0]).toBe(false);
  });

  it("text typed in one field is not lost when focus moves to another within the debounce", async () => {
    h = await mountEditor(PAGE, { mode: "edit" });
    const a = document.querySelector('[data-cms="t:hero.headline"]') as HTMLElement;
    const b = document.querySelector('[data-cms="t:hero.body"]') as HTMLElement;
    a.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    selectText(a, 3);
    await typeInto(a, "ZZ");
    b.dispatchEvent(new FocusEvent("focusout", { bubbles: true })); // no-op for b
    a.dispatchEvent(new FocusEvent("focusout", { bubbles: true, relatedTarget: b }));
    b.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    await flush(400);
    const edits = h.of("cms:edit");
    expect(edits.map((m) => m.path)).toEqual(["t:hero.headline"]);
    expect(edits[0].value).toBe("WelZZcome home.");
  });

  it("an untouched field never posts an edit (published text cannot be written over a draft)", async () => {
    h = await mountEditor(PAGE, { mode: "edit" });
    for (const el of Array.from(document.querySelectorAll<HTMLElement>("[data-cms]"))) {
      el.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
      el.dispatchEvent(new FocusEvent("focusout", { bubbles: true }));
    }
    await flush(400);
    expect(h.of("cms:edit")).toHaveLength(0);
  });

  it("editor:apply sets a text field, an image src and a link", async () => {
    h = await mountEditor(PAGE, { mode: "edit" });
    await h.send("editor:apply", { path: "t:hero.headline", value: "Hi <b>there</b><script>1</script>" });
    expect(document.querySelector('[data-cms="t:hero.headline"]')!.innerHTML).toBe("Hi <b>there</b>");
    await h.send("editor:apply", { path: "hero.image", value: "https://cdn.example/new.jpg" });
    expect((document.querySelector("[data-cms-img] img") as HTMLImageElement).getAttribute("src")).toBe("https://cdn.example/new.jpg");
    await h.send("editor:apply", { path: "hero.image", value: "javascript:alert(1)" });
    expect((document.querySelector("[data-cms-img] img") as HTMLImageElement).getAttribute("src")).toBe("https://cdn.example/new.jpg");
    await h.send("editor:apply", { path: "hero.cta", value: { label: "Come visit", href: "/locations/" } });
    const a = document.querySelector('[data-cms-link="hero.cta"]') as HTMLAnchorElement;
    expect(a.getAttribute("href")).toBe("/locations/");
    expect(a.querySelector("[data-cms-link-label]")!.textContent).toBe("Come visit");
    await h.send("editor:apply", { path: "hero.cta", value: { href: "javascript:alert(1)" } });
    expect(a.getAttribute("href")).toBe("/locations/");
  });

  it("editor:apply does not echo a cms:edit back (no loop)", async () => {
    h = await mountEditor(PAGE, { mode: "edit" });
    await h.send("editor:apply", { path: "t:hero.headline", value: "Hello" });
    await flush(400);
    expect(h.of("cms:edit")).toHaveLength(0);
  });

  it("editor:apply to the focused field does not move the caret, and is held back while it has unsent typing", async () => {
    h = await mountEditor(PAGE, { mode: "edit" });
    const el = document.querySelector('[data-cms="t:hero.headline"]') as HTMLElement;
    el.focus();
    el.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    selectText(el, 4);
    // unsent typing: the editor's stale echo must not overwrite it
    await typeInto(el, "X");
    await h.send("editor:apply", { path: "t:hero.headline", value: "stale old text" });
    expect(el.textContent).toBe("WelcXome home.");
    await flush(400); // typing is sent; now the field is clean
    // a clean focused field takes an external change but the caret keeps its character position
    selectText(el, 3);
    await h.send("editor:apply", { path: "t:hero.headline", value: "Welcome, home." });
    expect(el.textContent).toBe("Welcome, home.");
    const sel = window.getSelection()!;
    expect(el.contains(sel.anchorNode)).toBe(true);
    let pos = 0; const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let n: Node | null;
    while ((n = w.nextNode())) { if (n === sel.anchorNode) { pos += sel.anchorOffset; break; } pos += (n.nodeValue || "").length; }
    expect(pos).toBe(3);
  });

  it("a list keyed by id keeps each edit on its own item after a reorder", async () => {
    const tile = (id: string, word: string) => `<div data-id="${id}"><h3 data-cms="meetGrowServe.pillars.${id}.headline">${word}</h3></div>`;
    h = await mountEditor(`<section data-section="mgs"><div id="list">${tile("p-meet", "Meet")}${tile("p-grow", "Grow")}${tile("p-serve", "Serve")}</div></section>`, { mode: "edit" });
    const list = document.getElementById("list")!;
    list.insertBefore(list.lastElementChild!, list.firstElementChild); // Serve now first
    await h.send("editor:apply", { path: "meetGrowServe.pillars.p-grow.headline", value: "Grow deeper" });
    const words = Array.from(list.querySelectorAll("h3")).map((e) => e.textContent);
    expect(words).toEqual(["Serve", "Meet", "Grow deeper"]);
    const g = list.querySelector('[data-cms="meetGrowServe.pillars.p-grow.headline"]') as HTMLElement;
    g.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    await typeInto(g, "!");
    await flush(400);
    expect(h.of("cms:edit").at(-1)).toMatchObject({ path: "meetGrowServe.pillars.p-grow.headline" });
  });
});

describe("cms:section", () => {
  it("Esc clears a section selection and says so; Alt+ArrowUp asks the editor to move it up one", async () => {
    h = await mountEditor(PAGE, { mode: "edit" });
    const sec = document.querySelector('[data-section="mission"]') as HTMLElement;
    sec.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    expect(sec.classList.contains("cms-sel-sec")).toBe(true);
    await key(document.body, "ArrowDown", { altKey: true }); // already last: nothing to ask
    expect(h.of("cms:section")).toHaveLength(0);
    await key(document.body, "ArrowUp", { altKey: true });
    expect(h.of("cms:section").at(-1)).toMatchObject({ v: 2, source: "c3site", op: "move", id: "mission", index: 0 });
    await key(document.body, "Escape");
    expect(sec.classList.contains("cms-sel-sec")).toBe(false);
    expect(h.of("cms:section").at(-1)).toMatchObject({ op: "deselect", id: "mission", index: 1 });
  });
});
