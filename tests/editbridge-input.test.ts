// @vitest-environment jsdom
/**
 * In-place typing rules:
 * view mode is read-only, paste is plain text, a capped field stops at its cap, Cmd+K makes a link,
 * Tab walks the fields in reading order, Esc ends editing.
 */
import { describe, it, expect, afterEach } from "vitest";
import { mountEditor, flush, selectText, typeInto, pasteInto, key, type EditorHarness } from "./editbridge-harness";

let h: EditorHarness | null = null;
afterEach(async () => { if (h) { await h.unmount(); h = null; } });

const PAGE = `
  <header><nav><a href="/about/">About</a><a href="/locations/">Locations</a><a href="https://x.example/">Elsewhere</a></nav></header>
  <h1 data-cms="t:hero.headline">Welcome home.</h1>
  <p data-cms="t:hero.body">Join us on Sunday morning.</p>
  <p data-cms="t:card.body">A card.</p>`;
const $ = (s: string) => document.querySelector(s) as HTMLElement;

describe("view mode is view only", () => {
  it("nothing is contenteditable and typing posts nothing", async () => {
    h = await mountEditor(PAGE, { mode: "view" });
    expect(document.querySelectorAll("[contenteditable]").length).toBe(0);
    const el = $('[data-cms="t:hero.headline"]');
    el.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    await typeInto(el, "hack");
    await flush(400);
    expect(h.of("cms:edit")).toHaveLength(0);
    expect(document.getElementById("c3-toolbar")?.style.display || "none").toBe("none");
  });
  it("selecting words in view mode shows no format bar and Cmd+K does nothing", async () => {
    h = await mountEditor(PAGE, { mode: "view" });
    const el = $('[data-cms="t:hero.body"]');
    selectText(el, 0, 4);
    document.dispatchEvent(new Event("selectionchange"));
    await key(el, "k", { metaKey: true });
    expect(document.getElementById("c3-link-card")?.style.display || "none").toBe("none");
    expect(h.of("cms:edit")).toHaveLength(0);
  });
});

describe("paste is plain text and a capped field stops at its cap", () => {
  it("a paste is inserted as text only, newlines folded to spaces, and the default paste is cancelled", async () => {
    h = await mountEditor(PAGE, { mode: "edit" });
    const el = $('[data-cms="t:card.body"]');
    el.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    selectText(el, 1, 7);
    const prevented = await pasteInto(el, "line one\nline two", '<b style="color:red">line one</b><div>line two</div>');
    expect(prevented).toBe(true);
    expect(el.innerHTML).toBe("Aline one line two");
  });

  it("a 5,000-word paste into a capped field leaves it at its cap", async () => {
    h = await mountEditor(PAGE, { mode: "edit", caps: { "t:card.body": 120 } });
    const el = $('[data-cms="t:card.body"]');
    el.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    selectText(el, 0, (el.textContent || "").length);
    const words = Array.from({ length: 5000 }, (_, i) => "word" + i).join(" ");
    await pasteInto(el, words);
    expect((el.textContent || "").length).toBe(120);
    await flush(400);
    expect(h.of("cms:edit").at(-1).value.length).toBe(120);
    // the counter shows
    const cap = document.getElementById("c3-cap")!;
    expect(cap.textContent).toBe("120 / 120");
    expect(cap.style.display).not.toBe("none");
  });

  it("typing at the cap is refused; wildcard caps apply to list items", async () => {
    h = await mountEditor(`<h3 data-cms="a.pillars.p1.headline">12345</h3>`, { mode: "edit", caps: { "a.pillars.*.headline": 5 } });
    const el = $('[data-cms]');
    el.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    selectText(el, 5);
    const ev = new Event("beforeinput", { bubbles: true, cancelable: true }) as any;
    ev.inputType = "insertText"; ev.data = "6";
    expect(el.dispatchEvent(ev)).toBe(false); // preventDefault called
    const under = new Event("beforeinput", { bubbles: true, cancelable: true }) as any;
    under.inputType = "deleteContentBackward";
    expect(el.dispatchEvent(under)).toBe(true);
  });

  it("an uncapped field takes a long paste whole", async () => {
    h = await mountEditor(PAGE, { mode: "edit" });
    const el = $('[data-cms="t:card.body"]');
    el.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    selectText(el, 0, (el.textContent || "").length);
    await pasteInto(el, "x".repeat(900));
    expect((el.textContent || "").length).toBe(900);
  });
});

