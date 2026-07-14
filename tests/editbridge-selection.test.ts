// @vitest-environment jsdom
/**
 * v7 R6 (U2) — SELECTION MODEL. One affordance only: the marching-ants outline must
 * FOLLOW CLICK/SELECT and PERSIST while editing (not vanish on hover-off), including in
 * the nav bar where the sticky header re-renders and drops the class. And the solid
 * GREEN BOX (the c3hays :focus-visible teal ring) must be gone in edit mode — ants only.
 *
 * RED-FIRST: onFocusIn does not add .cms-sel to text; the remount observer only re-applies
 * IMAGES (nav links drop their selection); and the injected stylesheet has no outline killer.
 */
import { describe, it, expect, afterEach } from "vitest";
import { mountEditor, flush, editorStylesheet, type EditorHarness } from "./editbridge-harness";

let h: EditorHarness | null = null;
afterEach(async () => { if (h) { await h.unmount(); h = null; } });

describe("R6 — marching-ants follows selection and persists", () => {
  it("focusing a text region selects it (.cms-sel) and KEEPS it after mousing away", async () => {
    h = await mountEditor(`<section data-section="mission"><h2 data-cms="mission.html">Hi</h2><p data-cms="other">x</p></section>`);
    const el = document.querySelector('[data-cms="mission.html"]') as HTMLElement;
    el.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    expect(el.classList.contains("cms-sel")).toBe(true);
    // mouse moves away to another element — selection must NOT vanish (that was the hover bug)
    const other = document.querySelector('[data-cms="other"]') as HTMLElement;
    other.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    other.dispatchEvent(new MouseEvent("mouseout", { bubbles: true }));
    expect(el.classList.contains("cms-sel")).toBe(true);
  });

  it("a selected NAV item re-acquires .cms-sel by PATH after the header re-renders", async () => {
    h = await mountEditor(`<header><a data-cms-link="nav.home" href="/">Home</a></header>`);
    const link = document.querySelector('[data-cms-link="nav.home"]') as HTMLElement;
    link.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(link.classList.contains("cms-sel")).toBe(true);
    // sticky header re-render: the old node is replaced by a FRESH node with the same path
    const header = link.parentElement!;
    const fresh = document.createElement("a");
    fresh.setAttribute("data-cms-link", "nav.home");
    fresh.setAttribute("href", "/");
    fresh.textContent = "Home";
    header.replaceChild(fresh, link);
    await flush();
    expect(fresh.classList.contains("cms-sel")).toBe(true);
  });
});

describe("R6 — no solid green box (edit-mode outline killer)", () => {
  it("injects a rule removing the focus-visible outline on selected/focused regions", async () => {
    h = await mountEditor(`<h2 data-cms="mission.html">Hi</h2>`);
    const css = (editorStylesheet()?.textContent || "").replace(/\s+/g, " ");
    // selection is marching-ants only — the teal :focus-visible box is suppressed in edit mode
    expect(css).toMatch(/outline\s*:\s*none\s*!important/);
    expect(css).toMatch(/\.cms-sel/);
  });
});
