/**
 * HOME CONTENT CONTRACT — the hand-built homepage is the source of truth.
 *
 * Every editable text field is an HTML string (so inline formatting from C3
 * Studio — bold, color, size, font — is preserved and rendered verbatim by the
 * real components). DEFAULTS are the exact canonical content, so with the CMS off
 * the site looks identical to the hand-built original.
 */
import type { StudioHome, FreeEl, CMSOverrides } from "@/lib/cms";
import { sanitizeInlineHtml } from "@/lib/inline-html";
import { txTimes } from "@/lib/service-times-core";

const TEAL = "#1cc3af";

/* ── Per-section content types (text fields hold HTML) ───────── */
export interface HeroContent { heading: string; bgImage: string; ctaLabel: string; ctaHref: string; isLive: boolean }
export interface MissionContent { html: string }
export interface Pillar { /** Stable key of this pillar: the canvas addresses it as `meetGrowServe.pillars.<id>.*`, never by position. */ id: string; word: string; headline: string; body: string; image: string; href: string }
export interface MeetGrowServeContent { heading: string; pillars: Pillar[] }
export interface NT26Content { heading: string; body: string; ctaLabel: string; ctaHref: string; image: string }
/** A single editable "connect" tile in the StayConnected collection (camelCase, R2). */
export interface StayCard { id: string; title: string; body: string; icon: string; href: string; cta?: string }
/** StayConnected content. `cards` is OPTIONAL + ADDITIVE: absent/empty ⇒ legacy
 *  connect-count rendering (byte-identical for existing published content). */
export interface StayConnectedContent { cards?: StayCard[] }
export interface GiveContent { heading: string; body: string; ctaLabel: string; ctaHref: string; bgImage: string }
export interface BtnStyle { bg: string; color: string; radius: number; variant: "filled" | "outline"; font: string }
export interface IconStyle { color: string; bg: string; name?: string }
export interface SectionMeta { id: string; visible: boolean; bg?: string; variant?: string; bgSpan?: number }
export interface ImgStyle { pos?: string; scale?: number }
/** v7 (R4): site-wide visual-effect flags. Tyler-advanced; all OFF by default. */
export interface FxFlags { sectionBleed?: boolean }
export interface HomeContent { hero: HeroContent; mission: MissionContent; meetGrowServe: MeetGrowServeContent; nt26: NT26Content; give: GiveContent; stayConnected: StayConnectedContent; text: Record<string, string>; btn: Record<string, BtnStyle>; icon: Record<string, IconStyle>; sections: SectionMeta[]; img: Record<string, ImgStyle>; bgFill: Record<string, string>; anim: Record<string, string>; fx: FxFlags; freeOffsets?: Record<string, { x: number; y: number }>; freeEls?: FreeEl[] }

/** v6 R6: entrance-animation preset for a tagged element (by its data-cms path), or
 *  undefined when none. Hand-mirrors the c3-backend accessor; the reveal player
 *  reads this. Defensive at the boundary (non-string ⇒ undefined). */
export function animFor(content: Pick<HomeContent, "anim">, path: string): string | undefined {
  const v = content.anim?.[path];
  return typeof v === "string" && v ? v : undefined;
}

/** Inline style for an editable image's framing (focal point + zoom). */
export function imgCss(s?: ImgStyle): React.CSSProperties | undefined {
  if (!s) return undefined;
  return { objectPosition: s.pos || undefined, transform: s.scale && s.scale !== 1 ? `scale(${s.scale})` : undefined };
}

/** Canonical section order — used when C3 Studio hasn't customized the layout. */
export const SECTIONS_DEFAULT: SectionMeta[] = [
  { id: "hero", visible: true },
  { id: "mission", visible: true },
  { id: "meetGrowServe", visible: true },
  { id: "nt26", visible: true },
  { id: "locations", visible: true },
  { id: "stayConnected", visible: true },
];

