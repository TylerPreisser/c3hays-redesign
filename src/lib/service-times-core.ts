/**
 * Service times: the pure half. No imports, so the generator script, the server fetch and the tests all load it.
 *
 * Studio's location records are the only source of the church's times. A record carries
 * `services: [{ day, times: string[], slots?: [{ time, room, kids }] }]`; `slots` is what lets "with C3Kids" be
 * data instead of prose. When Studio is down the site falls back to `src/data/service-times.snapshot.ts`, a
 * generated copy of Studio's last published times. No other file may hold a clock time (tests/service-times.test.ts).
 */
export interface Slot {
  /** Canonical "H:MM AM" / "H:MM PM". */
  time: string;
  room: string | null;
  kids: boolean;
}
export interface DayServices {
  day: string;
  slots: Slot[];
}
export interface CampusTimes {
  slug: string;
  name: string;
  services: DayServices[];
}
export interface ServiceTimesData {
  campuses: CampusTimes[];
}

/** "8:00am", "8 AM", "10:45 a.m." -> "8:00 AM", or null when it is not a clock time. */
export function canonTime(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const m = /^\s*(\d{1,2})(?::(\d{2}))?\s*([ap])\.?\s?m\.?\s*$/i.exec(raw);
  if (!m) return null;
  const h = Number(m[1]);
  const min = m[2] ?? "00";
  if (h < 1 || h > 12 || Number(min) > 59) return null;
  return `${h}:${min} ${m[3].toUpperCase()}M`;
}

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
/** A weekday name in any case, canonical spelling, or null. */
export function canonDay(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const v = raw.trim().toLowerCase();
  return WEEKDAYS.find((d) => d.toLowerCase() === v) ?? null;
}
/** A room is a short plain label: letters, digits, spaces and . , ' - ( ) / #. Anything else is dropped (the time stays). */
export function plainRoom(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const v = raw.trim();
  return v && v.length <= 40 && /^[\p{L}\p{N} .,'’()\-/#]+$/u.test(v) ? v : null;
}

function normalizeSlots(svc: Record<string, unknown>): Slot[] | null {
  const out: Slot[] = [];
  if (Array.isArray(svc.slots) && svc.slots.length > 0) {
    for (const s of svc.slots as Array<Record<string, unknown>>) {
      const time = canonTime(s?.time);
      if (!time) return null;
      out.push({ time, room: plainRoom(s.room), kids: s.kids === true });
    }
    return out;
  }
  if (Array.isArray(svc.times) && svc.times.length > 0) {
    for (const t of svc.times) {
      const time = canonTime(t);
      if (!time) return null;
      out.push({ time, room: null, kids: false });
    }
    return out;
  }
  return null;
}

/** One Studio location record -> CampusTimes, or null when anything about its times is unusable. */
export function normalizeCampus(rec: unknown): CampusTimes | null {
  if (!rec || typeof rec !== "object") return null;
  const r = rec as Record<string, unknown>;
  const slug = typeof r.slug === "string" ? r.slug : typeof r.id === "string" ? r.id : "";
  if (!/^[a-z0-9-]+$/i.test(slug) || !Array.isArray(r.services) || r.services.length === 0) return null;
  const services: DayServices[] = [];
  for (const s of r.services as Array<Record<string, unknown>>) {
    const day = canonDay(s?.day);
    if (!day) return null;
    const slots = normalizeSlots(s);
    if (!slots) return null;
    services.push({ day, slots });
  }
  const name = plainRoom(r.name) ?? slug[0].toUpperCase() + slug.slice(1);
  return { slug, name, services };
}

/** Studio's records over the snapshot, campus by campus: a record that does not validate keeps the snapshot's. */
export function resolveTimes(live: unknown, snapshot: ServiceTimesData): ServiceTimesData {
  const byslug = new Map<string, CampusTimes>();
  if (Array.isArray(live)) {
    for (const rec of live) {
      const c = normalizeCampus(rec);
      if (c) byslug.set(c.slug, c);
    }
  }
  return { campuses: snapshot.campuses.map((c) => byslug.get(c.slug) ?? c) };
}

export const campus = (d: ServiceTimesData, slug: string): CampusTimes =>
  d.campuses.find((c) => c.slug === slug) ?? d.campuses[0];

export function slotLabel(s: Slot): string {
  const parts = [s.room, s.kids ? "with C3Kids" : null].filter(Boolean);
  return parts.length ? `${s.time} (${parts.join(", ")})` : s.time;
}
export const dayLine = (s: DayServices): string => `${s.day} ${s.slots.map(slotLabel).join(", ")}`;
export const campusLine = (c: CampusTimes): string => c.services.map(dayLine).join("; ");

/** "Saturday 5:00 PM; Sunday 8:00 AM (C3 Gym), 9:00 AM (with C3Kids), ...; Colby Sunday 10:00 AM" */
export function fullLine(d: ServiceTimesData): string {
  return d.campuses.map((c, i) => (i === 0 ? campusLine(c) : `${c.name} ${campusLine(c)}`)).join("; ");
}
/** Footer form: "Sat 5:00 PM · Sun 8:00 AM (C3 Gym), 9:00 AM (with C3Kids), ...". */
export const compactLine = (c: CampusTimes): string =>
  c.services.map((s) => `${s.day.slice(0, 3)} ${s.slots.map(slotLabel).join(", ")}`).join(" · ");

const andJoin = (xs: string[]): string => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);
/** "Saturdays at 5:00 PM and Sundays at 8:00 AM, 9:00 AM and 10:45 AM" */
export const spokenLine = (c: CampusTimes): string =>
  andJoin(c.services.map((s) => `${s.day}s at ${andJoin(s.slots.map((x) => x.time))}`));
/** Times of the services that run C3Kids: "9:00 AM and 10:45 AM" ("" when none). */
export const kidsTimes = (c: CampusTimes): string =>
  andJoin(c.services.flatMap((s) => s.slots.filter((x) => x.kids).map((x) => x.time)));
/** "Saturday · 5:00 PM", the first service of the campus. */
export function firstService(c: CampusTimes): string {
  const s = c.services[0];
  return `${s.day} · ${s.slots[0].time}`;
}
/** Back-compat shape for components that only list times per day. */
export const daysAndTimes = (c: CampusTimes): { day: string; times: string[] }[] =>
  c.services.map((s) => ({ day: s.day, times: s.slots.map((x) => x.time) }));

/**
 * A text override that spells out a clock time is stale by construction: times are Studio location data now, so a
 * published `text` bag from before that carries the old ones. Use the data-built fallback instead of it.
 */
export const hasClock = (v: unknown): boolean => typeof v === "string" && /\b\d{1,2}(?::\d{2})?\s?[ap]\.?m\b/i.test(v);
export function txTimes(text: Record<string, string> | undefined, key: string, fallback: string): string {
  const v = text?.[key];
  return typeof v === "string" && v.trim() !== "" && !hasClock(v) ? v : fallback;
}
/** A copy of the bag without the keys whose override spells out a clock time, so a <Tx> falls back to its data-built default. */
export function withoutStaleTimes(text: Record<string, string>, keys: string[]): Record<string, string> {
  const out = { ...text };
  for (const k of keys) if (hasClock(out[k])) delete out[k];
  return out;
}
