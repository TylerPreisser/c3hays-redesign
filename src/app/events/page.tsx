import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, ArrowUpRight } from "lucide-react";
import { assetPath } from "@/lib/asset-path";
import { getCMSPage } from "@/lib/cms";
import { tx, imgCss } from "@/lib/home-content";
import EventsStrip from "@/components/home/EventsStrip";

export const metadata: Metadata = {
  title: "Events",
  description:
    "What's on at Celebration Community Church — upcoming events, gatherings, and the full C3 calendar across both campuses.",
};

/* Real full-calendar surface from the content inventory: the church's live eSpace
   calendar widget (the /calendar page embeds exactly this). */
const ESPACE_CALENDAR =
  "https://app.espace.cool/clientApi/FullMonth/16599?calendarId=1774&categories=54054,50192,50191,50194,50193,50200,50195,50198,50196,50197,50199,54053&locationId=126482";

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

      {/* ── Upcoming events (reuses the editable EventsStrip) ────── */}
      <EventsStrip text={t} variant={t["events-variant"] || "cards"} />

      {/* ── Full calendar (real eSpace widget) ───────────────────── */}
      <section className="section" style={{ backgroundColor: "#ffffff" }}>
        <div className="container-c3">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p
                className="overline mb-4"
                style={{ color: "#1cc3af" }}
                data-cms="t:events-cal-eyebrow"
                dangerouslySetInnerHTML={{ __html: tx(t, "events-cal-eyebrow", "The full picture") }}
              />
              <h2
                className="display-2"
                style={{ color: "#1b1c1c" }}
                data-cms="t:events-cal-heading"
                dangerouslySetInnerHTML={{ __html: tx(t, "events-cal-heading", "The C3 calendar") }}
              />
              <p
                className="body-lg mt-4"
                style={{ color: "rgba(27,28,28,0.6)" }}
                data-cms="t:events-cal-body"
                dangerouslySetInnerHTML={{
                  __html: tx(t, "events-cal-body", "Every service, class, and gathering &mdash; browse the live church calendar below."),
                }}
              />
            </div>
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
        </div>
      </section>

      {/* ── CTA: newcomers ───────────────────────────────────────── */}
      <section className="section" style={{ backgroundColor: "#1b1c1c" }}>
        <div className="container-c3 text-center" style={{ maxWidth: 620 }}>
          <span
            className="inline-flex items-center justify-center mx-auto"
            style={{ width: 56, height: 56, borderRadius: 16, marginBottom: "1.5rem", background: "rgba(28,195,175,0.14)", color: "#1cc3af" }}
          >
            <CalendarDays size={26} />
          </span>
          <h2
            className="display-2 text-white mb-4"
            data-cms="t:events-cta-heading"
            dangerouslySetInnerHTML={{ __html: tx(t, "events-cta-heading", "New here? Come as you are.") }}
          />
          <p
            className="body-lg mb-8"
            style={{ color: "rgba(255,255,255,0.66)" }}
            data-cms="t:events-cta-body"
            dangerouslySetInnerHTML={{
              __html: tx(t, "events-cta-body", "Let us know you&rsquo;re coming and we&rsquo;ll have someone ready to welcome you."),
            }}
          />
          <Link href={t["events-cta-href"] || "/connect/"} className="btn btn-primary btn-lg" data-cms-link="events-cta">
            <span data-cms-link-label>{tx(t, "events-cta-label", "Plan your visit")}</span>
          </Link>
        </div>
      </section>
    </>
  );
}
