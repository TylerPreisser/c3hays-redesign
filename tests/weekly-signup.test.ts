// @vitest-environment jsdom
/**
 * EE-VISITWEEKLY round-2 — /news "The C3 Weekly" hero + editor-native signup.
 *
 * Red-first guards for queen-round2 items #8/#9/#10:
 *   #8  the weekly-hero KEEPS a top image (editable data-cms-img) with a left-aligned
 *       header (h1) over it.
 *   #9  a NEW editor-native newsletter-signup OVERLAY: an email field + a Sign-Up
 *       button that is a data-cms-link with the required data-cms-link-label, an
 *       editable heading, and the signup is a real <form>.
 *   #10 the old bottom "Get it in your inbox" InboxTile is GONE.
 *
 * Plus editable-by-construction: no collapsed data-cms-link on the page.
 */
import { describe, it, expect, beforeAll } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

function q(html: string) {
  const host = document.createElement("div");
  host.innerHTML = html;
  return host;
}
function collapsedLinkKeys(html: string): string[] {
  return Array.from(q(html).querySelectorAll("[data-cms-link]"))
    .filter((el) => !el.querySelector("[data-cms-link-label]"))
    .map((el) => el.getAttribute("data-cms-link") || "(unnamed)");
}

let newsHtml = "";

beforeAll(async () => {
  if (typeof window !== "undefined" && !window.matchMedia) {
    // @ts-expect-error minimal jsdom stub
    window.matchMedia = () => ({ matches: false, media: "", onchange: null, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent() { return false; } });
  }
  const { default: NewsPage } = await import("@/app/news/page");
  newsHtml = renderToStaticMarkup(await NewsPage({ searchParams: Promise.resolve({}) }));
});

describe("#8 — weekly-hero keeps an editable top image + left header", () => {
  it("renders an editable background photo (data-cms-img=weekly-hero-photo)", () => {
    expect(q(newsHtml).querySelector('[data-cms-img="weekly-hero-photo"]')).not.toBeNull();
  });
  it("renders an editable <h1> header over the image", () => {
    const h1 = q(newsHtml).querySelector('h1[data-cms]');
    expect(h1).not.toBeNull();
  });
});

describe("#9 — editor-native newsletter signup overlay", () => {
  it("renders a real signup form with an email field", () => {
    expect(q(newsHtml).querySelector('form input[type="email"]')).not.toBeNull();
  });
  it("has a Sign-Up button that is an editable data-cms-link with a label span", () => {
    const btn = q(newsHtml).querySelector('[data-cms-link="weekly-signup-cta"]');
    expect(btn).not.toBeNull();
    const label = btn?.querySelector("[data-cms-link-label]");
    expect(label).not.toBeNull();
    expect(label?.textContent).toContain("Sign Up");
  });
  it("has an independently-editable signup heading (data-cms)", () => {
    expect(q(newsHtml).querySelector('[data-cms="t:weekly-signup-heading"]')).not.toBeNull();
  });
});

describe("#10 — old bottom InboxTile is removed", () => {
  it("no longer renders the InboxTile reassurance line", () => {
    expect(newsHtml).not.toContain("No spam. Unsubscribe anytime.");
  });
});

describe("editable-by-construction", () => {
  it("has no collapsed data-cms-link on /news", () => {
    expect(collapsedLinkKeys(newsHtml)).toEqual([]);
  });
});
