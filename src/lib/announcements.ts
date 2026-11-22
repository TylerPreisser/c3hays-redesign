import { getCMSAnnouncements, getCMSGivingCampaigns, getCMSSite } from "@/lib/cms";

export interface Announcement { id: string; title: string; eyebrow?: string; body: string; linkLabel?: string; linkUrl?: string; priority: number }
export interface Campaign { id: string; title: string; blurb?: string; goal: number; raised: number | null; currency: string; giveUrl?: string }

/** A link target the site will render: a site path or https/http/mailto/tel. Anything else (javascript:, data:) is dropped. */
export function safeHref(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const h = v.trim();
  if (/^\/(?!\/)/.test(h) || /^(https?:|mailto:|tel:)/i.test(h)) return h;
  return undefined;
}

/**
 * The church's calendar day (yyyy-MM-dd, America/Chicago) a stored start or end falls on. An instant (a time with Z or a
 * UTC offset, as Studio stores them: the end of 12 Dec Central is 2026-12-13T05:59:00.000Z) is converted to Chicago; the
 * first ten characters of such a string are the UTC date and are NOT the church's day. A value with no zone (a plain date,
 * or a local date-time) is already the church's own wall-clock day.
 */
export function churchDay(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  if (!/^\d{4}-\d{2}-\d{2}/.test(t)) return null;
  if (/(?:Z|[+-]\d{2}:?\d{2})$/i.test(t) && /T/i.test(t)) {
    const d = new Date(t);
    return Number.isNaN(d.getTime()) ? null : churchToday(d);
  }
  return t.slice(0, 10);
}
const day = churchDay;

/** The date line Studio sends (`eyebrow`, e.g. "Wed 2 Dec") as plain text, or undefined. Never built from the start and end dates. */
const EYEBROW_MAX = 60;
export function plainEyebrow(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const t = v.replace(/<[^>]*>/g, "").replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, EYEBROW_MAX).trim();
  return t || undefined;
}

/**
 * The announcement bar is ONE line. Of the announcements that are on today (active, on the web surface, started and not
 * yet ended; the end day is the last day shown, in the church's zone) the site shows the one with the highest `priority` (staff raise it to say
 * "show this one now"); a tie goes to the one that started first, then to the newest published. None on = no bar.
 * `today` is a yyyy-MM-dd day in the church's time zone, passed in so the rule is testable.
 */
export const MAX_BANNERS = 1;
export function currentAnnouncements(raw: unknown, today: string): Announcement[] {
  if (!Array.isArray(raw)) return [];
  const out: (Announcement & { _at: string; _made: string })[] = [];
  for (const r of raw) {
    if (!r || typeof r !== "object") continue;
    const o = r as Record<string, unknown>;
    if (typeof o.id !== "string" || typeof o.title !== "string" || !o.title.trim()) continue;
    if (o.active === false) continue;
    if (o.surface !== undefined && o.surface !== "web" && o.surface !== "both") continue;
    const start = day(o.starts_at), end = day(o.ends_at);
    if (start && today < start) continue;
    if (end && today > end) continue;
    out.push({
      id: o.id,
      title: o.title.trim(),
      eyebrow: plainEyebrow(o.eyebrow),
      body: typeof o.body === "string" ? o.body.trim() : "",
      linkLabel: typeof o.link_label === "string" && o.link_label.trim() ? o.link_label.trim() : undefined,
      linkUrl: safeHref(o.link_url),
      priority: typeof o.priority === "number" ? o.priority : 0,
      _at: start ?? "",
      _made: typeof o.created_at === "string" ? o.created_at : "",
    });
  }
  return out
    .sort((a, b) => b.priority - a.priority || a._at.localeCompare(b._at) || b._made.localeCompare(a._made) || b.id.localeCompare(a.id))
    .map(({ _at: _a, _made: _m, ...a }) => a);
}

/** Today as yyyy-MM-dd in the church's time zone (Hays, Kansas). */
export function churchToday(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

export async function getAnnouncements(): Promise<Announcement[]> {
  return currentAnnouncements(await getCMSAnnouncements(), churchToday());
}

/** Campaigns still running (not ended, not draft), as the Give page shows them. A missing figure is "no figure", never $0. */
export function cleanCampaigns(raw: unknown, today: string): Campaign[] {
  if (!Array.isArray(raw)) return [];
  const out: Campaign[] = [];
  for (const r of raw) {
    if (!r || typeof r !== "object") continue;
    const o = r as Record<string, unknown>;
    if (typeof o.id !== "string" || typeof o.title !== "string" || !o.title.trim()) continue;
    if (o.status === "draft" || o.status === "ended") continue;
    const start = day(o.starts_at), end = day(o.ends_at);
    if (start && today < start) continue;
    if (end && today > end) continue;
    const goal = typeof o.goal_amount === "number" && o.goal_amount > 0 ? o.goal_amount : 0;
    // `amount_updated_at: null` is Studio saying "no figure yet": show none, never $0.
    const hasFigure = typeof o.raised_amount === "number" && o.amount_updated_at !== null;
    out.push({
      id: o.id,
      title: o.title.trim(),
      blurb: typeof o.blurb === "string" && o.blurb.trim() ? o.blurb.trim() : undefined,
      goal,
      raised: hasFigure ? (o.raised_amount as number) : null,
      currency: typeof o.currency === "string" ? o.currency : "USD",
      giveUrl: safeHref(o.give_url),
    });
  }
  return out;
}

export async function getCampaigns(): Promise<Campaign[]> {
  return cleanCampaigns(await getCMSGivingCampaigns(), churchToday());
}

/** The per-campus give pages Studio holds (`give_config.campuses`, else the legacy `giving` map). https only. */
export function giveLinksFrom(site: unknown): { hays?: string; colby?: string } {
  const out: { hays?: string; colby?: string } = {};
  if (!site || typeof site !== "object") return out;
  const s = site as { give_config?: { campuses?: Record<string, { give_url?: unknown }> }; giving?: Record<string, unknown> };
  for (const c of ["hays", "colby"] as const) {
    const v = s.give_config?.campuses?.[c]?.give_url ?? s.giving?.[c];
    const h = safeHref(v);
    if (h && /^https:/i.test(h)) out[c] = h;
  }
  return out;
}

export async function getGiveLinks() {
  return giveLinksFrom(await getCMSSite());
}
