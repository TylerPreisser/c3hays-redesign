import { Banknote, Globe, Smartphone } from "lucide-react";
import { site } from "@/data/site";
import { Tx, EditableLink } from "@/components/cms/Editable";
import Section from "@/components/ui/Section";
import Stack from "@/components/ui/Stack";

export interface GiveWaysProps {
  /** Page text override bag. */
  t: Record<string, string>;
}

/**
 * give-ways — the real celebratejesus.org "Ways To Give" (Cash or Check, Online,
 * Mobile App). Each method is its OWN tile with:
 *   • its own `data-cms-bg` (contract §1 thing #2 — recolorable per-card),
 *   • `<Tx>` heading + body (real verbatim copy), and
 *   • SEPARATE `<EditableLink>` buttons (never a whole-card link).
 *
 * The Online tile carries the three REAL Pushpay campus destinations (Hays / Colby
 * / Online) exactly as the live /give page does; the App tile links the real iOS
 * app. Cash/Check is in-person (no button — a card is allowed to have no CTA; the
 * collapse rule only forbids wrapping a whole card in one link).
 */
export default function GiveWays({ t }: GiveWaysProps) {
  const cardStyle: React.CSSProperties = {
    background: "var(--color-bone)",
    border: "1px solid var(--color-clay-line)",
    borderRadius: "var(--radius-md)",
    padding: "var(--s-8)",
  };
  const iconWrap: React.CSSProperties = {
    width: 48,
    height: 48,
    borderRadius: 14,
    background: "rgba(28,195,175,0.12)",
    marginBottom: "var(--s-6)",
  };

  return (
    <Section container size="default" style={{ backgroundColor: "var(--color-paper-soft)" }}>
      <Stack gap="heading">
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
            className="display-2"
            style={{ color: "var(--color-ink-warm)" }}
          />
        </Stack>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ width: "100%" }}>
          {/* ── Cash or Check (in person) ── */}
          <div className="flex flex-col" data-cms-bg="give-way-cash-bg" style={cardStyle}>
            <div className="grid place-items-center" style={iconWrap}>
              <Banknote size={22} strokeWidth={1.75} style={{ color: "var(--color-teal-deep)" }} />
            </div>
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
              fallback="Give at C3 during our weekend services at the boxes located at each entrance into our Worship Center."
              className="flex-1 text-sm leading-relaxed"
              style={{ color: "var(--color-stone)" }}
            />
          </div>

          {/* ── Online (the three real Pushpay campus destinations) ── */}
          <div className="flex flex-col" data-cms-bg="give-way-online-bg" style={cardStyle}>
            <div className="grid place-items-center" style={iconWrap}>
              <Globe size={22} strokeWidth={1.75} style={{ color: "var(--color-teal-deep)" }} />
            </div>
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
                className="btn btn-sm"
                style={{ width: "100%", justifyContent: "center", background: "var(--color-teal)", color: "#fff", fontWeight: 700 }}
              />
              <EditableLink
                text={t}
                k="give-way-online-colby"
                href={site.giving.colby}
                label="Colby Campus"
                external
                className="btn btn-outline btn-sm"
                style={{ width: "100%", justifyContent: "center" }}
              />
              <EditableLink
                text={t}
                k="give-way-online-online"
                href={site.giving.online}
                label="Online Campus"
                external
                className="btn btn-outline btn-sm"
                style={{ width: "100%", justifyContent: "center" }}
              />
            </div>
          </div>

          {/* ── Mobile App (real iOS app) ── */}
          <div className="flex flex-col" data-cms-bg="give-way-app-bg" style={cardStyle}>
            <div className="grid place-items-center" style={iconWrap}>
              <Smartphone size={22} strokeWidth={1.75} style={{ color: "var(--color-teal-deep)" }} />
            </div>
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
              fallback="Give by downloading the Celebration Community Church mobile app."
              className="flex-1 text-sm leading-relaxed"
              style={{ color: "var(--color-stone)", marginBottom: "var(--s-6)" }}
            />
            <EditableLink
              text={t}
              k="give-way-app-cta"
              href={site.appStore}
              label="Download the App"
              external
              className="btn btn-outline btn-sm self-start"
            />
          </div>
        </div>
      </Stack>
    </Section>
  );
}
