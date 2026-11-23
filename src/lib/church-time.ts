/**
 * The church's clock. Studio sends instants (UTC); every day, hour and minute the site prints or compares goes through here,
 * in the church's own zone (Hays and Colby are both Central), never in the zone of the server or the visitor's browser.
 * Pure, client-safe, no imports.
 */
export const CHURCH_TZ = "America/Chicago";

export interface WallParts { year: number; month: number; day: number; hour: number; minute: number }

const FMT = new Intl.DateTimeFormat("en-US", {
  timeZone: CHURCH_TZ, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
});

/** A time with a zone on it (Z or an offset): an instant. Anything else is already wall-clock time. */
const HAS_ZONE = /(?:Z|[+-]\d{2}:?\d{2})$/i;
const PLAIN = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/;

/** The church wall-clock parts of an ISO string: an instant is converted to Chicago; a zone-less value is read as it stands. Null when it is not a date. */
export function churchWallParts(iso: string | Date): WallParts | null {
  if (iso instanceof Date) return Number.isNaN(iso.getTime()) ? null : partsOfInstant(iso);
  const s = String(iso).trim();
  if (!PLAIN.test(s)) return null;
  if (/T/i.test(s) && HAS_ZONE.test(s)) {
    const d = new Date(s);
    return Number.isNaN(d.getTime()) ? null : partsOfInstant(d);
  }
  const m = PLAIN.exec(s)!;
  return { year: +m[1], month: +m[2], day: +m[3], hour: m[4] ? +m[4] : 0, minute: m[5] ? +m[5] : 0 };
}

function partsOfInstant(d: Date): WallParts {
  const p: Record<string, number> = {};
  for (const x of FMT.formatToParts(d)) if (x.type !== "literal") p[x.type] = Number(x.value);
  return { year: p.year, month: p.month, day: p.day, hour: p.hour === 24 ? 0 : p.hour, minute: p.minute };
}

const two = (n: number) => String(n).padStart(2, "0");
export const wallDay = (p: WallParts): string => `${p.year}-${two(p.month)}-${two(p.day)}`;
export const wallClock = (p: WallParts): string => `${two(p.hour)}:${two(p.minute)}`;

/**
 * The church day (yyyy-MM-dd) of a stored start or end. An all-day event is a calendar date, not an instant: it keeps its own
 * date. Any other instant is the Chicago day it falls on, so 6:30 PM Wednesday (00:30 UTC Thursday) is Wednesday.
 */
export function churchDay(iso: string, allDay = false): string | null {
  const s = String(iso).trim();
  if (allDay) return PLAIN.test(s) ? s.slice(0, 10) : null;
  const p = churchWallParts(s);
  return p ? wallDay(p) : null;
}

/** Today in the church's zone, yyyy-MM-dd. */
export function churchToday(now: Date = new Date()): string {
  return wallDay(partsOfInstant(now));
}

/** A Date that carries the church's wall clock in the process's own zone, the way the eSpace feed's dates do: read it back with local getters. */
export const wallDate = (p: WallParts): Date => new Date(p.year, p.month - 1, p.day, p.hour, p.minute, 0, 0);

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
/** "6:30 PM" */
export function clockLabel(p: WallParts): string {
  const h12 = p.hour % 12 === 0 ? 12 : p.hour % 12;
  return `${h12}:${two(p.minute)} ${p.hour < 12 ? "AM" : "PM"}`;
}
/** "Wednesday, December 2 · 6:30 PM", or "Wednesday, December 2" for an all-day event. The weekday is the church day's own. */
export function whenLabel(p: WallParts, allDay: boolean): string {
  const wd = WEEKDAYS[new Date(Date.UTC(p.year, p.month - 1, p.day)).getUTCDay()];
  const day = `${wd}, ${MONTHS[p.month - 1]} ${p.day}`;
  return allDay ? day : `${day} · ${clockLabel(p)}`;
}
