import type { Metadata } from "next";
import Image from "next/image";
import { assetPath } from "@/lib/asset-path";
import { getPageContent } from "@/lib/cms";
import { isCmsLive } from "@/lib/cms-live";
import { parseSections, tx, imgCss, type SectionMeta } from "@/lib/home-content";
import PageComposer from "@/components/cms/PageComposer";

/* Brand marks as inline SVGs (this lucide build ships no brand icons — matches the
   Footer + Watch page's inline-SVG convention). currentColor drives the fill. */
function VimeoIcon({ size = 15, style }: { size?: number; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={style}>
      <path d="M23.98 6.5c-.1 2.34-1.74 5.55-4.9 9.62C15.8 20.36 13 22.5 10.66 22.5c-1.45 0-2.68-1.34-3.68-4.02L5.31 11.9C4.57 9.22 3.78 7.88 2.93 7.88c-.18 0-.83.39-1.93 1.17L0 7.83c1.26-1.11 2.5-2.22 3.72-3.33 1.68-1.45 2.94-2.21 3.78-2.29 1.98-.19 3.2 1.17 3.66 4.07.5 3.13.84 5.08 1.03 5.84.57 2.61 1.2 3.91 1.89 3.91.54 0 1.34-.85 2.42-2.55 1.07-1.7 1.65-2.99 1.72-3.88.14-1.32-.38-1.98-1.55-1.98-.55 0-1.13.13-1.71.38 1.14-3.74 3.32-5.56 6.54-5.46 2.39.07 3.51 1.62 3.37 4.64z" />
    </svg>
  );
}
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
    "Watch and listen to messages from Celebration Community Church — live on Facebook and on demand in our Vimeo archive.",
};

/* Real destinations, sourced from celebratejesus.org/messages + /watch-online:
   past messages live in the Vimeo archive; the weekend service streams on Facebook Live. */
const VIMEO = "https://vimeo.com/c3hays";
const FACEBOOK_LIVE = "https://facebook.com/c3hays/videos";

/**
 * /messages — editor-editable SECTION contract.
 *
 * Rebuilt to REAL content only (no fabricated sermon series, podcast episodes, or
 * campus pastors). Three editor-native sections composed via <PageComposer>:
 *   • messages-hero    → full-bleed hero image + dark gradient
 *   • messages-banner  → real service-times band + Watch Live CTA
 *   • messages-archive → "Past Messages" — Vimeo archive + Facebook Live
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
                    "Miss a Sunday? Every message is on demand in our Vimeo archive — or join the live stream this weekend."
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
          /* ── Past Messages — Vimeo archive + Facebook Live (REAL) ── */
          <section className="section" style={{ backgroundColor: "#1b1c1c" }}>
            <div className="container-c3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 lg:gap-24 items-center">
                {/* Text */}
                <div>
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
                    style={{ marginBottom: "clamp(1rem, 3vw, 1.75rem)" }}
                    dangerouslySetInnerHTML={{
                      __html: tx(t, "messages-archive-heading", "Every message, on demand."),
                    }}
                  />
                  <p
                    data-cms="t:messages-archive-body"
                    style={{
                      fontSize: "1.125rem",
                      color: "rgba(255,255,255,0.75)",
                      lineHeight: 1.7,
                      marginBottom: "clamp(1.75rem, 4vw, 2.75rem)",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: tx(
                        t,
                        "messages-archive-body",
                        "Missed a weekend? Our full message archive lives on Vimeo — catch up anytime, from anywhere. Or join us live on Facebook every Saturday and Sunday."
                      ),
                    }}
                  />
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={t["messages-archive-cta-href"] || VIMEO}
                      data-cms-link="messages-archive-cta"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-lg inline-flex items-center gap-2"
                    >
                      <VimeoIcon size={16} />
                      <span
                        data-cms-link-label
                        dangerouslySetInnerHTML={{
                          __html: tx(t, "messages-archive-cta-label", "Past Messages on Vimeo"),
                        }}
                      />
                    </a>
                    <a
                      href={t["messages-archive-live-href"] || FACEBOOK_LIVE}
                      data-cms-link="messages-archive-live"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-lg inline-flex items-center gap-2"
                    >
                      <FacebookIcon size={15} />
                      <span
                        data-cms-link-label
                        dangerouslySetInnerHTML={{
                          __html: tx(t, "messages-archive-live-label", "Watch Live"),
                        }}
                      />
                    </a>
                  </div>
                </div>

                {/* Image */}
                <div
                  className="relative overflow-hidden"
                  data-cms-img="messages-archive-img"
                  style={{
                    aspectRatio: "4/3",
                    borderRadius: "var(--radius-md)",
                    minHeight: 240,
                  }}
                >
                  <Image
                    src={assetPath(media["messages-archive-img"] || "/images/gather.webp")}
                    alt="Watch past C3 messages"
                    fill
                    className="object-cover"
                    style={imgCss(ov.img?.["messages-archive-img"])}
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

  const known = new Set(["messages-hero", "messages-banner", "messages-archive"]);
  const visible = sections.filter((s) => known.has(s.id));

  return <PageComposer sections={visible} bgFill={ov.bgFill} anim={ov.anim} render={render} />;
}
