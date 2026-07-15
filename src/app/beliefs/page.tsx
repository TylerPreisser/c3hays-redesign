import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { beliefs } from "@/data/beliefs";
import { assetPath } from "@/lib/asset-path";
import { getCMSPage } from "@/lib/cms";
import { tx, imgCss } from "@/lib/home-content";

export const metadata: Metadata = {
  title: "What We Believe",
  description:
    "The core doctrinal convictions of Celebration Community Church — rooted in Scripture, centered on Jesus.",
};

export default async function BeliefsPage() {
  const ov = (await getCMSPage("/beliefs")) || {};
  const t = ov.text || {};
  const media = ov.media || {};

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section
        className="relative flex items-end overflow-hidden"
        style={{ minHeight: "65vh" }}
      >
        {/* Background image */}
        <div
          className="absolute inset-0"
          data-cms-img="beliefs-hero-img"
          style={{ borderRadius: 0 }}
        >
          <Image
            src={assetPath(media["beliefs-hero-img"] || "/images/worship.webp")}
            alt="Congregation in worship"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
            style={imgCss(ov.img?.["beliefs-hero-img"])}
          />
          {/* Base dark scrim */}
          <div
            className="absolute inset-0"
            style={{ background: "rgba(10,10,10,0.55)" }}
          />
          {/* Bottom-to-top gradient for text legibility */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.40) 50%, rgba(10,10,10,0.08) 100%)",
            }}
          />
        </div>

        {/* Hero content */}
        <div
          className="relative z-10 container-c3 w-full"
          style={{ paddingBottom: "clamp(3.5rem, 7vw, 6rem)", paddingTop: "clamp(7rem, 12vw, 10rem)" }}
        >
          <p
            className="overline mb-4"
            data-cms="t:beliefs-hero-eyebrow"
            style={{ color: "#1cc3af" }}
            dangerouslySetInnerHTML={{ __html: tx(t, "beliefs-hero-eyebrow", "Our Foundation") }}
          />
          <h1
            className="display-1 text-white"
            data-cms="t:beliefs-hero-title"
            style={{ maxWidth: "20ch" }}
            dangerouslySetInnerHTML={{ __html: tx(t, "beliefs-hero-title", "What We Believe") }}
          />
          <p
            className="body-lg mt-5"
            data-cms="t:beliefs-hero-body"
            style={{ color: "rgba(255,255,255,0.68)", maxWidth: "52ch" }}
            dangerouslySetInnerHTML={{
              __html: tx(
                t,
                "beliefs-hero-body",
                "These are the convictions that anchor everything we do at C3 — rooted in Scripture, centered on Jesus."
              ),
            }}
          />
        </div>
      </section>

      {/* ── Beliefs list — sticky left rail + scrollable items ─────── */}
      <section className="section" style={{ backgroundColor: "#ffffff" }}>
        <div className="container-c3">
          <div className="flex flex-col lg:flex-row lg:gap-20 xl:gap-28">

            {/* ── Left rail — sticky intro ─────────────────────────── */}
            <aside className="lg:w-80 xl:w-96 shrink-0 mb-14 lg:mb-0">
              <div className="lg:sticky lg:top-32">
                <p
                  className="overline mb-4"
                  data-cms="t:beliefs-rail-eyebrow"
                  style={{ color: "#1cc3af" }}
                  dangerouslySetInnerHTML={{ __html: tx(t, "beliefs-rail-eyebrow", "Our Convictions") }}
                />
                <h2
                  className="heading-1 mb-6"
                  data-cms="t:beliefs-rail-heading"
                  style={{ color: "#1b1c1c" }}
                  dangerouslySetInnerHTML={{ __html: tx(t, "beliefs-rail-heading", "The beliefs that anchor us.") }}
                />
                <p
                  className="body-base"
                  data-cms="t:beliefs-rail-body"
                  style={{ color: "rgba(27,28,28,0.65)" }}
                  dangerouslySetInnerHTML={{
                    __html: tx(
                      t,
                      "beliefs-rail-body",
                      "At Celebration Community Church, we hold to the historic, orthodox Christian faith as revealed in Scripture. These beliefs are not negotiable — they are the foundation of our community and the source of our hope."
                    ),
                  }}
                />

                {/* Teal accent rule */}
                <div
                  className="mt-10 hidden lg:block"
                  style={{
                    width: 40,
                    height: 3,
                    borderRadius: 2,
                    background: "#1cc3af",
                  }}
                />
              </div>
            </aside>

            {/* ── Right column — belief items ───────────────────────── */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col gap-0">
                {beliefs.map((belief, i) => (
                  <div
                    key={belief.id}
                    className="py-10 group"
                    style={{ borderBottom: "1px solid rgba(27,28,28,0.10)" }}
                  >
                    <div className="flex gap-6 md:gap-10">

                      {/* Number badge */}
                      <div className="shrink-0 pt-1">
                        <span
                          className="text-sm font-bold tabular-nums"
                          style={{ color: "#1cc3af", letterSpacing: "0.02em" }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3
                          className="heading-2 mb-4"
                          data-cms={`t:beliefs-item-${belief.id}-title`}
                          style={{ color: "#1b1c1c" }}
                          dangerouslySetInnerHTML={{
                            __html: tx(t, `beliefs-item-${belief.id}-title`, belief.title),
                          }}
                        />
                        <div className="flex flex-col gap-4">
                          {belief.paragraphs.map((para, pi) => (
                            <p
                              key={pi}
                              className="body-lg"
                              data-cms={`t:beliefs-item-${belief.id}-p${pi}`}
                              style={{ color: "rgba(27,28,28,0.68)", lineHeight: 1.75 }}
                              dangerouslySetInnerHTML={{
                                __html: tx(t, `beliefs-item-${belief.id}-p${pi}`, para),
                              }}
                            />
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Bottom CTA ────────────────────────────────────────────────── */}
      <section className="section" style={{ backgroundColor: "#1b1c1c" }}>
        <div
          className="container-c3 text-center"
          style={{ maxWidth: "40rem" }}
        >
          {/* Teal eyebrow */}
          <p
            className="overline mb-4"
            data-cms="t:beliefs-cta-eyebrow"
            style={{ color: "#1cc3af" }}
            dangerouslySetInnerHTML={{ __html: tx(t, "beliefs-cta-eyebrow", "Questions welcome") }}
          />

          <h2
            className="display-2 text-white mb-5"
            data-cms="t:beliefs-cta-heading"
            dangerouslySetInnerHTML={{ __html: tx(t, "beliefs-cta-heading", "Have questions?") }}
          />
          <p
            className="body-lg mb-10"
            data-cms="t:beliefs-cta-body"
            style={{ color: "rgba(255,255,255,0.60)" }}
            dangerouslySetInnerHTML={{
              __html: tx(
                t,
                "beliefs-cta-body",
                "For any questions regarding our statement of beliefs, please email office@celebratejesus.org."
              ),
            }}
          />

          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href={t["beliefs-cta-primary-href"] || "mailto:office@celebratejesus.org"}
              data-cms-link="beliefs-cta-primary"
              className="btn btn-primary btn-lg"
            >
              <span data-cms-link-label>
                {tx(t, "beliefs-cta-primary-label", "Email Our Office")}
              </span>
            </a>
            <Link
              href={t["beliefs-cta-secondary-href"] || "/visit/"}
              data-cms-link="beliefs-cta-secondary"
              className="btn btn-outline btn-lg"
            >
              <span data-cms-link-label>
                {tx(t, "beliefs-cta-secondary-label", "Plan a Visit")}
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
