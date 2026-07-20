import type { CSSProperties } from "react";
import { Clock, MapPin, HeartHandshake, Shirt, Baby, Smartphone } from "lucide-react";
import { locations } from "@/data/locations";
import { site } from "@/data/site";
import { Tx } from "@/components/cms/Editable";
import Logo from "@/components/brand/Logo";
import Section from "@/components/ui/Section";
import Stack from "@/components/ui/Stack";

/**
 * <JoinPanel> — consolidated /visit top panel (redesign/visit).
 *
 * ONE unified, warm, premium panel that folds together everything a first-time
 * guest needs above the fold:
 *   • the true C3 Logo + social icon buttons (C3 App / YouTube / Facebook / Instagram)
 *   • the "Join Us" heading
 *   • the two service-time cards (Hays + Colby)
 *   • the "What to Expect" content (What To Expect / Come As You Are / Bring The Kids),
 *     FOLDED IN as integrated feature rows — NOT separate standalone cards.
 *
 * Editability: every authored string routes through <Tx> and PRESERVES the visit
 * page's existing data-cms keys (visit-times-eyebrow/heading, visit-campus-*-name/
 * -address, visit-block-*-title/-body). Service times come from `locations` data.
 *
 * Warm-first: warm neutral tokens carry the surface; teal is a restrained accent.
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

/* Verbatim from celebratejesus.org /plan-your-visit (captured 2026-07-15).
   FOLDED into this panel as integrated feature rows (not standalone cards). */
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

export default function JoinPanel({ t }: { t: Record<string, string> }) {
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
      style={{ backgroundColor: "var(--color-paper)", color: "var(--color-ink-warm)" }}
      bgKey="visit-join-bg"
    >
      {/* ── Logo + social icon buttons ─────────────────────────── */}
      <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
        style={{ marginBottom: "var(--space-block)" }}
      >
        <Logo variant="dark" size={72} />
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

      {/* ── Two service-time cards (Hays + Colby) ──────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 items-stretch">
        {locations.map((loc) => (
          <div
            key={loc.id}
            className="flex flex-col h-full"
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
            <div className="flex flex-col gap-3">
              {loc.services.map((s) => (
                <div key={s.day} className="flex items-center gap-2.5">
                  <Clock size={14} style={{ color: "var(--color-stone)" }} className="shrink-0" />
                  <span className="body-base" style={{ color: "var(--color-ink-warm)" }}>
                    <strong className="font-semibold">{s.day}:</strong> {s.times.join(" · ")}
                  </span>
                </div>
              ))}
            </div>
            {/* Spacer flexes so Directions pins to the bottom → equal-height cards align. */}
            <div style={{ flex: 1, minHeight: "var(--space-cta)" }} />
            <a
              href={loc.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-navy btn-sm inline-flex items-center gap-1.5 self-start"
            >
              <MapPin size={14} />
              Directions
            </a>
          </div>
        ))}
      </div>

      {/* ── What to Expect — FOLDED IN as integrated feature rows ─ */}
      <div
        className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-10"
        style={{
          marginTop: "var(--space-block)",
          paddingTop: "var(--space-block)",
          borderTop: "1px solid var(--color-clay-line)",
        }}
      >
        {expectBlocks.map(({ id, Icon, title, body }) => (
          <div key={id} className="flex flex-col">
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
