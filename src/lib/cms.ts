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
import { cache } from "react";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { SectionMeta } from "@/lib/home-content";

const CMS_BASE = process.env.NEXT_PUBLIC_CMS_URL || "";

/**
 * Finding 2 — the fetcher used for EVERY c3-studio content read (published + draft).
 *
 * On the Worker, a same-account Worker→Worker subrequest to c3-studio's PUBLIC
 * workers.dev URL does not deliver the response body to the render — so BOTH published
 * (cmsFetch) and draft (draftFetch) silently fell back to the components' hard-coded
 * fallbacks (draft edits "disappeared" on reload; Publish appeared to not change the
 * live site). The fix is the loopback-safe SERVICE BINDING declared in wrangler.jsonc
 * (`services: [{ binding: "CMS", service: "c3-studio" }]`): when it's present we route
 * the subrequest through `env.CMS.fetch()`, which reaches c3-studio directly.
 *
 * getCloudflareContext() THROWS off the Worker (local `next dev`, vitest, static
 * export) → we fall back to the public-URL global fetch, so nothing changes there. The
 * URL is always built from CMS_BASE; only the FETCHER differs.
 */
type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;
function cmsFetcher(): FetchLike {
  try {
    const env = getCloudflareContext().env as
      | { CMS?: { fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response> } }
      | undefined;
    const cms = env?.CMS;
    if (cms) return (input, init) => cms.fetch(input, init);
  } catch {
    // no Cloudflare context (dev / vitest / export) → public-URL fetch
  }
  return (input, init) => fetch(input, init);
}

/**
 * A write to Studio from a server route of this site (the signup). Goes over the `CMS` service binding on the
 * Worker, the public URL elsewhere. Throws when no Studio is configured, so a caller can refuse instead of dropping.
 */
export function cmsForward(path: string, init: RequestInit): Promise<Response> {
  if (!CMS_BASE) throw new Error("Studio is not configured");
  return cmsFetcher()(`${CMS_BASE}${path}`, init);
}

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
    const res = await cmsFetcher()(`${CMS_BASE}${path}`, { cache: "no-store", signal: AbortSignal.timeout(2500) });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null; // CMS offline → caller falls back to static content
  }
}

/**
 * Can this Worker read Studio at all? "studio" when a published read comes back as JSON; "fallback" when it does not
 * (a refusal, a sign-in page where JSON was expected, a timeout, no Studio configured), in which case the pages show
 * their built-in content. Reported as the `x-c3-content` response header and one log line when the state changes; the
 * visitor never sees an error. Remembered per isolate for `ttlMs` so it costs one small read, not one per request.
 */
