// @vitest-environment jsdom
/**
 * p4-trustfix — the recurring trust-breaker: Vimeo + podcast surfaces that keep
 * shipping on /messages (and lingering in the footer), plus an invisible CTA on
 * /watch. This locks the removals at the SOURCE level so they cannot regress.
 *
 *   Messages — ZERO vimeo / anchor.fm / podcast / Spotify / Apple Podcasts; the full
 *              sermon archive is on YouTube (@c3hays) with a clean "Watch on YouTube"
 *              CTA. No `messages-vimeo-*` / `messages-podcast-*` CMS keys.
 *   Footer   — the newsletter blurb no longer says "Sermon notes"; no vimeo/podcast
 *              anywhere (including code comments).
 *   Watch    — the white "on demand" section's secondary CTA is NOT the light-on-dark
 *              `.btn-outline` (invisible on white) — it uses the ink variant.
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import path from "path";

const readRaw = (p: string) => readFileSync(path.resolve(process.cwd(), p), "utf8");

/**
 * Strip comments before asserting.
 *
 * The guarantee is that this PAGE does not RENDER a podcast/Vimeo link — not that
 * the word may never be written down. Grepping raw source conflated the two, so
 * the file's own header comment ("Rebuilt to REAL content only — no fabricated
 * sermon series, podcast episodes, or campus pastors") FAILED the very rule it
 * documents. A guard you cannot explain in a comment is a guard people delete.
 *
 * This is round-7 D169's ruling applied to its sibling: "the test assertion is
 * over-broad — fix the TESTS, not the feature. Replace the grep with the real
 * guarantee." The real guarantee is about emitted markup, so comments come out
 * first. Strings and JSX text still count, which is what actually ships.
 */
const stripComments = (src: string) =>
  src.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/(^|[^:])\/\/.*$/gm, "$1");

const read = (p: string) => stripComments(readRaw(p));
const BANNED = ["vimeo", "anchor.fm", "podcast", "spotify", "apple podcasts"];

describe("Messages — ZERO Vimeo / podcast; YouTube archive only", () => {
  const src = read("src/app/messages/page.tsx").toLowerCase();
  for (const term of BANNED) {
    it(`has NO "${term}" reference`, () => {
      expect(src).not.toContain(term);
    });
  }
  it("has NO messages-vimeo-* / messages-podcast-* CMS keys", () => {
    expect(src).not.toMatch(/messages-vimeo-/);
    expect(src).not.toMatch(/messages-podcast-/);
  });
  it("links the real YouTube channel @c3hays", () => {
    expect(src).toContain("youtube.com/@c3hays");
  });
});

describe("MockLiveStream — no Vimeo mention", () => {
  const src = read("src/components/watch/MockLiveStream.tsx").toLowerCase();
  it("has NO vimeo reference", () => {
    expect(src).not.toContain("vimeo");
  });
});

describe("Footer — newsletter blurb reworded; no Vimeo/podcast", () => {
  const src = read("src/components/layout/Footer.tsx").toLowerCase();
  for (const term of ["vimeo", "anchor.fm", "podcast"]) {
    it(`Footer source has NO "${term}" reference`, () => {
      expect(src).not.toContain(term);
    });
  }
  it("the footer-news-blurb default string does NOT say 'Sermon notes'", () => {
    // the default lives in the tx(t, "footer-news-blurb", "<default>") fallback
    const blurb = (read("src/components/layout/Footer.tsx")
      .match(/tx\(t,\s*"footer-news-blurb",\s*"([^"]*)"/) || [])[1] || "";
    expect(blurb).toBeTruthy();
    expect(blurb.toLowerCase()).not.toContain("sermon notes");
  });
});

describe("Watch — on-demand CTA is visible on the white section", () => {
  const src = read("src/app/watch/page.tsx");
  it("does NOT use the invisible light-on-dark `.btn-outline` (white text/border on white bg)", () => {
    // btn-outline-ink / -navy are fine; a bare `btn-outline ` token is the invisible one.
    expect(src).not.toMatch(/className="btn btn-outline btn-/);
  });
});
