/**
 * Phase-3 (p3-connect-watch) scope guards.
 *
 * Asserts Tyler's hard requirements at the SOURCE level so a regression can't
 * silently reintroduce the removed surfaces:
 *   Watch     — no podcast (anchor.fm), no Vimeo, no service-times block; YouTube + FB Live present.
 *   Connect   — contact form is FIRST; no "no bots"/captcha copy; a real CCB form URL is wired.
 *   Newsletter— /newsletter exists; old /news redirects to it.
 *   Events    — /events exists; does NOT reproduce the "No events found" empty state.
 */
import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "fs";
import path from "path";

const app = (p: string) => path.resolve(process.cwd(), "src/app", p);
const read = (p: string) => readFileSync(app(p), "utf8");

describe("Watch — YouTube + Facebook Live only (no podcast / Vimeo / service times)", () => {
  const src = read("watch/page.tsx");
  it("has NO podcast / anchor.fm reference", () => {
    expect(src.toLowerCase()).not.toContain("anchor.fm");
    expect(src.toLowerCase()).not.toContain("podcast");
  });
  it("has NO Vimeo reference", () => {
    expect(src.toLowerCase()).not.toContain("vimeo");
  });
  it("has NO service-times block", () => {
    // the old page rendered a "Service Times" section with per-campus time rows
    expect(src.toLowerCase()).not.toContain("service times");
    expect(src).not.toContain("watch-times-hays-time");
  });
  it("links the real YouTube channel and Facebook Live", () => {
    expect(src).toContain("youtube.com/@c3hays");
    expect(src).toContain("facebook.com/c3hays/videos");
  });
});

describe("Connect — form first, no captcha copy, real CCB form", () => {
  const page = read("connect/page.tsx");
  const client = read("connect/ConnectClient.tsx");
  const both = page + client;
  it("has NO 'no bots'/captcha copy", () => {
    expect(both.toLowerCase()).not.toContain("no bots");
    expect(both.toLowerCase()).not.toContain("captcha");
  });
  it("wires a real Church Community Builder form URL", () => {
    expect(both).toContain("celebration.ccbchurch.com/goto/forms");
  });
  it("renders the contact form BEFORE the intent/next-step cards", () => {
    // The form must appear earlier in the client than the intent/next-step cards.
    // Phase-5 redesign folded the old connect-form-heading into the glass-card
    // header, so anchor on the first form FIELD (stable) instead of that removed key.
    const formIdx = client.indexOf("connect-field-firstname");
    const intentsIdx = client.indexOf("connect-intents");
    expect(formIdx).toBeGreaterThan(-1);
    expect(intentsIdx).toBeGreaterThan(-1);
    expect(formIdx).toBeLessThan(intentsIdx);
  });
});

describe("Newsletter — new /newsletter page; old /news redirects", () => {
  it("/newsletter page exists", () => {
    expect(existsSync(app("newsletter/page.tsx"))).toBe(true);
  });
  it("/news redirects to /newsletter", () => {
    const news = read("news/page.tsx");
    expect(news).toContain("redirect");
    expect(news).toContain("/newsletter");
  });
});

describe("Events — real /events page, not the empty state", () => {
  it("/events page exists", () => {
    expect(existsSync(app("events/page.tsx"))).toBe(true);
  });
  it("does NOT reproduce the live site's 'No events found' empty state", () => {
    const src = read("events/page.tsx");
    expect(src.toLowerCase()).not.toContain("no events found");
  });
});
