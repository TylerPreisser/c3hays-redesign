// @vitest-environment node
import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import Hero from "@/components/home/Hero";
import { HERO_DEFAULTS } from "@/lib/home-content";

/**
 * The Home hero photo must be selectable in the editor's canvas in every layout. On Home the hero and the mission
 * share one photo painted by the page composer behind both (`continuous`), which can never be a click target, so the
 * hero carries the marker itself.
 */
describe("Home hero photo marker", () => {
  const props = { content: HERO_DEFAULTS, text: {}, btn: {} };
  it.each([["continuous", true], ["standalone", false]])("%s hero carries data-cms-img=hero.bg", (_n, continuous) => {
    const html = renderToStaticMarkup(createElement(Hero as never, { ...props, continuous } as never));
    expect(html).toContain('data-cms-img="hero.bg"');
  });
});