describe("Cmd+K link", () => {
  it("selecting words and pressing Cmd+K opens a page search; choosing a page posts the link edit", async () => {
    h = await mountEditor(PAGE, { mode: "edit", pages: [{ title: "Locations", href: "/locations/" }, { title: "About", href: "/about/" }] });
    const el = $('[data-cms="t:hero.body"]');
    el.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    selectText(el, 11, 17); // "Sunday"
    await key(el, "k", { metaKey: true });
    const card = document.getElementById("c3-link-card")!;
    expect(card.style.display).toBe("flex");
    const input = card.querySelector("input") as HTMLInputElement;
    input.value = "Loc";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    const items = Array.from(card.querySelectorAll("[data-page]")) as HTMLElement[];
    expect(items.map((i) => i.firstElementChild!.textContent)).toEqual(["Locations"]);
    items[0].dispatchEvent(new MouseEvent("mousedown", { bubbles: true, cancelable: true }));
    await flush(400);
    const edit = h.of("cms:edit").at(-1);
    expect(edit).toMatchObject({ path: "t:hero.body", value: 'Join us on <a href="/locations/">Sunday</a> morning.' });
    expect(card.style.display).toBe("none");
  });

  it("a typed address is accepted only if it is https, http, mailto, tel or a site path", async () => {
    h = await mountEditor(PAGE, { mode: "edit" });
    const el = $('[data-cms="t:hero.body"]');
    el.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    const card = () => document.getElementById("c3-link-card")!;
    for (const [typed, ok] of [["javascript:alert(1)", false], ["data:text/html,x", false], ["https://a.example/x", true], ["mailto:a@b.co", true], ["/visit/", true]] as const) {
      el.innerHTML = "Join us on Sunday morning.";
      selectText(el, 8, 14);
      await key(el, "k", { ctrlKey: true });
      const input = card().querySelector("input") as HTMLInputElement;
      input.value = typed;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      await key(input, "Enter");
      expect(el.querySelector("a")?.getAttribute("href") ?? null).toBe(ok ? typed : null);
    }
  });
});

describe("keyboard: Tab and Esc", () => {
  it("Tab moves to the next field in reading order and Shift+Tab to the previous", async () => {
    h = await mountEditor(PAGE, { mode: "edit" });
    const [a, b, c] = ["t:hero.headline", "t:hero.body", "t:card.body"].map((p) => $(`[data-cms="${p}"]`));
    a.focus(); a.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    await key(a, "Tab");
    expect(document.activeElement).toBe(b);
    await key(b, "Tab");
    expect(document.activeElement).toBe(c);
    await key(c, "Tab", { shiftKey: true });
    expect(document.activeElement).toBe(b);
  });

  it("Esc ends editing: flushes typing, blurs, keeps the page text", async () => {
    h = await mountEditor(PAGE, { mode: "edit" });
    const el = $('[data-cms="t:hero.headline"]');
    el.focus(); el.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    selectText(el, 13);
    await typeInto(el, "!");
    await key(el, "Escape");
    expect(document.activeElement).not.toBe(el);
    expect(h.of("cms:edit").at(-1)).toMatchObject({ path: "t:hero.headline", value: "Welcome home.!" });
  });

  it("Enter in a heading ends the line edit instead of adding a block", async () => {
    h = await mountEditor(PAGE, { mode: "edit" });
    const el = $('[data-cms="t:hero.headline"]');
    el.focus(); el.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    selectText(el, 13);
    await typeInto(el, "?");
    const ev = new Event("beforeinput", { bubbles: true, cancelable: true }) as any; ev.inputType = "insertParagraph";
    expect(el.dispatchEvent(ev)).toBe(false);
    expect(h.of("cms:edit").at(-1)).toMatchObject({ value: "Welcome home.?" });
  });
});

describe("the format bar offers B, I and Link only", () => {
  it("has exactly three buttons: Bold, Italic, Link", async () => {
    h = await mountEditor(PAGE, { mode: "edit" });
    const bar = document.getElementById("c3-toolbar")!;
    expect(Array.from(bar.querySelectorAll("button")).map((b) => b.getAttribute("aria-label"))).toEqual(["Bold", "Italic", "Link"]);
    expect(bar.querySelector("select, input, .sw")).toBeNull();
    expect(document.getElementById("c3-fontmenu")).toBeNull();
    expect(document.getElementById("c3-bg-handle")).toBeNull();
  });
});
