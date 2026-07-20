import type { Metadata } from "next";
import { getCMSPage } from "@/lib/cms";
import { parseSections, type SectionMeta } from "@/lib/home-content";
import PageComposer from "@/components/cms/PageComposer";
import JoinPanel from "@/components/visit/JoinPanel";
import VisitPlan from "@/components/visit/VisitPlan";
import VisitLocation from "@/components/visit/VisitLocation";

export const metadata: Metadata = {
  title: "Plan Your Visit",
  description:
    "Everything you need to know before your first visit to Celebration Community Church in Hays or Colby, Kansas — service times, what to expect, and how to find us.",
};

/**
 * /visit — rebuilt to the editor-editable SECTION contract (Phase-4).
 *
 * Composed via <PageComposer> from THREE editor-native sections whose ids match
 * c3-backend `defaultSectionsForSlug("/visit")` verbatim:
 *   • visit-hero     → <JoinPanel>     (logo/socials + service times + Directions)
 *   • visit-plan     → <VisitPlan>     (What to Expect / Come As You Are / Bring Kids)
 *   • visit-location → <VisitLocation> (lean "Get directions" locations block)
 *
 * PageComposer wraps each visible section in `<div data-section={id}>` and injects
 * the scoped per-section/per-tile background stylesheet, so the editor rail can
 * add / reorder / hide / recolor these sections. Every card carries its own
 * data-cms-bg, every heading/body is a <Tx>, and every button is an editable link.
 *
 * REMOVED per product tweak: the "coming this weekend" CCB-form CTA, and the
 * "Browse The C3 Weekly" block (now its OWN page at /news — The C3 Weekly).
 *
 * Server component; reads PUBLISHED CMS overrides (export-safe, no preview branch).
 */
const PAGE_DEFAULT_SECTIONS: SectionMeta[] = [
  { id: "visit-hero", visible: true },
  { id: "visit-plan", visible: true },
  { id: "visit-location", visible: true },
];

export default async function VisitPage() {
  const ov = (await getCMSPage("/visit")) || {};
  const t = ov.text || {};
  const sections = parseSections(ov.sections, PAGE_DEFAULT_SECTIONS);

  const render = (id: string): React.ReactNode => {
    switch (id) {
      case "visit-hero": return <JoinPanel t={t} />;
      case "visit-plan": return <VisitPlan t={t} />;
      case "visit-location": return <VisitLocation t={t} />;
      default: return null;
    }
  };

  const known = new Set(["visit-hero", "visit-plan", "visit-location"]);
  const visible = sections.filter((s) => known.has(s.id));

  return <PageComposer sections={visible} bgFill={ov.bgFill} anim={ov.anim} render={render} />;
}
