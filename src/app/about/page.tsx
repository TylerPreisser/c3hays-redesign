import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getCMSPage } from "@/lib/cms";
import { tx, imgCss } from "@/lib/home-content";
import { assetPath } from "@/lib/asset-path";
import OurValues from "@/components/about/OurValues";
import StaffGrid from "@/components/about/StaffGrid";
import Section from "@/components/ui/Section";
import Stack from "@/components/ui/Stack";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about who we are and meet the leadership of Celebration Community Church — a church family in western Kansas.",
};

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
          <div
            className="absolute inset-0"
            style={{ background: "rgba(10,10,10,0.52)" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.18) 55%, transparent 100%)",
            }}
          />
        </div>

        <div className="relative z-10 container-c3 pb-20 pt-40">
          {/* A1 — deliberate eyebrow → heading → subhead rhythm via Wave-0 Stack */}
          <Stack gap="heading">
            <Stack gap="eyebrow">
              <p
                className="overline"
                style={{ color: "#1cc3af" }}
                data-cms="t:about-hero-eyebrow"
                dangerouslySetInnerHTML={{
                  __html: tx(t, "about-hero-eyebrow", "About Us"),
                }}
              />
              <h1
                className="display-1 text-white text-balance"
                data-cms="t:about-hero-heading"
                dangerouslySetInnerHTML={{
                  __html: tx(t, "about-hero-heading", "Who we are."),
                }}
              />
            </Stack>
            <p
              className="body-lg max-w-xl"
              style={{ color: "rgba(255,255,255,0.68)" }}
              data-cms="t:about-hero-subhead"
              dangerouslySetInnerHTML={{
                __html: tx(
                  t,
                  "about-hero-subhead",
                  "Jesus is central to everything we do at C3. We exist to meet with Him, grow in Him, and serve through Him."
                ),
              }}
            />
          </Stack>
        </div>
      </section>

      {/* ── Who We Are (A2) ──────────────────────────────────────────────────
          items-start so the copy anchors to the top of the image row (no
          vertically-stranded text); rhythm via Wave-0 Stack tokens. */}
      <Section tone="white" container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-24 items-start">
          {/* Text column */}
          <div className="flex flex-col">
            <Stack gap="eyebrow">
              <p
                className="overline"
                style={{ color: "#1cc3af" }}
                data-cms="t:about-who-eyebrow"
                dangerouslySetInnerHTML={{
                  __html: tx(t, "about-who-eyebrow", "Who We Are"),
                }}
              />
              <h2
                className="display-2 text-balance"
                style={{ color: "#1b1c1c" }}
                data-cms="t:about-who-title"
                dangerouslySetInnerHTML={{
                  __html: tx(t, "about-who-title", "A relationship, not religion."),
                }}
              />
            </Stack>

            <Stack gap="body" style={{ marginTop: "var(--space-heading)" }}>
              <p
                className="body-lg"
                style={{ color: "rgba(27,28,28,0.80)", fontWeight: 500, lineHeight: 1.7 }}
                data-cms="t:about-who-lead"
                dangerouslySetInnerHTML={{
                  __html: tx(
                    t,
                    "about-who-lead",
                    "We believe that being a part of the local church is not about religion, but a relationship with Jesus."
                  ),
                }}
              />
              <p
                className="body-base"
                style={{ color: "rgba(27,28,28,0.65)", lineHeight: 1.8 }}
                data-cms="t:about-who-body"
                dangerouslySetInnerHTML={{
                  __html: tx(
                    t,
                    "about-who-body",
                    "We want you to join us as you are; there isn&apos;t a mold you have to fit before you walk through our doors."
                  ),
                }}
              />
            </Stack>

            <div style={{ marginTop: "var(--space-cta)" }}>
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

          {/* Image column — min-height trimmed so the two columns balance */}
          <div
            className="relative overflow-hidden lg:min-h-[460px] min-h-[320px]"
            data-cms-img="about-who-img"
            style={{ borderRadius: "var(--radius-md)" }}
          >
            <Image
              src={assetPath(media["about-who-img"] || media["about-mission-img"] || "/images/gather.webp")}
              alt="Church family gathered together"
              fill
              className="object-cover"
              style={imgCss(ov.img?.["about-who-img"])}
            />
          </div>
        </div>
      </Section>

      {/* ── Our Values — redesigned (Meet / Grow / Serve) ─────────────────── */}
      <OurValues text={t} />

      {/* ── Meet Our Staff — real 14-person roster ────────────────────────── */}
      <StaffGrid text={t} img={ov.img} />

    </>
  );
}
