import type { Metadata } from "next";
import Image from "next/image";
import { assetPath } from "@/lib/asset-path";
import { getCMSPage } from "@/lib/cms";
import { imgCss } from "@/lib/home-content";
import { Tx, EditableLink } from "@/components/cms/Editable";
import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";
import JoinPanel from "@/components/visit/JoinPanel";
import InboxTile from "@/components/newsletter/InboxTile";
import IssueBrowser from "@/components/newsletter/IssueBrowser";
import { newsletterIssues } from "@/data/news";

export const metadata: Metadata = {
  title: "Plan Your Visit",
  description:
    "Everything you need to know before your first visit to Celebration Community Church in Hays or Colby, Kansas — service times, what to expect, and The C3 Weekly.",
};

const CCB_FORM = "https://celebration.ccbchurch.com/goto/forms/47/responses/new";

/* Responsive gutter for the wide Browse container (mirrors .container-c3 padding). */
const GUTTER = "clamp(1.25rem, 5vw, 3rem)";

export default async function VisitPage() {
  const ov = (await getCMSPage("/visit")) || {};
  const t = ov.text || {};
  const media = ov.media || {};

  return (
    <>
      {/* ── (a) TOP "Join Us" panel — logo + socials + service times + what to expect ── */}
      <JoinPanel t={t} />

      {/* ── Let Us Know You're Coming — CCB guest form CTA (real, preserved) ── */}
      <Section
        container
        style={{ backgroundColor: "var(--color-paper-soft)", color: "var(--color-ink-warm)" }}
        bgKey="visit-cta-bg"
      >
        <div className="text-center" style={{ maxWidth: "60rem", marginInline: "auto" }}>
          <div
            className="relative overflow-hidden"
            style={{
              height: "clamp(240px, 34vw, 380px)",
              borderRadius: "var(--radius-md)",
              marginBottom: "var(--space-block)",
            }}
            data-cms-img="visit-cta-photo"
          >
            <Image
              src={assetPath(media["visit-cta-photo"] || "/images/congregation.webp")}
              alt="Warm welcome at C3"
              fill
              sizes="(min-width: 1024px) 60rem, 100vw"
              className="object-cover"
              style={imgCss(ov.img?.["visit-cta-photo"])}
            />
          </div>

          <Tx
            text={t}
            k="visit-cta-eyebrow"
            fallback="Coming this weekend?"
            as="p"
            className="overline"
            style={{ color: "var(--color-teal-deep)", marginBottom: "var(--space-eyebrow)" }}
          />
          <Tx
            text={t}
            k="visit-cta-heading"
            fallback="Let us know you&apos;re coming."
            as="h2"
            className="display-2 text-balance"
            style={{ color: "var(--color-ink-warm)", marginBottom: "var(--space-heading)" }}
          />
          <Tx
            text={t}
            k="visit-cta-body"
            fallback="Fill out the form and a member of our greeting team will be ready to meet you at the door, show you around, help you check in your kids, and find you a seat. We even have a gift for you — just to say thank you for checking out our church."
            as="p"
            className="body-lg"
            style={{
              color: "var(--color-stone)",
              lineHeight: 1.8,
              maxWidth: "44rem",
              marginInline: "auto",
              marginBottom: "var(--space-cta)",
            }}
          />
          <div className="flex flex-wrap gap-5 justify-center">
            <EditableLink
              text={t}
              k="visit-cta-primary"
              href={CCB_FORM}
              label="Let Us Know You're Coming"
              className="btn btn-primary btn-lg"
              external
            />
            <EditableLink
              text={t}
              k="visit-cta-secondary"
              href="/messages/"
              label="Watch Online First"
              className="btn btn-outline-navy btn-lg"
            />
          </div>
        </div>
      </Section>

      {/* ── (b) Browse C3 Weekly — responsive to window width ──────────── */}
      <Section
        style={{ backgroundColor: "var(--color-paper)", color: "var(--color-ink-warm)" }}
        bgKey="visit-weekly-bg"
      >
        <div style={{ width: `min(100% - 2 * ${GUTTER}, 1600px)`, marginInline: "auto" }}>
          <SectionHeader
            eyebrow={
              <Tx text={t} k="newsletter-issues-eyebrow" fallback="The C3 Weekly" />
            }
            title={
              <Tx text={t} k="newsletter-issues-heading" fallback="Browse The C3 Weekly" />
            }
            lead={
              <Tx
                text={t}
                k="newsletter-issues-lead"
                fallback="Filter by week or search a topic &mdash; then open any issue to read it in full."
              />
            }
            style={{ marginBottom: "var(--space-block)" }}
          />

          <IssueBrowser issues={newsletterIssues} />

          {/* Subscribe — get The C3 Weekly in your inbox (real, preserved keys). */}
          <div style={{ maxWidth: "34rem", marginInline: "auto", marginTop: "var(--space-block)" }}>
            <InboxTile
              sticky={false}
              title={
                <Tx text={t} k="newsletter-sub-heading" fallback="Get it in your inbox" />
              }
              body={
                <Tx
                  text={t}
                  k="newsletter-sub-body"
                  fallback="One short email each week &mdash; what&rsquo;s coming up, this week&rsquo;s message, and simple next steps."
                />
              }
            />
          </div>
        </div>
      </Section>
    </>
  );
}
