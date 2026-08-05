// @vitest-environment jsdom
/**
 * GIVE — EDITOR-NATIVE REBUILD GUARD (contract §1–§3, §4 "Give text-only").
 *
 * The old /give was bespoke JSX: hand-rolled <section>/<Section> with NO
 * `data-section` wrappers (so no rail / no per-section bg), invented dollar-amount
 * "$25/$50/$100" impact tiles, and cards whose backgrounds were inline styles with
 * NO `data-cms-bg`. This locks the rebuilt, editor-native shape:
 *
 *   (a) exactly the registry ids the c3-backend defaultSectionsForSlug("/give")
 *       declares, each emitted as a `<div data-section="…">` wrapper (via
 *       PageComposer);
 *   (b) every card/tile carries its OWN `data-cms-bg`;
 *   (c) every button is a `data-cms-link` with a REQUIRED `data-cms-link-label`
 *       child (no whole-card-collapse, no label concatenation);
 *   (d) the primary Give button points at the real Pushpay giving destination.
 *
 * RED-FIRST: against the pre-rebuild page this FAILS — the old page emits zero
 * `data-section` wrappers and its cards have no `data-cms-bg`.
 *
 * D169 RECONCILIATION (2026-08-05): (a) and (b) were pinned to a shape TWO product
 * rulings have since superseded, so they asserted prose rather than the guarantee.
 *
 *   (a) named `give-impact` as a required id. Commit 3c6d509 item #7 removed that
 *       section on purpose ("/give: remove give-impact ('Why we give') — flow is
 *       hero → ways-to-give → close"), and the registry this test cites as its own
 *       source of truth — c3-backend src/lib/content/page-sections.ts:25 — now reads
 *       `"/give": [v("give-hero"), v("give-ways")]`. The guarantee was never "three
 *       sections"; it is "the page emits EXACTLY the backend-declared ids, in order".
 *       Asserted against a list mirrored from that registry, so the next registry
 *       change fails here loudly instead of drifting.
 *
 *   (b) named six tiles (`give-impact-*`, `give-way-cash/online/app`) that no longer
 *       exist — three died with give-impact, and the ways-to-give tiles are now
 *       feature / app / person / mail. This one was HALF a stale grep: the real
 *       guarantee ("every card/tile owns a bg handle") was genuinely BROKEN — only
 *       the give-ways SECTION carried `give-ways-bg`, so a staffer could recolor the
 *       whole band but not one tile. Fixed in GiveWays/GiveOnline; asserted below on
 *       the tiles the page actually renders.
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

/**
 * The backend registry's /give entry, mirrored verbatim from c3-backend
 * src/lib/content/page-sections.ts (`DEFAULT_PAGE_SECTIONS["/give"]`). The site's
 * PAGE_DEFAULT_SECTIONS must equal this or the editor rail composes a page the site
 * cannot render — the cross-repo contract this file exists to hold.
 */
const REGISTRY_GIVE_SECTIONS = ["give-hero", "give-ways"];

describe("give — editor-native section composition", () => {
  it("emits exactly the registry section wrappers, in registry order", () => {
    expect(sectionIds(html)).toEqual(REGISTRY_GIVE_SECTIONS);
  });

  it("carries no give-impact section (removed by ruling #7 — hero → ways-to-give)", () => {
    expect(sectionIds(html)).not.toContain("give-impact");
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
    // The give-ways BAND owns one (section-level recolor)…
    expect(keys).toContain("give-ways-bg");
    // …and every tile INSIDE it owns its own, so a staffer can recolor one tile
    // without repainting the band: the dark "Give online" feature card plus the
    // three method tiles (the C3 app / in person / by mail).
    expect(keys).toEqual(expect.arrayContaining([
      "give-way-feature-bg",
      "give-way-app-bg",
      "give-way-person-bg",
      "give-way-mail-bg",
    ]));
  });

  it("no tile shares a bg handle with another (independent recolor)", () => {
    // A duplicated key would repaint two tiles at once — the failure per-tile
    // handles exist to prevent. buildBgCss keys on the attribute value alone.
    const keys = bgKeys(html);
    expect(new Set(keys).size).toBe(keys.length);
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
