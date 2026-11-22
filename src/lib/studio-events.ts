import { getCMSEvents, getCMSSite } from "@/lib/cms";
import { churchDay, churchToday, churchWallParts, wallClock } from "@/lib/church-time";

/** One event as Studio's public events route sends it, read at the boundary. `start` and `end` are the stored strings (UTC instants, or a plain date when all-day). */
export interface StudioEvent { id: string; title: string; start: string; end?: string; location?: string; description?: string; allDay: boolean }

/** Every scheduled event Studio sent, soonest first: no limit and no past filter. Anything malformed is skipped. */
export function allStudioEvents(raw: unknown): StudioEvent[] {
  if (!Array.isArray(raw)) return [];
  const out: StudioEvent[] = [];
  for (const r of raw) {
    if (!r || typeof r !== "object") continue;
    const o = r as Record<string, unknown>;
    if (typeof o.id !== "string" || typeof o.title !== "string" || !o.title.trim() || typeof o.start_date !== "string") continue;
    if (o.status !== undefined && o.status !== "scheduled") continue;
    const allDay = o.all_day === true;
    if (churchDay(o.start_date, allDay) === null) continue;
    const end = typeof o.end_date === "string" && o.end_date && churchDay(o.end_date, allDay) !== null ? o.end_date : undefined;
    out.push({
      id: o.id,
      title: o.title.trim(),
      start: o.start_date,
      end,
      location: typeof o.location === "string" && o.location ? o.location : undefined,
      description: typeof o.description === "string" && o.description ? o.description : undefined,
      allDay,
    });
  }
  // church wall-clock order (an all-day event sorts at the start of its day)
  const key = (e: StudioEvent) => {
    const p = churchWallParts(e.allDay ? e.start.slice(0, 10) : e.start);
    return `${churchDay(e.start, e.allDay)}T${e.allDay || !p ? "00:00" : wallClock(p)}`;
  };
  return out.sort((a, b) => key(a).localeCompare(key(b)));
}

/**
 * The events the Upcoming strip may show: kept while today (a church day, yyyy-MM-dd) is not past the church day the event
 * ends on (its end, else its start), so an event stays listed through the evening of its own day in Hays; soonest first.
 */
export function upcomingStudioEvents(raw: unknown, today: string, limit = 12): StudioEvent[] {
  return allStudioEvents(raw)
    .filter((e) => today <= (churchDay(e.end ?? e.start, e.allDay) as string))
    .slice(0, limit);
}

/** The events setting Studio serves on `site`. Anything but exactly "studio" is `espace`, today's behaviour. */
export type EventsMode = "espace" | "studio";
export async function getEventsMode(): Promise<EventsMode> {
  const site = await getCMSSite();
  return site && site.events_on_website === "studio" ? "studio" : "espace";
}

/** Studio's published events for /events in `studio` mode: the full list for the calendar and today's-forward list for the Upcoming strip. Both empty when Studio answers nothing. */
export async function getStudioEventLists(): Promise<{ all: StudioEvent[]; upcoming: StudioEvent[] }> {
  const raw = await getCMSEvents();
  if (raw === null) return { all: [], upcoming: [] };
  return { all: allStudioEvents(raw), upcoming: upcomingStudioEvents(raw, churchToday()) };
}
