import type { Metadata } from "next";
import Image from "next/image";
import { assetPath } from "@/lib/asset-path";
import { getPageContent } from "@/lib/cms";
import { isCmsLive } from "@/lib/cms-live";
import { parseSections, tx, imgCss, type SectionMeta } from "@/lib/home-content";
import PageComposer from "@/components/cms/PageComposer";
import PastMessagesGrid from "@/components/messages/PastMessagesGrid";
import { pastMessages } from "@/data/messages";

/* Brand mark as an inline SVG (this lucide build ships no brand icons — matches the
   Footer + Watch page's inline-SVG convention). currentColor drives the fill. */
function FacebookIcon({ size = 15, style }: { size?: number; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={style}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export const metadata: Metadata = {
  title: "Messages",
  description:
    "Watch and listen to messages from Celebration Community Church — live on Facebook and on demand on our YouTube channel.",
};

/* Real destinations (verified platforms): past messages live on YouTube
   (youtube.com/@c3hays); the weekend service streams on Facebook Live. */
const YOUTUBE = "https://youtube.com/@c3hays";
const FACEBOOK_LIVE = "https://facebook.com/c3hays/videos";

/**
 * /messages — editor-editable SECTION contract.
 *
 * Rebuilt to REAL content only (no fabricated sermon series, podcast episodes, or
 * campus pastors). Three editor-native sections composed via <PageComposer>:
 *   • messages-hero    → full-bleed hero image + dark gradient
 *   • messages-banner  → real service-times band + Watch Live CTA
 *   • messages-archive → "Past Messages" — YouTube archive + Facebook Live
 *
 * Every heading/body is data-cms tagged and every button is an editable link.
 */
const PAGE_DEFAULT_SECTIONS: SectionMeta[] = [
  { id: "messages-hero", visible: true },
  { id: "messages-banner", visible: true },
  { id: "messages-archive", visible: true },
];

export const dynamic = "force-dynamic";

export default async function MessagesPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
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
              <div className="absolute inset-0" style={{ background: "rgba(10,10,10,0.55)" }} />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.3) 55%, transparent 100%)",
                }}
              />
            </div>

            <div className="relative z-10 container-c3 pb-16 pt-44">
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
                  __html: tx(t, "messages-hero-eyebrow", "Messages"),
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
                    "Miss a Sunday? Every message is on demand on our YouTube channel — or join the live stream this weekend."
                  ),
                }}
              />
            </div>
          </section>
        );

      case "messages-banner":
        return (
          /* ── Live times banner — REAL service times ── */
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
              <a
                href={t["messages-banner-cta-href"] || FACEBOOK_LIVE}
                data-cms-link="messages-banner-cta"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm"
              >
                <span data-cms-link-label>
                  {tx(t, "messages-banner-cta-label", "Watch Live")}
                </span>
              </a>
            </div>
          </div>
        );

      case "messages-archive":
        return (
          /* ── Past Messages — searchable/filterable YouTube archive (REAL) ── */
          <section className="section" style={{ backgroundColor: "#1b1c1c" }}>
            <div className="container-c3">
              {/* Header — keeps the messages-archive-eyebrow / -heading / -body cms keys */}
              <div
                className="flex flex-wrap items-end justify-between gap-6"
                style={{ marginBottom: "clamp(2rem, 5vw, 3rem)" }}
              >
                <div style={{ maxWidth: "42rem" }}>
                  <span
                    data-cms="t:messages-archive-eyebrow"
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
                      __html: tx(t, "messages-archive-eyebrow", "Watch Anytime"),
                    }}
                  />
                  <h2
                    className="display-2 text-white text-balance"
                    data-cms="t:messages-archive-heading"
                    style={{ marginBottom: "clamp(0.75rem, 2vw, 1.25rem)" }}
                    dangerouslySetInnerHTML={{
                      __html: tx(t, "messages-archive-heading", "Past Messages"),
                    }}
                  />
                  <p
                    data-cms="t:messages-archive-body"
                    style={{
                      fontSize: "1.125rem",
                      color: "rgba(255,255,255,0.75)",
                      lineHeight: 1.7,
                    }}
                    dangerouslySetInnerHTML={{
                      __html: tx(
                        t,
                        "messages-archive-body",
                        "Search the archive and catch up on any weekend — every message streams on our YouTube channel. Or join us live on Facebook."
                      ),
                    }}
                  />
                </div>

                {/* Watch Live on Facebook affordance */}
                <a
                  href={t["messages-archive-live-href"] || FACEBOOK_LIVE}
                  data-cms-link="messages-archive-live"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-lg inline-flex items-center gap-2 shrink-0"
                >
                  <FacebookIcon size={15} />
                  <span
                    data-cms-link-label
                    dangerouslySetInnerHTML={{
                      __html: tx(t, "messages-archive-live-label", "Watch Live on Facebook"),
                    }}
                  />
                </a>
              </div>

              {/* Searchable + filterable grid (client component) */}
              <PastMessagesGrid messages={pastMessages} channelHref={YOUTUBE} />
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  const known = new Set(["messages-hero", "messages-banner", "messages-archive"]);
  const visible = sections.filter((s) => known.has(s.id));

  return <PageComposer sections={visible} bgFill={ov.bgFill} anim={ov.anim} render={render} />;
}
