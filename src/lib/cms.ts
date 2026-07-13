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

/** Structured, section-based Home content from C3 Studio (or null if CMS off). */
export const getCMSHome = () => cmsFetch<StudioHome>("/api/content/home");

/* ── U6: DRAFT isolation (preview mode) ───────────────────────────────────────
 * The editor iframe loads the site with `?cmsEdit=1&preview=<token>`. We FORWARD
 * that token to c3-backend's dedicated draft endpoint; c3-backend is the SOLE gate
 * — it mints AND validates the token (owns the signing secret; we never see it).
 *
 * HARD SECURITY PROPERTY (defense-in-depth on our side):
 *   • No `preview` token  → we NEVER touch the draft endpoint (published only).
 *   • ANY non-200 (missing/forged/expired → 401, or network error) → we fall back
 *     to PUBLISHED content. We never surface an error and never render draft to a
 *     tokenless/public request. c3-backend's validation is the real gate.
 * `path` mirrors the published surface: "home" | "globals" | "/<slug>". */
async function draftFetch<T>(path: string, preview?: string): Promise<T | null> {
  if (!CMS_BASE || !preview) return null; // no token ⇒ never request draft
  try {
    const url = `${CMS_BASE}/api/content/draft?path=${encodeURIComponent(path)}&preview=${encodeURIComponent(preview)}`;
    const res = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(2500) });
    if (!res.ok) return null; // 401/expired/invalid/anything ⇒ caller falls back to published
    return (await res.json()) as T;
  } catch {
    return null; // draft endpoint offline/slow ⇒ fall back to published
  }
}

/** Home content — DRAFT when a valid `preview` token is present, else PUBLISHED. */
export async function getHomeContent(preview?: string): Promise<StudioHome | null> {
  return (preview ? await draftFetch<StudioHome>("home", preview) : null) ?? getCMSHome();
}
/** Per-page overrides — DRAFT under a valid preview token, else PUBLISHED. */
export async function getPageContent(slug: string, preview?: string): Promise<CMSOverrides | null> {
  return (preview ? await draftFetch<CMSOverrides>(slug, preview) : null) ?? getCMSPage(slug);
}
/** Shared globals (header/footer) — DRAFT under a valid preview token, else PUBLISHED. */
export async function getGlobalsContent(preview?: string): Promise<CMSOverrides | null> {
  return (preview ? await draftFetch<CMSOverrides>("globals", preview) : null) ?? getCMSGlobals();
}

/** Generic override bag for a page or the shared globals (footer/header). */
export interface CMSOverrides {
  text?: Record<string, string>;
  btn?: Record<string, { bg?: string; color?: string; radius?: number; variant?: "filled" | "outline"; font?: string }>;
  icon?: Record<string, { color?: string; bg?: string; name?: string }>;
  img?: Record<string, { pos?: string; scale?: number }>;
  media?: Record<string, string>;
  nav?: { items?: { label: string; href: string }[]; bg?: string; color?: string; font?: string; effect?: "auto" | "solid" | "transparent" };
}
/** Per-page overrides (text/buttons/images) by slug, e.g. "/about/". */
export const getCMSPage = (slug: string) => cmsFetch<CMSOverrides>(`/api/content/page/${encodeURIComponent(slug)}`);
/** Overrides for globally-shared UI (footer/header). */
export const getCMSGlobals = () => cmsFetch<CMSOverrides>("/api/content/globals");

/** The CMS's HomeContent shape (mission is a single sentence here; the website
 *  splits it into emphasized segments). All fields optional for safety. */
export interface StudioHome {
  hero?: { heading?: string; bgImage?: string; ctaLabel?: string; ctaHref?: string; isLive?: boolean };
  mission?: { html?: string };
  meetGrowServe?: { heading?: string; pillars?: Array<{ word?: string; headline?: string; body?: string; image?: string; href?: string }> };
  nt26?: { heading?: string; body?: string; ctaLabel?: string; ctaHref?: string; image?: string };
  stayConnected?: { cards?: Array<{ id?: string; title?: string; body?: string; icon?: string; href?: string; cta?: string }> };
  text?: Record<string, string>;
  btn?: Record<string, { bg?: string; color?: string; radius?: number; variant?: "filled" | "outline"; font?: string }>;
  icon?: Record<string, { color?: string; bg?: string; name?: string }>;
  sections?: Array<{ id?: string; visible?: boolean; bg?: string; variant?: string }>;
  img?: Record<string, { pos?: string; scale?: number }>;
}
