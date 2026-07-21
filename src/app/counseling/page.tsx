import type { Metadata } from "next";
import Image from "next/image";
import { Phone, DollarSign, CheckCircle, GraduationCap } from "lucide-react";
import { counselors } from "@/data/counselors";
import { assetPath } from "@/lib/asset-path";
import { getPageContent } from "@/lib/cms";
import { isCmsLive } from "@/lib/cms-live";
import { imgCss, parseSections, type SectionMeta } from "@/lib/home-content";
import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";
import PageComposer from "@/components/cms/PageComposer";
import { Tx, EditableLink } from "@/components/cms/Editable";

export const metadata: Metadata = {
  title: "Counseling",
  description:
    "Bible-based counseling at C3 — trained counselors helping you develop spiritually healthy relationships with God and others.",
};

/**
 * /counseling is editor-native (contract §1–§3): it composes into the SAME ordered
 * sections c3-backend's `defaultSectionsForSlug("/counseling")` declares —
 * counseling-hero / counseling-team / counseling-fees — each wrapped in a
 * `<div data-section>` so the rail can add/reorder/hide/recolor it, and every tile
 * carries its own Layer-1 handles (`data-cms` text, `data-cms-bg` card bg,
 * `data-cms-img` hero photo, `data-cms-link`+label button).
 *
 * Content is STRICTLY from celebratejesus.org/counseling (verified): the three
 * counselors + the "Make An Appointment" primary action live on the real site.
 * The counselor cards keep `@/data/counselors` as fallbacks but route
 * role/name/bio through <Tx>. Server component.
 *
 * Theme mirrors HOME's alternating rhythm — hero photo → WHITE counselor-team
 * section (clean white cards) → subtle MIST fees dropdown. No legacy tan tokens.
 */

/** MUST match c3-backend `page-sections.ts` `/counseling` verbatim (shared key-space). */
const PAGE_DEFAULT_SECTIONS: SectionMeta[] = [
  { id: "counseling-hero", visible: true },
  { id: "counseling-team", visible: true },
  { id: "counseling-fees", visible: true },
];

/** One line in a fees/policy dropdown — teal check + CMS-wired (editable) text. */
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

/** Small micro-label used above groups inside the counselor cards. */
function CardLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="overline"
      style={{ color: "var(--color-mute)", fontSize: "0.7rem" }}
    >
      {children}
    </p>
  );
}

/**
 * One slim, quiet dropdown row in the fees section — native <details>/<summary>
 * (zero-JS, static-export safe), modeled on home's FaqAccordion but on a LIGHT
 * surface. Editable title via <Tx>; the practical detail lines are passed as
 * children (each a CMS-wired <PolicyLine>).
 */
function FeeItem({
  icon,
  titleK,
  titleFallback,
  t,
  children,
}: {
  icon: React.ReactNode;
  titleK: string;
  titleFallback: string;
  t: Record<string, string>;
  children: React.ReactNode;
}) {
  return (
    <details
      data-anim="fadeInUp"
      style={{
        background: "#fff",
        border: "1px solid rgba(27,28,28,0.08)",
        borderRadius: "var(--radius-md)",
        boxShadow: "var(--shadow-rest)",
        padding: "1.1rem 1.35rem",
      }}
    >
      <summary
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          cursor: "pointer",
          listStyle: "none",
          color: "var(--color-ink)",
          fontWeight: 600,
          fontSize: "1.02rem",
        }}
      >
        <span
          aria-hidden
          style={{ color: "var(--color-teal)", display: "inline-flex" }}
        >
          {icon}
        </span>
        <Tx as="span" text={t} k={titleK} fallback={titleFallback} style={{ flex: 1 }} />
        <span aria-hidden style={{ color: "var(--color-teal)", flex: "0 0 auto", fontSize: "1.25rem", lineHeight: 1 }}>
          +
        </span>
      </summary>
      <ul
        className="flex flex-col gap-2 body-sm"
        style={{ color: "var(--color-mute)", margin: "0.9rem 0 0.15rem" }}
      >
        {children}
      </ul>
    </details>
  );
}

