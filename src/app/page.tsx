import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import MissionBlock from "@/components/home/MissionBlock";
import MeetGrowServe from "@/components/home/MeetGrowServe";
import NT26Feature from "@/components/home/NT26Feature";
import LocationsSection from "@/components/home/LocationsSection";
import StayConnected from "@/components/home/StayConnected";
import GiveSection from "@/components/home/GiveSection";
import PromoBanner from "@/components/home/PromoBanner";
import { getHomeContent } from "@/lib/cms";
import { isCmsLive } from "@/lib/cms-live";
import { fromStudioHome } from "@/lib/home-content";
import PageComposer from "@/components/cms/PageComposer";
import { assetPath } from "@/lib/asset-path";
import { isExampleSection, renderExample, SECTION_EXAMPLE_IDS } from "@/lib/section-examples";

// Finding 2: force per-request render so the editor's ?preview token is always read
// and the (binding-fetched) DRAFT reflects. Without this the SSR response was served
// cached → edits "disappeared" on reload even though getHomeContent(preview) returns
// the draft. Public traffic still fetches PUBLISHED per request (CMS drives the site).
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Celebration Community Church | Welcome Home.",
  description:
    "A church family in Hays and Colby, Kansas — for everyone, just as you are. Services Saturday and Sunday.",
};

/**
 * The hand-built campus-chooser homepage is the SOURCE OF TRUTH. C3 Studio (the
 * CMS) only feeds CONTENT into these exact components — it never replaces them.
 * Section ORDER + VISIBILITY + BACKGROUND come from `c.sections`, so dragging a
 * card / hiding a section / recoloring it in C3 Studio is a real edit here.
 */
export default async function HomePage({
  searchParams,
}: {
  // Preview mode (U6): the editor iframe carries `?cmsEdit=1&preview=<token>`.
  // A tokenless/public request never receives a token here, so it never gets draft.
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Preview only exists in the CMS_LIVE server runtime. In the static-export build
  // CMS_LIVE is unset, so we must NOT read searchParams (that forces dynamic
  // rendering and breaks `output: export`). Export ⇒ published, byte-identical.
  const cmsLive = isCmsLive();
  const sp = cmsLive && searchParams ? await searchParams : {};
  const preview = typeof sp.preview === "string" ? sp.preview : undefined;
  const c = fromStudioHome(await getHomeContent(preview));

  // HOME continuous image (item 2) — hero + mission are ONE seamless background image,
  // driven by the GENERALIZABLE `bgSpan` feature (no CSS hack, no seam). This is only
  // correct when a classic hero sits IMMEDIATELY above a centered mission in the visible
  // order — so hiding or reordering either one gracefully falls back to their independent
  // looks (hero paints its own photo; mission goes solid dark), never a duplicated or
  // orphaned image. When continuous: the hero SECTION carries the shared hero.bg image as
  // its section bg with bgSpan:1, and PageComposer paints that one image behind BOTH
  // sections (both render transparent). buildBgCss/PageComposer clamp the span to the
  // available visible sections, so a hidden/reordered mission degrades safely.
  const visOrder = c.sections.filter((s) => s.visible);
  const hIdx = visOrder.findIndex((s) => s.id === "hero");
  const mIdx = visOrder.findIndex((s) => s.id === "mission");
  const heroVar = hIdx >= 0 ? visOrder[hIdx].variant : undefined;
  const missionVar = mIdx >= 0 ? visOrder[mIdx].variant : undefined;
  const heroMissionContinuous =
    hIdx >= 0 &&
    mIdx === hIdx + 1 &&
    (!heroVar || heroVar === "classic") &&
    (!missionVar || missionVar === "centered");

  // Each section id → the component for it, given its chosen style `variant`.
  // Wrapped in <div data-section> so a per-section background can be painted.
  const render = (id: string, variant?: string): React.ReactNode => {
    switch (id) {
      case "hero": return <Hero content={c.hero} btnStyle={c.btn["hero.cta"]} text={c.text} btn={c.btn} variant={variant} continuous={heroMissionContinuous} />;
      // In continuous mode both hero and mission render TRANSPARENT (with their own
      // scrims) so PageComposer's single span-layer image shows through as one seamless
      // photo. Standalone (not continuous) → mission is solid dark. The image itself is
      // no longer bled from here; it lives as the hero section's bg (see `sections`).
      case "mission": return <MissionBlock content={c.mission} variant={variant} bleed={c.fx?.sectionBleed} continuous={heroMissionContinuous} />;
      case "meetGrowServe": return <MeetGrowServe content={c.meetGrowServe} img={c.img} variant={variant} />;
      case "nt26": return <NT26Feature content={c.nt26} btnStyle={c.btn["nt26.cta"]} img={c.img} variant={variant} bleed={c.fx?.sectionBleed} />;
      case "locations": return <LocationsSection text={c.text} btn={c.btn} />;
      case "stayConnected": return <StayConnected content={c.stayConnected} text={c.text} icon={c.icon} btn={c.btn} variant={variant} />;
      case "give": return <GiveSection />;
      case "promo": return <PromoBanner text={c.text} btnStyle={c.btn["promo.cta"]} variant={variant} />;
      // New addable example sections (R3 library) render from the shared registry.
      default: return isExampleSection(id) ? renderExample(id, c, variant) : null;
    }
  };

  // Home is now the REFERENCE implementation of the generic PageComposer. It keeps
  // its own `known` allow-list (home renders only these ids) BEFORE handing the
  // list to the composer — the composer applies the visible-filter + buildBgCss.
  // EditBridge is mounted globally in layout.tsx.
  const known = new Set([
    "hero", "mission", "meetGrowServe", "nt26", "locations", "stayConnected", "give", "promo",
    ...SECTION_EXAMPLE_IDS,
  ]);
  // In continuous mode, express the hero→mission seamless image via the bgSpan feature:
  // give the HERO section the shared photo as its section bg and span it over the next 1
  // visible section (mission). PageComposer renders that as ONE continuous image; an
  // editor-set hero section bg is respected (only derive when none is set), so the photo
  // stays swappable via both hero.bgImage content and the section-bg control.
  const sections = c.sections
    .filter((s) => known.has(s.id))
    .map((s) =>
      heroMissionContinuous && s.id === "hero"
        ? { ...s, bg: s.bg ?? `url("${assetPath(c.hero.bgImage)}") center / cover no-repeat`, bgSpan: 1 }
        : s,
    );

  return <PageComposer sections={sections} bgFill={c.bgFill} anim={c.anim} render={render} />;
}