export type StudioContentState = "studio" | "fallback";
let probe: { at: number; state: StudioContentState } | null = null;
export async function studioContentState(ttlMs = 30_000): Promise<StudioContentState> {
  if (probe && Date.now() - probe.at < ttlMs) return probe.state;
  let state: StudioContentState = "fallback";
  let why = "no Studio configured";
  if (CMS_BASE) {
    try {
      const res = await cmsFetcher()(`${CMS_BASE}/api/content/site`, { cache: "no-store", signal: AbortSignal.timeout(2500) });
      if (!res.ok) why = `Studio answered ${res.status}`;
      else {
        const body = await res.json();
        if (body && typeof body === "object") state = "studio";
        else why = "Studio answered something that is not content";
      }
    } catch {
      why = "Studio answered something that is not JSON, or did not answer";
    }
  }
  if (state === "fallback" && probe?.state !== "fallback") console.warn(`[c3-content] fallback: ${why}`);
  probe = { at: Date.now(), state };
  return state;
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
/** Studio `announcements` (published, web surface). The site applies each one's start and end. */
export const getCMSAnnouncements = () => cmsFetch<unknown[]>("/api/content/announcements?surface=web");
/** Studio `site` (carries `give_config` and the legacy `giving` map). */
export const getCMSSite = () => cmsFetch<Record<string, unknown>>("/api/content/site");
/** Studio `giving_campaigns`, with the raised figure composed on. */
export const getCMSGivingCampaigns = () => cmsFetch<unknown[]>("/api/content/giving_campaigns");
/** Studio `newsletter_issues` (published). Each item carries its sanitised HTML in `html`. */
export const getCMSNewsletterIssues = () => cmsFetch<unknown[]>("/api/content/newsletter_issues");

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
/** Header that carries the editor's preview token to Studio. Never the query: a query lands in access logs. */
export const PREVIEW_HEADER = "x-c3-preview";

type DraftRead<T> = { ok: true; data: T } | { ok: false };

/**
 * One draft read per (path, token) per request. The layout (for the draft mark and the chrome) and the page (for its
 * own content) ask for the same path; `cache` makes that a single round trip to Studio.
 */
const draftOnce = cache(async (path: string, preview: string): Promise<DraftRead<unknown>> => {
  if (!CMS_BASE || !preview) return { ok: false }; // no token => never request draft
  try {
    const url = `${CMS_BASE}/api/content/draft?path=${encodeURIComponent(path)}`;
    // The draft route reads D1 and can exceed a tight timeout on a cold Worker-to-Worker subrequest; 8 s gives it room.
    const res = await cmsFetcher()(url, { cache: "no-store", headers: { [PREVIEW_HEADER]: preview }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) return { ok: false }; // 401 / expired / invalid / anything => the caller falls back to published
    return { ok: true, data: await res.json() };
  } catch {
    return { ok: false }; // draft endpoint offline or slow => published
  }
});
async function draftFetch<T>(path: string, preview?: string): Promise<T | null> {
  const r = await draftOnce(path, preview ?? "");
  return r.ok ? (r.data as T) : null;
}

/** Home content: DRAFT when a valid `preview` token is present, else PUBLISHED. */
export async function getHomeContent(preview?: string): Promise<StudioHome | null> {
  return (preview ? await draftFetch<StudioHome>("home", preview) : null) ?? getCMSHome();
}
/** Per-page overrides: DRAFT under a valid preview token, else PUBLISHED. */
export async function getPageContent(slug: string, preview?: string): Promise<CMSOverrides | null> {
  return (preview ? await draftFetch<CMSOverrides>(slug, preview) : null) ?? getCMSPage(slug);
}
/** Shared globals (header/footer text): DRAFT under a valid preview token, else PUBLISHED. */
export async function getGlobalsContent(preview?: string): Promise<CMSOverrides | null> {
  return (preview ? await draftFetch<CMSOverrides>("globals", preview) : null) ?? getCMSGlobals();
}

/** The menu as Studio stores it (`navigation.web`). Items without a label or an href are dropped. */
function cleanMenu(raw: unknown): NavItem[] | null {
  const list = Array.isArray(raw) ? raw : raw && typeof raw === "object" && Array.isArray((raw as { web?: unknown }).web) ? (raw as { web: unknown[] }).web : null;
  if (!list) return null;
  const one = (v: unknown, i: number): NavItem | null => {
    if (!v || typeof v !== "object") return null;
    const o = v as { id?: unknown; label?: unknown; href?: unknown; children?: unknown };
    if (typeof o.label !== "string" || !o.label.trim() || typeof o.href !== "string" || !o.href.trim()) return null;
    const kids = Array.isArray(o.children) ? o.children.map(one).filter((k): k is NavItem => !!k) : [];
    return { id: typeof o.id === "string" && o.id ? o.id : `nav-${i}`, label: o.label.trim(), href: o.href.trim(), ...(kids.length ? { children: kids } : {}) };
  };
  return list.map(one).filter((n): n is NavItem => !!n);
}

/**
 * THE one menu: Studio's `navigation` item (web list). Draft under a valid token, else published. Returns null when
 * Studio is down or the list is empty, so the header and footer keep the code list (`src/data/navigation.ts`).
 * `globals.nav` is not read.
 */
export async function getMenu(preview?: string): Promise<{ items: NavItem[] | null; draft: boolean }> {
  if (preview) {
    const d = cleanMenu(await draftFetch<unknown>("navigation", preview));
    if (d && d.length) return { items: d, draft: true };
  }
  const pub = cleanMenu(await cmsFetch<unknown>("/api/content/navigation?surface=web"));
  return { items: pub && pub.length ? pub : null, draft: false };
}

/** The path the draft route knows a page by: "home" for the front page, "/slug" for the rest. */
export function draftPathFor(pathname: string): string {
  const p = ("/" + pathname.replace(/^\/+/, "")).replace(/\/+$/, "");
  return p === "" || p === "/" ? "home" : p;
}

/**
 * The mark the root carries so the editor knows what it is looking at. "served" only when the page, the globals and
 * the menu ALL came from the draft; "fallback" when a token was sent but any of them did not (expired, forged, Studio
 * down). No token means a visitor: no mark at all.
 */
export async function getDraftMark(preview: string | undefined, pathname: string): Promise<{ mark?: "served" | "fallback"; asOf?: string }> {
  if (!preview) return {};
  const [page, globals, menu] = await Promise.all([
    draftOnce(draftPathFor(pathname), preview),
    draftOnce("globals", preview),
    draftOnce("navigation", preview),
  ]);
  return page.ok && globals.ok && menu.ok ? { mark: "served", asOf: new Date().toISOString() } : { mark: "fallback" };
}

/** Generic override bag for a page or the shared globals (footer/header). */
export interface CMSOverrides {
  text?: Record<string, string>;
  btn?: Record<string, { bg?: string; color?: string; radius?: number; variant?: "filled" | "outline"; font?: string }>;
  icon?: Record<string, { color?: string; bg?: string; name?: string }>;
  img?: Record<string, { pos?: string; scale?: number }>;
  media?: Record<string, string>;
  /** v3 (R4): per-element background fills keyed by data-cms-bg id (e.g. "g:footer"). */
  bgFill?: Record<string, string>;
  /** v6 (R6): per-element entrance animations keyed by data-cms path → preset. */
  anim?: Record<string, string>;
  /**
   * Layer-2 (any-page): the page's OWN ordered/recolorable section list — mirrors
   * StudioHome.sections (home-only today). A non-home page persists its section
   * order + per-section bg here so the editor rail can add/reorder/hide/recolor it,
   * and PageComposer emits the `<div data-section>` wrappers + scoped bg stylesheet.
   * Parse defensively at the boundary with `parseSections` (home-content.ts).
   */
  sections?: SectionMeta[];
  nav?: { items?: { label: string; href: string }[]; bg?: string; color?: string; font?: string; effect?: "auto" | "solid" | "transparent" };
  /** Drag-anywhere: freeform elements placed at arbitrary spots on this page. */
  freeEls?: FreeEl[];
  /** Drag-anywhere (any element): per-element free-drag OFFSETS applied to an EXISTING
   *  in-flow element (button/text/image/icon). Keyed by the element's OWN data-cms*
   *  attribute selector (e.g. `[data-cms="hero.title"]`, `[data-cms-link="give.cta"]`);
   *  value is a pixel translate. Rendered as one scoped <style> (transform: translate) on
   *  BOTH preview (draft) and the published site — so a dragged element persists. */
  freeOffsets?: Record<string, FreeOffset>;
}
/** A per-element free-drag offset (px), applied via CSS `transform: translate(x,y)`. */
export interface FreeOffset { x: number; y: number }
/** A drag-anywhere freeform element (mirror of c3-backend FreeEl). Position is stored
 *  viewport-independent: x as a % of page width, y as px from the page content top. */
export interface FreeEl {
  id: string;
  kind: "text" | "button";
  xPct: number;
  yPx: number;
  text: string;
  href?: string;
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
  meetGrowServe?: { heading?: string; pillars?: Array<{ id?: string; word?: string; headline?: string; body?: string; image?: string; href?: string }> };
  nt26?: { heading?: string; body?: string; ctaLabel?: string; ctaHref?: string; image?: string };
  stayConnected?: { cards?: Array<{ id?: string; title?: string; body?: string; icon?: string; href?: string; cta?: string }> };
  text?: Record<string, string>;
  btn?: Record<string, { bg?: string; color?: string; radius?: number; variant?: "filled" | "outline"; font?: string }>;
  icon?: Record<string, { color?: string; bg?: string; name?: string }>;
  sections?: Array<{ id?: string; visible?: boolean; bg?: string; variant?: string }>;
  img?: Record<string, { pos?: string; scale?: number }>;
  /** v3 (R3): per-element background fills (data-cms-bg id → CSS background string). */
  bgFill?: Record<string, string>;
  /** v6 (R6): per-element entrance animations (data-cms path → ANIMATION_PRESETS key). */
  anim?: Record<string, string>;
  /** v7 (R4): site-wide visual-effect flags. Tyler-advanced, OFF by default (Kale never toggles). */
  fx?: { sectionBleed?: boolean };
  /** Drag-anywhere (any element): per-element free-drag offsets on the HOME page.
   *  Same shape/semantics as CMSOverrides.freeOffsets. */
  freeOffsets?: Record<string, FreeOffset>;
  /** Drag-anywhere: NEW freeform text/button elements added to the HOME page (the
   *  "+ Add Text / + Button" tools). Same shape as CMSOverrides.freeEls. */
  freeEls?: FreeEl[];
}
