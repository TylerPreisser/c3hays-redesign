/**
 * eSpace live-calendar data layer (Phase 4, EV2/Wave 3).
 *
 * Reusable, framework-agnostic client for the church's public eSpace feed. Powers
 * both <LiveCalendar> (the on-theme month/agenda calendar) and <UpcomingEventsLive>
 * (the upcoming-events strip) — they share ONE in-flight network request via a
 * module-level promise cache so mounting both never double-fetches.
 *
 * Design rules baked in here:
 *  - Validate at the boundary: a malformed record is SKIPPED, never throws, never
 *    poisons the whole list. Every field is guarded.
 *  - Parse the ISO wall-clock literally (read Y/M/D/H/M off the string, build a
 *    LOCAL Date). `new Date("2026-05-23T17:00:00")` is parsed as local by modern
 *    engines, but the "…0000000" 7-digit fraction is non-standard and can trip
 *    parsers into UTC — so we never hand the raw string to `new Date()`.
 *  - CORS-open endpoint (`Access-Control-Allow-Origin: *`) → fetch straight from
 *    the browser; works in both static-export and CMS_LIVE server modes.
 */

/** GetFullCalendarEvents base — the JSON feed we map into <CalEvent>s. */
export const ESPACE_ENDPOINT =
  "https://app.espace.cool/Public/GetFullCalendarEvents";

/** Human "open the full calendar" link (the eSpace FullMonth widget URL). */
export const ESPACE_FULL_CALENDAR_URL =
  "https://app.espace.cool/clientApi/FullMonth/16599?calendarId=1774&categories=54054,50192,50191,50194,50193,50200,50195,50198,50196,50197,50199,54053&locationId=126482";

const MINISTRY_ID = "16599";
const CALENDAR_ID = "1774";

/** Fallback accent when a record carries no category color. */
const DEFAULT_COLOR = "#1cc3af"; // --color-teal

export interface CalEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  /** Pre-formatted, human time range, e.g. "5:00 PM – 6:30 PM" or "All day". */
  timeLabel: string;
  description: string;
  campus?: "Hays" | "Colby";
  location: string;
  /** Per-event accent color (hex from CatColorCode, else default teal). */
  color: string;
  isHoliday: boolean;
  /** External link, only present when the record supplies a usable url. */
  registerUrl?: string;
}

/** Shape of a raw eSpace record — every field optional/unknown until validated. */
interface RawEvent {
  Title?: unknown;
  start?: unknown;
  end?: unknown;
  allDay?: unknown;
  StartTime?: unknown;
  EventStartTime?: unknown;
  EventEndTime?: unknown;
  description?: unknown;
  locCodes?: unknown;
  location?: unknown;
  CatColorCode?: unknown;
  IsHoliday?: unknown;
  url?: unknown;
  IsRegistrationAvailable?: unknown;
}

function str(v: unknown): string {
  return typeof v === "string" ? v : v == null ? "" : String(v);
}

/**
 * Parse an eSpace ISO-local timestamp ("2026-05-23T17:00:00.0000000") as a LOCAL
 * wall-clock Date by reading the numeric fields directly — never via `new Date(str)`
 * (whose UTC handling of the 7-digit fraction would jump an event a day). Returns
 * null on anything unparseable so the caller can skip the record.
 */
