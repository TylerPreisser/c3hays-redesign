/**
 * v7 R4 (U1) — gradient section-bleed must be OFF by default (ugly grey band gone),
 * and only re-appear when the site opts in (Tyler-advanced toggle). Kale never sees it.
 *
 * RED-FIRST: before the fix, bleedBg() ALWAYS emits the transparent→dark→transparent
 * fade, so "default = solid, no transparent" fails. The enabled-path assertion stays
 * green (the fade is exactly what enabling should still produce).
 */
import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { bleedBg } from "@/lib/section-bleed";
import StatsBand from "@/components/home/StatsBand";

describe("bleedBg() — default OFF (R4)", () => {
  it("returns a SOLID dark by default (no gradient, no transparent stops)", () => {
    const bg = bleedBg("#1b1c1c");
    expect(bg).not.toContain("transparent");
    expect(bg).not.toContain("gradient");
    expect(bg).toContain("#1b1c1c");
  });

  it("emits the transparent→dark→transparent fade ONLY when enabled:true", () => {
    const bg = bleedBg("#1b1c1c", undefined, true);
    expect(bg).toContain("transparent");
    expect(bg).toContain("linear-gradient");
    expect(bg).toContain("#1b1c1c");
  });

  it("still honors a custom edge when enabled", () => {
    const bg = bleedBg("#252727", "40px", true);
    expect(bg).toContain("40px");
    expect(bg).toContain("#252727");
  });
});

describe("dark section render — clean edges by default (R4)", () => {
  it("StatsBand 'cards' has NO transparent bleed stops by default", () => {
    const html = renderToStaticMarkup(createElement(StatsBand, { variant: "cards" }));
    expect(html).not.toContain("transparent");
    expect(html).toContain("#1b1c1c");
  });

  it("StatsBand 'cards' restores the fade when bleed is enabled", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const html = renderToStaticMarkup(createElement(StatsBand as any, { variant: "cards", bleed: true }));
    expect(html).toContain("transparent");
  });
});
