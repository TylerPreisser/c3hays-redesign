import type { Metadata } from "next";
import Image from "next/image";
import { Phone, DollarSign, CheckCircle } from "lucide-react";
import { counselors } from "@/data/counselors";
import { assetPath } from "@/lib/asset-path";
import { getPageContent } from "@/lib/cms";
import { imgCss, parseSections, type SectionMeta } from "@/lib/home-content";
import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";
import Stack from "@/components/ui/Stack";
import FeatureCard from "@/components/ui/FeatureCard";
import PageComposer from "@/components/cms/PageComposer";
import { Tx, EditableLink } from "@/components/cms/Editable";

export const metadata: Metadata = {
  title: "Counseling",
  description:
    "Bible-based counseling at C3 — trained counselors helping you develop spiritually healthy relationships with God and others.",
};

/**
 * /counseling is now editor-native (contract §1–§3): it composes into the SAME
 * three ordered sections c3-backend's `defaultSectionsForSlug("/counseling")`
 * declares — so the editor rail can add/reorder/hide/recolor each — and every
 * tile inside carries its own Layer-1 handles (`data-cms` text, `data-cms-bg`
 * card bg, `data-cms-img` hero photo, `data-cms-link`+label button). The
 * counselor cards, previously bespoke JSX bolted onto `@/data/counselors`, keep
 * that data as fallbacks but route name/role/bio through <Tx>. Server component.
 */

/** MUST match c3-backend `page-sections.ts` `/counseling` verbatim (shared key-space). */
const PAGE_DEFAULT_SECTIONS: SectionMeta[] = [
  { id: "counseling-hero", visible: true },
  { id: "counseling-team", visible: true },
  { id: "counseling-fees", visible: true },
];

/** One line in a policy card — teal check + CMS-wired (editable) text. */
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
      <CheckCircle
        size={14}
        style={{ color: "var(--color-teal)", marginTop: 3 }}
        className="shrink-0"
      />
      <Tx text={t} k={k} fallback={fallback} />
    </li>
  );
}

/** Small warm micro-label used above lists inside the counselor cards. */
function CardLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="overline"
      style={{ color: "var(--color-stone)", fontSize: "0.7rem" }}
    >
      {children}
    </p>
  );
}

