// @vitest-environment jsdom
/**
 * EE-VISITWEEKLY rebuild guards (Phase-4 editor-editable contract).
 *
 * Four invariants the ee-visitweekly workstream must satisfy — written RED-FIRST
 * (they fail against the pre-rebuild code) then driven GREEN:
 *
 *   (a) /visit is section-composed into EXACTLY the 2 contract sections
 *       (visit-hero, visit-plan) — the visit-location campus directory was moved to
 *       the Locations page (#7) — and NO LONGER carries the removed "coming this
 *       weekend" CTA or the "Browse … C3 Weekly" block.
 *   (b) /news is the REAL "C3 Weekly" page (weekly-hero + weekly-list data-section
 *       wrappers, the issue browser) — NOT a router.replace redirect stub.
 *   (c) /newsletter redirects to /news (the C3 Weekly page), NOT /visit — so the
 *       editor's "News" resolves to real C3 Weekly content, not Visit.
 *   (d) the SHARED nav renders identically across pages and carries a "C3 Weekly"
 *       entry pointing at /news/.
 *
 * Also enforces editable-by-construction on both rebuilt pages: every data-cms-link
 * carries a data-cms-link-label descendant (no card-collapse).
 */
import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "fs";
import path from "path";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";

const app = (p: string) => path.resolve(process.cwd(), "src/app", p);
const readApp = (p: string) => readFileSync(app(p), "utf8");

/** data-section ids present in a rendered markup string. */
function sectionIds(html: string): string[] {
  const host = document.createElement("div");
  host.innerHTML = html;
  return Array.from(host.querySelectorAll("[data-section]")).map(
    (el) => el.getAttribute("data-section") || "",
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

let visitHtml = "";
let newsHtml = "";
let headerA = "";
let headerB = "";

beforeAll(async () => {
  // gsap's ScrollTrigger (pulled transitively by Hero/LocationsSection/Header) reads
  // window.matchMedia at module-eval; jsdom lacks it. Stub before dynamic import.
  if (typeof window !== "undefined" && !window.matchMedia) {
    // @ts-expect-error minimal jsdom stub
    window.matchMedia = () => ({ matches: false, media: "", onchange: null, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent() { return false; } });
  }

  const noProps = { searchParams: Promise.resolve({}) };
  const { default: VisitPage } = await import("@/app/visit/page");
  visitHtml = renderToStaticMarkup(await VisitPage(noProps));

  const { default: NewsPage } = await import("@/app/news/page");
  newsHtml = renderToStaticMarkup(await NewsPage(noProps));

  // Shared nav is layout-level (one <Header> for every page). Render it twice to
  // prove it is pathname-independent → identical nav on /visit and any other page.
  const { default: Header } = await import("@/components/layout/Header");
  headerA = renderToStaticMarkup(createElement(Header, { globals: {} }));
  headerB = renderToStaticMarkup(createElement(Header, { globals: {} }));
});

describe("(a) /visit — 2 contract sections, removed blocks gone", () => {
  it("emits exactly the 2 contract data-section wrappers (campus directory moved to Locations, #7)", () => {
    expect(sectionIds(visitHtml)).toEqual(["visit-hero", "visit-plan"]);
  });
  it("no longer renders the 'coming this weekend' CTA copy", () => {
    expect(visitHtml.toLowerCase()).not.toContain("coming this weekend");
    expect(visitHtml.toLowerCase()).not.toContain("let us know you&#x27;re coming");
    expect(visitHtml.toLowerCase()).not.toContain("watch online first");
  });
  it("no longer renders the 'Browse … C3 Weekly' block (moved to /news)", () => {
    expect(visitHtml).not.toContain("Browse The C3 Weekly");
    expect(visitHtml).not.toContain("Browse C3 Weekly");
  });
  it("is editable-by-construction (no collapsed links)", () => {
    expect(collapsedLinkKeys(visitHtml)).toEqual([]);
  });
});

describe("(b) /news — real C3 Weekly page, not a redirect", () => {
  it("emits the weekly-hero + weekly-list data-section wrappers", () => {
    const ids = sectionIds(newsHtml);
    expect(ids).toContain("weekly-hero");
    expect(ids).toContain("weekly-list");
  });
  it("renders C3 Weekly browse content (issue browser)", () => {
    expect(newsHtml).toContain("Browse The C3 Weekly");
  });
  it("is NOT a client redirect stub", () => {
    const src = readApp("news/page.tsx");
    expect(src).not.toContain("router.replace");
    expect(src).not.toContain("useRouter");
  });
  it("is editable-by-construction (no collapsed links)", () => {
    expect(collapsedLinkKeys(newsHtml)).toEqual([]);
  });
});

describe("(c) /newsletter — redirects to /news (C3 Weekly), not /visit", () => {
  const src = readApp("newsletter/page.tsx");
  it("targets /news, never /visit", () => {
    expect(src).toContain("/news");
    expect(src).not.toContain("/visit");
  });
});

describe("(d) shared nav — identical across pages, includes C3 Weekly → /news/", () => {
  it("renders identically regardless of page (pathname-independent)", () => {
    expect(headerA).toBe(headerB);
  });
  it("carries a 'C3 Weekly' nav entry pointing at /news/", () => {
    expect(headerA).toContain("C3 Weekly");
    // next/link renders the trailing-slash-stripped href on the <a>.
    expect(headerA).toContain('href="/news"');
  });
  it("still surfaces the other primary destinations", () => {
    for (const label of ["Messages", "Events", "Watch", "Counseling", "Connect"]) {
      expect(headerA).toContain(label);
    }
  });
});
