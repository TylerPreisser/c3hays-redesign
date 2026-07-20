/**
 * calendar.ts — per-event "Add to calendar" helpers (Phase 4, Events redesign).
 *
 * From a plain {@link CalendarEvent} this produces the three things a per-event
 * "Add to calendar" control needs:
 *   1. an ICS string (+ {@link downloadICS} to hand it to Apple Calendar / any ICS
 *      client via a Blob download);
 *   2. a Google Calendar "create event" URL ({@link googleCalendarUrl});
 *   3. an Outlook / Microsoft 365 "compose event" URL ({@link outlookCalendarUrl}).
 *
 * Timezone posture — the church runs on America/Chicago. A `Date` is an absolute
 * instant, so:
 *   - ICS emits wall-clock times with `TZID=America/Chicago` and ships a matching
 *     VTIMEZONE block (US Central DST rules) so Apple/Google/Outlook all place the
 *     event at the correct Central wall time regardless of the importer's own zone.
 *   - Google/Outlook URLs use absolute UTC (`…Z`) timestamps (unambiguous) and
 *     additionally pass `ctz=America/Chicago` to Google for display.
 * Every value is URL-encoded (URLSearchParams) or ICS-escaped at the boundary.
 *
 * Pure + framework-agnostic; only {@link downloadICS} touches the DOM (guarded).
 */

export interface CalendarEvent {
  title: string;
  /** Absolute start instant. */
  start: Date;
  /** Absolute end instant. Defaults to start + 1h when omitted. */
  end?: Date;
  location?: string;
  description?: string;
}

/** IANA zone the church operates in. */
export const CHURCH_TZ = "America/Chicago";

/** Default event length (ms) when no `end` is supplied — one hour. */
const DEFAULT_DURATION_MS = 60 * 60 * 1000;

/** Resolve the effective end instant (explicit `end`, else start + 1h). */
function resolveEnd(event: CalendarEvent): Date {
  if (event.end && !Number.isNaN(event.end.getTime())) return event.end;
  return new Date(event.start.getTime() + DEFAULT_DURATION_MS);
}

/**
 * Wall-clock `YYYYMMDDTHHMMSS` for `date` in America/Chicago — read off an
 * `Intl.DateTimeFormat` in that zone so the value is the Central local time of the
 * absolute instant, ready to pair with `TZID=America/Chicago`.
 */
function chicagoLocalStamp(date: Date): string {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: CHURCH_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const parts = fmt.formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "00";
  // Intl can emit "24" for midnight in some engines — normalize to "00".
  const hour = get("hour") === "24" ? "00" : get("hour");
  return `${get("year")}${get("month")}${get("day")}T${hour}${get("minute")}${get("second")}`;
}

/** Absolute UTC `YYYYMMDDTHHMMSSZ` stamp for `date`. */
function utcStamp(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

/** Escape a value for an ICS TEXT field (RFC 5545 §3.3.11). */
function escapeICS(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r\n|\r|\n/g, "\\n");
}

/** Fold a content line at 74 octets with CRLF + space (RFC 5545 §3.1). */
function foldLine(line: string): string {
  if (line.length <= 74) return line;
  const chunks: string[] = [];
  let rest = line;
  chunks.push(rest.slice(0, 74));
  rest = rest.slice(74);
  while (rest.length > 73) {
    chunks.push(` ${rest.slice(0, 73)}`);
    rest = rest.slice(73);
  }
  if (rest.length) chunks.push(` ${rest}`);
  return chunks.join("\r\n");
}

/** A stable-ish UID for an event (title + start + host). */
function eventUid(event: CalendarEvent): string {
  const slug = event.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "event";
  return `${utcStamp(event.start)}-${slug}@celebratejesus.org`;
}

/**
 * Minimal, correct VTIMEZONE for America/Chicago (current US Central DST rule:
 * spring-forward 2nd Sun of March, fall-back 1st Sun of November).
 */
