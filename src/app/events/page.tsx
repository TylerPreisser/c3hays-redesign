import type { Metadata } from "next";
import Image from "next/image";
import { assetPath } from "@/lib/asset-path";
import { getPageContent } from "@/lib/cms";
import { isCmsLive } from "@/lib/cms-live";
import { imgCss, parseSections, type SectionMeta } from "@/lib/home-content";
import { Tx } from "@/components/cms/Editable";
import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";
import PageComposer from "@/components/cms/PageComposer";
import LiveCalendar from "@/components/events/LiveCalendar";
import UpcomingEventsLive from "@/components/events/UpcomingEventsLive";
import UpcomingEventsAuthored from "@/components/events/UpcomingEventsAuthored";
import { parseEventCards } from "@/components/events/events-content";

export const metadata: Metadata = {
  title: "Events",
  description:
    "What's on at Celebration Community Church — upcoming events, gatherings, and the full C3 calendar across both campuses.",
};

/**
 * Canonical section order for /events — MUST match c3-backend
 * `defaultSectionsForSlug("/events")` = ["events-hero","events-upcoming","events-calendar"].
 * The editor rail (SectionDock) can add/reorder/hide/recolor from here once the page
 * persists its own `sections` list; PageComposer emits the `<div data-section>`
 * wrappers + scoped background stylesheet.
 */
const PAGE_DEFAULT_SECTIONS: SectionMeta[] = [
  { id: "events-hero", visible: true },
  { id: "events-upcoming", visible: true },
  { id: "events-calendar", visible: true },
];

/**
 * /events — now editor-native. The hand-built look is preserved, but every section
 * is composed through <PageComposer> (Layer 2) and every tile/text/link is a
 * Layer-1 handle. The embedded eSpace calendar (<LiveCalendar>) is kept as-is —
 * Tyler likes it. The upcoming-events cards, previously non-editable by construction
 * (EventCard rendered without a `cmsKey`), are now fully editable via
 * <UpcomingEventsLive> → <UpcomingEventsGrid>.
 */
export default async function EventsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Finding 2: forward the editor's ?preview token under CMS_LIVE so the editor
  // preview reflects DRAFT (published in export / public).
  const cmsLive = isCmsLive();
  const sp = cmsLive && searchParams ? await searchParams : {};
  const preview = typeof sp.preview === "string" ? sp.preview : undefined;
  const ov = (await getPageContent("/events", preview)) || {};
  const t = ov.text || {};
  const media = ov.media || {};
  const sections = parseSections(ov.sections, PAGE_DEFAULT_SECTIONS);
  // Authored cards (round-2) OVERRIDE the live eSpace feed when present; absent ⇒ the
  // live island keeps auto-populating (live-by-default). See events-content.ts.
  const authoredCards = parseEventCards(ov);

  const render = (id: string): React.ReactNode => {
    switch (id) {
      // ── Hero ──────────────────────────────────────────────────────
      case "events-hero":
        return (
          <section
            className="relative flex items-end overflow-hidden"
            style={{ minHeight: "52vh" }}
          >
            <div className="absolute inset-0" data-cms-img="events-hero-img">
              <Image
                src={assetPath(media["events-hero-img"] || "/images/community.webp")}
                alt="C3 gathering together"
                fill
                priority
                sizes="100vw"
                className="object-cover"
                style={imgCss(ov.img?.["events-hero-img"])}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(10,10,10,0.32) 0%, rgba(10,10,10,0.5) 50%, rgba(10,10,10,0.9) 100%)",
                }}
              />
            </div>
            <div className="relative z-10 container-c3 pb-16 pt-44">
              <Tx
                as="p"
                text={t}
                k="events-hero-eyebrow"
                fallback="What&rsquo;s On"
                className="overline mb-5"
                style={{ color: "#1cc3af" }}
              />
              <Tx
                as="h1"
                text={t}
                k="events-hero-heading"
                fallback="There&rsquo;s always something happening."
                className="display-1 text-white text-balance"
              />
              <Tx
                as="p"
                text={t}
                k="events-hero-body"
                fallback="From baptisms to serve days to student nights &mdash; here&rsquo;s what&rsquo;s coming up across both campuses."
                className="body-lg mt-5 max-w-xl"
                style={{ color: "rgba(255,255,255,0.68)" }}
              />
            </div>
          </section>
        );

      // ── Upcoming events (live eSpace feed, now editor-native cards) ─
      case "events-upcoming":
        return (
          <Section tone="dark" container>
            <SectionHeader
              align="center"
              style={{ marginBottom: "var(--space-block)" }}
              eyebrow={
                <Tx text={t} k="events-eyebrow" fallback="Mark your calendar" style={{ color: "#1cc3af" }} />
              }
              title={<Tx text={t} k="events-heading" fallback="Upcoming Events" />}
            />
            {authoredCards.length > 0 ? (
              <UpcomingEventsAuthored cards={authoredCards} text={t} media={media} />
            ) : (
              <UpcomingEventsLive text={t} media={media} />
            )}
          </Section>
        );

      // ── Full calendar (real eSpace widget — kept as-is) ────────────
      //  The "Open full calendar" CTA is intentionally DROPPED — its role is replaced
      //  by the per-event "Add to calendar" control on the upcoming cards above. The
      //  live calendar feed itself stays.
      case "events-calendar":
        return (
          <Section tone="white" container>
            <SectionHeader
              style={{ maxWidth: "40rem", marginBottom: "var(--space-block)" }}
              eyebrow={
                <Tx text={t} k="events-cal-eyebrow" fallback="The full picture" style={{ color: "var(--color-teal-deep)" }} />
              }
              title={<Tx text={t} k="events-cal-heading" fallback="The C3 calendar" />}
              lead={
                <Tx
                  text={t}
                  k="events-cal-body"
                  fallback="Every service, class, and gathering &mdash; browse the live church calendar below."
                />
              }
            />
            <LiveCalendar />
          </Section>
        );

      default:
        return null;
    }
  };

  return <PageComposer sections={sections} bgFill={ov.bgFill} anim={ov.anim} render={render} />;
}
