import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getCMSPage } from "@/lib/cms";
import { tx, imgCss } from "@/lib/home-content";
import { assetPath } from "@/lib/asset-path";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about the story, values, and people of Celebration Community Church — a church family in western Kansas.",
};

/* ── Fallback value data — defaults until CMS overrides exist ──────────── */
const VALUE_DEFAULTS = [
  {
    id: "scripture-first",
    title: "Scripture First",
    body: "Everything we do is anchored in the Bible — God's Word is our authority for faith, practice, and community life.",
  },
  {
    id: "jesus-centered",
    title: "Jesus-Centered Worship",
    body: "We believe worship is more than music. It's a way of life that puts Jesus at the center of everything.",
  },
  {
    id: "authentic-community",
    title: "Authentic Community",
    body: "We weren't meant to do life alone. Small groups, friendships, and belonging are part of the C3 DNA.",
  },
  {
    id: "generosity",
    title: "Generosity",
    body: "God is generous — and His people are too. We steward our time, talent, and treasure for His kingdom.",
  },
  {
    id: "serving-others",
    title: "Serving Others",
    body: "We take the love of Christ outside our walls — into Hays, Colby, and to the ends of the earth.",
  },
  {
    id: "every-generation",
    title: "Every Generation",
    body: "From kids to seniors, we believe every age has a role to play in building the church Jesus is building.",
  },
];

