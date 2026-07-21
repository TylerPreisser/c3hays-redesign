import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Play, ExternalLink } from "lucide-react";
import { assetPath } from "@/lib/asset-path";
import { getPageContent } from "@/lib/cms";
import { isCmsLive } from "@/lib/cms-live";
import { parseSections, tx, imgCss, type SectionMeta } from "@/lib/home-content";
import PageComposer from "@/components/cms/PageComposer";

/* Brand mark as an inline SVG (this lucide build ships no brand icons — matches the
   Footer + Watch page's inline-SVG convention). currentColor drives the fill. */
function YoutubeIcon({ size = 15, style }: { size?: number; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={style}>
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#fff" />
    </svg>
  );
}

export const metadata: Metadata = {
  title: "Messages",
  description:
    "Watch and listen to sermons from Celebration Community Church — anytime, anywhere.",
};

/**
 * /messages — rebuilt to the editor-editable SECTION contract.
 *
 * Composed via <PageComposer> from FOUR editor-native sections with canonical ids:
 *   • messages-hero    → full-bleed hero image + dark gradient
 *   • messages-banner  → the "Live times banner" band
 *   • messages-recent  → the "Recent Messages grid" (header + recentMessages cards + archive CTA)
 *   • messages-youtube → the dark "Watch-anytime" callout
 *
 * PageComposer wraps each visible section in `<div data-section={id}>` and injects the
 * scoped per-section/per-tile background stylesheet, so the editor rail can add / reorder
 * / hide / recolor these sections. Every heading/body is data-cms tagged and every button
 * is an editable link (data-cms-link + data-cms-link-label).
 *
 * Server component; reads PUBLISHED CMS overrides (forwards ?preview under CMS_LIVE).
 */
const PAGE_DEFAULT_SECTIONS: SectionMeta[] = [
  { id: "messages-hero", visible: true },
  { id: "messages-banner", visible: true },
  { id: "messages-recent", visible: true },
  { id: "messages-youtube", visible: true },
];

const recentMessages = [
  {
    id: "msg-0",
    title: "The God Who Sees",
    series: "Genesis",
    speaker: "Lead Pastor",
    date: "April 27, 2026",
    image: "/images/worship.webp",
  },
  {
    id: "msg-1",
    title: "Faith Over Fear",
    series: "Matthew",
    speaker: "Lead Pastor",
    date: "April 20, 2026",
    image: "/images/congregation.webp",
  },
  {
    id: "msg-2",
    title: "What Love Looks Like",
    series: "1 Corinthians 13",
    speaker: "Guest Speaker",
    date: "April 13, 2026",
    image: "/images/gather.webp",
  },
  {
    id: "msg-3",
    title: "The Prodigal Father",
    series: "Luke 15",
    speaker: "Lead Pastor",
    date: "April 6, 2026",
    image: "/images/worship.webp",
  },
  {
    id: "msg-4",
    title: "Resurrection Power",
    series: "Easter 2026",
    speaker: "Lead Pastor",
    date: "March 29, 2026",
    image: "/images/exterior.webp",
  },
  {
    id: "msg-5",
    title: "When God Speaks",
    series: "Hearing God",
    speaker: "Lead Pastor",
    date: "March 22, 2026",
    image: "/images/bg-2.webp",
  },
];

export const dynamic = "force-dynamic";

