/**
 * HOME CONTENT CONTRACT — the hand-built homepage is the source of truth.
 *
 * Every editable text field is an HTML string (so inline formatting from C3
 * Studio — bold, color, size, font — is preserved and rendered verbatim by the
 * real components). DEFAULTS are the exact canonical content, so with the CMS off
 * the site looks identical to the hand-built original.
 */
import type { StudioHome } from "@/lib/cms";

const TEAL = "#1cc3af";

/* ── Per-section content types (text fields hold HTML) ───────── */
export interface HeroContent { heading: string; bgImage: string; ctaLabel: string; ctaHref: string; isLive: boolean }
export interface MissionContent { html: string }
export interface Pillar { word: string; headline: string; body: string; image: string; href: string }
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
export interface SectionMeta { id: string; visible: boolean; bg?: string; variant?: string }
export interface ImgStyle { pos?: string; scale?: number }
export interface HomeContent { hero: HeroContent; mission: MissionContent; meetGrowServe: MeetGrowServeContent; nt26: NT26Content; give: GiveContent; stayConnected: StayConnectedContent; text: Record<string, string>; btn: Record<string, BtnStyle>; icon: Record<string, IconStyle>; sections: SectionMeta[]; img: Record<string, ImgStyle>; bgFill: Record<string, string> }

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
  return text && typeof text[key] === "string" && text[key].trim() !== "" ? text[key] : fallback;
}

/* ── DEFAULTS = the canonical site content ──── */
export const HERO_DEFAULTS: HeroContent = {
  heading: "Welcome home.",
  bgImage: "/images/building.webp",
  ctaLabel: "Plan Your Visit",
  ctaHref: "/visit/",
  isLive: false,
};
export const MISSION_DEFAULTS: MissionContent = {
  html: `We exist to <em style="color:${TEAL};font-style:italic">meet</em> Him, <em style="color:${TEAL};font-style:italic">grow</em> in Him, and <em style="color:${TEAL};font-style:italic">serve</em> through Him.`,
};
export const MEET_GROW_SERVE_DEFAULTS: MeetGrowServeContent = {
  heading: "Find your place at C3.",
  pillars: [
    { word: "About", headline: "Who We Are", body: "A church family in Hays and Colby, Kansas — where everyone is welcome, just as you are.", image: "/images/congregation.webp", href: "/about/" },
    { word: "Messages", headline: "Watch &amp; Listen", body: "Catch up on any message, any series — anytime, anywhere. New sermons every week.", image: "/images/gather.webp", href: "/messages/" },
    { word: "Connect", headline: "Connect with Us", body: "Whether you're new or have been here a while, there's a place for you. Let us know how to help.", image: "/images/exterior.webp", href: "/connect/" },
  ],
};
export const NT26_DEFAULTS: NT26Content = {
  heading: `Have you read your <span style="color:${TEAL}">Bible</span> today?`,
  body: "The NT26 Reading Plan takes you through the entire New Testament in 2026 — one chapter at a time, together as a church family. No experience required. Just a willing heart.",
  ctaLabel: "Start Reading",
  ctaHref: "/messages/",
  image: "/images/nt26.webp",
};
export const GIVE_DEFAULTS: GiveContent = {
  heading: "Give.", body: "Partner with what God is doing through C3.", ctaLabel: "Give Now", ctaHref: "/give/", bgImage: "/images/building.webp",
};
export const HOME_DEFAULTS: HomeContent = {
  hero: HERO_DEFAULTS, mission: MISSION_DEFAULTS, meetGrowServe: MEET_GROW_SERVE_DEFAULTS, nt26: NT26_DEFAULTS, give: GIVE_DEFAULTS, stayConnected: {}, text: {}, btn: {}, icon: {}, sections: SECTIONS_DEFAULT, img: {}, bgFill: {},
};

const str = (v: unknown, fallback: string): string => (typeof v === "string" && v.trim() !== "" ? v : fallback);

/* ── Map C3 Studio's structured home content → HomeContent (per-field fallback) ── */
export function fromStudioHome(raw: StudioHome | null | undefined): HomeContent {
  if (!raw) return HOME_DEFAULTS;
  const pillarsRaw = raw.meetGrowServe?.pillars;
  return {
    hero: {
      heading: str(raw.hero?.heading, HERO_DEFAULTS.heading),
      bgImage: str(raw.hero?.bgImage, HERO_DEFAULTS.bgImage),
      ctaLabel: str(raw.hero?.ctaLabel, HERO_DEFAULTS.ctaLabel),
      ctaHref: str(raw.hero?.ctaHref, HERO_DEFAULTS.ctaHref),
      isLive: typeof raw.hero?.isLive === "boolean" ? raw.hero.isLive : HERO_DEFAULTS.isLive,
    },
    mission: { html: str(raw.mission?.html, MISSION_DEFAULTS.html) },
    meetGrowServe: {
      heading: str(raw.meetGrowServe?.heading, MEET_GROW_SERVE_DEFAULTS.heading),
      pillars: Array.isArray(pillarsRaw) && pillarsRaw.length
        ? pillarsRaw.map((p, i) => ({
            word: str(p?.word, MEET_GROW_SERVE_DEFAULTS.pillars[i]?.word ?? `tile-${i}`),
            headline: str(p?.headline, MEET_GROW_SERVE_DEFAULTS.pillars[i]?.headline ?? ""),
            body: str(p?.body, MEET_GROW_SERVE_DEFAULTS.pillars[i]?.body ?? ""),
            image: str(p?.image, MEET_GROW_SERVE_DEFAULTS.pillars[i]?.image ?? "/images/congregation.webp"),
            href: str(p?.href, MEET_GROW_SERVE_DEFAULTS.pillars[i]?.href ?? "/"),
          }))
        : MEET_GROW_SERVE_DEFAULTS.pillars,
    },
    nt26: {
      heading: str(raw.nt26?.heading, NT26_DEFAULTS.heading),
      body: str(raw.nt26?.body, NT26_DEFAULTS.body),
      ctaLabel: str(raw.nt26?.ctaLabel, NT26_DEFAULTS.ctaLabel),
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
            .map((c) => ({ id: c.id!, title: c.title!, body: c.body!, icon: c.icon!, href: c.href!, cta: typeof c.cta === "string" ? c.cta : undefined }))
        : undefined,
    },
    text: (raw.text && typeof raw.text === "object" ? raw.text : {}) as Record<string, string>,
    btn: (raw.btn && typeof raw.btn === "object" ? raw.btn : {}) as Record<string, BtnStyle>,
    icon: (raw.icon && typeof raw.icon === "object" ? raw.icon : {}) as Record<string, IconStyle>,
    sections: Array.isArray(raw.sections) && raw.sections.length
      ? raw.sections
          .filter((s) => s && typeof s.id === "string")
          .map((s) => ({ id: s.id as string, visible: s.visible !== false, bg: typeof s.bg === "string" ? s.bg : undefined, variant: typeof s.variant === "string" ? s.variant : undefined }))
      : SECTIONS_DEFAULT,
    img: (raw.img && typeof raw.img === "object" ? raw.img : {}) as Record<string, ImgStyle>,
    // v3 (R3): per-element background fills (data-cms-bg id → CSS background string).
    bgFill: (raw.bgFill && typeof raw.bgFill === "object" ? raw.bgFill : {}) as Record<string, string>,
  };
}
