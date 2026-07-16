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

const read = (p: string) => readFileSync(path.resolve(process.cwd(), p), "utf8");
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
