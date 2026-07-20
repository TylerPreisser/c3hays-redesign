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
import FeatureCard from "@/components/ui/FeatureCard";
import PageComposer from "@/components/cms/PageComposer";
import { Tx, EditableLink } from "@/components/cms/Editable";

export const metadata: Metadata = {
  title: "Counseling",
  description:
    "Bible-based counseling at C3 — trained counselors helping you develop spiritually healthy relationships with God and others.",
};

/**
 * /counseling is editor-native (contract §1–§3): it composes into the SAME three
 * ordered sections c3-backend's `defaultSectionsForSlug("/counseling")` declares —
 * counseling-hero / counseling-team / counseling-fees — each wrapped in a
 * `<div data-section>` so the rail can add/reorder/hide/recolor it, and every tile
 * carries its own Layer-1 handles (`data-cms` text, `data-cms-bg` card bg,
 * `data-cms-img` hero photo, `data-cms-link`+label button).
 *
 * Content is STRICTLY from celebratejesus.org/counseling (verified): the three
 * counselors + the "Make An Appointment" primary action live on the real site.
 * The counselor cards keep `@/data/counselors` as fallbacks but route
 * role/name/bio through <Tx>. Server component.
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

/** Small warm micro-label used above groups inside the counselor cards. */
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

  /* ── counseling-team — mission intro + redesigned, editor-native counselor cards ── */
  const teamSection = (
    <Section
      container
      style={{ background: "var(--color-paper)", color: "var(--color-ink-warm)" }}
    >
      <SectionHeader
        leadMaxWidth="48rem"
        style={{ marginBottom: "var(--space-block)" }}
        eyebrow={<Tx text={t} k="counseling-vision-eyebrow" fallback="Our Team" />}
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
            fallback="A team approach to counseling, centered around trained, Biblically-based counselors — helping you develop spiritually, emotionally, and relationally."
            style={{ color: "var(--color-stone)" }}
          />
        }
      />

      {/* Counselor cards — each is its OWN editable tile: data-cms-bg on the
          container, role/name/bio routed through <Tx> (keys derived from the
          counselor id, @/data/counselors values as fallbacks). Redesigned: teal
          role eyebrow → name → bio → specialty CHIPS → education footer pinned to
          the card base (even heights, no checklist noise). */}
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
              background: "var(--color-paper-soft)",
              border: "1px solid var(--color-clay-line)",
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
                  style={{ color: "var(--color-stone)", fontSize: "0.85rem" }}
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
              style={{ color: "var(--color-stone)", marginTop: "var(--space-heading)" }}
            />

            {/* Specialties — calm teal-tinted chips (replaces the checklist). */}
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
                      color: "var(--color-ink-warm)",
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
                borderTop: "1px solid var(--color-clay-line)",
              }}
            >
              <GraduationCap
                size={15}
                style={{ color: "var(--color-teal)", marginTop: 2 }}
                className="shrink-0"
              />
              <p className="text-xs" style={{ color: "var(--color-stone)", lineHeight: 1.5 }}>
                {c.education.join(" · ")}
              </p>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );

  /* ── counseling-fees — fees + policies (editable FeatureCards). The old bottom
        "You don't have to carry it alone" CTA panel was REMOVED (Tyler's note);
        the primary appointment action now lives in the hero. ── */
  const feesSection = (
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
                fallback="Cash, check, credit card (some counselors), or Venmo"
              />
              <PolicyLine k="counseling-fee-due" t={t} fallback="Payment due at the time of appointment" />
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

        {/* Getting started — real contact path from celebratejesus.org */}
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
                fallback="Email office@celebratejesus.org or call (785) 625-5483"
              />
              <PolicyLine
                k="counseling-start-step2"
                t={t}
                fallback="We&apos;ll match you with a trained counselor for your needs"
              />
              <PolicyLine
                k="counseling-start-step3"
                t={t}
                fallback="In crisis? Call or text 988 (Suicide &amp; Crisis Lifeline)"
              />
            </ul>
          </FeatureCard>
        </div>
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
