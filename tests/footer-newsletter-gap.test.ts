// @vitest-environment jsdom
/**
 * v8 P3 — the footer newsletter blurb sat directly on top of <NewsletterForm/> with a
 * cramped (effectively 0px) gap. The blurb is a <p>, and globals.css carries an
 * UNLAYERED `p{margin:0}` reset that BEATS Tailwind's layered `mb-*` utility, so the
 * audit-proposed `mb-8` on the blurb computes to 0 (verified live at 1440). The
 * effective, codebase-idiomatic fix is a spacing WRAPPER on the next element — a
 * `<div className="mt-7">` around <NewsletterForm/>, matching the sibling
 * `<div className="mt-7"><SocialRow/></div>` (a div has no unlayered margin reset, so
 * `mt-*` actually applies).
 *
 * This locks the fix structurally: the blurb is immediately followed by an mt-* wrapper,
 * NOT relying on its own (inert) margin. RED-FIRST: pre-fix the blurb `</p>` is followed
 * by the bare `<form …>` (NewsletterForm's root), so the wrapper assertion fails.
 */
import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import Footer from "@/components/layout/Footer";

describe("P3 — footer newsletter blurb→form gap uses an effective spacing wrapper", () => {
  const html = renderToStaticMarkup(createElement(Footer, {}));

  it("the newsletter blurb is immediately followed by an mt-* spacing wrapper (not an inert p-margin)", () => {
    // SSR strips JSX comments, so the blurb </p> is directly followed by the wrapper div.
    expect(html).toMatch(/data-cms="g:footer-news-blurb"[\s\S]*?<\/p><div class="mt-\d+">/);
  });

  it("the blurb <p> itself carries NO mb-* utility (it would be overridden to 0 by the unlayered p reset)", () => {
    const blurbTag = (html.match(/<p[^>]*data-cms="g:footer-news-blurb"[^>]*>/) || [""])[0];
    expect(blurbTag).toBeTruthy();
    expect(blurbTag).not.toMatch(/\bmb-\d+\b/);
  });
});
