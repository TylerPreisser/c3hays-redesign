// @vitest-environment jsdom
/**
 * Symptom-B guard: the /section-preview LIVE route must route a NON-HOME section id
 * (connect-*, give-*, counseling-*, events-*, visit-*, weekly-*) to its real page so
 * the rail thumbnail renders that page's section (Option C) instead of the old
 * renderExample() → null → BLANK card. This locks the id-prefix ↔ slug contract
 * (shared key-space with c3-backend page-sections); home/example ids must stay on the
 * renderExample path (→ null here).
 */
import { describe, it, expect } from "vitest";
import { slugForSectionId } from "@/lib/section-preview-slug";

describe("slugForSectionId — non-home section id → owning page slug", () => {
  it.each([
    ["connect-hero", "/connect"],
    ["connect-steps", "/connect"],
    ["give-hero", "/give"],
    ["give-impact", "/give"],
    ["give-ways", "/give"],
    ["counseling-hero", "/counseling"],
    ["counseling-team", "/counseling"],
    ["counseling-fees", "/counseling"],
    ["events-hero", "/events"],
    ["events-upcoming", "/events"],
    ["events-calendar", "/events"],
    ["visit-hero", "/visit"],
    ["visit-plan", "/visit"],
    ["visit-location", "/visit"],
    ["weekly-hero", "/news"],
    ["weekly-list", "/news"],
  ])("%s → %s", (id, slug) => {
    expect(slugForSectionId(id)).toBe(slug);
  });
});

describe("slugForSectionId — HOME + example ids stay on the renderExample path", () => {
  it.each([
    "hero", "mission", "meetGrowServe", "nt26", "locations", "stayConnected", "give", "promo",
    // example-library ids that share a leading word but NOT the "<page>-" prefix:
    "serviceTimes", "eventsStrip", "ministriesGrid", "staffGrid", "scriptureVerse",
    "unknownThing",
  ])("%s → null", (id) => {
    expect(slugForSectionId(id)).toBeNull();
  });
});
