// @vitest-environment jsdom
/**
 * EDITABLE-BY-CONSTRUCTION GUARD (contract §5).
 *
 * The editor derives a button's label from the FIRST `[data-cms-link-label]`
 * descendant of a `[data-cms-link]` element, falling back to the element's whole
 * innerText (EditBridge.tsx:402). So a card wrapped in ONE `data-cms-link` with NO
 * label span collapses its entire icon+heading+body+cta copy into a single editable
 * "button" — the Connect card-collapse bug (contract §4). This test locks the
 * INVARIANT: every `[data-cms-link]` MUST contain a `[data-cms-link-label]`
 * descendant, so no future component can regress into that collapse.
 *
 * WHY THIS SHAPE (keeping CI green while proving the invariant catches the real
 * bug — the choice the mission asked me to document):
 *   • The invariant's catching power is proven two ways: (1) a synthetic fixture
 *     built to Connect's exact collapsed shape is detected, and (2) the REAL
 *     ConnectClient markup is rendered and asserted clean under `it.fails` — which
 *     currently FAILS (the four NEXT_STEPS cards collapse), so `it.fails` records an
 *     EXPECTED failure and the suite stays GREEN. When the connect-builder wave
 *     un-collapses those cards (adds a `data-cms-link-label`), the body starts
 *     PASSING → `it.fails` then FAILS loudly → forcing removal of `.fails` so the
 *     guard becomes an ordinary green assertion. Self-correcting; never silently
 *     stale. Home is asserted directly (it is already correct — the reference page).
 */
import { describe, it, expect, beforeAll } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";

/** INVARIANT (a): return the `data-cms-link` keys whose element has NO
 *  `data-cms-link-label` descendant (i.e. collapsed cards). Empty ⇒ all good. */
function collapsedLinkKeys(html: string): string[] {
  const host = document.createElement("div");
  host.innerHTML = html;
  return Array.from(host.querySelectorAll("[data-cms-link]"))
    .filter((el) => !el.querySelector("[data-cms-link-label]"))
    .map((el) => el.getAttribute("data-cms-link") || "(unnamed)");
}

let homeHtml = "";
let connectHtml = "";

beforeAll(async () => {
  // Home + Connect pull components that import gsap's ScrollTrigger, which reads
  // window.matchMedia at module-eval; jsdom lacks it. Stub before dynamic import.
  if (typeof window !== "undefined" && !window.matchMedia) {
    // @ts-expect-error minimal jsdom stub
    window.matchMedia = () => ({ matches: false, media: "", onchange: null, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent() { return false; } });
  }
  const { default: HomePage } = await import("@/app/page");
  // HomePage is an async server component; with no CMS configured it renders the
  // hand-built defaults via the new PageComposer.
  homeHtml = renderToStaticMarkup(await HomePage({}));

  const { default: ConnectClient } = await import("@/app/connect/ConnectClient");
  connectHtml = renderToStaticMarkup(createElement(ConnectClient, { text: {}, media: {}, img: {} }));
});

describe("invariant (a): the detector itself", () => {
  it("flags a collapsed card (data-cms-link wrapping copy, no label span)", () => {
    // Mirrors Connect's NEXT_STEPS card shape exactly.
    const collapsed =
      '<a data-cms-link="connect-step-visit"><h3>Plan a visit</h3><p>Let us know…</p><span>Let us know</span></a>';
    expect(collapsedLinkKeys(collapsed)).toEqual(["connect-step-visit"]);
  });

  it("passes a properly-tagged link (label span present)", () => {
    const ok =
      '<a data-cms-link="events.cta"><span data-cms-link-label>See All Events</span></a>';
    expect(collapsedLinkKeys(ok)).toEqual([]);
  });

  it("passes the EditableLink primitive", () => {
    // Import lazily to avoid loading gsap at top-level before the matchMedia stub.
    const html = renderToStaticMarkup(
      createElement("div", null,
        // EditableLink always emits the label span (Editable.tsx:92).
        createElement("a", { "data-cms-link": "x" }, createElement("span", { "data-cms-link-label": true }, "Go"))),
    );
    expect(collapsedLinkKeys(html)).toEqual([]);
  });
});

describe("invariant (a) on real page components", () => {
  it("home: PageComposer emits section wrappers and no collapsed links (reference page)", () => {
    // PageComposer generalization stays byte-editable-correct: sections wrapped +
    // every data-cms-link carries a label.
    expect(homeHtml).toContain('data-section="hero"');
    expect(collapsedLinkKeys(homeHtml)).toEqual([]);
  });

  // PENDING connect-builder rebuild (contract §4): the four NEXT_STEPS cards each
  // wrap icon+h3+p+cta in ONE data-cms-link with NO data-cms-link-label, collapsing
  // the whole card into a single editable "button". This asserts the fixed state;
  // it currently FAILS, so `it.fails` keeps the suite green today and will FLIP to a
  // real failure once the cards are un-collapsed — the signal to delete `.fails`.
  it.fails("connect: NEXT_STEPS cards must not collapse into one editable link (pending connect rebuild)", () => {
    expect(collapsedLinkKeys(connectHtml)).toEqual([]);
  });
});
