// @vitest-environment jsdom
/**
 * GIVE — EDITOR-NATIVE REBUILD GUARD (contract §1–§3, §4 "Give text-only").
 *
 * The old /give was bespoke JSX: hand-rolled <section>/<Section> with NO
 * `data-section` wrappers (so no rail / no per-section bg), invented dollar-amount
 * "$25/$50/$100" impact tiles, and cards whose backgrounds were inline styles with
 * NO `data-cms-bg`. This locks the rebuilt, editor-native shape:
 *
 *   (a) exactly the 3 registry ids the c3-backend defaultSectionsForSlug("/give")
 *       expects — give-hero, give-impact, give-ways — each emitted as a
 *       `<div data-section="…">` wrapper (via PageComposer);
 *   (b) every card/tile carries its OWN `data-cms-bg`;
 *   (c) every button is a `data-cms-link` with a REQUIRED `data-cms-link-label`
 *       child (no whole-card-collapse, no label concatenation);
 *   (d) the primary Give button points at the real Pushpay giving destination.
 *
 * RED-FIRST: against the pre-rebuild page this FAILS — the old page emits zero
 * `data-section` wrappers and its cards have no `data-cms-bg`.
 */
import { describe, it, expect, beforeAll } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

/** data-section ids present, in document order. */
function sectionIds(html: string): string[] {
  const host = document.createElement("div");
  host.innerHTML = html;
  return Array.from(host.querySelectorAll("[data-section]")).map(
    (el) => el.getAttribute("data-section") || "(unnamed)",
  );
}

/** data-cms-link keys whose element has NO data-cms-link-label descendant. */
function collapsedLinkKeys(html: string): string[] {
  const host = document.createElement("div");
  host.innerHTML = html;
  return Array.from(host.querySelectorAll("[data-cms-link]"))
    .filter((el) => !el.querySelector("[data-cms-link-label]"))
    .map((el) => el.getAttribute("data-cms-link") || "(unnamed)");
}

/** data-cms-bg keys present. */
function bgKeys(html: string): string[] {
  const host = document.createElement("div");
  host.innerHTML = html;
  return Array.from(host.querySelectorAll("[data-cms-bg]")).map(
    (el) => el.getAttribute("data-cms-bg") || "(unnamed)",
  );
}

let html = "";

beforeAll(async () => {
  if (typeof window !== "undefined" && !window.matchMedia) {
    // @ts-expect-error minimal jsdom stub (RevealPlayer path touches matchMedia via gsap in some trees)
    window.matchMedia = () => ({ matches: false, media: "", onchange: null, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent() { return false; } });
  }
  const { default: GivePage } = await import("@/app/give/page");
  // Async server component; with no CMS configured it renders the hand-built defaults.
  html = renderToStaticMarkup(await GivePage({}));
});

describe("give — editor-native section composition", () => {
  it("emits exactly the 3 registry section wrappers in order", () => {
    expect(sectionIds(html)).toEqual(["give-hero", "give-impact", "give-ways"]);
  });

  it("every button is a labelled data-cms-link (no card-collapse, no concatenation)", () => {
    expect(collapsedLinkKeys(html)).toEqual([]);
    // and there IS at least one real editable button on the page
    const host = document.createElement("div");
    host.innerHTML = html;
    expect(host.querySelectorAll("[data-cms-link]").length).toBeGreaterThan(0);
  });

  it("every card/tile carries its own data-cms-bg", () => {
    const keys = bgKeys(html);
    // the three impact-facet cards AND the three ways-to-give tiles each own a bg key
    expect(keys).toEqual(expect.arrayContaining([
      "give-impact-community-bg",
      "give-impact-world-bg",
      "give-impact-church-bg",
      "give-way-cash-bg",
      "give-way-online-bg",
      "give-way-app-bg",
    ]));
  });

  it("primary Give button points at the real Pushpay destination", () => {
    const host = document.createElement("div");
    host.innerHTML = html;
    const cta = host.querySelector('[data-cms-link="give-hero-cta"]') as HTMLAnchorElement | null;
    expect(cta).not.toBeNull();
    expect(cta!.getAttribute("href")).toMatch(/pushpay\.com\/g\/celebratejesus/);
    expect(cta!.querySelector("[data-cms-link-label]")?.textContent).toBeTruthy();
  });

  it("carries NO invented dollar-amount ($) impact tiles", () => {
    // The removed motif: literal "$25/$50/$100" tiles that were never on the real site.
    expect(html).not.toMatch(/\$25|\$50|\$100/);
  });
});
