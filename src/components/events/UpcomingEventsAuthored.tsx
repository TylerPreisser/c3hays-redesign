import EventCard from "@/components/events/EventCard";
import { ESPACE_FULL_CALENDAR_URL } from "@/lib/espace";
import type { EventCardItem } from "@/components/events/events-content";

/**
 * <UpcomingEventsAuthored> — the SERVER-RENDERED, editor-native "Upcoming Events"
 * grid, used when the page has an authored `cards` list (see events-content.ts). It
 * is a plain server component (no client island), so every card exists at the
 * editor's first DOM scan → its text is truly contentEditable, and the list is
 * add/removable via the editor's collection panel (queen's fence).
 *
 * Each card is fully editor-native:
 *   • title/month/day/detail/campus → data-cms="events.cards.<id>.<field>" (cardPath),
 *   • container bg                   → data-cms-bg="events-card-<id>-bg",
 *   • image                          → data-cms-img="events-card-<id>-img" (swappable),
 *   • CTA                            → EditableLink data-cms-link="events.cards.<id>.cta".
 * The wrapper carries data-cms-list="events.cards" — the editor's add/remove anchor.
 *
 * NOTE (no AddToCalendar here): authored cards are curated marketing tiles that carry
 * display-only month/day strings, not real start/end Date objects, so the per-event
 * "Add to calendar" control (which needs a datetime) is intentionally omitted — the
 * live-feed island keeps it. The editable CTA is the card's action.
 */

const GRID: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "clamp(1.25rem, 3vw, 2rem)",
  alignItems: "stretch",
};

/** Rotating default photos so a card NEVER shows only the gradient; each is still
 *  swappable per-card via data-cms-img. */
const CARD_IMAGES = ["/images/worship.webp", "/images/gather.webp", "/images/community.webp"];

export interface UpcomingEventsAuthoredProps {
  cards: EventCardItem[];
  /** Page text overrides — resolves persisted CTA label/href for each card. */
  text?: Record<string, string>;
  /** Page media overrides — a swapped image src per `events-card-<id>-img` key. */
  media?: Record<string, string>;
}

export default function UpcomingEventsAuthored({ cards, text, media }: UpcomingEventsAuthoredProps) {
  return (
    <div data-cms-list="events.cards" style={GRID}>
      {cards.map((c, i) => {
        const imgKey = `events-card-${c.id}-img`;
        return (
          <EventCard
            key={c.id}
            cardPath={`events.cards.${c.id}`}
            cmsText={text}
            bgCmsKey={`events-card-${c.id}-bg`}
            imgCmsKey={imgKey}
            image={media?.[imgKey] || c.image || CARD_IMAGES[i % CARD_IMAGES.length]}
            imageAlt={c.title}
            month={c.month}
            day={c.day}
            title={c.title}
            detail={c.detail}
            campus={c.campus}
            ctaCmsKey={`events.cards.${c.id}.cta`}
            ctaHref={c.ctaHref || ESPACE_FULL_CALENDAR_URL}
            ctaLabel={c.ctaLabel || "Event details"}
            ctaExternal
            style={{ height: "auto", flex: "1 1 auto" }}
          />
        );
      })}
    </div>
  );
}
