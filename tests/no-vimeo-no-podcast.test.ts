// @vitest-environment jsdom
/**
 * Socials source-of-truth guard for src/data/site.ts + the site-wide Footer bar.
 *
 * HISTORY / CORRECTION. This file used to assert `'podcast' in site.social === false`,
 * on the Phase-3 belief that anchor.fm was fabricated alongside Vimeo. That premise was
 * WRONG and the assertion is now inverted. Evidence:
 *   - reference/c3hays-org-mirror/ (raw capture of the live celebratejesus.org) links
 *     https://anchor.fm/c3pod 226x, in the site-wide footer, behind a fa-podcast icon,
 *     immediately after the vimeo icon.
 *   - The URL still resolves: 302 -> https://creators.spotify.com/pod/profile/c3pod/
 *     (200), whose og:description reads "The C3 Podcast is a product of Celebration
 *     Community Church, with two physical campuses in Hays, KS and Colby, KS."
 * So cec38a8 was right to carry `podcast`, and removing it would delete a real church
 * channel and blank the "C3 Podcast" card in WeeklyConnect. The guard now protects the
 * link instead of banning it.
 *
 * Two further corrections, both from probing the live artifact rather than the mirror:
 *   - appStore: apps.apple.com/us/app/c3-hays/id1028509278 now 301s to .../c3-ks/...
 *     (the app was renamed). The slug is Apple-controlled and cosmetic, so this asserts
 *     the STABLE App ID, not the slug — pinning the slug is what made this go stale.
 *   - facebook/instagram: www-vs-bare host is not a truth property (same page, and the
 *     mirror carries both forms). Pinning the exact prefix made this go red without
 *     anything actually being wrong, so these assert the ACCOUNT, not the string.
 *
 * Vimeo stays banned, but as a PRODUCT decision, not a truth claim: the real site does
 * carry vimeo.com/c3hays; the redesign consolidated watch-on-demand to YouTube (3c6d509).
 */
import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import Footer from "@/components/layout/Footer";
import { site } from "@/data/site";

describe("real socials source of truth (site.ts)", () => {
  it("carries the real C3 Podcast (anchor.fm/c3pod), which is NOT fabricated", () => {
    expect("podcast" in site.social).toBe(true);
    expect(site.social.podcast).toBe("https://anchor.fm/c3pod");
  });

  it("has NO vimeo channel (consolidated onto YouTube by product decision)", () => {
    expect("vimeo" in site.social).toBe(false);
    for (const v of Object.values(site.social)) {
      expect(v).not.toMatch(/vimeo/i);
    }
  });

  it("points every social at the real church account", () => {
    expect(site.social.youtube).toBe("https://www.youtube.com/@c3hays");
    // account identity, not host formatting — see header note
    expect(site.social.facebook).toMatch(/^https:\/\/(www\.)?facebook\.com\/c3hays\/?$/);
    expect(site.social.instagram).toMatch(/^https:\/\/(www\.)?instagram\.com\/c3hays\/?$/);
  });

  it("uses the live-stream path the real site actually links (/videos, never /live)", () => {
    // the mirror links facebook.com/c3hays/videos 14x and /live zero times
    expect(site.social.facebookLive).toMatch(
      /^https:\/\/(www\.)?facebook\.com\/c3hays\/videos$/
    );
  });

  it("links the real iOS app by App ID (no invented Google Play link)", () => {
    expect(site.appStore).toMatch(
      /^https:\/\/apps\.apple\.com\/us\/app\/[a-z0-9-]+\/id1028509278$/
    );
    expect(JSON.stringify(site)).not.toMatch(/play\.google\.com/i);
  });

  it("wires Give via the real Pushpay campuses", () => {
    expect(site.giving.hays).toContain("pushpay.com/g/4390326549");
    expect(site.giving.colby).toContain("pushpay.com/g/celebratejesus");
    expect(site.giving.online).toContain("pushpay.com/g/4553051606");
  });
});

describe("Footer social bar (every page) is FB / IG / YouTube / App — no Vimeo", () => {
  for (const variant of ["editorial", "minimal", "bigcta"]) {
    it(`${variant} footer: no Vimeo; keeps FB/IG/YouTube`, () => {
      const html = renderToStaticMarkup(
        createElement(Footer, { globals: { text: { "footer-variant": variant } } })
      );
      expect(html).not.toMatch(/vimeo/i);
      expect(html).not.toContain('aria-label="Vimeo"');
      expect(html).toContain('aria-label="YouTube"');
      expect(html).toContain('aria-label="Facebook"');
      expect(html).toContain('aria-label="Instagram"');
      // the podcast is real but is NOT one of the four footer icons — it surfaces in
      // WeeklyConnect. Keeping it out of the bar is a layout decision p4-trustfix also locks.
      expect(html).not.toMatch(/anchor\.fm/i);
    });
  }
});
