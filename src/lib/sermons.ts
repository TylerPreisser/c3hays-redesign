import { getCMSSermons } from "@/lib/cms";
import { pastMessages, type PastMessage } from "@/data/messages";

/** A sermon as Studio's public `/api/content/sermons` serves it. Everything but id and title may be missing. */
export interface StudioSermon {
  id: string;
  title: string;
  speaker?: string | null;
  date?: string | null;
  description?: string | null;
  youtube_video_id?: string | null;
  thumbnail_url?: string | null;
  scripture_references?: string[] | null;
  duration?: number | null;
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** Read defensively: a record Studio served that is not shaped like a sermon is dropped, never rendered half-built. */
export function cleanSermons(raw: unknown): StudioSermon[] {
  if (!Array.isArray(raw)) return [];
  const out: StudioSermon[] = [];
  for (const r of raw) {
    if (!r || typeof r !== "object") continue;
    const o = r as Record<string, unknown>;
    if (typeof o.id !== "string" || !o.id || typeof o.title !== "string" || !o.title.trim()) continue;
    const vid = typeof o.youtube_video_id === "string" && /^[A-Za-z0-9_-]{6,20}$/.test(o.youtube_video_id) ? o.youtube_video_id : null;
    out.push({
      id: o.id,
      title: o.title.trim(),
      speaker: typeof o.speaker === "string" ? o.speaker : null,
      date: typeof o.date === "string" && /^\d{4}-\d{2}-\d{2}/.test(o.date) ? o.date.slice(0, 10) : null,
      description: typeof o.description === "string" ? o.description : null,
      youtube_video_id: vid,
      thumbnail_url: typeof o.thumbnail_url === "string" ? o.thumbnail_url : null,
      scripture_references: Array.isArray(o.scripture_references) ? o.scripture_references.filter((x): x is string => typeof x === "string") : [],
      duration: typeof o.duration === "number" ? o.duration : null,
    });
  }
  return out.sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
}

export function dateLabel(date?: string | null): string {
  const m = date ? /^(\d{4})-(\d{2})-(\d{2})/.exec(date) : null;
  return m ? `${MONTHS[Number(m[2]) - 1]} ${Number(m[3])}, ${m[1]}` : "";
}

/** Studio's sermons, newest first, or null when Studio did not answer (the caller keeps its fallback). */
export async function getSermons(): Promise<StudioSermon[] | null> {
  const raw = await getCMSSermons();
  return raw === null ? null : cleanSermons(raw);
}

/** The cards on /messages: Studio's sermons when Studio answered, else the static archive. */
export async function getMessageCards(): Promise<PastMessage[]> {
  const sermons = await getSermons();
  if (sermons === null) return pastMessages;
  return sermons.map((s) => ({
    id: s.id,
    title: s.title,
    dateLabel: dateLabel(s.date),
    year: s.date ? s.date.slice(0, 4) : "",
    tags: s.scripture_references ?? [],
    href: `/messages/${encodeURIComponent(s.id)}/`,
    speaker: s.speaker || undefined,
    internal: true,
  }));
}