/** Read a generic per-element text override (HTML) by its data-cms id, else fallback. */
export function tx(text: Record<string, string> | undefined, key: string, fallback: string): string {
  return text && typeof text[key] === "string" && text[key].trim() !== "" ? sanitizeInlineHtml(text[key]) : fallback;
}

/** `txTimes` (a stale clock-time override falls back to the data-built text) with what Studio sent read through the allow-list. */
export function txTimesSafe(text: Record<string, string> | undefined, key: string, fallback: string): string {
  const v = txTimes(text, key, fallback);
  return v === fallback ? fallback : sanitizeInlineHtml(v);
}

/**
 * Defensive parse of a persisted section list (CMS overrides / StudioHome) into
 * `SectionMeta[]`. Any-page equivalent of the inline home parse (used by
 * `fromStudioHome`): keeps only entries with a string `id`, defaults `visible` to
 * true (only an explicit `false` hides), and string-guards `bg`/`variant`. Returns
 * `fallback` when `raw` is not a non-empty array (missing/garbage ⇒ page defaults).
 * Page files call `parseSections(overrides?.sections, PAGE_DEFAULT_SECTIONS)`.
 */
export function parseSections(raw: unknown, fallback: SectionMeta[]): SectionMeta[] {
  if (!Array.isArray(raw) || raw.length === 0) return fallback;
  return (raw as Array<{ id?: unknown; visible?: unknown; bg?: unknown; variant?: unknown; bgSpan?: unknown }>)
    .filter((s) => !!s && typeof s.id === "string")
    .map((s) => ({
      id: s.id as string,
      visible: s.visible !== false,
      bg: typeof s.bg === "string" ? s.bg : undefined,
      variant: typeof s.variant === "string" ? s.variant : undefined,
      // v-span: number of ADDITIONAL adjacent visible sections this section's bg
      // image spans across (0/undefined = normal). Guarded to a number at the boundary.
      bgSpan: typeof s.bgSpan === "number" ? s.bgSpan : undefined,
    }));
}

/* ── DEFAULTS = the canonical site content ──── */
export const HERO_DEFAULTS: HeroContent = {
  // Verbatim from celebratejesus.org home H1.
  heading: "Welcome Home.",
  bgImage: "/images/building.webp",
  ctaLabel: "Plan Your Visit",
  ctaHref: "/visit/",
  isLive: false,
};
export const MISSION_DEFAULTS: MissionContent = {
  // Verbatim mission line from celebratejesus.org (no comma before "and").
  html: `We exist to <em style="color:${TEAL};font-style:italic">meet</em> Him, <em style="color:${TEAL};font-style:italic">grow</em> in Him and <em style="color:${TEAL};font-style:italic">serve</em> through Him.`,
};
export const MEET_GROW_SERVE_DEFAULTS: MeetGrowServeContent = {
  // Real celebratejesus.org home section header.
  heading: "Meet. Grow. Serve.",
  pillars: [
    { id: "about", word: "About", headline: "Who We Are", body: "A church family in Hays and Colby, Kansas, where everyone is welcome, just as you are.", image: "/images/congregation.webp", href: "/about/" },
    { id: "messages", word: "Messages", headline: "Watch &amp; Listen", body: "Catch up on any message, any series, anytime, online or in person.", image: "/images/gather.webp", href: "/messages/" },
    { id: "connect", word: "Connect", headline: "Connect with Us", body: "You're welcome to join us just as you are. There isn't a mold you have to fit before you walk through our doors.", image: "/images/exterior.webp", href: "/connect/" },
  ],
};
export const NT26_DEFAULTS: NT26Content = {
  heading: `Have you read your <span style="color:${TEAL}">Bible</span> today?`,
  body: "Read through the New Testament in 2026. Click for today's reading plan and devotional.",
  ctaLabel: "Start Reading",
  ctaHref: "/messages/",
  image: "/images/nt26.webp",
};
export const GIVE_DEFAULTS: GiveContent = {
  heading: "Give.", body: "Partner with what God is doing through C3.", ctaLabel: "Give Now", ctaHref: "/give/", bgImage: "/images/building.webp",
};
export const HOME_DEFAULTS: HomeContent = {
  hero: HERO_DEFAULTS, mission: MISSION_DEFAULTS, meetGrowServe: MEET_GROW_SERVE_DEFAULTS, nt26: NT26_DEFAULTS, give: GIVE_DEFAULTS, stayConnected: {}, text: {}, btn: {}, icon: {}, sections: SECTIONS_DEFAULT, img: {}, bgFill: {}, anim: {}, fx: {},
};

