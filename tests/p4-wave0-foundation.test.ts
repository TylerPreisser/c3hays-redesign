// @vitest-environment jsdom
/**
 * Phase 4 — Wave 0 foundation.
 *
 * Guards the systemic root-cause fix + the reusable spacing/component primitives
 * every redesign wave consumes:
 *   1. The element reset (`h1..h6,p,ul,ol,figure,blockquote{margin:0}`) MUST live
 *      inside `@layer base { }`. Unlayered, it beats Tailwind v4's layered
 *      `@layer utilities` `mb-*`/`mt-*` so every heading/paragraph margin computes
 *      to 0 sitewide (the "everything is vertically cramped" root cause).
 *   2. `.btn` must use `line-height:1.15` + base `font-size:0.875rem` (G3 — the
 *      pill text was optically squeezed at line-height:1 / 0.8125rem).
 *   3. Named vertical-rhythm tokens exist so components never hand-pick clamps.
 *   4. The Section / Stack / SectionHeader / FeatureCard primitives render.
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import path from "path";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";

const css = readFileSync(path.resolve(process.cwd(), "src/app/globals.css"), "utf8");

/** Extract the body of the FIRST `@layer <name> {…}` block by brace-matching. */
function layerBody(source: string, name: string): string | null {
  const marker = `@layer ${name}`;
  const at = source.indexOf(marker);
  if (at === -1) return null;
  const open = source.indexOf("{", at);
  if (open === -1) return null;
  let depth = 0;
  for (let i = open; i < source.length; i++) {
    if (source[i] === "{") depth++;
    else if (source[i] === "}") {
      depth--;
      if (depth === 0) return source.slice(open + 1, i);
    }
  }
  return null;
}

describe("Wave 0 — S1: reset is layered so utility margins win", () => {
  it("wraps the element reset in @layer base", () => {
    const base = layerBody(css, "base");
    expect(base, "@layer base { … } block must exist").not.toBeNull();
    // The heading/paragraph margin reset lives INSIDE @layer base.
    expect(base).toMatch(/h1\s*,\s*h2/);
    expect(base).toMatch(/blockquote/);
    expect(base).toMatch(/margin:\s*0/);
  });

  it("does not leave the heading/paragraph margin reset unlayered", () => {
    // Strip every @layer block, then assert the bare reset is gone from the
    // top level (an unlayered `h1,…{margin:0}` is exactly the bug).
    let stripped = css;
    // remove @layer <name> { ... } blocks (brace-matched, one at a time)
    for (;;) {
      const m = stripped.match(/@layer\s+[\w,\s]+\{/);
      if (!m || m.index === undefined) break;
      const open = stripped.indexOf("{", m.index);
      let depth = 0;
      let end = -1;
      for (let i = open; i < stripped.length; i++) {
        if (stripped[i] === "{") depth++;
        else if (stripped[i] === "}") {
          depth--;
          if (depth === 0) { end = i; break; }
        }
      }
      if (end === -1) break;
      stripped = stripped.slice(0, m.index) + stripped.slice(end + 1);
    }
    // No unlayered `h1,h2,…,blockquote { margin: 0 }` reset remains.
    expect(stripped).not.toMatch(/h1\s*,\s*h2[^{}]*blockquote\s*\{\s*margin:\s*0/);
  });
});

describe("Wave 0 — S4/G3: button text de-cramped", () => {
  const btn = css.match(/\.btn\s*\{[^}]*\}/)?.[0] ?? "";
  it(".btn uses line-height:1.15", () => {
    expect(btn).toMatch(/line-height:\s*1\.15/);
  });
  it(".btn base font-size is 0.875rem", () => {
    expect(btn).toMatch(/font-size:\s*0\.875rem/);
  });
});

describe("Wave 0 — §2.2: named vertical-rhythm tokens", () => {
  for (const tok of ["--space-eyebrow", "--space-heading", "--space-body", "--space-cta", "--space-block"]) {
    it(`defines ${tok}`, () => {
      expect(css).toMatch(new RegExp(tok.replace(/-/g, "\\-") + "\\s*:"));
    });
  }
});

describe("Wave 0 — primitives render", () => {
  it("Section applies tone + container + section padding + data-cms-bg", async () => {
    const { default: Section } = await import("@/components/ui/Section");
    const html = renderToStaticMarkup(
      createElement(Section, { tone: "mist", container: true, bgKey: "about-values" }, "hi")
    );
    expect(html).toContain("section-mist");
    expect(html).toContain("container-c3");
    expect(html).toContain('data-cms-bg="about-values"');
    expect(html).toMatch(/<section/);
  });

  it("Section size=flush-top drops the top padding", async () => {
    const { default: Section } = await import("@/components/ui/Section");
    const flush = renderToStaticMarkup(createElement(Section, { size: "flush-top" }, "x"));
    // uses the rhythm var for bottom, 0 for top — never an ad-hoc clamp
    expect(flush).toMatch(/padding-top:\s*0/);
  });

  it("Stack lays out a flex column with a rhythm-token gap", async () => {
    const { default: Stack } = await import("@/components/ui/Stack");
    const html = renderToStaticMarkup(createElement(Stack, { gap: "body" }, "a"));
    expect(html).toMatch(/display:\s*flex/);
    expect(html).toMatch(/flex-direction:\s*column/);
    expect(html).toContain("var(--space-body)");
  });

  it("SectionHeader emits overline + display heading", async () => {
    const { default: SectionHeader } = await import("@/components/ui/SectionHeader");
    const html = renderToStaticMarkup(
      createElement(SectionHeader, { eyebrow: "Our Story", title: "Who We Are", lead: "A church." })
    );
    expect(html).toContain("overline");
    expect(html).toContain("Our Story");
    expect(html).toContain("Who We Are");
    expect(html).toContain("A church.");
    expect(html).toMatch(/display-2|display-1/);
  });

  it("FeatureCard is an equal-height contained surface with heading-3 + body", async () => {
    const { default: FeatureCard } = await import("@/components/ui/FeatureCard");
    const html = renderToStaticMarkup(
      createElement(FeatureCard, { title: "Come As You Are", body: "No dress code." })
    );
    expect(html).toContain("heading-3");
    expect(html).toContain("Come As You Are");
    expect(html).toContain("No dress code.");
    // equal-height: flex column so a grid row of cards stretches evenly
    expect(html).toMatch(/flex-direction:\s*column/);
    // contained rounded surface
    expect(html).toMatch(/border-radius/);
  });
});
