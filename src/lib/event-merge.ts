import { DEFAULT_COLOR, dayKey, type CalEvent } from "@/lib/espace";
import { churchWallParts, clockLabel, wallDate, whenLabel, type WallParts } from "@/lib/church-time";
import type { StudioEvent } from "@/lib/studio-events";
import { isWeekendServiceTitle } from "@/lib/service-times-core";

/**
 * Studio events and the eSpace calendar on one page. Pure: no fetch, no zone of its own (every time goes through church-time).
 * A Studio event becomes a CalEvent carrying the church's wall clock, exactly as the eSpace feed's events do, so a visitor
 * anywhere sees Hays time on both sources. Because that Date depends on the zone it is built in, this runs in the browser.
 */

/** Lower case, accents removed, every run of non-letters/digits one space, trimmed. */
export function normaliseTitle(title: string): string {
  return title.normalize("NFD").replace(/\p{M}+/gu, "").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}

/** The twin key: church day | start minute (or all-day) | normalised title. Two events with one key are one occasion. */
export function twinKey(e: { title: string; wall: string; allDay: boolean }): string {
  const day = e.wall.slice(0, 10);
  const time = e.allDay ? "all-day" : e.wall.slice(11, 16);
  return `${day}|${time}|${normaliseTitle(e.title)}`;
}
const keyOf = (e: CalEvent): string => twinKey({ title: e.title, wall: `${dayKey(e.start)}T${String(e.start.getHours()).padStart(2, "0")}:${String(e.start.getMinutes()).padStart(2, "0")}`, allDay: e.allDay });

function campusIn(text: string): CalEvent["campus"] {
  const h = /hays/i.test(text), c = /colby/i.test(text);
  return h === c ? undefined : h ? "Hays" : "Colby";
}

/** One Studio event as a calendar event. No registration link is carried: a member's link is personal and never on a public page. */
export function studioToCalEvent(e: StudioEvent): CalEvent {
  const sp = churchWallParts(e.allDay ? e.start.slice(0, 10) : e.start) as WallParts;
  const ep = e.end ? churchWallParts(e.allDay ? e.end.slice(0, 10) : e.end) : null;
  const start = wallDate(sp);
  const end = ep ? wallDate(ep) : start;
  const timed = !e.allDay;
  const timeLabel = !timed ? "All day" : ep && end.getTime() > start.getTime() ? `${clockLabel(sp)} – ${clockLabel(ep)}` : clockLabel(sp);
  return {
    id: `studio-${e.id}`,
    title: e.title,
    start,
    end,
    allDay: e.allDay,
    timeLabel,
    description: e.description ?? "",
    campus: campusIn(e.location ?? ""),
    location: e.location ?? "",
    color: DEFAULT_COLOR,
    isHoliday: false,
    whenLabel: whenLabel(sp, e.allDay),
  };
}

const isStudio = (e: CalEvent) => e.id.startsWith("studio-");
const campusesDiffer = (a: CalEvent, b: CalEvent) => !!a.campus && !!b.campus && a.campus !== b.campus;

/**
 * Studio's events plus eSpace's, in start order. An eSpace event with the same twin key as a Studio one is that same
 * occasion and is dropped (the Studio one has the record people reply to), unless both campuses are known and differ:
 * then they are two events and both stay. On a tie in start, Studio first.
 */
export function mergeEvents(studio: CalEvent[], espace: CalEvent[]): CalEvent[] {
  const byKey = new Map<string, CalEvent[]>();
  for (const s of studio) { const k = keyOf(s); byKey.set(k, [...(byKey.get(k) ?? []), s]); }
  const rest = espace.filter((e) => !(byKey.get(keyOf(e)) ?? []).some((s) => !campusesDiffer(s, e)));
  const all = [...studio, ...rest];
  // stable: eSpace keeps its own order on ties, Studio events tie on title
  return all
    .map((e, i) => ({ e, i }))
    .sort((a, b) => a.e.start.getTime() - b.e.start.getTime()
      || (isStudio(a.e) === isStudio(b.e) ? (isStudio(a.e) ? a.e.title.localeCompare(b.e.title) : 0) : isStudio(a.e) ? -1 : 1)
      || a.i - b.i)
    .map((x) => x.e);
}

/**
 * The cards for the Upcoming strip: Studio's events (already kept through their church day) merged with eSpace's events that
 * have not started, real events before holidays, the first `n`.
 */
export function upcomingMerged(studio: CalEvent[], espace: CalEvent[], n: number, nowMs: number = Date.now()): CalEvent[] {
  const merged = mergeEvents(studio, espace.filter((e) => e.start.getTime() >= nowMs));
  return [...merged.filter((e) => !e.isHoliday), ...merged.filter((e) => e.isHoliday)].slice(0, Math.max(0, n));
}

/**
 * The church's own calendar (eSpace) carries a free-text note on its "Weekend Services" rows that can be stale ("9:30 and
 * 11:00"). The site never prints that note: those rows carry the line built from Studio's service times instead, the same
 * record every other page reads. The eSpace text itself is the church's to fix in eSpace; nothing here edits it.
 */
export function withStudioWeekendLine(events: CalEvent[], line: string, dayLine?: (weekday: number) => string): CalEvent[] {
  if (!line) return events;
  return events.map((e) => {
    if (!isWeekendServiceTitle(e.title)) return e;
    // A row shows that day's own times from the record, never eSpace's block ("8:00 AM - 12:30 PM" reads as one long service).
    const p = churchWallParts(e.start);
    const own = p && dayLine ? dayLine(new Date(Date.UTC(p.year, p.month - 1, p.day)).getUTCDay()) : "";
    return own ? { ...e, description: own, timeLabel: own, isWeekend: true, ...(/Colby/.test(own) && /Hays/.test(own) ? { campusTag: "Hays + Colby" } : {}) } : { ...e, description: line, isWeekend: true };
  });
}

/** eSpace rows that are set-up jobs for staff, not events for visitors. Matched by title, case-insensitive. */
export const INTERNAL_EVENT_TITLES = ["gym set up", "gym setup"];
export function withoutInternalEvents(events: CalEvent[], extra: string[] = []): CalEvent[] {
  const hide = new Set([...INTERNAL_EVENT_TITLES, ...extra.map((t) => t.trim().toLowerCase())]);
  return events.filter((e) => !hide.has(normaliseTitle(e.title)) && !hide.has(e.title.trim().toLowerCase()));
}