const CHICAGO_VTIMEZONE = [
  "BEGIN:VTIMEZONE",
  "TZID:America/Chicago",
  "BEGIN:DAYLIGHT",
  "TZOFFSETFROM:-0600",
  "TZOFFSETTO:-0500",
  "TZNAME:CDT",
  "DTSTART:19700308T020000",
  "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU",
  "END:DAYLIGHT",
  "BEGIN:STANDARD",
  "TZOFFSETFROM:-0500",
  "TZOFFSETTO:-0600",
  "TZNAME:CST",
  "DTSTART:19701101T020000",
  "RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU",
  "END:STANDARD",
  "END:VTIMEZONE",
];

/**
 * Build a complete, importable ICS (VCALENDAR) string for a single event, with a
 * Central-time VTIMEZONE so importers place it at the correct wall-clock time.
 */
export function buildICS(event: CalendarEvent): string {
  const end = resolveEnd(event);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Celebration Community Church//C3 Events//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...CHICAGO_VTIMEZONE,
    "BEGIN:VEVENT",
    `UID:${eventUid(event)}`,
    `DTSTAMP:${utcStamp(new Date())}`,
    `DTSTART;TZID=${CHURCH_TZ}:${chicagoLocalStamp(event.start)}`,
    `DTEND;TZID=${CHURCH_TZ}:${chicagoLocalStamp(end)}`,
    `SUMMARY:${escapeICS(event.title)}`,
  ];
  if (event.description) lines.push(`DESCRIPTION:${escapeICS(event.description)}`);
  if (event.location) lines.push(`LOCATION:${escapeICS(event.location)}`);
  lines.push("END:VEVENT", "END:VCALENDAR");
  return lines.map(foldLine).join("\r\n");
}

/** A safe download filename derived from the event title, ending in `.ics`. */
export function icsFilename(event: CalendarEvent): string {
  const slug =
    event.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 50) || "event";
  return `${slug}.ics`;
}

/**
 * Trigger a browser download of the event as an `.ics` file (Apple Calendar and
 * every ICS-aware client). No-op outside the browser. Returns true if it ran.
 */
export function downloadICS(event: CalendarEvent, filename?: string): boolean {
  if (typeof document === "undefined") return false;
  const blob = new Blob([buildICS(event)], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || icsFilename(event);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Revoke on the next tick so the click has a chance to consume the URL.
  setTimeout(() => URL.revokeObjectURL(url), 0);
  return true;
}

/** A `data:` URL form of the ICS (alternative to the Blob download). */
export function icsDataUrl(event: CalendarEvent): string {
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(buildICS(event))}`;
}

/**
 * Google Calendar "create event" URL. Uses absolute UTC timestamps (unambiguous)
 * plus `ctz=America/Chicago` for display.
 */
export function googleCalendarUrl(event: CalendarEvent): string {
  const end = resolveEnd(event);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    ctz: CHURCH_TZ,
  });
  if (event.description) params.set("details", event.description);
  if (event.location) params.set("location", event.location);
  // `dates` uses raw `start/end` (all URL-safe chars) so the separator stays a
  // literal slash Google expects, not %2F.
  const dates = `${utcStamp(event.start)}/${utcStamp(end)}`;
  return `https://calendar.google.com/calendar/render?${params.toString()}&dates=${dates}`;
}

/**
 * Outlook / Microsoft 365 "compose event" deep link. Uses ISO-8601 UTC instants
 * (accepted by Outlook), URL-encoded via URLSearchParams.
 */
export function outlookCalendarUrl(event: CalendarEvent): string {
  const end = resolveEnd(event);
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: event.title,
    startdt: event.start.toISOString(),
    enddt: end.toISOString(),
  });
  if (event.description) params.set("body", event.description);
  if (event.location) params.set("location", event.location);
  return `https://outlook.office.com/calendar/0/deeplink/compose?${params.toString()}`;
}

/** All three destinations at once (URLs); ICS is fetched via download/dataUrl. */
export function calendarLinks(event: CalendarEvent): {
  google: string;
  outlook: string;
  icsDataUrl: string;
} {
  return {
    google: googleCalendarUrl(event),
    outlook: outlookCalendarUrl(event),
    icsDataUrl: icsDataUrl(event),
  };
}
