import { CreditCard, Smartphone, Banknote } from "lucide-react";
import { site } from "@/data/site";
import { Tx, EditableLink } from "@/components/cms/Editable";
import Section from "@/components/ui/Section";
import Stack from "@/components/ui/Stack";
import GiveCard from "./GiveCard";

export interface GiveWaysProps {
  /** Page text override bag. */
  t: Record<string, string>;
}

/**
 * give-ways — the "how." The real celebratejesus.org ways to give: Online (through the
 * real Pushpay campus links — Hays / Colby / Online), the real iOS Mobile App, and Cash
 * or Check in person. It shares give-impact's exact skeleton — eyebrow → heading → lead
 * over a 3-up grid of the shared <GiveCard> — so the two halves of the page (why / how)
 * read as one system.
 *
 * Each method is its own recolorable tile (`data-cms-bg`) with editable <Tx> copy and
 * SEPARATE <EditableLink> buttons (never a whole-card link). Cash/Check is in person, so
 * it carries no button — a card is allowed to have no CTA; the rule only forbids wrapping
 * the whole card in one link.
 *
 * `id="give-ways"` is the scroll target for the hero's secondary CTA.
 */
export default function GiveWays({ t }: GiveWaysProps) {
  const btnFull: React.CSSProperties = { width: "100%", justifyContent: "center" };

  return (
    <Section
      id="give-ways"
      container
      size="default"
      style={{ backgroundColor: "var(--color-paper-soft)", scrollMarginTop: "5rem" }}
    >
      <Stack gap="block">
        <Stack gap="heading" style={{ maxWidth: "46rem" }}>
          <Stack gap="eyebrow">
            <Tx
              text={t}
              k="give-ways-eyebrow"
              fallback="Three simple ways"
              className="overline"
              style={{ color: "var(--color-teal-deep)" }}
            />
            <Tx
              as="h2"
              text={t}
              k="give-ways-heading"
              fallback="Ways To Give"
              className="display-2 text-balance"
              style={{ color: "var(--color-ink-warm)" }}
            />
          </Stack>
          <Tx
            as="p"
            text={t}
            k="give-ways-lead"
            fallback="Give a one-time gift or set up recurring giving &mdash; whichever fits you best."
            className="body-lg"
            style={{ color: "var(--color-stone)" }}
          />
        </Stack>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ width: "100%" }}>
          {/* ── Online (the three real Pushpay campus destinations) ── */}
          <GiveCard bgKey="give-way-online-bg" icon={CreditCard}>
            <Tx
              as="h3"
              text={t}
              k="give-way-online-title"
              fallback="Online"
              className="heading-3"
              style={{ color: "var(--color-ink-warm)", marginBottom: "var(--s-3)", fontSize: "1.125rem" }}
            />
            <Tx
              as="p"
              text={t}
              k="give-way-online-body"
              fallback="Complete a one-time gift or one that is reoccurring through our easy-to-use giving platform."
              className="flex-1 text-sm leading-relaxed"
              style={{ color: "var(--color-stone)", marginBottom: "var(--s-6)" }}
            />
            <div className="flex flex-col gap-2" style={{ width: "100%" }}>
              <EditableLink
                text={t}
                k="give-way-online-hays"
                href={site.giving.hays}
                label="Hays Campus"
                external
                className="btn btn-primary btn-sm"
                style={btnFull}
              />
              <EditableLink
                text={t}
                k="give-way-online-colby"
                href={site.giving.colby}
                label="Colby Campus"
                external
                className="btn btn-outline-ink btn-sm"
                style={btnFull}
              />
              <EditableLink
                text={t}
                k="give-way-online-online"
                href={site.giving.online}
                label="Online Campus"
                external
                className="btn btn-outline-ink btn-sm"
                style={btnFull}
              />
            </div>
          </GiveCard>

          {/* ── Mobile App (real iOS app) ── */}
          <GiveCard bgKey="give-way-app-bg" icon={Smartphone}>
            <Tx
              as="h3"
              text={t}
              k="give-way-app-title"
              fallback="Mobile App"
              className="heading-3"
              style={{ color: "var(--color-ink-warm)", marginBottom: "var(--s-3)", fontSize: "1.125rem" }}
            />
            <Tx
              as="p"
              text={t}
              k="give-way-app-body"
              fallback="Give on the go by downloading the Celebration Community Church mobile app."
              className="flex-1 text-sm leading-relaxed"
              style={{ color: "var(--color-stone)", marginBottom: "var(--s-6)" }}
            />
            <EditableLink
              text={t}
              k="give-way-app-cta"
              href={site.appStore}
              label="Download the App"
              external
              className="btn btn-outline-ink btn-sm"
              style={btnFull}
            />
          </GiveCard>

          {/* ── Cash or Check (in person — no CTA by design) ── */}
          <GiveCard bgKey="give-way-cash-bg" icon={Banknote}>
            <Tx
              as="h3"
              text={t}
              k="give-way-cash-title"
              fallback="Cash or Check"
              className="heading-3"
              style={{ color: "var(--color-ink-warm)", marginBottom: "var(--s-3)", fontSize: "1.125rem" }}
            />
            <Tx
              as="p"
              text={t}
              k="give-way-cash-body"
              fallback="Give during our weekend services at the boxes located at each entrance into our Worship Center."
              className="flex-1 text-sm leading-relaxed"
              style={{ color: "var(--color-stone)" }}
            />
          </GiveCard>
        </div>
      </Stack>
    </Section>
  );
}
