import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Phone, DollarSign, CheckCircle } from "lucide-react";
import { counselors } from "@/data/counselors";
import { assetPath } from "@/lib/asset-path";
import { getCMSPage } from "@/lib/cms";
import { tx, imgCss } from "@/lib/home-content";
import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";
import Stack from "@/components/ui/Stack";
import FeatureCard from "@/components/ui/FeatureCard";

export const metadata: Metadata = {
  title: "Counseling",
  description:
    "Bible-based counseling at C3 — trained counselors helping you develop spiritually healthy relationships with God and others.",
};

/** CMS-wired inline node (preserves the editor hook + rich text on a primitive). */
function Cms({
  k,
  t,
  fallback,
}: {
  k: string;
  t: Record<string, string>;
  fallback: string;
}) {
  return (
    <span data-cms={`t:${k}`} dangerouslySetInnerHTML={{ __html: tx(t, k, fallback) }} />
  );
}

/** One line in a dark policy card (teal check + CMS-wired text). */
function PolicyLine({
  k,
  t,
  fallback,
}: {
  k: string;
  t: Record<string, string>;
  fallback: string;
}) {
  return (
    <li className="flex items-start gap-2.5">
      <CheckCircle size={14} style={{ color: "#1cc3af", marginTop: 3 }} className="shrink-0" />
      <span data-cms={`t:${k}`} dangerouslySetInnerHTML={{ __html: tx(t, k, fallback) }} />
    </li>
  );
}

