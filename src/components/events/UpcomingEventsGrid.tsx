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
 *     present ONLY once a photo has been swapped in via the page's `media` map. There
 *     is no default asset: ITEM A (e2bdeed) made live tiles image-less because the
 *     eSpace feed carries no photos, and a stock image under a real event name would
 *     be an invented fact about the church,
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
        // The live eSpace feed carries NO images, so these tiles are IMAGE-LESS by
        // default (no rotating default photo, no gradient block) — the chip-topped body
        // is the whole card. A card is opted INTO an image by a `media` override, and
        // only then does the media area (and with it the data-cms-img swap handle)
        // render. NOTE the consequence: with no media area there is no on-canvas
        // target, so the FIRST photo has to arrive from Studio's media panel by key
        // (`events-upcoming-${i}-img`) — after that the handle is on the card and the
        // usual click-to-swap works. Authored cards (UpcomingEventsAuthored) always
        // carry the handle; only these positional live tiles behave this way.
        const overrideImg = media?.[imgKey];
        // The per-event "Add to calendar" control renders INSIDE the card, in its footer
        // slot (below the CTA, within the card boundary). The card is an <article> here
        // (ctaCmsKey set → no whole-card <a>), so nesting the interactive menu is valid
        // HTML — the CTA link and the AddToCalendar button/menu are separate siblings.
        return (
          <EventCard
            key={ev.id}
            cmsKey={cmsKey}
            cmsText={text}
            bgCmsKey={`${cmsKey}-bg`}
            imgCmsKey={imgKey}
            image={overrideImg}
            hideMedia={!overrideImg}
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
            footer={<AddToCalendar event={toCalendarEvent(ev)} />}
          />
        );
      })}
    </div>
  );
}
