import { Home, Globe, Church } from "lucide-react";
import { Tx } from "@/components/cms/Editable";
import Section from "@/components/ui/Section";
import Stack from "@/components/ui/Stack";
import GiveCard from "./GiveCard";

export interface GiveImpactProps {
  /** Page text override bag. */
  t: Record<string, string>;
}

/**
 * give-impact — the "why." The real celebratejesus.org "Why We Give" statement, then
 * three QUALITATIVE facets of where that generosity goes — grounded in the real /give
 * line ("the work C3 is doing in your community and around the world") and the C3
 * mission (Meet · Grow · Serve). No invented numbers or dollar figures.
 *
 * Structurally it mirrors give-ways exactly — an eyebrow → heading → lead intro over a
 * 3-up grid of the shared <GiveCard> — so the two sections read as one system. Each
 * facet is its own recolorable tile (`data-cms-bg`) with editable <Tx> heading + body.
 */
export default function GiveImpact({ t }: GiveImpactProps) {
  return (
    <Section container size="default" style={{ backgroundColor: "var(--color-paper)" }}>
      <Stack gap="block">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ width: "100%" }}>
          {/* ── In your community ── */}
          <GiveCard bgKey="give-impact-community-bg" icon={Home}>
            <Tx
              as="h3"
              text={t}
              k="give-impact-community-title"
              fallback="In your community"
              className="heading-3"
              style={{ color: "var(--color-ink-warm)", marginBottom: "var(--s-3)", fontSize: "1.125rem" }}
            />
            <Tx
              as="p"
              text={t}
              k="give-impact-community-body"
              fallback="Weekend gatherings in Hays and Colby, our next-generation ministries, and care for people right where they are."
              className="flex-1 text-sm leading-relaxed"
              style={{ color: "var(--color-stone)" }}
            />
          </GiveCard>

          {/* ── Around the world ── */}
          <GiveCard bgKey="give-impact-world-bg" icon={Globe}>
            <Tx
              as="h3"
              text={t}
              k="give-impact-world-title"
              fallback="Around the world"
              className="heading-3"
              style={{ color: "var(--color-ink-warm)", marginBottom: "var(--s-3)", fontSize: "1.125rem" }}
            />
            <Tx
              as="p"
              text={t}
              k="give-impact-world-body"
              fallback="Mission partners carrying the hope of Jesus far beyond our walls, in places we may never visit ourselves."
              className="flex-1 text-sm leading-relaxed"
              style={{ color: "var(--color-stone)" }}
            />
          </GiveCard>

          {/* ── Through the local church ── */}
          <GiveCard bgKey="give-impact-church-bg" icon={Church}>
            <Tx
              as="h3"
              text={t}
              k="give-impact-church-title"
              fallback="Through the local church"
              className="heading-3"
              style={{ color: "var(--color-ink-warm)", marginBottom: "var(--s-3)", fontSize: "1.125rem" }}
            />
            <Tx
              as="p"
              text={t}
              k="give-impact-church-body"
              fallback="Keeping the doors open and the lights on, so anyone who walks in can meet with Jesus, grow, and serve."
              className="flex-1 text-sm leading-relaxed"
              style={{ color: "var(--color-stone)" }}
            />
          </GiveCard>
        </div>
      </Stack>
    </Section>
  );
}
