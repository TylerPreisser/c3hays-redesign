// @vitest-environment jsdom
/**
 * /counseling EDITOR-NATIVE GUARD (contract §1–§3, §5).
 *
 * The Counseling page was bespoke JSX: no section model (Layer 2), counselor
 * cards from @/data/counselors rendered as untagged <h3>/<p>, and the top photo
 * un-swappable. This test locks the rebuilt, editor-native shape:
 *   (1) the page composes into the THREE registry-native sections the c3-backend
 *       defaultSectionsForSlug("/counseling") declares — verbatim ids, each wrapped
 *       in a <div data-section> so the rail can add/reorder/hide/recolor it;
 *   (2) the hero (top) photo carries data-cms-img so it is swappable;
 *   (3) every counselor card container carries its OWN data-cms-bg so a card can be
 *       recolored independently;
 *   (4) the editable-by-construction invariant holds — every [data-cms-link] has a
 *       [data-cms-link-label] descendant (no whole-card-as-one-link collapse).
 *
 * RED-FIRST: against the pre-rebuild page this fails at (1) (zero data-section
 * wrappers) — proving it reproduces the gap before the fix makes it green.
 */
import { describe, it, expect, beforeAll } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { counselors } from "@/data/counselors";

/** data-cms-link keys whose element has NO data-cms-link-label descendant. */
function collapsedLinkKeys(html: string): string[] {
  const host = document.createElement("div");
  host.innerHTML = html;
  return Array.from(host.querySelectorAll("[data-cms-link]"))
    .filter((el) => !el.querySelector("[data-cms-link-label]"))
    .map((el) => el.getAttribute("data-cms-link") || "(unnamed)");
}

/** The data-section ids present in the rendered markup, in order. */
function sectionIds(html: string): string[] {
  const host = document.createElement("div");
  host.innerHTML = html;
  return Array.from(host.querySelectorAll("[data-section]")).map(
    (el) => el.getAttribute("data-section") || "",
  );
}

let html = "";

beforeAll(async () => {
  // Some shared UI reads window.matchMedia at module-eval; jsdom lacks it.
  if (typeof window !== "undefined" && !window.matchMedia) {
    // @ts-expect-error minimal jsdom stub
    window.matchMedia = () => ({ matches: false, media: "", onchange: null, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent() { return false; } });
  }
  const { default: CounselingPage } = await import("@/app/counseling/page");
  // Async server component; with no CMS configured it renders the hand-built
  // defaults via PageComposer.
  html = renderToStaticMarkup(await CounselingPage({}));
});

describe("/counseling is editor-native (Layer 2 + Layer 1)", () => {
  it("composes the three backend-declared sections, each in a data-section wrapper", () => {
    expect(sectionIds(html)).toEqual([
      "counseling-hero",
      "counseling-team",
      "counseling-fees",
    ]);
  });

  it("the hero (top) photo is swappable — carries data-cms-img", () => {
    expect(html).toContain('data-cms-img="counseling-hero-bg"');
  });

  it("every counselor card container has its own data-cms-bg", () => {
    for (const c of counselors) {
      expect(html).toContain(`data-cms-bg="counseling-${c.id}-bg"`);
    }
  });

  it("each counselor's name/role/bio is independently editable (data-cms)", () => {
    for (const c of counselors) {
      expect(html).toContain(`data-cms="t:counseling-${c.id}-name"`);
      expect(html).toContain(`data-cms="t:counseling-${c.id}-role"`);
      expect(html).toContain(`data-cms="t:counseling-${c.id}-bio"`);
    }
  });

  it("no editable link collapses a whole card (every data-cms-link has a label span)", () => {
    expect(collapsedLinkKeys(html)).toEqual([]);
  });
});