export default async function AboutPage() {
  const ov = (await getCMSPage("/about")) || {};
  const t = ov.text || {};
  const media = ov.media || {};

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section
        className="relative flex items-end overflow-hidden"
        style={{ minHeight: "clamp(480px, 62vh, 740px)" }}
      >
        {/* Background image */}
        <div
          className="absolute inset-0"
          data-cms-img="about-hero-bg"
          style={{ borderRadius: 0 }}
        >
          <Image
            src={assetPath(media["about-hero-bg"] || "/images/congregation.webp")}
            alt="C3 congregation gathered in worship"
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={imgCss(ov.img?.["about-hero-bg"])}
          />
          {/* Dark overlay */}
          <div
            className="absolute inset-0"
            style={{ background: "rgba(10,10,10,0.52)" }}
          />
          {/* Bottom-to-top gradient for text legibility */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.18) 55%, transparent 100%)",
            }}
          />
        </div>

        {/* Hero text */}
        <div className="relative z-10 container-c3 pb-16 pt-40">
          {/* Eyebrow */}
          <p
            className="overline mb-4"
            style={{ color: "#1cc3af" }}
            data-cms="t:about-hero-eyebrow"
            dangerouslySetInnerHTML={{
              __html: tx(t, "about-hero-eyebrow", "Who We Are"),
            }}
          />
          <h1
            className="display-1 text-white text-balance"
            data-cms="t:about-hero-heading"
            dangerouslySetInnerHTML={{
              __html: tx(t, "about-hero-heading", "A people on a mission."),
            }}
          />
          <p
            className="body-lg mt-5 max-w-lg"
            style={{ color: "rgba(255,255,255,0.68)" }}
            data-cms="t:about-hero-subhead"
            dangerouslySetInnerHTML={{
              __html: tx(
                t,
                "about-hero-subhead",
                "To meet Jesus, grow with Him, and serve our community."
              ),
            }}
          />
        </div>
      </section>

      {/* ── Mission ───────────────────────────────────────────────────────── */}
      <section className="section" style={{ backgroundColor: "#ffffff" }}>
        <div className="container-c3">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-stretch">
            {/* Text column */}
            <div className="flex flex-col justify-center">
              {/* Eyebrow */}
              <p
                className="overline mb-5"
                style={{ color: "#1cc3af" }}
                data-cms="t:about-mission-eyebrow"
                dangerouslySetInnerHTML={{
                  __html: tx(t, "about-mission-eyebrow", "Our Mission"),
                }}
              />

              <h2
                className="display-2 mb-8 text-balance"
                style={{ color: "#1b1c1c" }}
                data-cms="t:about-mission-title"
                dangerouslySetInnerHTML={{
                  __html: tx(
                    t,
                    "about-mission-title",
                    `We exist to <em class="not-italic" style="color:#1cc3af">Meet.</em> <em class="not-italic" style="color:#1cc3af">Grow.</em> <em class="not-italic" style="color:#1cc3af">Serve.</em>`
                  ),
                }}
              />

              <p
                className="body-lg mb-6"
                style={{ color: "rgba(27,28,28,0.80)", fontWeight: 500 }}
                data-cms="t:about-mission-lead"
                dangerouslySetInnerHTML={{
                  __html: tx(
                    t,
                    "about-mission-lead",
                    "Jesus is central to everything we do at C3. We exist to meet with Him, grow in Him, and serve through Him."
                  ),
                }}
              />

              <p
                className="body-base mb-5"
                style={{ color: "rgba(27,28,28,0.65)", lineHeight: 1.75 }}
                data-cms="t:about-mission-body-1"
                dangerouslySetInnerHTML={{
                  __html: tx(
                    t,
                    "about-mission-body-1",
                    "Celebration Community Church began with a simple conviction: that the local church matters. When people gather in the name of Jesus, lives change. Families are restored. Communities are transformed."
                  ),
                }}
              />

              <p
                className="body-base mb-10"
                style={{ color: "rgba(27,28,28,0.65)", lineHeight: 1.75 }}
                data-cms="t:about-mission-body-2"
                dangerouslySetInnerHTML={{
                  __html: tx(
                    t,
                    "about-mission-body-2",
                    "From our roots in Hays, Kansas, we&apos;ve grown into a multi-campus church family that spans northwest Kansas — with one vision, one mission, and one King."
                  ),
                }}
              />

              <div>
                <Link
                  href={t["about-beliefs-btn-href"] || "/beliefs/"}
                  data-cms-link="about-beliefs-btn"
                  className="btn btn-primary btn-lg"
                >
                  <span data-cms-link-label>
                    {tx(t, "about-beliefs-btn-label", "What We Believe")}
                  </span>
                </Link>
              </div>
            </div>

            {/* Image column */}
            <div
              className="relative overflow-hidden lg:min-h-[480px]"
              data-cms-img="about-mission-img"
              style={{ borderRadius: "var(--radius-md)" }}
            >
              <Image
                src={assetPath(media["about-mission-img"] || "/images/gather.webp")}
                alt="Church gathering"
                fill
                className="object-cover"
                style={imgCss(ov.img?.["about-mission-img"])}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ────────────────────────────────────────────────────────── */}
      <section className="section" style={{ backgroundColor: "#1b1c1c" }}>
        <div className="container-c3">
          {/* Section header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
            <div>
              <p
                className="overline mb-4"
                style={{ color: "#1cc3af" }}
                data-cms="t:about-values-eyebrow"
                dangerouslySetInnerHTML={{
                  __html: tx(t, "about-values-eyebrow", "What We Live By"),
                }}
              />
              <h2
                className="display-2 text-white"
                data-cms="t:about-values-title"
                dangerouslySetInnerHTML={{
                  __html: tx(t, "about-values-title", "Our Values"),
                }}
              />
            </div>
          </div>

          {/* Values grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {VALUE_DEFAULTS.map((v, i) => (
              <div
                key={v.id}
                className="p-8 flex flex-col"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  borderRadius: "var(--radius-md)",
                }}
              >
                <span
                  className="block overline mb-5"
                  style={{ color: "#1cc3af" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3
                  className="heading-3 text-white mb-3"
                  data-cms={`t:about-value-${i}-title`}
                  dangerouslySetInnerHTML={{
                    __html: tx(t, `about-value-${i}-title`, v.title),
                  }}
                />
                <p
                  className="body-sm"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                  data-cms={`t:about-value-${i}-body`}
                  dangerouslySetInnerHTML={{
                    __html: tx(t, `about-value-${i}-body`, v.body),
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="section" style={{ backgroundColor: "#ffffff" }}>
        <div className="container-c3 text-center" style={{ maxWidth: "42rem", marginInline: "auto" }}>
          {/* Eyebrow */}
          <p
            className="overline mb-5"
            style={{ color: "#1cc3af" }}
            data-cms="t:about-cta-eyebrow"
            dangerouslySetInnerHTML={{
              __html: tx(t, "about-cta-eyebrow", "First Time Here?"),
            }}
          />

          <h2
            className="display-2 mb-5"
            style={{ color: "#1b1c1c" }}
            data-cms="t:about-cta-title"
            dangerouslySetInnerHTML={{
              __html: tx(t, "about-cta-title", "Ready to visit?"),
            }}
          />

          <p
            className="body-lg mb-10"
            style={{ color: "rgba(27,28,28,0.65)" }}
            data-cms="t:about-cta-body"
            dangerouslySetInnerHTML={{
              __html: tx(
                t,
                "about-cta-body",
                "We&apos;d love to meet you. No pressure, no dress code — just come."
              ),
            }}
          />

          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href={t["about-visit-btn-href"] || "/visit/"}
              data-cms-link="about-visit-btn"
              className="btn btn-primary btn-lg"
            >
              <span data-cms-link-label>
                {tx(t, "about-visit-btn-label", "Plan Your Visit")}
              </span>
            </Link>
            <Link
              href={t["about-connect-btn-href"] || "/connect/"}
              data-cms-link="about-connect-btn"
              className="btn btn-outline-navy btn-lg"
            >
              <span data-cms-link-label>
                {tx(t, "about-connect-btn-label", "Fill Out a Connect Card")}
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
