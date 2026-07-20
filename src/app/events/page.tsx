import type { Metadata } from "next";
import Image from "next/image";
import { assetPath } from "@/lib/asset-path";
import { getCMSPage } from "@/lib/cms";
import { tx, imgCss } from "@/lib/home-content";
import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";
import LiveCalendar from "@/components/events/LiveCalendar";
import UpcomingEventsLive from "@/components/events/UpcomingEventsLive";

export const metadata: Metadata = {
  title: "Events",
  description:
    "What's on at Celebration Community Church — upcoming events, gatherings, and the full C3 calendar across both campuses.",
};

export default async function EventsPage() {
  const ov = (await getCMSPage("/events")) || {};
  const t = ov.text || {};
  const media = ov.media || {};

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────── */}
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
          <p
            className="overline mb-5"
            style={{ color: "#1cc3af" }}
            data-cms="t:events-hero-eyebrow"
            dangerouslySetInnerHTML={{ __html: tx(t, "events-hero-eyebrow", "What's On") }}
          />
          <h1
            className="display-1 text-white text-balance"
            data-cms="t:events-hero-heading"
            dangerouslySetInnerHTML={{ __html: tx(t, "events-hero-heading", "There&rsquo;s always something happening.") }}
          />
          <p
            className="body-lg mt-5 max-w-xl"
            style={{ color: "rgba(255,255,255,0.68)" }}
            data-cms="t:events-hero-body"
            dangerouslySetInnerHTML={{
              __html: tx(
                t,
                "events-hero-body",
                "From baptisms to serve days to student nights &mdash; here&rsquo;s what&rsquo;s coming up across both campuses."
              ),
            }}
          />
        </div>
      </section>

      {/* ── Upcoming events (EventCard grid — real images, EV1) ───── */}
      <Section tone="dark" container>
        <SectionHeader
          align="center"
          style={{ marginBottom: "var(--space-block)" }}
          eyebrow={
            <span
              style={{ color: "#1cc3af" }}
              data-cms="t:events-eyebrow"
              dangerouslySetInnerHTML={{ __html: tx(t, "events-eyebrow", "Mark your calendar") }}
            />
          }
          title={
            <span
              data-cms="t:events-heading"
              dangerouslySetInnerHTML={{ __html: tx(t, "events-heading", "Upcoming Events") }}
            />
          }
        />
        <UpcomingEventsLive />
      </Section>

      {/* ── Full calendar (real eSpace widget — EV2/Wave 3 prettifies) ──
          EV/redesign: the "Open full calendar" CTA (a link out to the eSpace
          FullMonth widget) is intentionally DROPPED — its role is replaced by the
          per-event "Add to calendar" control on the upcoming-events cards above.
          The live calendar feed itself stays. */}
      <Section tone="white" container>
        <SectionHeader
          style={{ maxWidth: "40rem", marginBottom: "var(--space-block)" }}
          eyebrow={
            <span
              style={{ color: "var(--color-teal-deep)" }}
              data-cms="t:events-cal-eyebrow"
              dangerouslySetInnerHTML={{ __html: tx(t, "events-cal-eyebrow", "The full picture") }}
            />
          }
          title={
            <span
              data-cms="t:events-cal-heading"
              dangerouslySetInnerHTML={{ __html: tx(t, "events-cal-heading", "The C3 calendar") }}
            />
          }
          lead={
            <span
              data-cms="t:events-cal-body"
              dangerouslySetInnerHTML={{
                __html: tx(t, "events-cal-body", "Every service, class, and gathering &mdash; browse the live church calendar below."),
              }}
            />
          }
        />

        <LiveCalendar />
      </Section>
      {/* EV3 / G2: terminal newcomers CTA removed — the Footer is the site-wide CTA. */}
    </>
  );
}
