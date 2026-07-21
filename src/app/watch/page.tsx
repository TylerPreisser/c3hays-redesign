import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { assetPath } from "@/lib/asset-path";
import { getPageContent } from "@/lib/cms";
import { isCmsLive } from "@/lib/cms-live";
import { parseSections, tx, imgCss, type SectionMeta } from "@/lib/home-content";
import PageComposer from "@/components/cms/PageComposer";

/* Brand marks as inline SVGs (this lucide build has no brand icons — matches the
   Footer's inline-SVG convention). currentColor drives the fill. */
function YouTubeIcon({ size = 24, style }: { size?: number; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={style}>
      <path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8zM9.55 15.57V8.43L15.82 12l-6.27 3.57z" />
    </svg>
  );
}
function FacebookIcon({ size = 24, style }: { size?: number; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={style}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export const metadata: Metadata = {
  title: "Watch Online",
  description:
    "Watch Celebration Community Church online — live on Facebook and on demand on our YouTube channel.",
};

/* Real destinations (verified platforms): the weekend service streams on Facebook
   Live; the past-message archive lives on YouTube (youtube.com/@c3hays). */
const YOUTUBE = "https://youtube.com/@c3hays";
const FACEBOOK_LIVE = "https://facebook.com/c3hays/videos";

/**
 * /watch — rebuilt to the editor-native SECTION contract (Phase-4).
 *
 * Composed via <PageComposer> from THREE editor-native sections whose ids match
 * the c3-backend page-sections default for /watch:
 *   • watch-hero     → inline hero band (photo + eyebrow/headline/subhead).
 *   • watch-channels → "Two ways to watch" (Facebook Live + YouTube archive cards).
 *   • watch-ondemand → "Catch up on demand" (messages + YouTube CTAs).
 *
 * PageComposer wraps each visible section in `<div data-section={id}>` and injects
 * the scoped per-section/per-tile background stylesheet, so the editor rail can
 * add / reorder / hide / recolor these sections. Every card carries its own
 * data-cms-bg, every heading/body is data-cms text, and every button is an
 * editable link.
 *
 * De-collapse (item 4): each channel card is a data-cms-bg <div> whose image and
 * copy are independent editable children, with ONLY the bottom CTA wrapped in an
 * editable <a data-cms-link> — so clicking the card selects the card, and the CTA
 * is its own editable link (mirrors connect ConnectSteps, commit b7310ba).
 *
 * Server component; reads PUBLISHED CMS overrides (preview forwarded under CMS_LIVE).
 */
const PAGE_DEFAULT_SECTIONS: SectionMeta[] = [
  { id: "watch-hero", visible: true },
  { id: "watch-channels", visible: true },
  { id: "watch-ondemand", visible: true },
];

export const dynamic = "force-dynamic";

export default async function WatchPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Finding 2: forward the editor's ?preview token under CMS_LIVE so the editor
  // preview reflects DRAFT (published in export / public).
  const cmsLive = isCmsLive();
  const sp = cmsLive && searchParams ? await searchParams : {};
  const preview = typeof sp.preview === "string" ? sp.preview : undefined;
  const ov = (await getPageContent("/watch", preview)) || {};
  const t = ov.text || {};
  const media = ov.media || {};
  const sections = parseSections(ov.sections, PAGE_DEFAULT_SECTIONS);

  const channels = [
    {
      id: "facebook",
      Icon: FacebookIcon,
      href: FACEBOOK_LIVE,
      accent: "#1877f2",
      image: "/images/congregation.webp",
      defaultLabel: "Facebook Live",
      defaultTitle: "Watch Live",
      defaultBody:
        "Join the live stream every Saturday and Sunday, and catch replays right in your feed.",
      defaultCta: "Watch on Facebook",
    },
    {
      id: "youtube",
      Icon: YouTubeIcon,
      href: YOUTUBE,
      accent: "#ff0000",
      image: "/images/gather.webp",
      defaultLabel: "YouTube",
      defaultTitle: "Past Messages",
      defaultBody:
        "Every past message, on demand on our YouTube channel — catch up anytime, from anywhere.",
      defaultCta: "Open the archive",
    },
  ];

  const render = (id: string): React.ReactNode => {
    switch (id) {
      // ── Hero ─────────────────────────────────────────────────────
      case "watch-hero":
        return (
          <section
            className="relative flex items-end overflow-hidden"
            style={{ minHeight: "58vh" }}
          >
            <div className="absolute inset-0" data-cms-img="watch-hero-img">
              <Image
                src={assetPath(media["watch-hero-img"] || "/images/gather.webp")}
                alt="C3 live worship service"
                fill
                className="object-cover"
                priority
                sizes="100vw"
                style={imgCss(ov.img?.["watch-hero-img"])}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(10,10,10,0.30) 0%, rgba(10,10,10,0.48) 50%, rgba(10,10,10,0.90) 100%)",
                }}
              />
            </div>

            <div className="relative z-10 container-c3 pb-20 pt-44">
              <p
                className="overline mb-5"
                style={{ color: "#1cc3af" }}
                data-cms="t:watch-hero-eyebrow"
                dangerouslySetInnerHTML={{ __html: tx(t, "watch-hero-eyebrow", "Watch Online") }}
              />
              <h1
                className="display-1 text-white text-balance"
                data-cms="t:watch-hero-headline"
                dangerouslySetInnerHTML={{
                  __html: tx(t, "watch-hero-headline", "Watch C3, wherever you are."),
                }}
              />
              <p
                className="body-lg mt-5 max-w-xl"
                style={{ color: "rgba(255,255,255,0.68)" }}
                data-cms="t:watch-hero-subhead"
                dangerouslySetInnerHTML={{
                  __html: tx(
                    t,
                    "watch-hero-subhead",
                    "Every service streams live &mdash; and every past message is on demand. Two ways to join in."
                  ),
                }}
              />
            </div>
          </section>
        );

      // ── Two ways to watch: Facebook Live + YouTube archive ─────────
      case "watch-channels":
        return (
          <section style={{ backgroundColor: "#0a0a0a" }} className="section">
            <div className="container-c3">
              <div className="mb-12 max-w-2xl">
                <p
                  className="overline mb-4"
                  style={{ color: "#1cc3af" }}
                  data-cms="t:watch-channels-eyebrow"
                  dangerouslySetInnerHTML={{
                    __html: tx(t, "watch-channels-eyebrow", "Where to watch"),
                  }}
                />
                <h2
                  className="display-2 text-white text-balance"
                  data-cms="t:watch-channels-heading"
                  dangerouslySetInnerHTML={{
                    __html: tx(t, "watch-channels-heading", "Two ways to watch"),
                  }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {channels.map((c) => {
                  const Icon = c.Icon;
                  return (
                    // De-collapsed card: the CARD is a data-cms-bg <div> (selects the
                    // card), its image + copy are independent editable children, and
                    // ONLY the bottom CTA is a real editable link.
                    <div
                      key={c.id}
                      className="group relative flex flex-col overflow-hidden"
                      data-cms-bg={`watch-${c.id}-bg`}
                      style={{
                        borderRadius: "var(--radius-md)",
                        border: "1px solid rgba(255,255,255,0.10)",
                        background: "#141515",
                      }}
                    >
                      {/* Media */}
                      <div className="relative" style={{ aspectRatio: "16/9" }} data-cms-img={`watch-${c.id}-img`}>
                        <Image
                          src={assetPath(media[`watch-${c.id}-img`] || c.image)}
                          alt={tx(t, `watch-${c.id}-title`, c.defaultTitle)}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                          style={imgCss(ov.img?.[`watch-${c.id}-img`])}
                        />
                        <div className="absolute inset-0" style={{ background: "rgba(10,10,10,0.42)" }} />
                        <span
                          className="absolute left-5 top-5 inline-flex items-center justify-center"
                          style={{
                            width: 52,
                            height: 52,
                            borderRadius: 14,
                            background: "rgba(255,255,255,0.94)",
                            color: c.accent,
                            boxShadow: "0 10px 24px rgba(0,0,0,0.35)",
                          }}
                        >
                          <Icon size={26} />
                        </span>
                      </div>

                      {/* Copy */}
                      <div className="flex flex-1 flex-col p-8">
                        <p
                          className="overline mb-3"
                          style={{ color: "#1cc3af" }}
                          data-cms={`t:watch-${c.id}-label`}
                          dangerouslySetInnerHTML={{ __html: tx(t, `watch-${c.id}-label`, c.defaultLabel) }}
                        />
                        <h3
                          className="heading-2 text-white mb-3"
                          data-cms={`t:watch-${c.id}-title`}
                          dangerouslySetInnerHTML={{ __html: tx(t, `watch-${c.id}-title`, c.defaultTitle) }}
                        />
                        <p
                          className="body-base"
                          style={{ color: "rgba(255,255,255,0.62)" }}
                          data-cms={`t:watch-${c.id}-body`}
                          dangerouslySetInnerHTML={{ __html: tx(t, `watch-${c.id}-body`, c.defaultBody) }}
                        />
                        <a
                          href={t[`watch-${c.id}-href`] || c.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-cms-link={`watch-${c.id}`}
                          className="mt-7 inline-flex items-center gap-1.5 font-semibold transition-colors"
                          style={{ color: "#fff" }}
                        >
                          <span data-cms-link-label>{tx(t, `watch-${c.id}-cta`, c.defaultCta)}</span>
                          <ArrowUpRight
                            size={18}
                            className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );

      // ── Catch up on demand ───────────────────────────────────────
      case "watch-ondemand":
        return (
          <section className="section" style={{ backgroundColor: "#ffffff" }}>
            <div className="container-c3">
              <div className="mx-auto text-center" style={{ maxWidth: 620 }}>
                <p
                  className="overline mb-4"
                  style={{ color: "#1cc3af" }}
                  data-cms="t:watch-ondemand-eyebrow"
                  dangerouslySetInnerHTML={{ __html: tx(t, "watch-ondemand-eyebrow", "On Demand") }}
                />
                <h2
                  className="display-2 text-balance"
                  style={{ color: "#1b1c1c" }}
                  data-cms="t:watch-ondemand-heading"
                  dangerouslySetInnerHTML={{
                    __html: tx(t, "watch-ondemand-heading", "Missed a weekend? Catch up anytime."),
                  }}
                />
                <p
                  className="body-lg mt-4"
                  style={{ color: "rgba(27,28,28,0.6)" }}
                  data-cms="t:watch-ondemand-body"
                  dangerouslySetInnerHTML={{
                    __html: tx(
                      t,
                      "watch-ondemand-body",
                      "Browse every message in one place &mdash; or head to our YouTube channel."
                    ),
                  }}
                />
                <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href={t["watch-messages-btn-href"] || "/messages/"}
                    className="btn btn-primary btn-lg"
                    data-cms-link="watch-messages-btn"
                  >
                    <span data-cms-link-label>
                      {tx(t, "watch-messages-btn-label", "Browse all messages")}
                    </span>
                  </Link>
                  <a
                    href={t["watch-youtube-btn-href"] || YOUTUBE}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-ink btn-lg"
                    data-cms-link="watch-youtube-btn"
                  >
                    <span data-cms-link-label>
                      {tx(t, "watch-youtube-btn-label", "Past messages on YouTube")}
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  const known = new Set(["watch-hero", "watch-channels", "watch-ondemand"]);
  const visible = sections.filter((s) => known.has(s.id));

  return <PageComposer sections={visible} bgFill={ov.bgFill} anim={ov.anim} render={render} freeEls={ov.freeEls} />;
}
