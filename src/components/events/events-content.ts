/**
 * Authored /events content model (round-2: ADD/REMOVE + true edit of event cards).
 *
 * The "Upcoming Events" section is LIVE eSpace by default (positional, refetched —
 * not add/removable, and its client island mounts after the editor's first scan). To
 * make the cards TRULY editable AND add/removable, the editor persists an AUTHORED
 * card list in the page overrides; when present it OVERRIDES the live feed (mirrors
 * home/StayConnected's additive `cards` fence). Absent/empty ⇒ the live island still
 * renders, so the public site keeps live-by-default until someone curates.
 *
 * SHARED CONTRACT WITH THE EDITOR (c3-backend, queen's fence):
 *  - Storage: the authored list lives at `PageOverrides.cards` (array) for `/events`.
 *  - Text fields (title/month/day/detail/campus) round-trip via the on-canvas router
 *    path `events.cards.<id>.<field>` → `PageOverrides.cards[id].<field>` (EventCard
 *    emits `data-cms="events.cards.<id>.<field>"` in `cardPath` mode).
 *  - CTA label/href round-trip via the text bag keys `events.cards.<id>.cta-label` /
 *    `events.cards.<id>.cta-href` (EditableLink's `data-cms-link="events.cards.<id>.cta"`).
 *  - Card bg = `events-card-<id>-bg` (data-cms-bg); image = `events-card-<id>-img`
 *    (data-cms-img, swapped via `PageOverrides.media`).
 *  - The list wrapper carries `data-cms-list="events.cards"` as the add/remove anchor.
 *
 * Parse defensively at the boundary: a malformed entry is skipped, never throws.
 */

/** One authored event card. `id` is the stable CMS identity (never reused). */
export interface EventCardItem {
  id: string;
  title: string;
  month: string;
  day: string;
  detail: string;
  campus: string;
  /** Local `/images/*.webp` or absolute URL; falsy ⇒ a rotating default is used. */
  image?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

/**
 * Parse the authored `cards` list off a page-overrides object. Returns `[]` when the
 * page has no authored cards (⇒ caller falls back to the live eSpace island). Keeps
 * only entries with a non-empty string `id`; every other field is string-guarded so a
 * partial/garbage record can't throw or poison the list.
 */
export function parseEventCards(overrides: unknown): EventCardItem[] {
  const raw = (overrides as { cards?: unknown } | null | undefined)?.cards;
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const out: EventCardItem[] = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const e = entry as Record<string, unknown>;
    const id = str(e.id).trim();
    if (!id || seen.has(id)) continue; // stable, unique identity is required
    seen.add(id);
    out.push({
      id,
      title: str(e.title),
      month: str(e.month),
      day: str(e.day),
      detail: str(e.detail),
      campus: str(e.campus),
      image: str(e.image) || undefined,
      ctaLabel: str(e.ctaLabel) || undefined,
      ctaHref: str(e.ctaHref) || undefined,
    });
  }
  return out;
}