export default async function CounselingPage() {
  const ov = (await getCMSPage("/counseling")) || {};
  const t = ov.text || {};
  const media = ov.media || {};

  return (
    <>
      {/* ── Hero — full-bleed with gradient scrim ── */}
      <section className="relative flex items-end overflow-hidden" style={{ minHeight: "56vh" }}>
        <div className="absolute inset-0" data-cms-img="counseling-hero-bg">
          <Image
            src={assetPath(media["counseling-hero-bg"] || "/images/congregation.webp")}
            alt="C3 congregation worshipping together"
            fill
            className="object-cover"
            priority
            style={imgCss(ov.img?.["counseling-hero-bg"])}
          />
          {/* Base scrim */}
          <div className="absolute inset-0" style={{ background: "rgba(10,10,10,0.55)" }} />
          {/* Bottom-to-top gradient for headline readability */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.18) 60%, transparent 100%)",
            }}
          />
        </div>

        <div className="relative z-10 container-c3 pb-16 pt-44">
          <Stack gap="heading" style={{ maxWidth: "36rem" }}>
            <Stack gap="eyebrow">
              <p
                data-cms="t:counseling-hero-eyebrow"
                className="overline"
                style={{ color: "#1cc3af" }}
                dangerouslySetInnerHTML={{ __html: tx(t, "counseling-hero-eyebrow", "C3 Counseling") }}
              />
              <h1
                data-cms="t:counseling-hero-heading"
                className="display-1 text-white text-balance"
                dangerouslySetInnerHTML={{ __html: tx(t, "counseling-hero-heading", "Counseling") }}
              />
            </Stack>
            <p
              data-cms="t:counseling-hero-sub"
              className="body-lg text-balance"
              style={{ color: "rgba(255,255,255,0.72)" }}
              dangerouslySetInnerHTML={{
                __html: tx(
                  t,
                  "counseling-hero-sub",
                  "Professional, Bible-based counseling — for people who want to grow in wholeness."
                ),
              }}
            />
          </Stack>
        </div>
      </section>

      {/* ── Vision intro + counselors ── */}
      <Section tone="white" container>
        <SectionHeader
          eyebrow={<Cms k="counseling-vision-eyebrow" t={t} fallback="Our Mission" />}
          title={<Cms k="counseling-vision-heading" t={t} fallback="Whole people, through Christ." />}
          lead={
            <Cms
              k="counseling-vision-body"
              t={t}
              fallback="Helping people develop spiritually healthy relationships with God through Jesus Christ — and supporting emotional and relational wellness with a team of trained, Bible-based counselors."
            />
          }
          leadMaxWidth="48rem"
          style={{ marginBottom: "var(--space-block)" }}
        />

        {/* ── Counselor cards — contained, equal-height, hover-bloom ── */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 items-stretch"
          style={{ gap: "var(--space-body)" }}
        >
          {counselors.map((c) => (
            <article
              key={c.id}
              className="bento-tile flex flex-col h-full"
              style={{
                padding: "clamp(1.75rem, 3vw, 2.5rem)",
                background: "#fff",
                border: "1px solid rgba(27,28,28,0.08)",
                borderRadius: "var(--radius-md)",
                boxShadow: "var(--shadow-rest)",
              }}
            >
              {/* Monogram avatar */}
              <div
                className="flex items-center justify-center shrink-0"
                style={{
                  width: "3.5rem",
                  height: "3.5rem",
                  marginBottom: "var(--space-heading)",
                  borderRadius: 999,
                  background: "rgba(28, 195, 175, 0.12)",
                  border: "2px solid #1cc3af",
                }}
              >
                <span className="font-bold tracking-wide" style={{ color: "#179c8c", fontSize: "1.05rem" }}>
                  {c.name.split(" ").map((n) => n[0]).join("")}
                </span>
              </div>

              {/* Name + credentials */}
              <h3 className="heading-3" style={{ color: "#1b1c1c" }}>
                {c.name}
                {c.credentials && (
                  <span className="font-normal ml-1.5" style={{ color: "rgba(27,28,28,0.5)", fontSize: "0.9rem" }}>
                    {c.credentials}
                  </span>
                )}
              </h3>
              <p
                className="font-semibold"
                style={{ color: "#179c8c", fontSize: "0.9rem", marginTop: "0.4rem" }}
              >
                {c.title}
              </p>
              <p
                className="body-sm flex-1"
                style={{ color: "var(--color-mute)", marginTop: "var(--space-body)" }}
              >
                {c.bio}
              </p>

              {/* Specialties */}
              <div style={{ marginTop: "var(--space-body)" }}>
                <p
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: "rgba(27,28,28,0.4)", marginBottom: "0.85rem" }}
                >
                  Specialties
                </p>
                <ul className="flex flex-col gap-2">
                  {c.specialties.map((s) => (
                    <li
                      key={s}
                      className="flex items-center gap-2 body-sm"
                      style={{ color: "var(--color-mute)" }}
                    >
                      <CheckCircle size={13} style={{ color: "#1cc3af" }} className="shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Education */}
              <div style={{ marginTop: "var(--space-body)" }}>
                <p
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: "rgba(27,28,28,0.4)", marginBottom: "0.6rem" }}
                >
                  Education
                </p>
                <ul className="flex flex-col gap-1.5">
                  {c.education.map((e) => (
                    <li key={e} className="text-xs" style={{ color: "rgba(27,28,28,0.45)" }}>
                      {e}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* ── Fees & Policies — dark section, equal-height FeatureCards ── */}
      <Section tone="dark" container>
        <SectionHeader
          eyebrow={
            <span style={{ color: "#1cc3af" }}>
              <Cms k="counseling-policies-eyebrow" t={t} fallback="Practical Details" />
            </span>
          }
          title={
            <span className="text-white">
              <Cms k="counseling-policies-heading" t={t} fallback="Fees &amp; Policies" />
            </span>
          }
          style={{ marginBottom: "var(--space-block)" }}
        />

        <div
          className="grid grid-cols-1 md:grid-cols-3 items-stretch"
          style={{ gap: "var(--space-body)" }}
        >
          {/* Fees */}
          <FeatureCard
            tone="dark"
            icon={<DollarSign size={24} />}
            title={<Cms k="counseling-fees-heading" t={t} fallback="Fees" />}
          >
            <ul
              className="flex flex-col gap-3 body-sm"
              style={{ color: "rgba(255,255,255,0.62)", marginTop: "var(--space-heading)" }}
            >
              <PolicyLine k="counseling-fee-rate" t={t} fallback="$75 / session (reduced rate)" />
              <PolicyLine
                k="counseling-fee-payment"
                t={t}
                fallback="Cash, check; some counselors accept credit / Venmo"
              />
              <PolicyLine k="counseling-fee-due" t={t} fallback="Payment due at appointment" />
              <PolicyLine
                k="counseling-fee-scholarship"
                t={t}
                fallback="Scholarships available on a case-by-case basis"
              />
            </ul>
          </FeatureCard>

          {/* Cancellation */}
          <FeatureCard
            tone="dark"
            icon={<Phone size={24} />}
            title={<Cms k="counseling-cancel-heading" t={t} fallback="Cancellation Policy" />}
          >
            <ul
              className="flex flex-col gap-3 body-sm"
              style={{ color: "rgba(255,255,255,0.62)", marginTop: "var(--space-heading)" }}
            >
              <PolicyLine
                k="counseling-cancel-notice"
                t={t}
                fallback="24-hour notice required for cancellations"
              />
              <PolicyLine
                k="counseling-cancel-noshow"
                t={t}
                fallback="No-shows are charged the $75 session fee"
              />
            </ul>
          </FeatureCard>

          {/* Getting started */}
          <FeatureCard
            tone="dark"
            icon={<CheckCircle size={24} />}
            title={<Cms k="counseling-start-heading" t={t} fallback="Getting Started" />}
          >
            <ul
              className="flex flex-col gap-3 body-sm"
              style={{ color: "rgba(255,255,255,0.62)", marginTop: "var(--space-heading)" }}
            >
              <PolicyLine
                k="counseling-start-step1"
                t={t}
                fallback="Reach out via our connect form or call the church office"
              />
              <PolicyLine
                k="counseling-start-step2"
                t={t}
                fallback="We&apos;ll match you with the right counselor for your needs"
              />
              <PolicyLine
                k="counseling-start-step3"
                t={t}
                fallback="Confidential — your privacy is always protected"
              />
            </ul>
          </FeatureCard>
        </div>
      </Section>

      {/* ── Connect CTA — contained, roomy closing moment ── */}
      <Section tone="mist" container>
        <div
          className="mx-auto"
          style={{
            maxWidth: "52rem",
            background: "#fff",
            border: "1px solid rgba(27,28,28,0.07)",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-rest)",
            padding: "clamp(2.5rem, 5vw, 4rem)",
          }}
        >
          <Stack gap="cta" align="center">
            <SectionHeader
              align="center"
              eyebrow={<Cms k="counseling-cta-eyebrow" t={t} fallback="Take the first step" />}
              title={<Cms k="counseling-cta-heading" t={t} fallback="You don&apos;t have to carry it alone." />}
              lead={
                <Cms
                  k="counseling-cta-body"
                  t={t}
                  fallback="Reach out to our team and we&apos;ll connect you with the right counselor for your needs."
                />
              }
              leadMaxWidth="34rem"
            />
            <Link
              href={t["counseling-cta-btn-href"] || "/connect/"}
              data-cms-link="counseling-cta-btn"
              className="btn btn-primary btn-lg"
            >
              <span data-cms-link-label>
                {tx(t, "counseling-cta-btn-label", "Get Connected")}
              </span>
            </Link>
          </Stack>
        </div>
      </Section>
    </>
  );
}
