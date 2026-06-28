/**
 * C3 Studio (CMS) integration — the website consumes the platform content layer.
 *
 * This is the REAL back-and-forth wiring: pages fetch PUBLISHED content from the
 * C3 admin backend's content API. Staff edit + Publish in C3 Studio → this site
 * reflects it on the next request (run the site with `next dev` for live updates).
 *
 * Falls back gracefully (returns null) if the CMS isn't running, so the site's
 * existing static pages keep working.
 */

// CMS is OPT-IN. With no NEXT_PUBLIC_CMS_URL configured (the default for the
// local static export), every CMS call short-circuits to null and the site
// renders its hand-built pages — keeping `output: "export"` statically
// buildable. Set NEXT_PUBLIC_CMS_URL (and run a server runtime) to let C3 Studio
// drive the site once the admin backend is live.
const CMS_BASE = process.env.NEXT_PUBLIC_CMS_URL || "";

export interface CMSBlock {
  id: string;
  screen_id: string;
  component_type: string;
  sort_order: number;
  visible: boolean;
  content: Record<string, unknown>;
}
export interface CMSBundle {
  site: Record<string, unknown>;
  navigation: { web: NavItem[]; app: NavItem[] };
  screens: Array<{ id: string; slug: string; title: string; surface: string; visible: boolean; sort_order: number }>;
  sermons: unknown[];
  events: unknown[];
  locations: unknown[];
  announcements: unknown[];
}
export interface NavItem { id: string; label: string; href: string; children?: NavItem[] }

async function cmsFetch<T>(path: string): Promise<T | null> {
  if (!CMS_BASE) return null; // CMS not configured → static fallback (no fetch, export-safe)
  try {
    const res = await fetch(`${CMS_BASE}${path}`, { cache: "no-store", signal: AbortSignal.timeout(2500) });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null; // CMS offline → caller falls back to static content
  }
}

/** Whole published bundle (site, nav, collections). */
export const getCMSBundle = () => cmsFetch<CMSBundle>("/api/content");

/** A screen composed with its ordered, visible blocks. slug "/" must be encoded. */
export async function getCMSScreen(slug: string): Promise<{ screen: { title: string; surface: string }; blocks: CMSBlock[] } | null> {
  return cmsFetch(`/api/content/screen/${encodeURIComponent(slug)}`);
}

export const getCMSSermons = () => cmsFetch<unknown[]>("/api/content/sermons");
export const getCMSEvents = () => cmsFetch<unknown[]>("/api/content/events");
export const getCMSLocations = () => cmsFetch<unknown[]>("/api/content/locations");
