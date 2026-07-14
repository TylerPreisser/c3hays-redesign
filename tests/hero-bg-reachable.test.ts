// @vitest-environment jsdom
/**
 * v8 iter-2 D3 caveat — the home hero BACKGROUND (`<Image data-cms-img="hero.bg">`) sits
 * under the scrim overlays + the centered content column, so elementFromPoint never hit
 * the photo and it couldn't be swapped. FIX: the two scrim overlays are
 * `pointer-events:none`, and the content column is `pointer-events:none` with its H1/CTA
 * children re-enabled (`pointer-events:auto`) — empty hero areas fall through to the
 * photo (Change-image reachable) while the headline stays editable and the CTAs clickable.
 *
 * RED-FIRST: none of the hero overlays carry pointer-events today.
 */
import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import Hero from "@/components/home/Hero";

const html = renderToStaticMarkup(createElement(Hero, {})); // defaults → classic variant

describe("D3 — home hero background photo is reachable for swap", () => {
  it("the vertical scrim is click-through", () => {
    expect(html).toMatch(/linear-gradient\(180deg, rgba\(10,10,10,0\.6\)[^"]*pointer-events:\s*none/);
  });
  it("the vignette scrim is click-through", () => {
    expect(html).toMatch(/radial-gradient\(ellipse 70% 55%[^"]*pointer-events:\s*none/);
  });
  it("the content column is click-through with interactive children re-enabled", () => {
    expect(html).toMatch(/pointer-events:\s*none/);
    expect(html).toMatch(/pointer-events:\s*auto/);
  });
});
