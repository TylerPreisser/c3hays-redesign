import type { Metadata } from "next";
import { getPageContent } from "@/lib/cms";
import { isCmsLive } from "@/lib/cms-live";
import { parseSections, type SectionMeta } from "@/lib/home-content";
import PageComposer from "@/components/cms/PageComposer";
import GiveHero from "./GiveHero";
import GiveImpact from "./GiveImpact";
import GiveWays from "./GiveWays";

export const metadata: Metadata = {
  title: "Give",
  description:
    "Your giving is changing the world. Support the work of Celebration Community Church — online through Pushpay, by cash or check, or in the C3 app.",
};

/**
 * Canonical /give composition — matches c3-backend `defaultSectionsForSlug("/give")`
 * verbatim so the editor rail (SectionDock) can add / reorder / hide / recolor these
 * sections. Persisted `ov.sections` (when the page has been edited) overrides this.
 */
const PAGE_DEFAULT_SECTIONS: SectionMeta[] = [
  { id: "give-hero", visible: true },
  { id: "give-impact", visible: true },
  { id: "give-ways", visible: true },
];

/**
 * /give — rebuilt editor-native (contract §1–§3). Every section is a
 * `<div data-section>` (rail-eligible, per-section bg), every tile owns a
 * `data-cms-bg`, every heading/body is a `<Tx>`, and every button is a labelled
 * `<EditableLink>`. Content is ONLY the real celebratejesus.org /give copy +
 * the real Pushpay giving destinations (nothing invented; the old $-motif tiles
 * are gone). Composed through the shared PageComposer, same as home.
 */
export default async function GivePage({
  searchParams,
}: {
  // Preview mode (U6): the editor iframe carries `?cmsEdit=1&preview=<token>`.
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Only read searchParams in the CMS_LIVE server runtime — in the static-export
  // build reading them forces dynamic rendering and breaks `output: export`.
  const cmsLive = isCmsLive();
  const sp = cmsLive && searchParams ? await searchParams : {};
  const preview = typeof sp.preview === "string" ? sp.preview : undefined;

  const ov = (await getPageContent("/give", preview)) || {};
  const t = ov.text || {};
  const media = ov.media || {};
  const img = ov.img || {};

  // Editor-persisted order/visibility/bg, else the canonical default composition.
  const sections = parseSections(ov.sections, PAGE_DEFAULT_SECTIONS);

  const render = (id: string): React.ReactNode => {
    switch (id) {
      case "give-hero":
        return <GiveHero t={t} media={media} img={img} />;
      case "give-impact":
        return <GiveImpact t={t} />;
      case "give-ways":
        return <GiveWays t={t} />;
      default:
        return null;
    }
  };

  return <PageComposer sections={sections} bgFill={ov.bgFill} anim={ov.anim} render={render} />;
}