const str = (v: unknown, fallback: string): string => (typeof v === "string" && v.trim() !== "" ? v : fallback);
/** Like `str`, for text that is set as HTML: what Studio sent goes through the allow-list, the built-in fallback does not need it. */
const htm = (v: unknown, fallback: string): string => (typeof v === "string" && v.trim() !== "" ? sanitizeInlineHtml(v) : fallback);

/**
 * A pillar's key in a canvas path. Studio gives each stored pillar an `id`; a record without one (old content) takes
 * the default pillar's id at its position, then `tile-<n>`. Only [A-Za-z0-9_-] survive (a dot would split the path),
 * and a repeated id gets a suffix so two pillars never share one key.
 */
export function pillarId(raw: unknown, i: number, all: unknown[] = []): string {
  const clean = (v: unknown) => (typeof v === "string" ? v.replace(/[^A-Za-z0-9_-]/g, "-").replace(/^-+|-+$/g, "") : "");
  const base = clean(raw) || MEET_GROW_SERVE_DEFAULTS.pillars[i]?.id || `tile-${i}`;
  const before = all.slice(0, i).map(clean);
  let id = base;
  for (let n = 2; before.includes(id); n++) id = `${base}-${n}`;
  return id;
}

/* ── Map C3 Studio's structured home content → HomeContent (per-field fallback) ── */
export function fromStudioHome(raw: StudioHome | null | undefined): HomeContent {
  if (!raw) return HOME_DEFAULTS;
  const pillarsRaw = raw.meetGrowServe?.pillars;
  return {
    hero: {
      heading: htm(raw.hero?.heading, HERO_DEFAULTS.heading),
      bgImage: str(raw.hero?.bgImage, HERO_DEFAULTS.bgImage),
      ctaLabel: htm(raw.hero?.ctaLabel, HERO_DEFAULTS.ctaLabel),
      ctaHref: str(raw.hero?.ctaHref, HERO_DEFAULTS.ctaHref),
      isLive: typeof raw.hero?.isLive === "boolean" ? raw.hero.isLive : HERO_DEFAULTS.isLive,
    },
    mission: { html: htm(raw.mission?.html, MISSION_DEFAULTS.html) },
    meetGrowServe: {
      heading: htm(raw.meetGrowServe?.heading, MEET_GROW_SERVE_DEFAULTS.heading),
      pillars: Array.isArray(pillarsRaw) && pillarsRaw.length
        ? pillarsRaw.map((p, i) => ({
            id: pillarId(p?.id, i, pillarsRaw.map((q) => q?.id)),
            word: htm(p?.word, MEET_GROW_SERVE_DEFAULTS.pillars[i]?.word ?? `tile-${i}`),
            headline: htm(p?.headline, MEET_GROW_SERVE_DEFAULTS.pillars[i]?.headline ?? ""),
            body: htm(p?.body, MEET_GROW_SERVE_DEFAULTS.pillars[i]?.body ?? ""),
            image: str(p?.image, MEET_GROW_SERVE_DEFAULTS.pillars[i]?.image ?? "/images/congregation.webp"),
            href: str(p?.href, MEET_GROW_SERVE_DEFAULTS.pillars[i]?.href ?? "/"),
          }))
        : MEET_GROW_SERVE_DEFAULTS.pillars,
    },
    nt26: {
      heading: htm(raw.nt26?.heading, NT26_DEFAULTS.heading),
      body: htm(raw.nt26?.body, NT26_DEFAULTS.body),
      ctaLabel: htm(raw.nt26?.ctaLabel, NT26_DEFAULTS.ctaLabel),
      ctaHref: str(raw.nt26?.ctaHref, NT26_DEFAULTS.ctaHref),
      image: str(raw.nt26?.image, NT26_DEFAULTS.image),
    },
    give: GIVE_DEFAULTS,
    // ADDITIVE (R2): only surface a cards array when C3 Studio actually sent valid
    // cards; otherwise `undefined` ⇒ StayConnected keeps its legacy rendering.
    stayConnected: {
      cards: Array.isArray(raw.stayConnected?.cards)
        ? raw.stayConnected!.cards!
            .filter((c) => c && typeof c.id === "string" && typeof c.title === "string" && typeof c.body === "string" && typeof c.icon === "string" && typeof c.href === "string")
            .map((c) => ({ id: c.id!, title: sanitizeInlineHtml(c.title!), body: sanitizeInlineHtml(c.body!), icon: c.icon!, href: c.href!, cta: typeof c.cta === "string" ? c.cta : undefined }))
        : undefined,
    },
    text: (raw.text && typeof raw.text === "object" ? raw.text : {}) as Record<string, string>,
    btn: (raw.btn && typeof raw.btn === "object" ? raw.btn : {}) as Record<string, BtnStyle>,
    icon: (raw.icon && typeof raw.icon === "object" ? raw.icon : {}) as Record<string, IconStyle>,
    // Byte-identical to the previous inline parse, now shared with any page.
    sections: parseSections(raw.sections, SECTIONS_DEFAULT),
    img: (raw.img && typeof raw.img === "object" ? raw.img : {}) as Record<string, ImgStyle>,
    // v3 (R3): per-element background fills (data-cms-bg id → CSS background string).
    bgFill: (raw.bgFill && typeof raw.bgFill === "object" ? raw.bgFill : {}) as Record<string, string>,
    // v6 R6: per-element entrance animations (mirrors bgFill).
    anim: (raw.anim && typeof raw.anim === "object" ? raw.anim : {}) as Record<string, string>,
    // v7 R4: site-wide fx flags. sectionBleed is OFF unless the studio explicitly sets true.
    fx: { sectionBleed: raw.fx?.sectionBleed === true },
    // Drag-anywhere: per-element free-drag offsets (data-cms* selector → {x,y} px).
    freeOffsets: (raw.freeOffsets && typeof raw.freeOffsets === "object" ? raw.freeOffsets : {}) as Record<string, { x: number; y: number }>,
    // Drag-anywhere: freeform text/button elements added on the home page.
    freeEls: Array.isArray(raw.freeEls) ? raw.freeEls : [],
  };
}

/**
 * exampleContentShim — build a full HomeContent from the canonical DEFAULTS, overlaid
 * with a NON-HOME page's own flat overrides (text/btn/icon/img/bgFill). This lets
 * `renderExample()` render an ADDED library/example section on ANY page, editing against
 * that page's own overrides (so the added section's text/colors persist per-page). The
 * structured home fields (hero/mission/…) fall back to defaults — only relevant if a
 * user adds one of those specific sections to another page. Cheap to build (defaults +
 * a shallow spread); pages build it once per render.
 */
export function exampleContentShim(ov: CMSOverrides): HomeContent {
  const base = fromStudioHome(null);
  return {
    ...base,
    text: ov.text || {},
    btn: (ov.btn || {}) as HomeContent["btn"],
    icon: (ov.icon || {}) as HomeContent["icon"],
    img: (ov.img || {}) as HomeContent["img"],
    bgFill: ov.bgFill || {},
  };
}
