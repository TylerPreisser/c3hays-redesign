import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { assetPath } from "@/lib/asset-path";
import { getCMSPage } from "@/lib/cms";
import { tx, imgCss } from "@/lib/home-content";
import MockLiveStream from "@/components/watch/MockLiveStream";

export const metadata: Metadata = {
  title: "Watch Live",
  description:
    "Watch Celebration Community Church live online. Services Saturday 5 PM and Sunday 8, 9:30, and 11 AM.",
};

const recentMessages = [
  {
    id: "watch-msg-0",
    defaultTitle: "The God Who Sees",
    defaultSeries: "Genesis",
    defaultDate: "April 27, 2026",
    image: "/images/worship.webp",
  },
  {
    id: "watch-msg-1",
    defaultTitle: "Faith Over Fear",
    defaultSeries: "Matthew",
    defaultDate: "April 20, 2026",
    image: "/images/congregation.webp",
  },
  {
    id: "watch-msg-2",
    defaultTitle: "What Love Looks Like",
    defaultSeries: "1 Corinthians 13",
    defaultDate: "April 13, 2026",
    image: "/images/gather.webp",
  },
];

export default async function WatchPage() {
  const ov = (await getCMSPage("/watch")) || {};
  const t = ov.text || {};
  const media = ov.media || {};

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section
        className="relative flex items-end overflow-hidden"
        style={{ minHeight: "60vh" }}
      >
        <div className="absolute inset-0" data-cms-img="watch-hero-img">
          <Image
            src={assetPath(media["watch-hero-img"] || "/images/gather.webp")}
            alt="C3 live worship service"
            fill
            className="object-cover"
            priority
            style={imgCss(ov.img?.["watch-hero-img"])}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(10,10,10,0.30) 0%, rgba(10,10,10,0.48) 50%, rgba(10,10,10,0.88) 100%)",
            }}
          />
        </div>

        <div className="relative z-10 container-c3 pb-20 pt-44">
          {/* Eyebrow */}
          <p
            className="overline mb-5"
            style={{ color: "#1cc3af" }}
            data-cms="t:watch-hero-eyebrow"
            dangerouslySetInnerHTML={{ __html: tx(t, "watch-hero-eyebrow", "Watch") }}
          />

          <h1
            className="display-1 text-white text-balance"
            data-cms="t:watch-hero-headline"
            dangerouslySetInnerHTML={{
              __html: tx(t, "watch-hero-headline", "Watch C3 Live"),
            }}
          />

          <p
            className="body-lg mt-5 max-w-xl"
            style={{ color: "rgba(255,255,255,0.65)" }}
            data-cms="t:watch-hero-subhead"
            dangerouslySetInnerHTML={{
              __html: tx(
                t,
                "watch-hero-subhead",
                "Join us online every weekend. Services stream live — and you can catch any past message on demand."
              ),
            }}
          />
        </div>
      </section>

      {/* ── Live player ──────────────────────────────────────────── */}
      <section
        style={{ backgroundColor: "#0a0a0a", paddingTop: "2.5rem", paddingBottom: "3.5rem" }}
      >
        <div className="container-c3">
          {/* Labeled MOCK live-stream adapter — zero external calls.
              Production swaps this for the real Vimeo/Mux embed. */}
          <MockLiveStream
            poster="/images/congregation.webp"
            isLive={false}
            nextService="Saturday · 5:00 PM"
          />

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={t["watch-vimeo-btn-href"] || "https://vimeo.com/c3hays"}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
              data-cms-link="watch-vimeo-btn"
            >
              <span data-cms-link-label>
                {tx(t, "watch-vimeo-btn-label", "Watch on Vimeo")}
              </span>
            </a>
            <Link
              href={t["watch-messages-btn-href"] || "/messages/"}
              className="btn btn-outline btn-sm"
              data-cms-link="watch-messages-btn"
            >
              <span data-cms-link-label>
                {tx(t, "watch-messages-btn-label", "Browse All Messages")}
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Service times ────────────────────────────────────────── */}
      <section
        className="py-20"
        style={{
          backgroundColor: "#1b1c1c",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="container-c3">
          {/* Section label */}
          <p
            className="overline mb-10"
            style={{ color: "#1cc3af" }}
            data-cms="t:watch-times-eyebrow"
            dangerouslySetInnerHTML={{
              __html: tx(t, "watch-times-eyebrow", "Service Times"),
            }}
          />

          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-0 max-w-2xl overflow-hidden"
            style={{
              border: "1px solid rgba(255,255,255,0.10)",
              borderRadius: "var(--radius-md)",
            }}
          >
            {/* Hays campus */}
            <div className="p-10 border-b border-white/10 md:border-b-0 md:border-r md:border-white/10">
              <p
                className="overline mb-6"
                style={{ color: "#1cc3af" }}
                data-cms="t:watch-times-hays-eyebrow"
                dangerouslySetInnerHTML={{
                  __html: tx(t, "watch-times-hays-eyebrow", "Hays"),
                }}
              />
              <div className="flex flex-col gap-2.5 text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
                <p
                  data-cms="t:watch-times-hays-time-0"
                  dangerouslySetInnerHTML={{
                    __html: tx(t, "watch-times-hays-time-0", "Saturday — 5:00 PM"),
                  }}
                />
                <p
                  data-cms="t:watch-times-hays-time-1"
                  dangerouslySetInnerHTML={{
                    __html: tx(t, "watch-times-hays-time-1", "Sunday — 8:00 AM"),
                  }}
                />
                <p
                  data-cms="t:watch-times-hays-time-2"
                  dangerouslySetInnerHTML={{
                    __html: tx(t, "watch-times-hays-time-2", "Sunday — 9:30 AM"),
                  }}
                />
                <p
                  data-cms="t:watch-times-hays-time-3"
                  dangerouslySetInnerHTML={{
                    __html: tx(t, "watch-times-hays-time-3", "Sunday — 11:00 AM"),
                  }}
                />
              </div>
            </div>

            {/* Colby campus */}
            <div className="p-10">
              <p
                className="overline mb-6"
                style={{ color: "#1cc3af" }}
                data-cms="t:watch-times-colby-eyebrow"
                dangerouslySetInnerHTML={{
                  __html: tx(t, "watch-times-colby-eyebrow", "Colby"),
                }}
              />
              <div className="flex flex-col gap-2.5 text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
                <p
                  data-cms="t:watch-times-colby-time-0"
                  dangerouslySetInnerHTML={{
                    __html: tx(t, "watch-times-colby-time-0", "Sunday — 10:00 AM"),
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Recent messages ──────────────────────────────────────── */}
      <section className="section" style={{ backgroundColor: "#ffffff" }}>
        <div className="container-c3">
          {/* Header */}
          <div className="mb-14">
            <p
              className="overline mb-4"
              style={{ color: "#1cc3af" }}
              data-cms="t:watch-ondemand-eyebrow"
              dangerouslySetInnerHTML={{ __html: tx(t, "watch-ondemand-eyebrow", "On Demand") }}
            />
            <h2
              className="display-2 text-balance"
              style={{ color: "#1b1c1c" }}
              data-cms="t:watch-catchup-heading"
              dangerouslySetInnerHTML={{
                __html: tx(t, "watch-catchup-heading", "Catch Up"),
              }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {recentMessages.map((msg) => (
              <div key={msg.id} className="group cursor-pointer">
                {/* Thumbnail */}
                <div
                  className="relative overflow-hidden mb-6"
                  style={{ height: 220, borderRadius: "var(--radius-md)" }}
                  data-cms-img={`${msg.id}-img`}
                >
                  <Image
                    src={assetPath(media[`${msg.id}-img`] || msg.image)}
                    alt={tx(t, `${msg.id}-title`, msg.defaultTitle)}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    style={imgCss(ov.img?.[`${msg.id}-img`])}
                  />
                  {/* Scrim + play button */}
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ background: "rgba(10,10,10,0.38)" }}
                  >
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center border border-white/40 transition-all duration-200 group-hover:scale-110 group-hover:border-white/70"
                      style={{ background: "rgba(255,255,255,0.13)", backdropFilter: "blur(4px)" }}
                    >
                      <Play size={18} className="text-white ml-0.5" fill="white" />
                    </div>
                  </div>
                </div>

                {/* Copy */}
                <h3
                  className="heading-3 mb-2"
                  style={{ color: "#1b1c1c" }}
                  data-cms={`t:${msg.id}-title`}
                  dangerouslySetInnerHTML={{
                    __html: tx(t, `${msg.id}-title`, msg.defaultTitle),
                  }}
                />
                <p
                  className="body-sm"
                  style={{ color: "rgba(27,28,28,0.50)" }}
                  data-cms={`t:${msg.id}-meta`}
                  dangerouslySetInnerHTML={{
                    __html: tx(
                      t,
                      `${msg.id}-meta`,
                      `${msg.defaultSeries} · ${msg.defaultDate}`
                    ),
                  }}
                />
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-14 text-center">
            <Link
              href={t["watch-all-messages-btn-href"] || "/messages/"}
              className="btn btn-primary btn-lg"
              data-cms-link="watch-all-messages-btn"
            >
              <span data-cms-link-label>
                {tx(t, "watch-all-messages-btn-label", "All Messages")}
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
