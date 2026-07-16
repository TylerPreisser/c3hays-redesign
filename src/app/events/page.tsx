import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { assetPath } from "@/lib/asset-path";
import { getCMSPage } from "@/lib/cms";
import { tx, imgCss } from "@/lib/home-content";
import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";
import EventCard from "@/components/events/EventCard";

export const metadata: Metadata = {
  title: "Events",
  description:
    "What's on at Celebration Community Church — upcoming events, gatherings, and the full C3 calendar across both campuses.",
};

/* Real full-calendar surface from the content inventory: the church's live eSpace
   calendar widget (the /calendar page embeds exactly this). EV2 (Wave 3) will
   convert this feed into a prettier on-theme calendar; the iframe stays for now. */
const ESPACE_CALENDAR =
  "https://app.espace.cool/clientApi/FullMonth/16599?calendarId=1774&categories=54054,50192,50191,50194,50193,50200,50195,50198,50196,50197,50199,54053&locationId=126482";

/* Upcoming events — editable in place via `events-<k>-*` CMS text hooks (same
   convention as the shared EventsStrip) plus a real image per event (EV1). The
   image falls back to a tasteful gradient inside EventCard, never a grey box. */
const UPCOMING = [
  {
    k: "a",
    month: "JUL",
    day: "20",
    title: "Baptism Sunday",
    detail: "Both services &bull; Take your next step",
    campus: "Both campuses",
    image: "/images/worship.webp",
  },
  {
    k: "b",
    month: "JUL",
    day: "26",
    title: "Youth Summer Night",
    detail: "Fri 7:00pm &bull; Grades 6&ndash;12",
    campus: "Hays campus",
    image: "/images/gather.webp",
  },
  {
    k: "c",
    month: "AUG",
    day: "03",
    title: "Newcomers Lunch",
    detail: "After 11:00am &bull; Meet the team",
    campus: "Both campuses",
    image: "/images/community.webp",
  },
];

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
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "clamp(1.25rem, 3vw, 2rem)",
            alignItems: "stretch",
          }}
        >
          {UPCOMING.map((e) => (
            <EventCard
              key={e.k}
              image={media[`events-${e.k}-img`] || e.image}
              imgCmsKey={`events-${e.k}-img`}
              href={t[`events-${e.k}-href`] || t["events.cta-href"] || "/connect/"}
              imageAlt={e.title}
              month={
                <span
                  data-cms={`t:events-${e.k}-month`}
                  dangerouslySetInnerHTML={{ __html: tx(t, `events-${e.k}-month`, e.month) }}
                />
              }
              day={
                <span
                  data-cms={`t:events-${e.k}-day`}
                  dangerouslySetInnerHTML={{ __html: tx(t, `events-${e.k}-day`, e.day) }}
                />
              }
              title={
                <span
                  data-cms={`t:events-${e.k}-title`}
                  dangerouslySetInnerHTML={{ __html: tx(t, `events-${e.k}-title`, e.title) }}
                />
              }
              detail={
                <span
                  data-cms={`t:events-${e.k}-detail`}
                  dangerouslySetInnerHTML={{ __html: tx(t, `events-${e.k}-detail`, e.detail) }}
                />
              }
              campus={
                <span
                  data-cms={`t:events-${e.k}-campus`}
                  dangerouslySetInnerHTML={{ __html: tx(t, `events-${e.k}-campus`, e.campus) }}
                />
              }
            />
          ))}
        </div>
      </Section>

      {/* ── Full calendar (real eSpace widget — EV2/Wave 3 prettifies) ── */}
      <Section tone="white" container>
        <div
          className="flex flex-wrap items-end justify-between gap-6"
          style={{ marginBottom: "var(--space-block)" }}
        >
          <SectionHeader
            style={{ maxWidth: "40rem" }}
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
          <a
            href={t["events-cal-href"] || ESPACE_CALENDAR}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
            data-cms-link="events-cal-cta"
          >
            <span data-cms-link-label>{tx(t, "events-cal-cta-label", "Open full calendar")}</span>
            <ArrowUpRight size={18} className="ml-1.5" />
          </a>
        </div>

        <div
          className="relative overflow-hidden"
          style={{
            borderRadius: "var(--radius-md)",
            border: "1px solid rgba(27,28,28,0.10)",
            background: "#f6f6f6",
          }}
        >
          <iframe
            src={t["events-cal-embed"] || ESPACE_CALENDAR}
            title="C3 Hays church calendar"
            style={{ width: "100%", height: 720, border: 0, display: "block" }}
          />
        </div>
      </Section>
      {/* EV3 / G2: terminal newcomers CTA removed — the Footer is the site-wide CTA. */}
    </>
  );
}
