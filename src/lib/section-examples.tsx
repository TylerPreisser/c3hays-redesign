/**
 * SECTION EXAMPLE LIBRARY (Website Editor v2, R3) — the c3hays half of the shared
 * section-library contract.
 *
 * This is the SINGLE SOURCE OF TRUTH on the site side for the *addable*, generic
 * example sections: what they're called, their variants, and how to render one
 * from published/draft HomeContent. It is the mirror of c3-backend's
 * HOME_SECTION_DEFS / SECTION_VARIANTS / SECTION_THUMBNAILS — the two ends share
 * ONE key space (the `id`, and `${id}:${variant}` for variant-scoped assets).
 *
 * Rules that keep the two repos in lock-step:
 *   • `id` values are camelCase and MUST match c3-backend's def keys verbatim.
 *   • Every example renders purely from the generic override maps already on
 *     HomeContent (text / btn / img / icon) — no bespoke typed fields — so adding
 *     a new example never requires a HomeContent shape change (nothing to break
 *     for existing published content).
 *   • The shoot harness (scripts/shoot-sections.mjs) enumerates these ids/variants
 *     to produce the thumbnail assets + the SECTION_THUMBNAILS map c3-backend commits.
 */
import type { HomeContent } from "@/lib/home-content";
import ServiceTimes from "@/components/home/ServiceTimes";
import SermonFeature from "@/components/home/SermonFeature";
import EventsStrip from "@/components/home/EventsStrip";
import MinistriesGrid from "@/components/home/MinistriesGrid";
import StaffGrid from "@/components/home/StaffGrid";
import Testimonial from "@/components/home/Testimonial";
import FaqAccordion from "@/components/home/FaqAccordion";
import StatsBand from "@/components/home/StatsBand";
import NextSteps from "@/components/home/NextSteps";
import ScriptureVerse from "@/components/home/ScriptureVerse";
import PromoBanner from "@/components/home/PromoBanner";
// v5 R2: the six CORE home sections, so the shoot harness can render REAL previews
// for them (they were icon-only in v4). These render from typed HomeContent fields,
// IDENTICAL to how src/app/page.tsx renders the live homepage.
import Hero from "@/components/home/Hero";
import MissionBlock from "@/components/home/MissionBlock";
import MeetGrowServe from "@/components/home/MeetGrowServe";
import NT26Feature from "@/components/home/NT26Feature";
import LocationsSection from "@/components/home/LocationsSection";
import StayConnected from "@/components/home/StayConnected";
import GiveSection from "@/components/home/GiveSection";

export interface VariantDef { key: string; label: string }
export interface SectionExampleDef {
  id: string;
  label: string;
  /** lucide-react icon name — icon fallback in the editor when no thumbnail yet. */
  icon: string;
  description: string;
  /** Editor "group"/category the section is filed under. */
  group: string;
  variants: VariantDef[];
}

/**
 * The addable example sections. `variants[0]` is the default (matches each
 * component's own default when `variant` is undefined). Keep in sync with
 * c3-backend HOME_SECTION_DEFS.
 */
export const SECTION_EXAMPLES: SectionExampleDef[] = [
  // v5 R2 — the six CORE home sections. `variants: []` → the shoot harness renders
  // ONE real preview per id (their editor default look); renderExample feeds them
  // exactly the props src/app/page.tsx uses, so the thumbnail matches the live page.
  { id: "hero", label: "Hero", icon: "PanelTop", group: "Core", description: "Full-bleed welcome with headline and call to action.", variants: [{ key: "classic", label: "Full-bleed Cinematic" }, { key: "split", label: "Editorial Split" }, { key: "minimal", label: "Centered Statement" }] },
  { id: "mission", label: "Mission statement", icon: "Quote", group: "Core", description: "One emphasized sentence — your why.", variants: [] },
  { id: "meetGrowServe", label: "Find your place", icon: "LayoutGrid", group: "Core", description: "A grid of tiles linking people to next steps.", variants: [{ key: "cards", label: "3-up Feature Cards" }, { key: "bento", label: "Bento Grid" }, { key: "list", label: "Editorial List" }] },
  { id: "nt26", label: "Bible reading feature", icon: "BookOpen", group: "Core", description: "Split feature with image, heading and CTA.", variants: [{ key: "imageRight", label: "Media Right" }, { key: "imageLeft", label: "Media Left" }, { key: "stacked", label: "Centered Stack" }] },
  { id: "locations", label: "Our churches", icon: "MapPin", group: "Core", description: "Campus cards with service times and directions.", variants: [] },
  { id: "stayConnected", label: "Get in Touch", icon: "Mail", group: "Core", description: "Contact cards with recolorable icons.", variants: [] },
  { id: "serviceTimes", label: "Service Times", icon: "Clock", group: "Visit", description: "When & where you gather — campuses and weekend times.", variants: [{ key: "cards", label: "Campus cards" }, { key: "band", label: "Centered band" }] },
  { id: "sermonFeature", label: "Message Spotlight", icon: "PlayCircle", group: "Media", description: "Feature this weekend's message with a play thumbnail.", variants: [{ key: "spotlight", label: "Spotlight" }, { key: "split", label: "Split" }] },
  { id: "eventsStrip", label: "Upcoming Events", icon: "CalendarDays", group: "Connect", description: "A short list of what's coming up, with dates.", variants: [{ key: "cards", label: "Cards" }, { key: "list", label: "Agenda list" }] },
  { id: "ministriesGrid", label: "Ministries", icon: "LayoutGrid", group: "Connect", description: "Tiles for Kids, Students, Groups, Worship and more.", variants: [{ key: "grid", label: "Grid" }, { key: "list", label: "List" }] },
  { id: "staffGrid", label: "Meet the Team", icon: "Users", group: "About", description: "Portrait cards for your leaders and staff.", variants: [{ key: "grid", label: "Portrait grid" }, { key: "row", label: "Avatar row" }] },
  { id: "testimonial", label: "Story / Quote", icon: "Quote", group: "About", description: "A member story or pull-quote in your church's voice.", variants: [{ key: "centered", label: "Centered" }, { key: "panel", label: "Accent panel" }] },
  { id: "faq", label: "Questions (FAQ)", icon: "HelpCircle", group: "Visit", description: "Answer the questions a first-time guest asks.", variants: [{ key: "list", label: "Accordion" }, { key: "split", label: "Intro + list" }] },
  { id: "statsBand", label: "Impact Numbers", icon: "BarChart3", group: "About", description: "A band of at-a-glance figures — campuses, groups, serving.", variants: [{ key: "band", label: "Teal band" }, { key: "cards", label: "Cards" }] },
  { id: "nextSteps", label: "Next Steps", icon: "Footprints", group: "Connect", description: "Guide guests through Visit → Connect → Grow → Serve.", variants: [{ key: "steps", label: "Numbered path" }, { key: "cards", label: "Action cards" }] },
  { id: "scriptureVerse", label: "Scripture", icon: "BookOpen", group: "Media", description: "A featured verse — pairs with the NT26 reading plan.", variants: [{ key: "centered", label: "Centered" }, { key: "left", label: "Editorial left" }] },
  { id: "promo", label: "Announcement", icon: "Megaphone", group: "Connect", description: "A bold promo band for an event, series, or season.", variants: [{ key: "band", label: "Band" }, { key: "split", label: "Split" }, { key: "centered", label: "Centered" }] },
];

