/**
 * HOME CONTENT CONTRACT — the hand-built homepage is the source of truth.
 *
 * Each premium home component renders from a typed content slice defined here.
 * DEFAULTS are the EXACT current hardcoded values, so when the CMS is absent or a
 * field is missing, the site looks identical to the hand-built original.
 *
 * `mapHomeContent()` maps C3 Studio's published home-screen blocks onto these
 * slices. Editing those blocks in the builder changes what the REAL components
 * render — never how they look. This is the inversion: CMS feeds the design, it
 * does not replace it.
 */
import type { CMSBlock } from "@/lib/cms";

/* ── Per-section content types ───────────────────────────── */
export interface HeroContent {
  heading: string;
  bgImage: string;
  ctaLabel: string;
  ctaHref: string;
  isLive: boolean;
}
export interface MissionSegment { text: string; em?: boolean }
export interface MissionContent { segments: MissionSegment[] }

export interface Pillar { word: string; headline: string; body: string; image: string; href: string }
export interface MeetGrowServeContent { heading: string; pillars: Pillar[] }

export interface NT26Content {
  pre: string; em: string; post: string;
  body: string; ctaLabel: string; ctaHref: string; image: string;
}
export interface GiveContent {
  heading: string; body: string; ctaLabel: string; ctaHref: string; bgImage: string;
}

export interface HomeContent {
  hero: HeroContent;
  mission: MissionContent;
  meetGrowServe: MeetGrowServeContent;
  nt26: NT26Content;
  give: GiveContent;
}

/* ── DEFAULTS = the hand-built site's exact current content ──── */
export const HERO_DEFAULTS: HeroContent = {
  heading: "Welcome home.",
  bgImage: "/images/building.webp",
  ctaLabel: "Plan Your Visit",
  ctaHref: "/visit/",
  isLive: false,
};

export const MISSION_DEFAULTS: MissionContent = {
  segments: [
    { text: "We exist to " },
    { text: "meet", em: true },
    { text: " Him, " },
    { text: "grow", em: true },
    { text: " in Him, and " },
    { text: "serve", em: true },
    { text: " through Him." },
  ],
};

export const MEET_GROW_SERVE_DEFAULTS: MeetGrowServeContent = {
  heading: "Find your place at C3.",
  pillars: [
    { word: "About", headline: "Who We Are", body: "A church family in Hays and Colby, Kansas — where everyone is welcome, just as you are.", image: "/images/congregation.webp", href: "/about/" },
    { word: "Messages", headline: "Watch & Listen", body: "Catch up on any message, any series — anytime, anywhere. New sermons every week.", image: "/images/gather.webp", href: "/messages/" },
    { word: "Connect", headline: "Connect with Us", body: "Whether you're new or have been here a while, there's a place for you. Let us know how to help.", image: "/images/exterior.webp", href: "/connect/" },
  ],
};

export const NT26_DEFAULTS: NT26Content = {
  pre: "Have you read your ",
  em: "Bible",
  post: " today?",
  body: "The NT26 Reading Plan takes you through the entire New Testament in 2026 — one chapter at a time, together as a church family. No experience required. Just a willing heart.",
  ctaLabel: "Start Reading",
  ctaHref: "/messages/",
  image: "/images/nt26.webp",
};

export const GIVE_DEFAULTS: GiveContent = {
  heading: "Give.",
  body: "Partner with what God is doing through C3.",
  ctaLabel: "Give Now",
  ctaHref: "/give/",
  bgImage: "/images/building.webp",
};

export const HOME_DEFAULTS: HomeContent = {
  hero: HERO_DEFAULTS,
  mission: MISSION_DEFAULTS,
  meetGrowServe: MEET_GROW_SERVE_DEFAULTS,
  nt26: NT26_DEFAULTS,
  give: GIVE_DEFAULTS,
};

/* ── Map C3 Studio blocks → HomeContent (fallback to defaults per field) ── */
const str = (v: unknown, fallback: string): string =>
  typeof v === "string" && v.trim() !== "" ? v : fallback;

