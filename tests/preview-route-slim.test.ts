// @vitest-environment jsdom
/**
 * G4 (perf slim): the inert /section-preview thumbnail route must NOT boot the site's
 * heavy client chrome (framer-motion nav, Lenis smooth-scroll, reveal player). The
 * `isSectionPreviewPath` guard is the single source of truth every chrome component uses
 * to opt out on that route only — never on a real page.
 *
 * We assert (1) the pure matcher, and (2) that the Header renders NOTHING on the preview
 * route (proving the framer-motion header is stripped) while still rendering on a real
 * page (proving the live site is untouched).
 */
import { describe, it, expect, beforeAll, vi } from "vitest";

const state = vi.hoisted(() => ({ path: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => state.path }));

import { isSectionPreviewPath } from "@/lib/preview-route";

describe("isSectionPreviewPath — matches the preview route only", () => {
  it.each([
    ["/section-preview", true],
    ["/section-preview/", true],
    ["/section-preview?section=hero&cmsEdit=0", true],
    ["/", false],
    ["/about", false],
    ["/section-preview/foo", false],
    [null, false],
    [undefined, false],
  ])("%s → %s", (input, expected) => {
    expect(isSectionPreviewPath(input as string | null | undefined)).toBe(expected);
  });
});

describe("Header is stripped on the preview route, present on real pages", () => {
  let renderHeader: (path: string) => string;
  beforeAll(async () => {
    if (typeof window !== "undefined" && !window.matchMedia) {
      // @ts-expect-error minimal jsdom stub (gsap ScrollTrigger reads matchMedia at import)
      window.matchMedia = () => ({ matches: false, media: "", onchange: null, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent() { return false; } });
    }
    const { renderToStaticMarkup } = await import("react-dom/server");
    const { createElement } = await import("react");
    const { default: Header } = await import("@/components/layout/Header");
    renderHeader = (path: string) => { state.path = path; return renderToStaticMarkup(createElement(Header, {})); };
  });

  it("renders no header markup on /section-preview", () => {
    expect(renderHeader("/section-preview")).toBe("");
  });

  it("renders a real <header> on a normal page", () => {
    expect(renderHeader("/")).toContain("<header");
  });
});
