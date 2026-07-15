// @vitest-environment jsdom
/**
 * Phase 3 site-wide truth pass — Vimeo and the anchor.fm PODCAST are removed
 * EVERYWHERE and replaced by the real YouTube channel (@c3hays). This guards the
 * shared surfaces this coder owns: the socials source of truth (src/data/site.ts)
 * and the site-wide Footer social bar (rendered on every page).
 *
 * RED-FIRST: before the fix site.social carried `vimeo` + `podcast` and the Footer
 * rendered a Vimeo <Social> icon.
 */
import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import Footer from "@/components/layout/Footer";
import { site } from "@/data/site";

describe("Phase 3 — real socials source of truth (site.ts)", () => {
  it("has NO vimeo and NO podcast channel", () => {
    expect("vimeo" in site.social).toBe(false);
    expect("podcast" in site.social).toBe(false);
    // no stray vimeo/anchor URL hiding in any social value
    for (const v of Object.values(site.social)) {
      expect(v).not.toMatch(/vimeo|anchor\.fm/i);
    }
  });
  it("uses the real YouTube channel and Facebook Live", () => {
    expect(site.social.youtube).toBe("https://www.youtube.com/@c3hays");
    expect(site.social.facebook).toBe("https://facebook.com/c3hays");
    expect(site.social.facebookLive).toBe("https://facebook.com/c3hays/videos");
    expect(site.social.instagram).toBe("https://instagram.com/c3hays");
  });
  it("links the real iOS app (no invented Google Play link)", () => {
    expect(site.appStore).toBe("https://apps.apple.com/us/app/c3-hays/id1028509278");
  });
  it("wires Give via the real Pushpay campuses", () => {
    expect(site.giving.hays).toContain("pushpay.com/g/4390326549");
    expect(site.giving.colby).toContain("pushpay.com/g/celebratejesus");
    expect(site.giving.online).toContain("pushpay.com/g/4553051606");
  });
});

describe("Phase 3 — Footer social bar (every page) has no Vimeo / no podcast", () => {
  for (const variant of ["editorial", "minimal", "bigcta"]) {
    it(`${variant} footer: no Vimeo, no anchor.fm; keeps FB/IG/YouTube`, () => {
      const html = renderToStaticMarkup(
        createElement(Footer, { globals: { text: { "footer-variant": variant } } })
      );
      expect(html).not.toMatch(/vimeo/i);
      expect(html).not.toMatch(/anchor\.fm/i);
      expect(html).not.toContain('aria-label="Vimeo"');
      expect(html).toContain('aria-label="YouTube"');
      expect(html).toContain('aria-label="Facebook"');
      expect(html).toContain('aria-label="Instagram"');
    });
  }
});
