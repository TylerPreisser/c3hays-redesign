// @vitest-environment jsdom
/**
 * /connect is EDITOR-NATIVE (contract 2026-07-20).
 *
 * Proves the connect rebuild composes through PageComposer as two rail-eligible
 * sections AND that each "Ways to get connected" card exposes its four independent
 * editor handles — the un-collapse of the old whole-card-as-one-link anti-pattern:
 *   1. section wrappers  → exactly `data-section="connect-hero"` + `"connect-steps"`
 *   2. tile background   → `data-cms-bg="connect-step-<id>-bg"` on the card container
 *   3/4. text + button   → the CTA is its OWN `data-cms-link` WITH a
 *        `data-cms-link-label` child (no card collapse).
 *
 * Renders the REAL server page (defaults; no CMS configured) exactly like the
 * home reference in editable-by-construction.test.ts.
 */
import { describe, it, expect, beforeAll } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

const STEP_IDS = ["visit", "serve", "prayer", "visitpage"];

let html = "";

beforeAll(async () => {
  // PageComposer mounts RevealPlayer, which reads window.matchMedia at eval; jsdom
  // lacks it. Stub before importing the page (same guard as the home reference).
  if (typeof window !== "undefined" && !window.matchMedia) {
    // @ts-expect-error minimal jsdom stub
    window.matchMedia = () => ({ matches: false, media: "", onchange: null, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent() { return false; } });
  }
  const { default: ConnectPage } = await import("@/app/connect/page");
  // Async server component; no CMS configured ⇒ published defaults via PageComposer.
  html = renderToStaticMarkup(await ConnectPage({}));
});

function host(markup: string): HTMLElement {
  const el = document.createElement("div");
  el.innerHTML = markup;
  return el;
}

/** data-cms-link keys with NO data-cms-link-label descendant (collapsed cards). */
function collapsedLinkKeys(markup: string): string[] {
  return Array.from(host(markup).querySelectorAll("[data-cms-link]"))
    .filter((el) => !el.querySelector("[data-cms-link-label]"))
    .map((el) => el.getAttribute("data-cms-link") || "(unnamed)");
}

describe("connect is editor-native (section-composed + per-handle cards)", () => {
  it("emits exactly two data-section wrappers, in order", () => {
    const ids = Array.from(host(html).querySelectorAll("[data-section]")).map((el) =>
      el.getAttribute("data-section")
    );
    expect(ids).toEqual(["connect-hero", "connect-steps"]);
  });

  it("each step card exposes a data-cms-bg tile-background handle", () => {
    const root = host(html);
    for (const id of STEP_IDS) {
      expect(root.querySelector(`[data-cms-bg="connect-step-${id}-bg"]`)).not.toBeNull();
    }
  });

  it("each step card has its OWN data-cms-link CTA with a data-cms-link-label child", () => {
    const root = host(html);
    for (const id of STEP_IDS) {
      const link = root.querySelector(`[data-cms-link="connect-step-${id}"]`);
      expect(link, `missing CTA link for connect-step-${id}`).not.toBeNull();
      expect(
        link && link.querySelector("[data-cms-link-label]"),
        `connect-step-${id} CTA has no label span`
      ).not.toBeNull();
    }
    // And nothing on the whole page collapses into a label-less link.
    expect(collapsedLinkKeys(html)).toEqual([]);
  });
});
