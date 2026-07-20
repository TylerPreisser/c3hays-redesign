import EventCard from "@/components/events/EventCard";
import AddToCalendar from "@/components/events/AddToCalendar";
import { ESPACE_FULL_CALENDAR_URL, type CalEvent } from "@/lib/espace";
import type { CalendarEvent } from "@/lib/calendar";

/**
 * <UpcomingEventsGrid> — the PURE presentational grid for the /events "Upcoming
 * Events" cards. Split out of <UpcomingEventsLive> so the same JSX is (a) rendered
 * by the client island once the live eSpace feed resolves and (b) unit-testable
 * with sample events (the island itself only ever paints skeletons in static markup).
 *
 * EDITOR-NATIVE BY CONSTRUCTION (contract §1, fixes "Events cards non-editable"):
 * each card is given a DETERMINISTIC, index-based CMS key (`events-upcoming-${i}`) so
 * every part is independently editable in C3 Studio —
 *   • title / date / detail / campus → data-cms via EventCard's `cmsKey` path,
 *   • the card container background   → data-cms-bg (`events-upcoming-${i}-bg`),
 *   • the card image                  → data-cms-img (`events-upcoming-${i}-img`),
 *     swappable via the page's `media` map and defaulting to a real asset,
 *   • the CTA                         → an <EditableLink> (data-cms-link + label).
 * Live event fields are the FALLBACKS; a saved override wins (tx() pattern). Because
 * the rows are positional/live, keys are index-based by design — a caveat the editor
 * accepts in exchange for making these cards editable at all.
 */

const GRID: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "clamp(1.25rem, 3vw, 2rem)",
  alignItems: "stretch",
};

/** Deterministic default photos so a card NEVER shows only the gradient (the
 *  Phase-4 "broken image" note); the editor can still swap each via data-cms-img. */
const CARD_IMAGES = ["/images/worship.webp", "/images/gather.webp", "/images/community.webp"];

function detailLine(ev: CalEvent): string {
  const desc = ev.description ? ev.description.trim() : "";
  const clipped = desc.length > 60 ? `${desc.slice(0, 60).trimEnd()}…` : desc;
  return clipped ? `${ev.timeLabel} · ${clipped}` : ev.timeLabel;
}

function campusLabel(ev: CalEvent): string {
  if (ev.campus) return `${ev.campus} campus`;
  return ev.isHoliday ? "Holiday" : "Both campuses";
}

/** Map a live eSpace event → the plain shape the calendar helpers consume. */
function toCalendarEvent(ev: CalEvent): CalendarEvent {
  return {
    title: ev.title,
    start: ev.start,
    end: ev.end,
    location: ev.location || undefined,
    description: ev.description || undefined,
  };
}

export interface UpcomingEventsGridProps {
  events: CalEvent[];
  /** Page text overrides — persisted card edits (title/date/detail/campus/CTA). */
  text?: Record<string, string>;
  /** Page media overrides — a swapped image src per `events-upcoming-${i}-img` key. */
  media?: Record<string, string>;
}

export default function UpcomingEventsGrid({ events, text, media }: UpcomingEventsGridProps) {
  return (
    <div style={GRID}>
      {events.map((ev, i) => {
        const cmsKey = `events-upcoming-${i}`;
        const imgKey = `${cmsKey}-img`;
        // Card + per-event add-to-calendar stacked in one grid cell. The CTA link and
        // the interactive AddToCalendar menu are SIBLINGS (never nested — a <button>
        // inside an <a> is invalid HTML).
        return (
          <div
            key={ev.id}
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            <EventCard
              cmsKey={cmsKey}
              cmsText={text}
              bgCmsKey={`${cmsKey}-bg`}
              imgCmsKey={imgKey}
              image={media?.[imgKey] || CARD_IMAGES[i % CARD_IMAGES.length]}
              imageAlt={ev.title}
              month={ev.start.toLocaleDateString("en-US", { month: "short" }).toUpperCase()}
              day={String(ev.start.getDate()).padStart(2, "0")}
              title={ev.title}
              detail={detailLine(ev)}
              campus={campusLabel(ev)}
              ctaCmsKey={`${cmsKey}-cta`}
              ctaHref={ev.registerUrl || ESPACE_FULL_CALENDAR_URL}
              ctaLabel="Event details"
              ctaExternal
              style={{ height: "auto", flex: "1 1 auto" }}
            />
            <div style={{ marginTop: "0.75rem" }}>
              <AddToCalendar event={toCalendarEvent(ev)} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
