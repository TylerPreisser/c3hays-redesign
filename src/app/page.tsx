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
import { fromStudioHome } from "@/lib/home-content";
import { isExampleSection, renderExample, SECTION_EXAMPLE_IDS } from "@/lib/section-examples";

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
  const cmsLive = process.env.CMS_LIVE === "1";
  const sp = cmsLive && searchParams ? await searchParams : {};
  const preview = typeof sp.preview === "string" ? sp.preview : undefined;
  const c = fromStudioHome(await getHomeContent(preview));

  // Each section id → the component for it, given its chosen style `variant`.
  // Wrapped in <div data-section> so a per-section background can be painted.
  const render = (id: string, variant?: string): React.ReactNode => {
    switch (id) {
      case "hero": return <Hero content={c.hero} btnStyle={c.btn["hero.cta"]} text={c.text} btn={c.btn} variant={variant} />;
      case "mission": return <MissionBlock content={c.mission} variant={variant} />;
      case "meetGrowServe": return <MeetGrowServe content={c.meetGrowServe} img={c.img} variant={variant} />;
      case "nt26": return <NT26Feature content={c.nt26} btnStyle={c.btn["nt26.cta"]} img={c.img} variant={variant} />;
      case "locations": return <LocationsSection text={c.text} btn={c.btn} />;
      case "stayConnected": return <StayConnected content={c.stayConnected} text={c.text} icon={c.icon} variant={variant} />;
      case "give": return <GiveSection />;
      case "promo": return <PromoBanner text={c.text} btnStyle={c.btn["promo.cta"]} variant={variant} />;
      // New addable example sections (R3 library) render from the shared registry.
      default: return isExampleSection(id) ? renderExample(id, c, variant) : null;
    }
  };

  const known = new Set([
    "hero", "mission", "meetGrowServe", "nt26", "locations", "stayConnected", "give", "promo",
    ...SECTION_EXAMPLE_IDS,
  ]);
  const visible = c.sections.filter((s) => s.visible && known.has(s.id));
  // Per-section background overrides → a single scoped stylesheet (no component edits).
  const bgCss = c.sections
    .filter((s) => s.visible && s.bg)
    .map((s) => `[data-section="${s.id}"]>*{background-color:${s.bg} !important}`)
    .join("");

  return (
    <>
      {/* EditBridge is mounted globally in layout.tsx now. */}
      {bgCss && <style dangerouslySetInnerHTML={{ __html: bgCss }} />}
      {visible.map((s) => (
        <div key={s.id} data-section={s.id}>
          {render(s.id, s.variant)}
        </div>
      ))}
    </>
  );
}
