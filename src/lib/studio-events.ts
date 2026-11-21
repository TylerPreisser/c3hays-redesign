import { getCMSEvents } from "@/lib/cms";

export interface StudioEvent { id: string; title: string; start: string; location?: string; description?: string; allDay: boolean }

/** Upcoming, scheduled events from Studio's public events route, soonest first. Anything malformed is skipped. */
export function upcomingStudioEvents(raw: unknown, nowIso: string, limit = 12): StudioEvent[] {
  if (!Array.isArray(raw)) return [];
  const out: StudioEvent[] = [];
  for (const r of raw) {
    if (!r || typeof r !== "object") continue;
    const o = r as Record<string, unknown>;
    if (typeof o.id !== "string" || typeof o.title !== "string" || typeof o.start_date !== "string") continue;
    if (o.status !== undefined && o.status !== "scheduled") continue;
    const end = typeof o.end_date === "string" && o.end_date ? o.end_date : o.start_date;
    if (end < nowIso.slice(0, o.all_day === true ? 10 : 19)) continue;
    out.push({
      id: o.id,
      title: o.title.trim(),
      start: o.start_date,
      location: typeof o.location === "string" && o.location ? o.location : undefined,
      description: typeof o.description === "string" && o.description ? o.description : undefined,
      allDay: o.all_day === true,
    });
  }
  return out.sort((a, b) => a.start.localeCompare(b.start)).slice(0, limit);
}

export async function getStudioEvents(): Promise<StudioEvent[] | null> {
  const raw = await getCMSEvents();
  return raw === null ? null : upcomingStudioEvents(raw, new Date().toISOString());
}