function byType(blocks: CMSBlock[] | null | undefined) {
  const map = new Map<string, Record<string, unknown>>();
  for (const b of blocks ?? []) {
    if (b.visible !== false && !map.has(b.component_type)) map.set(b.component_type, b.content || {});
  }
  return map;
}

export function mapHomeContent(blocks: CMSBlock[] | null | undefined): HomeContent {
  const m = byType(blocks);

  const hero = m.get("hero");
  const heroContent: HeroContent = hero
    ? {
        heading: str(hero.heading, HERO_DEFAULTS.heading),
        bgImage: str(hero.image, HERO_DEFAULTS.bgImage),
        ctaLabel: str(hero.cta_label, HERO_DEFAULTS.ctaLabel),
        ctaHref: str(hero.cta_url, HERO_DEFAULTS.ctaHref),
        isLive: HERO_DEFAULTS.isLive,
      }
    : HERO_DEFAULTS;

  // Mission: a rich_text block whose heading carries the sentence. If the heading
  // still contains the three verbs, keep teal emphasis on them; else render plain.
  const rich = m.get("rich_text");
  let mission: MissionContent = MISSION_DEFAULTS;
  if (rich && typeof rich.heading === "string" && rich.heading.trim()) {
    mission = { segments: emphasizeVerbs(rich.heading) };
  }

  const grid = m.get("card_grid");
  let meetGrowServe: MeetGrowServeContent = MEET_GROW_SERVE_DEFAULTS;
  if (grid) {
    const cards = Array.isArray(grid.cards) ? (grid.cards as Record<string, unknown>[]) : [];
    const pillars: Pillar[] = cards.length
      ? cards.slice(0, 3).map((c, i) => ({
          word: str(c.word ?? c.eyebrow, MEET_GROW_SERVE_DEFAULTS.pillars[i]?.word ?? ""),
          headline: str(c.title ?? c.headline, MEET_GROW_SERVE_DEFAULTS.pillars[i]?.headline ?? ""),
          body: str(c.body ?? c.text, MEET_GROW_SERVE_DEFAULTS.pillars[i]?.body ?? ""),
          image: str(c.image, MEET_GROW_SERVE_DEFAULTS.pillars[i]?.image ?? "/images/congregation.webp"),
          href: str(c.href ?? c.link, MEET_GROW_SERVE_DEFAULTS.pillars[i]?.href ?? "/"),
        }))
      : MEET_GROW_SERVE_DEFAULTS.pillars;
    meetGrowServe = { heading: str(grid.heading, MEET_GROW_SERVE_DEFAULTS.heading), pillars };
  }

  const it = m.get("image_text");
  const nt26: NT26Content = it
    ? {
        ...NT26_DEFAULTS,
        // image_text has a single heading; show it whole (no forced emphasis word)
        pre: str(it.heading, `${NT26_DEFAULTS.pre}${NT26_DEFAULTS.em}${NT26_DEFAULTS.post}`),
        em: it.heading ? "" : NT26_DEFAULTS.em,
        post: it.heading ? "" : NT26_DEFAULTS.post,
        body: str(it.body, NT26_DEFAULTS.body),
        image: str(it.image, NT26_DEFAULTS.image),
      }
    : NT26_DEFAULTS;

  const g = m.get("give_cta");
  const give: GiveContent = g
    ? {
        ...GIVE_DEFAULTS,
        heading: str(g.heading, GIVE_DEFAULTS.heading),
        ctaLabel: str(g.cta_label, GIVE_DEFAULTS.ctaLabel),
        ctaHref: str(g.cta_url, GIVE_DEFAULTS.ctaHref),
      }
    : GIVE_DEFAULTS;

  return { hero: heroContent, mission, meetGrowServe, nt26, give };
}

/** Split a sentence into segments, marking meet/grow/serve (whole words) for teal emphasis. */
function emphasizeVerbs(sentence: string): MissionSegment[] {
  const parts = sentence.split(/\b(meet|grow|serve)\b/gi);
  return parts
    .filter((p) => p !== "")
    .map((p) => (/^(meet|grow|serve)$/i.test(p) ? { text: p, em: true } : { text: p }));
}