export default async function MessagesPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Finding 2: forward the editor's ?preview token under CMS_LIVE so the editor
  // preview reflects DRAFT (published in export / public).
  const cmsLive = isCmsLive();
  const sp = cmsLive && searchParams ? await searchParams : {};
  const preview = typeof sp.preview === "string" ? sp.preview : undefined;
  const ov = (await getPageContent("/messages", preview)) || {};
  const t = ov.text || {};
  const media = ov.media || {};
  const sections = parseSections(ov.sections, PAGE_DEFAULT_SECTIONS);

  const render = (id: string): React.ReactNode => {
    switch (id) {
      case "messages-hero":
        return (
          /* ── Hero — full-bleed image + dark gradient ── */
          <section className="relative flex items-end overflow-hidden" style={{ minHeight: "56vh" }}>
            {/* Background image — CMS-replaceable */}
            <div
              className="absolute inset-0"
              data-cms-img="messages-hero-img"
              style={{ borderRadius: 0 }}
            >
              <Image
                src={assetPath(media["messages-hero-img"] || "/images/worship.webp")}
                alt="Sunday worship service"
                fill
                priority
                sizes="100vw"
                className="object-cover animate-ken-burns"
                style={imgCss(ov.img?.["messages-hero-img"])}
              />
              {/* Base dark scrim */}
              <div
                className="absolute inset-0"
                style={{ background: "rgba(10,10,10,0.55)" }}
              />
              {/* Bottom-up gradient for text legibility */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.3) 55%, transparent 100%)",
                }}
              />
            </div>

            {/* Hero text — bottom-anchored */}
            <div className="relative z-10 container-c3 pb-16 pt-44">
              {/* Eyebrow */}
              <span
                data-cms="t:messages-hero-eyebrow"
                style={{
                  display: "inline-block",
                  textTransform: "uppercase",
                  letterSpacing: "0.16em",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "#1cc3af",
                  marginBottom: "1rem",
                }}
                dangerouslySetInnerHTML={{
                  __html: tx(t, "messages-hero-eyebrow", "Sermons &amp; Teaching"),
                }}
              />
              <h1
                className="display-1 text-white text-balance"
                data-cms="t:messages-hero-heading"
                style={{ marginBottom: "1.25rem" }}
                dangerouslySetInnerHTML={{
                  __html: tx(t, "messages-hero-heading", "Watch &amp; Listen"),
                }}
              />
              <p
                className="body-lg"
                data-cms="t:messages-hero-body"
                style={{ color: "rgba(255,255,255,0.65)", maxWidth: "38rem" }}
                dangerouslySetInnerHTML={{
                  __html: tx(
                    t,
                    "messages-hero-body",
                    "Miss a Sunday? Browse our full sermon archive on YouTube, or tune in live this weekend."
                  ),
                }}
              />
            </div>
          </section>
        );

      case "messages-banner":
        return (
          /* ── Live times banner ── */
          <div style={{ backgroundColor: "#1b1c1c" }}>
            <div className="container-c3 py-4 flex flex-wrap items-center justify-between gap-4">
              <div
                className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm"
                style={{ color: "rgba(255,255,255,0.65)" }}
              >
                <span
                  className="font-semibold text-white"
                  data-cms="t:messages-banner-label"
                  dangerouslySetInnerHTML={{
                    __html: tx(t, "messages-banner-label", "Join us live:"),
                  }}
                />
                <span
                  data-cms="t:messages-banner-hays"
                  dangerouslySetInnerHTML={{
                    __html: tx(
                      t,
                      "messages-banner-hays",
                      "Hays — Sat 5pm · Sun 8am, 9:30am, 11am"
                    ),
                  }}
                />
                <span
                  data-cms="t:messages-banner-colby"
                  dangerouslySetInnerHTML={{
                    __html: tx(t, "messages-banner-colby", "Colby — Sun 10am"),
                  }}
                />
              </div>
              <Link
                href={t["messages-banner-cta-href"] || "/watch/"}
                data-cms-link="messages-banner-cta"
                className="btn btn-primary btn-sm"
              >
                <span data-cms-link-label>
                  {tx(t, "messages-banner-cta-label", "Watch Live")}
                </span>
              </Link>
            </div>
          </div>
        );

      case "messages-recent":
        return (
          /* ── Recent Messages grid ── */
          <section className="section" style={{ backgroundColor: "#ffffff" }}>
            <div className="container-c3">
              {/* Section header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 mb-14">
                <div>
                  {/* Eyebrow */}
                  <span
                    data-cms="t:messages-grid-eyebrow"
                    style={{
                      display: "inline-block",
                      textTransform: "uppercase",
                      letterSpacing: "0.16em",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "#1cc3af",
                      marginBottom: "0.625rem",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: tx(t, "messages-grid-eyebrow", "This Month"),
                    }}
                  />
                  <h2
                    className="heading-1"
                    style={{ color: "#1b1c1c" }}
                    data-cms="t:messages-grid-heading"
                    dangerouslySetInnerHTML={{
                      __html: tx(t, "messages-grid-heading", "Recent Messages"),
                    }}
                  />
                </div>

                {/* External platform link — the full sermon archive lives on YouTube */}
                <div className="flex gap-3">
                  <a
                    href={t["messages-youtube-href"] || "https://www.youtube.com/@c3hays"}
                    data-cms-link="messages-youtube"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-navy btn-sm inline-flex items-center gap-2"
                  >
                    <YoutubeIcon size={15} />
                    <span
                      data-cms-link-label
                      dangerouslySetInnerHTML={{
                        __html: tx(t, "messages-youtube-label", "Watch on YouTube"),
                      }}
                    />
                  </a>
                </div>
              </div>

              {/* Message cards — 3-column grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentMessages.map((msg) => (
                  <article key={msg.id} className="group cursor-pointer">
                    {/* Thumbnail — 4:5 portrait, rounded with play overlay */}
                    <div
                      className="relative overflow-hidden mb-5"
                      data-cms-img={msg.id}
                      style={{
                        aspectRatio: "4/5",
                        borderRadius: "var(--radius-md)",
                      }}
                    >
                      <Image
                        src={assetPath(media[msg.id] || msg.image)}
                        alt={msg.title}
                        fill
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                        style={imgCss(ov.img?.[msg.id])}
                      />
                      {/* Dark overlay */}
                      <div
                        className="absolute inset-0 transition-colors duration-300"
                        style={{ background: "rgba(10,10,10,0.38)" }}
                      />
                      {/* Play button */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div
                          className="w-14 h-14 rounded-full flex items-center justify-center border border-white/40 transition-all duration-200 group-hover:bg-white/20 group-hover:scale-105"
                          style={{ background: "rgba(255,255,255,0.14)" }}
                          aria-hidden="true"
                        >
                          <Play size={18} className="text-white ml-0.5" fill="white" />
                        </div>
                      </div>
                      {/* Series pill */}
                      <div className="absolute top-3 left-3">
                        <span
                          className="px-3 py-1 text-xs font-bold tracking-wide"
                          data-cms={`t:${msg.id}-series`}
                          style={{
                            background: "#1cc3af",
                            color: "#fff",
                            borderRadius: 999,
                          }}
                          dangerouslySetInnerHTML={{
                            __html: tx(t, `${msg.id}-series`, msg.series),
                          }}
                        />
                      </div>
                    </div>

                    {/* Card info */}
                    <h3
                      className="font-bold mb-1.5 leading-snug"
                      data-cms={`t:${msg.id}-title`}
                      style={{ color: "#1b1c1c", fontSize: "1rem" }}
                      dangerouslySetInnerHTML={{
                        __html: tx(t, `${msg.id}-title`, msg.title),
                      }}
                    />
                    <p
                      className="text-sm"
                      style={{ color: "rgba(27,28,28,0.5)" }}
                    >
                      <span
                        data-cms={`t:${msg.id}-speaker`}
                        dangerouslySetInnerHTML={{
                          __html: tx(t, `${msg.id}-speaker`, msg.speaker),
                        }}
                      />
                      <span aria-hidden="true"> · </span>
                      <span
                        data-cms={`t:${msg.id}-date`}
                        dangerouslySetInnerHTML={{
                          __html: tx(t, `${msg.id}-date`, msg.date),
                        }}
                      />
                    </p>
                  </article>
                ))}
              </div>

              {/* Full archive CTA */}
              <div className="mt-14 text-center">
                <a
                  href={t["messages-archive-href"] || "https://www.youtube.com/@c3hays"}
                  data-cms-link="messages-archive"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-lg inline-flex items-center gap-2"
                >
                  <ExternalLink size={16} aria-hidden="true" />
                  <span
                    data-cms-link-label
                    dangerouslySetInnerHTML={{
                      __html: tx(
                        t,
                        "messages-archive-label",
                        "Full Archive on YouTube"
                      ),
                    }}
                  />
                </a>
              </div>
            </div>
          </section>
        );

      case "messages-youtube":
        return (
          /* ── Watch-anytime callout — dark section (full archive on YouTube) ── */
          <section className="section" style={{ backgroundColor: "#1b1c1c" }}>
            <div className="container-c3">
              <div
                className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 lg:gap-24 items-center"
              >
                {/* Text */}
                <div>
                  <span
                    data-cms="t:messages-youtube-eyebrow"
                    style={{
                      display: "inline-block",
                      textTransform: "uppercase",
                      letterSpacing: "0.16em",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "#1cc3af",
                      marginBottom: "1rem",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: tx(t, "messages-youtube-eyebrow", "Watch Anytime"),
                    }}
                  />
                  <h2
                    className="display-2 text-white text-balance"
                    data-cms="t:messages-youtube-heading"
                    style={{ marginBottom: "clamp(1rem, 3vw, 1.75rem)" }}
                    dangerouslySetInnerHTML={{
                      __html: tx(
                        t,
                        "messages-youtube-heading",
                        "Every Message on YouTube"
                      ),
                    }}
                  />
                  <p
                    data-cms="t:messages-youtube-body"
                    style={{
                      fontSize: "1.125rem",
                      color: "rgba(255,255,255,0.75)",
                      lineHeight: 1.7,
                      marginBottom: "clamp(1.75rem, 4vw, 2.75rem)",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: tx(
                        t,
                        "messages-youtube-body",
                        "Missed a weekend? Every C3 message is on our YouTube channel — catch the latest series, revisit an old favorite, and subscribe so you never miss a Sunday."
                      ),
                    }}
                  />
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={t["messages-youtube-cta-href"] || "https://www.youtube.com/@c3hays"}
                      data-cms-link="messages-youtube-cta"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-sm inline-flex items-center gap-2"
                    >
                      <YoutubeIcon size={15} />
                      <span
                        data-cms-link-label
                        dangerouslySetInnerHTML={{
                          __html: tx(
                            t,
                            "messages-youtube-cta-label",
                            "Watch on YouTube"
                          ),
                        }}
                      />
                    </a>
                    <Link
                      href={t["messages-watch-live-href"] || "/watch/"}
                      data-cms-link="messages-watch-live"
                      className="btn btn-outline btn-sm"
                    >
                      <span data-cms-link-label>
                        {tx(t, "messages-watch-live-label", "Watch Live")}
                      </span>
                    </Link>
                  </div>
                </div>

                {/* Image */}
                <div
                  className="relative overflow-hidden"
                  data-cms-img="messages-youtube-img"
                  style={{
                    aspectRatio: "4/3",
                    borderRadius: "var(--radius-md)",
                    minHeight: 240,
                  }}
                >
                  <Image
                    src={assetPath(media["messages-youtube-img"] || "/images/gather.webp")}
                    alt="Watch C3 messages on YouTube"
                    fill
                    className="object-cover"
                    style={imgCss(ov.img?.["messages-youtube-img"])}
                  />
                </div>
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  const known = new Set([
    "messages-hero",
    "messages-banner",
    "messages-recent",
    "messages-youtube",
  ]);
  const visible = sections.filter((s) => known.has(s.id));

  return <PageComposer sections={visible} bgFill={ov.bgFill} anim={ov.anim} render={render} />;
}