function parseLocalDateTime(raw: unknown): Date | null {
  const s = str(raw);
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/.exec(s);
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  const hour = m[4] ? Number(m[4]) : 0;
  const min = m[5] ? Number(m[5]) : 0;
  if (!year || !month || !day) return null;
  const d = new Date(year, month - 1, day, hour, min, 0, 0);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Local `YYYY-MM-DD` key (never toISOString — that shifts to UTC). */
export function dayKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function campusFrom(locCodes: string): CalEvent["campus"] {
  if (/hays/i.test(locCodes)) return "Hays";
  if (/colby/i.test(locCodes)) return "Colby";
  return undefined;
}

function timeLabelFor(
  allDay: boolean,
  startTime: string,
  endTime: string,
  startTimeFallback: string
): string {
  if (allDay) return "All day";
  const s = startTime.trim();
  const e = endTime.trim();
  if (s && e) return `${s} – ${e}`;
  if (s) return s;
  const fb = startTimeFallback.trim();
  if (fb && fb.toUpperCase() !== "ALL DAY") return fb;
  return "All day";
}

/** Map one raw record → CalEvent, or null if it's unusable (skip it). */
function mapRecord(raw: RawEvent, index: number): CalEvent | null {
  const start = parseLocalDateTime(raw.start);
  if (!start) return null; // no valid start → cannot place it, skip

  const end = parseLocalDateTime(raw.end) ?? start;
  const title = str(raw.Title).trim() || "Untitled event";
  const allDay = raw.allDay === true;
  const isHoliday = raw.IsHoliday === true;
  const locCodes = str(raw.locCodes);
  const color = (() => {
    const c = str(raw.CatColorCode).trim();
    return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(c) ? c : DEFAULT_COLOR;
  })();

  const url = str(raw.url).trim();

  return {
    id: `${dayKey(start)}-${index}`,
    title,
    start,
    end,
    allDay,
    timeLabel: timeLabelFor(
      allDay,
      str(raw.EventStartTime),
      str(raw.EventEndTime),
      str(raw.StartTime)
    ),
    description: str(raw.description).trim(),
    campus: campusFrom(locCodes),
    location: str(raw.location).trim(),
    color,
    isHoliday,
    registerUrl: url ? url : undefined,
  };
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** `YYYY-MM-DD` for the feed's start/end query params (local date). */
function isoDate(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function buildUrl(start: Date, end: Date): string {
  const p = new URLSearchParams({
    ministryId: MINISTRY_ID,
    calendarId: CALENDAR_ID,
    categories: "",
    locations: "",
    showNationalHolidays: "True",
    start: isoDate(start),
    end: isoDate(end),
  });
  return `${ESPACE_ENDPOINT}?${p.toString()}`;
}

// Module-level in-flight/result cache keyed by the request URL, so two components
// that both call fetchEspaceEvents() in the same window share ONE network request.
const cache = new Map<string, Promise<CalEvent[]>>();

/**
 * Fetch the eSpace feed and map it into sorted <CalEvent>s.
 *
 * IMPORTANT — window width: eSpace's GetFullCalendarEvents COLLAPSES recurring-event
 * occurrences when the requested window is too wide (a ~15-month window returns each
 * recurring series only ONCE at its past series-start date, so live weekly services
 * vanish). Verified against the live API: windows ≤ ~3 months return every
 * occurrence. So callers MUST pass a narrow window (LiveCalendar → the visible 6-week
 * grid; UpcomingEventsLive → ~3 months forward), and the DEFAULT here is deliberately
 * narrow (today − 7d → today + 92d) so an argless call can't reintroduce the collapse.
 *
 * A bad HTTP status or non-array body throws (surfaced by the UI's error state);
 * a single malformed record is silently skipped (not a page-level failure).
 */
export async function fetchEspaceEvents(opts?: {
  start?: Date;
  end?: Date;
}): Promise<CalEvent[]> {
  const now = new Date();
  const defStart = new Date(now);
  defStart.setDate(defStart.getDate() - 7);
  const defEnd = new Date(now);
  defEnd.setDate(defEnd.getDate() + 92);
  const start = opts?.start ?? defStart;
  const end = opts?.end ?? defEnd;
  const url = buildUrl(start, end);

  const cached = cache.get(url);
  if (cached) return cached;

  const promise = (async () => {
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) {
      throw new Error(`eSpace feed returned HTTP ${res.status}`);
    }
    const body: unknown = await res.json();
    if (!Array.isArray(body)) {
      throw new Error("eSpace feed did not return an array");
    }
    const events: CalEvent[] = [];
    body.forEach((raw, i) => {
      const mapped = mapRecord((raw ?? {}) as RawEvent, i);
      if (mapped) events.push(mapped);
    });
    events.sort((a, b) => a.start.getTime() - b.start.getTime());
    return events;
  })();

  // Cache the promise so concurrent callers share it; evict on failure so a
  // transient network error can be retried on the next mount.
  cache.set(url, promise);
  promise.catch(() => cache.delete(url));
  return promise;
}

/** Group events by local `YYYY-MM-DD`. Insertion order preserves start-sort. */
export function groupByDay(events: CalEvent[]): Map<string, CalEvent[]> {
  const map = new Map<string, CalEvent[]>();
  for (const e of events) {
    const key = dayKey(e.start);
    const bucket = map.get(key);
    if (bucket) bucket.push(e);
    else map.set(key, [e]);
  }
  return map;
}

/**
 * Next `n` upcoming events (start >= now), real events first then holidays.
 * Within each group, chronological order is preserved.
 */
export function upcomingEvents(events: CalEvent[], n: number): CalEvent[] {
  const now = Date.now();
  const future = events.filter((e) => e.start.getTime() >= now);
  const real = future.filter((e) => !e.isHoliday);
  const holidays = future.filter((e) => e.isHoliday);
  return [...real, ...holidays].slice(0, Math.max(0, n));
}

/**
 * 6-row Sun–Sat grid of Date cells covering `month` (0-based, JS convention),
 * including the leading/trailing days from the adjacent months so the grid is
 * always a full 6×7 rectangle.
 */
export function monthMatrix(year: number, month: number): Date[][] {
  const first = new Date(year, month, 1);
  // Back up to the Sunday on/before the 1st.
  const gridStart = new Date(year, month, 1 - first.getDay());
  const weeks: Date[][] = [];
  const cursor = new Date(gridStart);
  for (let w = 0; w < 6; w++) {
    const row: Date[] = [];
    for (let d = 0; d < 7; d++) {
      row.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(row);
  }
  return weeks;
}
