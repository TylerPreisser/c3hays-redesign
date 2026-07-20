import type { CSSProperties } from "react";
import { HeartHandshake, Shirt, Baby } from "lucide-react";
import { Tx } from "@/components/cms/Editable";
import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";

/**
 * <VisitPlan> — the /visit "Plan your visit" section (data-section="visit-plan").
 *
 * The "What To Expect / Come As You Are / Bring The Kids" expectations, lifted out of
 * the hero panel into their OWN editor-native section so it can be independently
 * reordered / hidden / recolored from the rail. Each expectation is its own card with
 * its OWN data-cms-bg, and every authored string routes through <Tx> (PRESERVING the
 * existing visit-block-* keys). Server component (no client state).
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
    width: "3rem",
    height: "3rem",
    borderRadius: "var(--radius-sm)",
    background: "rgba(28,195,175,0.12)",
    color: "var(--color-teal)",
    flexShrink: 0,
  };

  return (
    <Section
      container
      style={{ backgroundColor: "var(--color-paper-soft)", color: "var(--color-ink-warm)" }}
      bgKey="visit-plan-bg"
    >
      <SectionHeader
        eyebrow={<Tx text={t} k="visit-plan-eyebrow" fallback="Plan your visit" />}
        title={<Tx text={t} k="visit-plan-heading" fallback="What to expect" />}
        lead={
          <Tx
            text={t}
            k="visit-plan-lead"
            fallback="Everything you need to know before you walk through the door &mdash; so your first Sunday feels like coming home."
          />
        }
        style={{ marginBottom: "var(--space-block)" }}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-10">
        {expectBlocks.map(({ id, Icon, title, body }) => (
          <div
            key={id}
            className="flex flex-col"
            data-cms-bg={`visit-block-${id}-bg`}
            style={{
              background: "var(--color-paper)",
              border: "1px solid var(--color-clay-line)",
              borderRadius: "var(--radius-md)",
              padding: "clamp(1.75rem, 3vw, 2.25rem)",
              boxShadow: "var(--shadow-rest)",
            }}
          >
            <div style={iconChip} aria-hidden="true">
              <Icon size={24} strokeWidth={1.75} />
            </div>
            <Tx
              text={t}
              k={`visit-block-${id}-title`}
              fallback={title}
              as="h3"
              className="heading-3"
              style={{ color: "var(--color-ink-warm)", marginTop: "var(--space-heading)" }}
            />
            <Tx
              text={t}
              k={`visit-block-${id}-body`}
              fallback={body}
              as="p"
              className="body-base"
              style={{ color: "var(--color-stone)", marginTop: "var(--space-eyebrow)", lineHeight: 1.7 }}
            />
          </div>
        ))}
      </div>
    </Section>
  );
}
