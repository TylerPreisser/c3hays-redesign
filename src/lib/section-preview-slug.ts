/**
 * The id-prefix ↔ page-slug contract for the LIVE /section-preview route.
 *
 * A NON-HOME Layer-2 section id lives only inside its own page's render() switch, so
 * the live rail thumbnail is produced by rendering that page and isolating the target
 * section (see src/app/section-preview/page.tsx, Option C). This maps the section id
 * to the owning page route. Kept in its OWN gsap-free module so it is unit-testable
 * without dragging the whole render graph (renderExample → home components → gsap).
 *
 * The id prefixes mirror c3-backend's page-sections key-space (shared, hand-mirrored).
 * Returns null for HOME + example-library ids (those render via renderExample). Note
 * the trailing "-" in each prefix is load-bearing: it keeps example ids that merely
 * share a leading word (e.g. "eventsStrip") on the home path.
 */
export function slugForSectionId(id: string): string | null {
  if (id.startsWith("connect-")) return "/connect";
  if (id.startsWith("give-")) return "/give";
  if (id.startsWith("counseling-")) return "/counseling";
  if (id.startsWith("events-")) return "/events";
  if (id.startsWith("visit-")) return "/visit";
  if (id.startsWith("weekly-")) return "/news";
  if (id.startsWith("about-")) return "/about";
  if (id.startsWith("beliefs-")) return "/beliefs";
  if (id.startsWith("locations-")) return "/locations";
  if (id.startsWith("messages-")) return "/messages";
  if (id.startsWith("watch-")) return "/watch";
  return null;
}
