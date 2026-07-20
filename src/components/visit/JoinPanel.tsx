import type { CSSProperties } from "react";
import { Clock, MapPin, Smartphone } from "lucide-react";
import { locations } from "@/data/locations";
import { site } from "@/data/site";
import { Tx } from "@/components/cms/Editable";
import Logo from "@/components/brand/Logo";
import Section from "@/components/ui/Section";
import Stack from "@/components/ui/Stack";

/**
 * <JoinPanel> — the /visit HERO section (data-section="visit-hero").
 *
 * The warm, premium top panel a first-time guest lands on:
 *   • the true C3 Logo + social icon buttons (C3 App / YouTube / Facebook / Instagram)
 *   • the "Join Us / When & where we meet" heading
 *   • the two service-time cards (Hays + Colby) — TIMES + address + a single
 *     editable "Directions" link (no campus-details filler, per Phase-4).
 *
 * The "What to Expect" expectations moved OUT to <VisitPlan> (visit-plan) so each is
 * its own editor-native, independently-recolorable section. Every authored string
 * routes through <Tx> (PRESERVING the existing data-cms keys) and every service card
 * carries its OWN data-cms-bg + an editable Directions link (data-cms-link + label).
 *
 * Server component (no client state).
 */

/* Brand marks as inline SVGs — this lucide build ships no brand icons (matches the
   Footer / newsletter inline-SVG convention). currentColor drives the fill. */
function YoutubeIcon({ size = 22, style }: { size?: number; style?: CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={style}>
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="var(--color-paper)" />
    </svg>
  );
}
function FacebookIcon({ size = 22, style }: { size?: number; style?: CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={style}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
function InstagramIcon({ size = 22, style }: { size?: number; style?: CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={style}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

/* Real celebratejesus.org channels — pulled from @/data/site (single source of truth). */
const SOCIALS = [
  { id: "app", label: "Get the C3 App", href: site.appStore, Icon: Smartphone },
  { id: "youtube", label: "Watch on YouTube", href: site.social.youtube, Icon: YoutubeIcon },
  { id: "facebook", label: "Follow on Facebook", href: site.social.facebook, Icon: FacebookIcon },
  { id: "instagram", label: "Follow on Instagram", href: site.social.instagram, Icon: InstagramIcon },
] as const;

export default function JoinPanel({ t }: { t: Record<string, string> }) {
  return (
    <Section
      container
      style={{ backgroundColor: "var(--color-paper)", color: "var(--color-ink-warm)" }}
      bgKey="visit-join-bg"
    >
      {/* ── Logo + social icon buttons ─────────────────────────── */}
      <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
        style={{ marginBottom: "var(--space-block)" }}
      >
        {/* #5: the single /visit logo is editable — click to replace in C3 Studio
            (data-cms-img via cmsKey; shares the global dark-logo key so a swap is
            consistent with the header). */}
        <Logo variant="dark" size={72} cmsKey="g:logo-dark" />
        <div className="flex flex-wrap items-center gap-3" aria-label="Connect with C3">
          {SOCIALS.map(({ id, label, href, Icon }) => (
            <a
              key={id}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              title={label}
              className="bento-tile inline-flex items-center justify-center"
              style={{
                width: "3rem",
                height: "3rem",
                borderRadius: "var(--radius-md)",
                background: "var(--color-paper-soft)",
                border: "1px solid var(--color-clay-line)",
                color: "var(--color-ink-warm)",
                boxShadow: "var(--shadow-rest)",
              }}
            >
              <Icon size={22} />
            </a>
          ))}
        </div>
      </div>

      {/* ── Join Us heading ────────────────────────────────────── */}
      <Stack gap="eyebrow" style={{ marginBottom: "var(--space-block)" }}>
        <Tx
          text={t}
          k="visit-times-eyebrow"
          fallback="Join Us"
          as="p"
          className="overline"
          style={{ color: "var(--color-teal-deep)" }}
        />
        <Tx
          text={t}
          k="visit-times-heading"
          fallback="When &amp; where we meet"
          as="h2"
          className="display-2 text-balance"
          style={{ color: "var(--color-ink-warm)" }}
        />
      </Stack>

      {/* ── Two service-time cards (Hays + Colby) — each its own data-cms-bg ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 items-stretch">
        {locations.map((loc) => (
          <div
            key={loc.id}
            className="flex flex-col h-full"
            data-cms-bg={`visit-service-${loc.id}`}
            style={{
              background: "var(--color-paper-soft)",
              border: "1px solid var(--color-clay-line)",
              borderRadius: "var(--radius-md)",
              padding: "clamp(1.75rem, 3vw, 2.5rem)",
              boxShadow: "var(--shadow-rest)",
            }}
          >
            <Tx
              text={t}
              k={`visit-campus-${loc.id}-name`}
              fallback={`${loc.name} Campus`}
              as="h3"
              className="font-bold text-sm uppercase tracking-widest"
              style={{ color: "var(--color-teal-deep)", marginBottom: "1.5rem" }}
            />
            <div className="flex items-start gap-3" style={{ marginBottom: "1.5rem" }}>
              <MapPin size={15} style={{ color: "var(--color-stone)", marginTop: 3 }} className="shrink-0" />
              <Tx
                text={t}
                k={`visit-campus-${loc.id}-address`}
                fallback={`${loc.street}, ${loc.city}, ${loc.state} ${loc.zip}`}
                as="address"
                className="not-italic body-base"
                style={{ color: "var(--color-stone)", lineHeight: 1.7 }}
              />
            </div>
            {/* #4: the service TIMES + text are editor-native — each row is its own
                <Tx> region (data-cms), so staff edit the day/times in place. */}
            <div className="flex flex-col gap-3">
              {loc.services.map((s, i) => (
                <div key={s.day} className="flex items-center gap-2.5">
                  <Clock size={14} style={{ color: "var(--color-stone)" }} className="shrink-0" />
                  <Tx
                    text={t}
                    k={`visit-campus-${loc.id}-service-${i}`}
                    fallback={`${s.day}: ${s.times.join(" · ")}`}
                    as="span"
                    className="body-base"
                    style={{ color: "var(--color-ink-warm)" }}
                  />
                </div>
              ))}
            </div>
            {/* Spacer flexes so Directions pins to the bottom → equal-height cards align. */}
            <div style={{ flex: 1, minHeight: "var(--space-cta)" }} />
            {/* Editable Directions link (data-cms-link + required label span; keeps the icon). */}
            <a
              href={t[`visit-dir-${loc.id}-href`] || loc.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cms-link={`visit-dir-${loc.id}`}
              className="btn btn-outline-navy btn-sm inline-flex items-center gap-1.5 self-start"
            >
              <MapPin size={14} />
              <span data-cms-link-label>{t[`visit-dir-${loc.id}-label`] || "Directions"}</span>
            </a>
          </div>
        ))}
      </div>
    </Section>
  );
}
