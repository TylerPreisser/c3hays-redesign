import type { CSSProperties } from "react";
import { HeartHandshake, Shirt, Baby } from "lucide-react";
import { Tx } from "@/components/cms/Editable";
import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";

/**
 * <VisitPlan> — the /visit "Plan your visit" section (data-section="visit-plan").
 *
 * The "What To Expect / Come As You Are / Bring The Kids" expectations, presented as a
 * native <details>/<summary> ACCORDION (zero-JS, static-export safe — mirrors
 * home/FaqAccordion). Themed to the site's dark rhythm (#1b1c1c section, #252727 rows,
 * teal accent) rather than the old tan palette. Each block is its own accordion row with
 * its OWN data-cms-bg, and every authored string routes through <Tx> (PRESERVING the
 * existing visit-block-* / visit-plan-* keys). Server component (no client state).
 */

/* Verbatim from celebratejesus.org /plan-your-visit (captured 2026-07-15). */
const expectBlocks = [
  {
    id: "expect",
    Icon: HeartHandshake,
    title: "What To Expect",
    body: "We know that showing up to a new place for the first time can be intimidating, but at C3 it&apos;s our desire that you feel right at home from the moment you pull into the parking lot. As a first-time guest, you are VIP to us so we&apos;ll be there with you every step of the way! We even have a gift for you - just to say &lsquo;thank you&rsquo; for checking out our church.",
  },
  {
    id: "dress",
    Icon: Shirt,
    title: "Come As You Are",
    body: "At C3, there is no dress code. Some people show up in suits, and others wear jeans and t-shirts. We want you to wear whatever makes you feel comfortable.",
  },
  {
    id: "kids",
    Icon: Baby,
    title: "Bring The Kids",
    body: "C3Kids is available for children ages 3 through the 5th grade. The care and growth of every child is our highest priority and our passion is to create exciting, Bible-driven, interactive environments especially designed for your kids! C3Kids is available during our 9:30am service on Sunday so you can enjoy a great service knowing your child is being loved and nurtured.",
  },
];

export default function VisitPlan({ t }: { t: Record<string, string> }) {
  const iconChip: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "2.75rem",
    height: "2.75rem",
    borderRadius: "var(--radius-sm)",
    background: "rgba(28,195,175,0.12)",
    color: "var(--color-teal)",
    flexShrink: 0,
  };

  return (
    <Section
      container
      tone="dark"
      style={{ backgroundColor: "#1b1c1c", color: "#ffffff" }}
      bgKey="visit-plan-bg"
    >
      <SectionHeader
        eyebrow={
          <Tx
            text={t}
            k="visit-plan-eyebrow"
            fallback="Plan your visit"
            style={{ color: "var(--color-teal)" }}
          />
        }
        title={
          <Tx
            text={t}
            k="visit-plan-heading"
            fallback="What to expect"
            style={{ color: "#ffffff" }}
          />
        }
        lead={
          <Tx
            text={t}
            k="visit-plan-lead"
            fallback="Everything you need to know before you walk through the door &mdash; so your first Sunday feels like coming home."
            style={{ color: "rgba(255,255,255,0.70)" }}
          />
        }
        style={{ marginBottom: "var(--space-block)" }}
      />

      {/* Native accordion — each expectation is an independently recolorable row
          (its own data-cms-bg). Zero-JS via <details>/<summary>, static-export safe. */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {expectBlocks.map(({ id, Icon, title, body }) => (
          <details
            key={id}
            data-cms-bg={`visit-block-${id}-bg`}
            style={{
              background: "#252727",
              borderRadius: "var(--radius-md)",
              border: "1px solid rgba(255,255,255,0.10)",
              padding: "1.15rem 1.4rem",
            }}
          >
            <summary
              style={{
                listStyle: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <span style={iconChip} aria-hidden="true">
                <Icon size={20} strokeWidth={1.75} />
              </span>
              <Tx
                text={t}
                k={`visit-block-${id}-title`}
                fallback={title}
                as="span"
                className="heading-3"
                style={{ color: "#ffffff", flex: 1, margin: 0 }}
              />
              <span
                aria-hidden="true"
                style={{ color: "var(--color-teal)", fontSize: "1.6rem", lineHeight: 1, flex: "0 0 auto" }}
              >
                +
              </span>
            </summary>
            <Tx
              text={t}
              k={`visit-block-${id}-body`}
              fallback={body}
              as="p"
              className="body-base"
              style={{ color: "rgba(255,255,255,0.72)", marginTop: "0.9rem", lineHeight: 1.7 }}
            />
          </details>
        ))}
      </div>
    </Section>
  );
}
