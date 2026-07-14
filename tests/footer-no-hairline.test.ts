// @vitest-environment jsdom
/**
 * v8 D4 — the 2px teal hairline in the middle of the footer must be GONE (Tyler
 * confirmed removal with the user). It appears in TWO places: the Editorial variant
 * (`!preCta`) and the Minimal variant, each a
 * `<div style={{height:2, background:"linear-gradient(90deg, transparent, #1cc3af ...)"}}>`.
 *
 * We render the REAL Footer (both default/editorial and minimal variants) and assert
 * the hairline div is absent. RED-FIRST: before the fix both variants emit it.
 */
import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import Footer from "@/components/layout/Footer";

/** The distinctive fingerprint of the teal hairline: a 2px-tall teal linear-gradient. */
const HAIRLINE = /height:\s*2px;\s*background:\s*linear-gradient\(90deg,\s*transparent,\s*#1cc3af/;

describe("D4 — footer teal hairline removed", () => {
  it("editorial (default) footer has no teal hairline", () => {
    const html = renderToStaticMarkup(createElement(Footer, {}));
    expect(html).not.toMatch(HAIRLINE);
  });
  it("minimal footer has no teal hairline", () => {
    const html = renderToStaticMarkup(createElement(Footer, { globals: { text: { "footer-variant": "minimal" } } }));
    expect(html).not.toMatch(HAIRLINE);
  });
});
