import { Tx } from "@/components/cms/Editable";
import Section from "@/components/ui/Section";
import Stack from "@/components/ui/Stack";

export interface GiveImpactProps {
  /** Page text override bag. */
  t: Record<string, string>;
}

/**
 * give-impact — the real "Why We Give" statement (what giving supports).
 *
 * Verbatim celebratejesus.org /give copy, presented as a single recolorable panel.
 * The panel is a TILE with its OWN `data-cms-bg="give-impact-card"` (contract §1
 * thing #2) so the editor can paint it independently of the section background.
 */
export default function GiveImpact({ t }: GiveImpactProps) {
  return (
    <Section container size="default" style={{ backgroundColor: "var(--color-paper)" }}>
      <div
        data-cms-bg="give-impact-card"
        style={{
          background: "var(--color-bone)",
          border: "1px solid var(--color-clay-line)",
          borderRadius: "var(--radius-md)",
          padding: "clamp(2rem, 5vw, 3.5rem)",
          boxShadow: "var(--shadow-rest)",
        }}
      >
        <Stack gap="heading" style={{ maxWidth: "46rem" }}>
          <Stack gap="eyebrow">
            <Tx
              text={t}
              k="give-impact-eyebrow"
              fallback="Generosity is worship"
              className="overline"
              style={{ color: "var(--color-teal-deep)" }}
            />
            <Tx
              as="h2"
              text={t}
              k="give-impact-heading"
              fallback="Why We Give"
              className="display-2 text-balance"
              style={{ color: "var(--color-ink-warm)" }}
            />
          </Stack>
          <Tx
            as="p"
            text={t}
            k="give-impact-body"
            fallback="At Celebration Community Church we understand that God owns everything."
            className="body-lg"
            style={{ color: "var(--color-ink-warm)" }}
          />
          <Tx
            as="p"
            text={t}
            k="give-impact-body-2"
            fallback="We invest our time, our talents, and our money in things that matter to God. We practice and encourage generous giving."
            className="body-lg"
            style={{ color: "var(--color-stone)" }}
          />
        </Stack>
      </div>
    </Section>
  );
}