/** All example ids (for the shoot harness + preview route param generation). */
export const SECTION_EXAMPLE_IDS = SECTION_EXAMPLES.map((s) => s.id);

/** Every shoot key: the id itself plus each `${id}:${variant}` (variant-scoped). */
export const SECTION_SHOOT_KEYS: string[] = SECTION_EXAMPLES.flatMap((s) => [s.id, ...s.variants.map((v) => `${s.id}:${v.key}`)]);

/** True when `id` is one of the generic example sections handled by renderExample. */
export const isExampleSection = (id: string): boolean => SECTION_EXAMPLE_IDS.includes(id);

/**
 * Render one example section from HomeContent's generic override maps. Used by the
 * homepage renderer AND the /section-preview shoot route so a section looks
 * IDENTICAL in the library thumbnail and on the live page.
 */
export function renderExample(id: string, c: HomeContent, variant?: string): React.ReactNode {
  switch (id) {
    // v5 R2 — CORE home sections, rendered EXACTLY as src/app/page.tsx renders them
    // (same typed fields + prop wiring) so the shoot thumbnail equals the live look.
    case "hero": return <Hero content={c.hero} btnStyle={c.btn["hero.cta"]} text={c.text} btn={c.btn} variant={variant} />;
    case "mission": return <MissionBlock content={c.mission} variant={variant} bleed={c.fx?.sectionBleed} />;
    case "meetGrowServe": return <MeetGrowServe content={c.meetGrowServe} img={c.img} variant={variant} />;
    case "nt26": return <NT26Feature content={c.nt26} btnStyle={c.btn["nt26.cta"]} img={c.img} variant={variant} bleed={c.fx?.sectionBleed} />;
    case "locations": return <LocationsSection text={c.text} btn={c.btn} />;
    case "stayConnected": return <StayConnected content={c.stayConnected} text={c.text} icon={c.icon} btn={c.btn} variant={variant} />;
    // `give` is a CORE homepage section (rendered directly in page.tsx, never via the
    // isExampleSection default branch). It's registered here ONLY so the LIVE
    // /section-preview route can render a true thumbnail for it like every other card.
    case "give": return <GiveSection />;
    case "serviceTimes": return <ServiceTimes text={c.text} btnStyle={c.btn["svc.cta"]} variant={variant} />;
    case "sermonFeature": return <SermonFeature text={c.text} img={c.img} btnStyle={c.btn["sermon.cta"]} variant={variant} />;
    case "eventsStrip": return <EventsStrip text={c.text} btnStyle={c.btn["events.cta"]} variant={variant} />;
    case "ministriesGrid": return <MinistriesGrid text={c.text} icon={c.icon} variant={variant} />;
    case "staffGrid": return <StaffGrid text={c.text} img={c.img} variant={variant} />;
    case "testimonial": return <Testimonial text={c.text} variant={variant} bleed={c.fx?.sectionBleed} />;
    case "faq": return <FaqAccordion text={c.text} variant={variant} />;
    case "statsBand": return <StatsBand text={c.text} variant={variant} bleed={c.fx?.sectionBleed} />;
    case "nextSteps": return <NextSteps text={c.text} icon={c.icon} variant={variant} />;
    case "scriptureVerse": return <ScriptureVerse text={c.text} variant={variant} />;
    case "promo": return <PromoBanner text={c.text} btnStyle={c.btn["promo.cta"]} variant={variant} />;
    default: return null;
  }
}