export default async function CounselingPage({
  searchParams,
}: {
  // Preview mode (U6): the editor iframe carries `?cmsEdit=1&preview=<token>`.
  // A tokenless/public request never receives a token, so it never gets draft.
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
} = {}) {
  // Preview only exists in the CMS_LIVE server runtime. In the static-export build
  // CMS_LIVE is unset, so we must NOT read searchParams (that forces dynamic
  // rendering and breaks `output: export`).
  const cmsLive = process.env.CMS_LIVE === "1";
  const sp = cmsLive && searchParams ? await searchParams : {};
  const preview = typeof sp.preview === "string" ? sp.preview : undefined;

  const ov = (await getPageContent("/counseling", preview)) || {};
  const t = ov.text || {};
  const media = ov.media || {};
  const sections = parseSections(ov.sections, PAGE_DEFAULT_SECTIONS);

  /* ── counseling-hero — top photo band (editable image + editable headline) ── */
  const heroSection = (
    <section
      className="relative flex items-end overflow-hidden"
      style={{ minHeight: "60vh" }}
    >
      {/* Top PHOTO — swappable in the editor via data-cms-img. */}
      <div className="absolute inset-0" data-cms-img="counseling-hero-bg">
        <Image
          src={assetPath(media["counseling-hero-bg"] || "/images/congregation.webp")}
          alt="C3 congregation worshipping together"
          fill
          className="object-cover"
          priority
          style={imgCss(ov.img?.["counseling-hero-bg"])}
        />
        {/* Warm base scrim (ink-warm) */}
        <div className="absolute inset-0" style={{ background: "rgba(26,24,21,0.56)" }} />
        {/* Bottom-to-top warm gradient for headline readability */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(26,24,21,0.92) 0%, rgba(26,24,21,0.30) 55%, rgba(26,24,21,0.04) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 container-c3 pb-16 pt-44" data-anim="fadeInUp">
        <SectionHeader
          titleAs="h1"
          titleClassName="display-1"
          leadMaxWidth="34rem"
          style={{ maxWidth: "40rem" }}
          eyebrow={
            <Tx
              text={t}
              k="counseling-hero-eyebrow"
              fallback="C3 Counseling"
              style={{ color: "var(--color-teal)" }}
            />
          }
          title={
            <Tx
              as="span"
              text={t}
              k="counseling-hero-heading"
              fallback="Counseling"
              className="text-balance"
              style={{ color: "#fff" }}
            />
          }
          lead={
            <Tx
              as="span"
              text={t}
              k="counseling-hero-sub"
              fallback="Professional, Bible-based counseling — for people who want to grow in wholeness."
              className="text-balance"
              style={{ color: "rgba(255,255,255,0.78)" }}
            />
          }
        />
      </div>
    </section>
  );

  /* ── counseling-team — mission intro + editable counselor cards ── */
  const teamSection = (
    <Section
      container
      style={{ background: "var(--color-paper)", color: "var(--color-ink-warm)" }}
    >
      <SectionHeader
        leadMaxWidth="48rem"
        style={{ marginBottom: "var(--space-block)" }}
        eyebrow={<Tx text={t} k="counseling-vision-eyebrow" fallback="Our Mission" />}
        title={
          <Tx
            as="span"
            text={t}
            k="counseling-vision-heading"
            fallback="Whole people, through Christ."
          />
        }
        lead={
          <Tx
            as="span"
            text={t}
            k="counseling-vision-body"
            fallback="Helping people develop spiritually healthy relationships with God through Jesus Christ — and supporting emotional and relational wellness with a team of trained, Bible-based counselors."
            style={{ color: "var(--color-stone)" }}
          />
        }
      />

      {/* Counselor cards — each is its OWN editable tile: data-cms-bg on the
          container, and role/name/bio routed through <Tx> (keys derived from the
          counselor id, @/data/counselors values as fallbacks). */}
      <div
        className="grid grid-cols-1 md:grid-cols-3 items-stretch"
        style={{ gap: "var(--space-body)" }}
      >
        {counselors.map((c) => (
          <article
            key={c.id}
            data-anim="fadeInUp"
            data-cms-bg={`counseling-${c.id}-bg`}
            className="bento-tile flex flex-col h-full"
            style={{
              padding: "clamp(1.75rem, 3vw, 2.5rem)",
              background: "var(--color-paper-soft)",
              border: "1px solid var(--color-clay-line)",
              borderRadius: "var(--radius-md)",
              boxShadow: "var(--shadow-rest)",
            }}
          >
            {/* Thin teal accent mark */}
            <span
              aria-hidden="true"
              style={{
                display: "block",
                width: "2.5rem",
                height: "3px",
                borderRadius: "var(--radius-pill)",
                background: "var(--color-teal)",
                marginBottom: "var(--space-heading)",
              }}
            />

            {/* Role as teal eyebrow — editable */}
            <Tx
              as="p"
              className="overline"
              text={t}
              k={`counseling-${c.id}-role`}
              fallback={c.title}
            />

            {/* Name + credentials — name editable */}
            <h3
              className="heading-3"
              style={{ color: "var(--color-ink-warm)", marginTop: "var(--space-eyebrow)" }}
            >
              <Tx
                as="span"
                text={t}
                k={`counseling-${c.id}-name`}
                fallback={c.name}
              />
              {c.credentials && (
                <span
                  className="font-normal ml-1.5"
                  style={{ color: "var(--color-stone)", fontSize: "0.9rem" }}
                >
                  {c.credentials}
                </span>
              )}
            </h3>

            {/* Bio — editable */}
            <Tx
              as="p"
              className="body-sm flex-1"
              text={t}
              k={`counseling-${c.id}-bio`}
              fallback={c.bio}
              style={{ color: "var(--color-stone)", marginTop: "var(--space-body)" }}
            />

            {/* Specialties */}
            <div style={{ marginTop: "var(--space-body)" }}>
              <CardLabel>Specialties</CardLabel>
              <ul className="flex flex-col gap-2" style={{ marginTop: "0.75rem" }}>
                {c.specialties.map((s) => (
                  <li
                    key={s}
                    className="flex items-center gap-2 body-sm"
                    style={{ color: "var(--color-mute)" }}
                  >
                    <CheckCircle
                      size={13}
                      style={{ color: "var(--color-teal)" }}
                      className="shrink-0"
                    />
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Education */}
            <div style={{ marginTop: "var(--space-body)" }}>
              <CardLabel>Education</CardLabel>
              <ul className="flex flex-col gap-1.5" style={{ marginTop: "0.6rem" }}>
                {c.education.map((e) => (
                  <li key={e} className="text-xs" style={{ color: "var(--color-stone)" }}>
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );

  /* ── counseling-fees — fees/policies cards + closing Connect CTA ── */
  const feesSection = (
    <>
      {/* Fees & Policies — warm ink section, editable FeatureCards. */}
      <Section container style={{ background: "var(--color-ink-warm)", color: "#fff" }}>
        <SectionHeader
          style={{ marginBottom: "var(--space-block)" }}
          eyebrow={
            <Tx
              text={t}
              k="counseling-policies-eyebrow"
              fallback="Practical Details"
              style={{ color: "var(--color-teal)" }}
            />
          }
          title={
            <Tx
              as="span"
              text={t}
              k="counseling-policies-heading"
              fallback="Fees &amp; Policies"
              style={{ color: "#fff" }}
            />
          }
        />

        <div
          className="grid grid-cols-1 md:grid-cols-3 items-stretch"
          style={{ gap: "var(--space-body)" }}
        >
          {/* Fees */}
          <div className="h-full" data-anim="fadeInUp">
            <FeatureCard
              tone="dark"
              bgKey="counseling-fees-card-bg"
              icon={<DollarSign size={24} />}
              title={<Tx text={t} k="counseling-fees-heading" fallback="Fees" />}
            >
              <ul
                className="flex flex-col gap-3 body-sm"
                style={{ color: "rgba(255,255,255,0.66)", marginTop: "var(--space-heading)" }}
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
          </div>

          {/* Cancellation */}
          <div className="h-full" data-anim="fadeInUp">
            <FeatureCard
              tone="dark"
              bgKey="counseling-cancel-card-bg"
              icon={<Phone size={24} />}
              title={<Tx text={t} k="counseling-cancel-heading" fallback="Cancellation Policy" />}
            >
              <ul
                className="flex flex-col gap-3 body-sm"
                style={{ color: "rgba(255,255,255,0.66)", marginTop: "var(--space-heading)" }}
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
          </div>

          {/* Getting started */}
          <div className="h-full" data-anim="fadeInUp">
            <FeatureCard
              tone="dark"
              bgKey="counseling-start-card-bg"
              icon={<CheckCircle size={24} />}
              title={<Tx text={t} k="counseling-start-heading" fallback="Getting Started" />}
            >
              <ul
                className="flex flex-col gap-3 body-sm"
                style={{ color: "rgba(255,255,255,0.66)", marginTop: "var(--space-heading)" }}
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
        </div>
      </Section>

      {/* Connect CTA — calm warm closing panel (editable card bg + button). */}
      <Section container style={{ background: "var(--color-paper)" }}>
        <div
          className="mx-auto"
          data-anim="fadeInUp"
          data-cms-bg="counseling-cta-panel-bg"
          style={{
            maxWidth: "52rem",
            background: "var(--color-paper-soft)",
            border: "1px solid var(--color-clay-line)",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-rest)",
            padding: "clamp(2.75rem, 5vw, 4.25rem)",
          }}
        >
          <Stack gap="cta" align="center">
            <SectionHeader
              align="center"
              leadMaxWidth="34rem"
              eyebrow={<Tx text={t} k="counseling-cta-eyebrow" fallback="Take the first step" />}
              title={
                <Tx
                  as="span"
                  text={t}
                  k="counseling-cta-heading"
                  fallback="You don&apos;t have to carry it alone."
                  style={{ color: "var(--color-ink-warm)" }}
                />
              }
              lead={
                <Tx
                  as="span"
                  text={t}
                  k="counseling-cta-body"
                  fallback="Reach out to our team and we&apos;ll connect you with the right counselor for your needs."
                  style={{ color: "var(--color-stone)" }}
                />
              }
            />
            <EditableLink
              text={t}
              k="counseling-cta-btn"
              href="/connect/"
              label="Get Connected"
              className="btn btn-primary btn-lg"
            />
          </Stack>
        </div>
      </Section>
    </>
  );

  const render = (id: string): React.ReactNode => {
    switch (id) {
      case "counseling-hero":
        return heroSection;
      case "counseling-team":
        return teamSection;
      case "counseling-fees":
        return feesSection;
      default:
        return null;
    }
  };

  return (
    <PageComposer sections={sections} bgFill={ov.bgFill} anim={ov.anim} render={render} />
  );
}