export const dynamic = "force-dynamic";

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
  const cmsLive = isCmsLive();
  const sp = cmsLive && searchParams ? await searchParams : {};
  const preview = typeof sp.preview === "string" ? sp.preview : undefined;

  const ov = (await getPageContent("/counseling", preview)) || {};
  const t = ov.text || {};
  const media = ov.media || {};
  const sections = parseSections(ov.sections, PAGE_DEFAULT_SECTIONS);

  /* ── counseling-hero — top photo band, editable photo + headline + primary CTA ── */
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
        {/* Neutral base scrim */}
        <div className="absolute inset-0" style={{ background: "rgba(10,10,10,0.56)" }} />
        {/* Bottom-to-top neutral gradient for headline readability */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.30) 55%, rgba(10,10,10,0.04) 100%)",
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
              fallback="A team approach to Bible-based counseling — trained counselors helping you grow spiritually, emotionally, and relationally."
              className="text-balance"
              style={{ color: "rgba(255,255,255,0.78)" }}
            />
          }
        />
        {/* Primary action — the real site's "Make An Appointment" CTA. */}
        <div style={{ marginTop: "var(--space-block)" }}>
          <EditableLink
            text={t}
            k="counseling-hero-cta"
            href="/connect/"
            label="Make An Appointment"
            className="btn btn-primary btn-lg"
          />
        </div>
      </div>
    </section>
  );

  /* ── counseling-team — the three real counselors as editor-native cards.
        Clean on-theme WHITE section with white cards (mirrors home's rhythm):
        teal role eyebrow → ink name + muted credentials → muted bio →
        teal-tinted specialty CHIPS → muted education footer pinned to the card
        base (even heights). ── */
  const teamSection = (
    <Section container tone="white" style={{ color: "var(--color-ink)" }}>
      <SectionHeader
        leadMaxWidth="48rem"
        style={{ marginBottom: "var(--space-block)" }}
        eyebrow={<Tx text={t} k="counseling-team-eyebrow" fallback="Our Team" />}
        title={
          <Tx
            as="span"
            text={t}
            k="counseling-team-heading"
            fallback="Meet the counselors"
          />
        }
        lead={
          <Tx
            as="span"
            text={t}
            k="counseling-team-lead"
            fallback="A team approach to Bible-based counseling — trained counselors ready to walk with you toward wholeness in Christ."
            style={{ color: "var(--color-mute)" }}
          />
        }
      />

      {/* Counselor cards — each is its OWN editable tile: data-cms-bg on the
          container, role/name/bio routed through <Tx> (keys derived from the
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
            className="flex flex-col h-full"
            style={{
              padding: "clamp(1.75rem, 3vw, 2.25rem)",
              background: "#fff",
              border: "1px solid rgba(27,28,28,0.08)",
              borderRadius: "var(--radius-md)",
              boxShadow: "var(--shadow-rest)",
            }}
          >
            {/* Role — teal eyebrow (editable) */}
            <Tx
              as="p"
              className="overline"
              style={{ color: "var(--color-teal)" }}
              text={t}
              k={`counseling-${c.id}-role`}
              fallback={c.title}
            />

            {/* Name + credentials (name editable) */}
            <h3
              className="heading-3"
              style={{ color: "var(--color-ink)", marginTop: "var(--space-eyebrow)" }}
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
                  style={{ color: "var(--color-mute)", fontSize: "0.85rem" }}
                >
                  {c.credentials}
                </span>
              )}
            </h3>

            {/* Bio (editable) */}
            <Tx
              as="p"
              className="body-sm"
              text={t}
              k={`counseling-${c.id}-bio`}
              fallback={c.bio}
              style={{ color: "var(--color-mute)", marginTop: "var(--space-heading)" }}
            />

            {/* Specialties — calm teal-tinted chips. */}
            <div style={{ marginTop: "var(--space-body)" }}>
              <CardLabel>Specialties</CardLabel>
              <ul className="flex flex-wrap gap-2" style={{ marginTop: "0.6rem" }}>
                {c.specialties.map((s) => (
                  <li
                    key={s}
                    style={{
                      fontSize: "0.75rem",
                      lineHeight: 1.2,
                      padding: "0.34rem 0.68rem",
                      borderRadius: "var(--radius-pill)",
                      background: "rgba(28,195,175,0.10)",
                      color: "var(--color-ink)",
                      border: "1px solid rgba(28,195,175,0.22)",
                    }}
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Education — muted footer pinned to the card base (even card heights). */}
            <div
              className="flex items-start gap-2"
              style={{
                marginTop: "auto",
                paddingTop: "var(--space-body)",
                borderTop: "1px solid rgba(27,28,28,0.08)",
              }}
            >
              <GraduationCap
                size={15}
                style={{ color: "var(--color-teal)", marginTop: 2 }}
                className="shrink-0"
              />
              <p className="text-xs" style={{ color: "var(--color-mute)", lineHeight: 1.5 }}>
                {c.education.join(" · ")}
              </p>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );

  /* ── counseling-fees — practical details as a SUBTLE, quiet dropdown on a light
        MIST surface (native <details>, modeled on home's FaqAccordion). Replaces
        the old loud dark 3-card band. All real content retained; counseling-* cms
        keys preserved so authored overrides survive. ── */
  const feesSection = (
    <Section container tone="mist" style={{ color: "var(--color-ink)" }}>
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
            style={{ color: "var(--color-ink)" }}
          />
        }
      />

      <div
        className="flex flex-col"
        style={{ gap: "0.75rem", maxWidth: "48rem", marginInline: "auto" }}
      >
        {/* Fees */}
        <FeeItem
          t={t}
          icon={<DollarSign size={18} />}
          titleK="counseling-fees-heading"
          titleFallback="Fees"
        >
          <PolicyLine k="counseling-fee-rate" t={t} fallback="$75 / session" />
          <PolicyLine
            k="counseling-fee-payment"
            t={t}
            fallback="Cash or check — some counselors also accept credit card and Venmo"
          />
          <PolicyLine
            k="counseling-fee-due"
            t={t}
            fallback="All payments due to your counselor at the time of your appointment"
          />
          <PolicyLine
            k="counseling-fee-scholarship"
            t={t}
            fallback="Scholarships may be available"
          />
        </FeeItem>

        {/* Cancellation */}
        <FeeItem
          t={t}
          icon={<Phone size={18} />}
          titleK="counseling-cancel-heading"
          titleFallback="Cancellation Policy"
        >
          <PolicyLine
            k="counseling-cancel-notice"
            t={t}
            fallback="Please cancel more than 24 hours prior to your appointment"
          />
          <PolicyLine
            k="counseling-cancel-noshow"
            t={t}
            fallback="Appointments not cancelled 24 hours prior are charged the $75 session fee"
          />
        </FeeItem>

        {/* Getting started — real contact path from celebratejesus.org */}
        <FeeItem
          t={t}
          icon={<CheckCircle size={18} />}
          titleK="counseling-start-heading"
          titleFallback="Getting Started"
        >
          <PolicyLine
            k="counseling-start-step1"
            t={t}
            fallback="Email office@celebratejesus.org to request an appointment"
          />
          <PolicyLine
            k="counseling-start-step2"
            t={t}
            fallback="Or call the church office at (785) 625-5483"
          />
        </FeeItem>
      </div>
    </Section>
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
