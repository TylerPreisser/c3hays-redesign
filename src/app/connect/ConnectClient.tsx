"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Hand,
  HeartHandshake,
  MessageCircle,
  CalendarDays,
  Check,
  ArrowUpRight,
  MapPin,
  Phone,
  Mail,
  Clock,
} from "lucide-react";
import { tx, imgCss } from "@/lib/home-content";
import { assetPath } from "@/lib/asset-path";
import { site } from "@/data/site";
import { locations } from "@/data/locations";
import { Tx } from "@/components/cms/Editable";
import Section from "@/components/ui/Section";
import Stack from "@/components/ui/Stack";

/* Connect — a PREMIUM full-bleed photo + glass contact card, then the real
   next-step links. VISUAL ONLY: the form is intentionally non-functional
   (onSubmit preventDefault → success state). The connect actions on the live
   site run on Church Community Builder (CCB) forms — those exact URLs are the
   real links preserved below (sourced from the content inventory).

   EDITOR-NATIVE REFACTOR (contract 2026-07-20): this page is now composed of two
   editor-native sections — `connect-hero` (this glass-card hero) and
   `connect-steps` (the "Ways to get connected" cards) — wired through
   PageComposer in page.tsx. Each is exported below so the page's render(id)
   switch can place them inside their own `<div data-section>` wrapper (rail bg).
   The default export renders BOTH (used by the editable-by-construction guard
   test, which renders the whole client surface). VISUAL is UNCHANGED — this is an
   editability refactor, not a redesign. */

const CCB = "https://celebration.ccbchurch.com/goto/forms";
const CCB_VISIT = `${CCB}/47/responses/new`; // "Let us know you're coming"
const CCB_SERVE = `${CCB}/397/responses/new`; // Hays serve
const CCB_COUNSELING = `${CCB}/258/responses/new`; // Counseling appt

/* "What's this about?" — visual-only routing hint. */
const REASONS = ["Visiting", "Prayer", "Serving", "General"];

/* Real next-step destinations (from the inventory). */
const NEXT_STEPS = [
  {
    id: "visit",
    icon: Hand,
    defaultTitle: "Plan a visit",
    defaultBody: "Let us know you're coming and we'll have someone ready to welcome you.",
    defaultCta: "Let us know",
    href: CCB_VISIT,
    external: true,
  },
  {
    id: "serve",
    icon: HeartHandshake,
    defaultTitle: "Serve & volunteer",
    defaultBody: "Use your gifts to make a difference across our campuses and community.",
    defaultCta: "Sign up to serve",
    href: CCB_SERVE,
    external: true,
  },
  {
    id: "prayer",
    icon: MessageCircle,
    defaultTitle: "Talk with a counselor",
    defaultBody: "Our C3 counselors would be honored to walk with you. Reduced-fee sessions.",
    defaultCta: "Make an appointment",
    href: CCB_COUNSELING,
    external: true,
  },
  {
    id: "visitpage",
    icon: CalendarDays,
    defaultTitle: "Know before you go",
    defaultBody: "Service times, what to wear, and what to expect on your first Sunday.",
    defaultCta: "Plan your visit",
    href: "/visit/",
    external: false,
  },
];

type ImgOverride = { pos?: string; scale?: number };

interface ConnectHeroProps {
  text: Record<string, string>;
  media?: Record<string, string>;
  img?: Record<string, ImgOverride>;
}

/* ── SECTION: connect-hero — full-bleed photo + glass contact card + contact/map.
   Every authored surface stays editable via <Tx> / data-cms-link / data-cms-img,
   exactly as before (nothing removed). ─────────────────────────────────────── */
export function ConnectHero({ text, media = {}, img = {} }: ConnectHeroProps) {
  const [submitted, setSubmitted] = useState(false);

  const addr = site.address;
  const addressLine = `${addr.street}, ${addr.city}, ${addr.state} ${addr.zip}`;
  const mapsDir = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    addressLine
  )}`;
  const hays = locations.find((l) => l.id === "hays");
  const serviceLine = hays
    ? hays.services.map((s) => `${s.day} ${s.times.join(", ")}`).join(" · ")
    : "Sat 5PM · Sun 8, 9:30 & 11AM";

  /* Monochrome, self-contained faux static-map thumbnail (no API key). */
  const mapSvg =
    "<svg xmlns='http://www.w3.org/2000/svg' width='480' height='180' viewBox='0 0 480 180'>" +
    "<rect width='480' height='180' fill='#e9e2d6'/>" +
    "<g stroke='#cdc5b7' stroke-width='7' fill='none' stroke-linecap='round'>" +
    "<path d='M0 46 H480'/><path d='M0 128 H480'/>" +
    "<path d='M112 0 V180'/><path d='M320 0 V180'/>" +
    "</g>" +
    "<path d='M-20 12 L500 150' stroke='#d8d1c4' stroke-width='13' fill='none'/>" +
    "<path d='M60 180 L260 20' stroke='#d8d1c4' stroke-width='9' fill='none'/>" +
    "</svg>";
  const mapBg = `url("data:image/svg+xml,${encodeURIComponent(mapSvg)}")`;

  return (
    <>
      <style>{CONNECT_CSS}</style>

      {/* ── Full-bleed photo + glass contact card ─────────────────── */}
      <section
        className="connect-fullbleed"
        style={{ minHeight: "max(660px, 100svh)" }}
      >
        {/* Background photo — CMS-swappable (data-cms-img preserved) */}
        <div className="connect-hero-media" data-cms-img="connect-hero-bg">
          <Image
            src={assetPath(media["connect-hero-bg"] || "/images/community.webp")}
            alt="The C3 family gathered together"
            fill
            priority
            sizes="100vw"
            className="object-cover connect-drift connect-bg-img"
            style={imgCss(img["connect-hero-bg"])}
          />
        </div>

        {/* MANDATORY directional scrim: dark on the card side → light on the open
            side. Guarantees legibility; glass alone fails over a photo. */}
        <div className="connect-scrim" aria-hidden="true" />

        {/* Card wrapper — anchored lower-left */}
        <div className="connect-card-wrap container-c3">
          <div className="glass-card connect-card-rise">
            {/* Header */}
            <Stack gap="eyebrow" style={{ marginBottom: "var(--space-heading)" }}>
              <Tx
                text={text}
                k="connect-hero-eyebrow"
                fallback="Get in touch"
                className="overline"
                style={{ color: "var(--color-teal)" }}
              />
              <Tx
                text={text}
                k="connect-hero-heading"
                fallback="Come as you are &mdash; we&rsquo;d love to meet you."
                as="h1"
                className="connect-card-title"
              />
            </Stack>
            <Tx
              text={text}
              k="connect-hero-body"
              fallback="Send a note and a real person from our team will personally reach out. No pressure &mdash; just a warm welcome."
              as="p"
              className="body-base"
              style={{ color: "rgba(255,255,255,0.82)", marginBottom: "var(--s-8)" }}
            />

            {submitted ? (
              /* Success state (visual only) */
              <div className="text-center connect-stagger" style={{ padding: "1.5rem 0" }}>
                <div
                  className="flex items-center justify-center mx-auto"
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 999,
                    marginBottom: "var(--space-heading)",
                    background: "rgba(28,195,175,0.18)",
                    border: "2px solid var(--color-teal)",
                  }}
                >
                  <Check size={28} style={{ color: "var(--color-teal)" }} />
                </div>
                <Tx
                  text={text}
                  k="connect-thanks-heading"
                  fallback="Thanks &mdash; we&rsquo;ll be in touch."
                  as="h2"
                  className="connect-card-title"
                  style={{ marginBottom: "var(--space-eyebrow)" }}
                />
                <Tx
                  text={text}
                  k="connect-thanks-body"
                  fallback="A real person from our team will reach out personally. We&rsquo;d love to see you this weekend."
                  as="p"
                  className="body-base mx-auto"
                  style={{ color: "rgba(255,255,255,0.82)", maxWidth: 380 }}
                />
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
                noValidate
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-body)" }}>
                  <GlassField
                    label={tx(text, "connect-field-firstname", "Name")}
                    delay={120}
                    required
                  >
                    <input
                      type="text"
                      required
                      autoComplete="name"
                      className="input-c3"
                      placeholder="Jane Smith"
                    />
                  </GlassField>

                  <GlassField
                    label={tx(text, "connect-field-email", "Email")}
                    delay={180}
                    required
                  >
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      inputMode="email"
                      className="input-c3"
                      placeholder="jane@example.com"
                    />
                  </GlassField>

                  <GlassField
                    label={tx(text, "connect-field-reason", "What&rsquo;s this about?")}
                    delay={240}
                  >
                    <select className="input-c3" style={selectStyle} defaultValue="">
                      <option value="">
                        {tx(text, "connect-field-reason-placeholder", "Pick what fits best…")}
                      </option>
                      {REASONS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </GlassField>

                  <GlassField
                    label={tx(text, "connect-field-message", "Your message")}
                    delay={300}
                  >
                    <textarea
                      className="input-c3 textarea-c3"
                      rows={3}
                      placeholder={tx(
                        text,
                        "connect-field-message-placeholder",
                        "Prayer requests, questions, or just say hi…"
                      )}
                    />
                  </GlassField>
                </div>

                {/* Submit (visual only) */}
                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-full connect-stagger"
                  style={{ marginTop: "var(--space-cta)", animationDelay: "360ms" }}
                  data-cms-link="connect-submit"
                >
                  <span data-cms-link-label>{tx(text, "connect-submit-label", "Send message")}</span>
                </button>

                {/* Real CCB alternative — preserved */}
                <p
                  className="text-center connect-stagger"
                  style={{
                    marginTop: "var(--space-body)",
                    fontSize: "0.9rem",
                    color: "rgba(255,255,255,0.7)",
                    animationDelay: "420ms",
                  }}
                >
                  {tx(text, "connect-ccb-pretext", "Planning a first visit? ")}
                  <a
                    href={text["connect-ccb-href"] || CCB_VISIT}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group font-semibold"
                    style={{ color: "var(--color-teal)" }}
                    data-cms-link="connect-ccb"
                  >
                    <span data-cms-link-label>
                      {tx(text, "connect-ccb-label", "Let us know you're coming")}
                    </span>
                    <ArrowUpRight
                      size={15}
                      className="inline-block ml-0.5 -mt-0.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </a>
                </p>
              </form>
            )}

            {/* Quick-contact + map ─────────────────────────────── */}
            <div className="connect-contact connect-stagger" style={{ animationDelay: "480ms" }}>
              <Tx
                text={text}
                k="connect-contact-title"
                fallback="Visit the Hays campus"
                as="p"
                className="overline"
                style={{ color: "rgba(255,255,255,0.6)", marginBottom: "var(--s-4)" }}
              />
              <ul className="connect-contact-list">
                <li>
                  <MapPin size={16} aria-hidden="true" />
                  <span>{addressLine}</span>
                </li>
                <li>
                  <Phone size={16} aria-hidden="true" />
                  <a href={`tel:${site.phone.replace(/[^0-9+]/g, "")}`}>{site.phone}</a>
                </li>
                <li>
                  <Mail size={16} aria-hidden="true" />
                  <a href={`mailto:${site.email}`}>{site.email}</a>
                </li>
                <li>
                  <Clock size={16} aria-hidden="true" />
                  <span>{serviceLine}</span>
                </li>
              </ul>

              {/* Monochrome static-map thumbnail → Google Maps directions */}
              <a
                href={mapsDir}
                target="_blank"
                rel="noopener noreferrer"
                className="connect-map group"
                aria-label={`Get directions to the C3 Hays campus at ${addressLine}`}
                data-cms-link="connect-map"
                style={{ backgroundImage: mapBg }}
              >
                <span className="connect-map-pin" aria-hidden="true">
                  <MapPin size={20} />
                </span>
                <span className="connect-map-label">
                  <span data-cms-link-label>Get directions</span>
                  <ArrowUpRight
                    size={15}
                    className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

interface ConnectStepsProps {
  text: Record<string, string>;
}

/* ── SECTION: connect-steps — "Ways to get connected".
   EDITOR-NATIVE: each card is FOUR independent handles (contract §1/§2), not one
   big link:
     • CONTAINER  <div data-cms-bg="connect-step-<id>-bg">   → tile background
     • HEADING    <Tx k="connect-step-<id>-title" as="h3">   → card title text
     • BODY       <Tx k="connect-step-<id>-body"  as="p">    → card body text
     • BUTTON     <a data-cms-link="connect-step-<id>">      → CTA (own link)
                    <span data-cms-link-label>…</span> + ArrowUpRight after the span
   The CTA anchor mirrors <EditableLink> byte-for-byte (reads `${k}-href` and
   `${k}-label`, falling back to the pre-existing `${k}-cta` value so NO content is
   lost) — hand-inlined ONLY so the ArrowUpRight flourish can live inside the <a>
   after the label span, which the primitive can't express. ───────────────────── */
export function ConnectSteps({ text }: ConnectStepsProps) {
  return (
    <Section tone="white" container>
      <Stack gap="heading" style={{ maxWidth: "40rem", marginBottom: "var(--space-block)" }}>
        <Stack gap="eyebrow">
          <Tx
            text={text}
            k="connect-intents-eyebrow"
            fallback="Take a next step"
            className="overline"
          />
          <Tx
            text={text}
            k="connect-intents-heading"
            fallback="Ways to get connected"
            as="h2"
            className="display-2"
            style={{ color: "#1b1c1c" }}
          />
        </Stack>
        <Tx
          text={text}
          k="connect-intents-body"
          fallback="Pick a step and we&rsquo;ll take it with you &mdash; each one goes straight to the right team."
          as="p"
          className="body-lg"
          style={{ color: "var(--color-mute)" }}
        />
      </Stack>

      <div className="grid grid-cols-1 sm:grid-cols-2 items-stretch" style={{ gap: "var(--space-body)" }}>
        {NEXT_STEPS.map((s) => {
          const Icon = s.icon;
          const k = `connect-step-${s.id}`;
          const ctaHref = text[`${k}-href`] || s.href;
          // Prefer a new `${k}-label` override, else the pre-existing `${k}-cta`
          // value (or the design default) — no authored content is dropped.
          const ctaLabel =
            (text[`${k}-label`] && text[`${k}-label`].trim() !== ""
              ? text[`${k}-label`]
              : tx(text, `${k}-cta`, s.defaultCta));
          const cardStyle: React.CSSProperties = {
            display: "flex",
            flexDirection: "column",
            height: "100%",
            borderRadius: "var(--radius-md)",
            padding: "clamp(1.75rem, 3vw, 2.5rem)",
            minHeight: 240,
            background: "#fff",
            border: "1px solid rgba(27,28,28,0.08)",
            boxShadow: "var(--shadow-rest)",
          };
          return (
            <div key={s.id} data-cms-bg={`${k}-bg`} className="bento-tile" style={cardStyle}>
              <span
                className="inline-flex items-center justify-center"
                style={{
                  width: "3rem",
                  height: "3rem",
                  borderRadius: "var(--radius-sm)",
                  marginBottom: "var(--space-heading)",
                  background: "rgba(28,195,175,0.12)",
                  color: "var(--color-teal)",
                }}
                aria-hidden="true"
              >
                <Icon size={24} />
              </span>
              <Tx
                text={text}
                k={`${k}-title`}
                fallback={s.defaultTitle}
                as="h3"
                className="heading-3"
                style={{ color: "#1b1c1c" }}
              />
              <Tx
                text={text}
                k={`${k}-body`}
                fallback={s.defaultBody}
                as="p"
                className="body-base"
                style={{ color: "var(--color-mute)", marginTop: "var(--space-eyebrow)" }}
              />
              {/* CTA — its OWN editable link (data-cms-link + required label span). */}
              <a
                href={ctaHref}
                data-cms-link={k}
                className="group inline-flex items-center gap-1.5 font-semibold"
                style={{
                  color: "var(--color-teal-deep, #179c8c)",
                  marginTop: "var(--space-cta)",
                  alignSelf: "flex-start",
                }}
                {...(s.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                <span data-cms-link-label>{ctaLabel}</span>
                <ArrowUpRight
                  size={17}
                  className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

interface ConnectClientProps {
  text: Record<string, string>;
  media?: Record<string, string>;
  img?: Record<string, ImgOverride>;
}

/* Default export — the FULL connect surface (hero + steps). page.tsx composes the
   two sections individually through PageComposer; this default renders both and is
   what the editable-by-construction guard test mounts to scan the whole page. */
export default function ConnectClient({ text, media = {}, img = {} }: ConnectClientProps) {
  return (
    <>
      <ConnectHero text={text} media={media} img={img} />
      <ConnectSteps text={text} />
    </>
  );
}

/* ── Shared select style ── */
const selectStyle: React.CSSProperties = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%231b1c1c' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 0.75rem center",
  appearance: "none",
  paddingRight: "2.5rem",
  cursor: "pointer",
};

/* ── Glass field wrapper (staggered) ── */
function GlassField({
  label,
  required,
  delay,
  children,
}: {
  label: string;
  required?: boolean;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 connect-stagger" style={{ animationDelay: `${delay}ms` }}>
      <label
        style={{ fontSize: "0.875rem", fontWeight: 600, color: "rgba(255,255,255,0.9)" }}
        dangerouslySetInnerHTML={{
          __html: required ? `${label} <span style="color:var(--color-teal)">*</span>` : label,
        }}
      />
      {children}
    </div>
  );
}

/* ── Scoped CSS: glass fallback, motion, mobile solid-sheet degrade.
   globals.css is off-limits, so the @supports / @media rules that inline
   styles can't express live here. The global reduced-motion guard also
   applies; these rules reinforce it for the drift + entrance. ── */
const CONNECT_CSS = `
.connect-fullbleed {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
}
.connect-hero-media { position: absolute; inset: 0; }
.connect-bg-img { filter: saturate(0.82) brightness(0.95); transform-origin: center; }
.connect-drift { animation: connectDrift 26s var(--ease-out) infinite alternate; }
@keyframes connectDrift { from { transform: scale(1.02); } to { transform: scale(1.08); } }

.connect-scrim {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.0) 30%),
    linear-gradient(100deg,
      rgba(0,0,0,0.62) 0%,
      rgba(0,0,0,0.52) 32%,
      rgba(0,0,0,0.28) 62%,
      rgba(0,0,0,0.12) 100%);
}

.connect-card-wrap {
  position: relative;
  z-index: 1;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  padding-top: 8.5rem;
  padding-bottom: clamp(2.5rem, 6vw, 5.5rem);
}

.glass-card {
  width: clamp(340px, 42vw, 500px);
  max-width: 100%;
  padding: clamp(1.75rem, 3vw, 2.5rem);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.22);
  border-radius: var(--radius);
  box-shadow: 0 20px 60px rgba(0,0,0,0.25);
  background: rgba(20,20,20,0.82); /* solid fallback (no backdrop-filter) */
}
@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .glass-card {
    background: rgba(255,255,255,0.16);
    -webkit-backdrop-filter: blur(12px) saturate(1.25);
    backdrop-filter: blur(12px) saturate(1.25);
  }
}

.connect-card-title {
  font-family: var(--font-display, inherit);
  font-weight: 700;
  line-height: 1.08;
  letter-spacing: -0.01em;
  color: #fff;
  font-size: clamp(1.7rem, 2.6vw, 2.3rem);
}

/* Inputs sit on glass — keep them near-white for crisp contrast. */
.glass-card .input-c3 {
  background: rgba(255,255,255,0.95);
  border-radius: var(--radius-sm);
  border-bottom: 1.5px solid rgba(0,0,0,0.12);
}
.glass-card .input-c3:focus { border-bottom-color: var(--color-teal); }

.connect-contact {
  margin-top: var(--s-8);
  padding-top: var(--s-6);
  border-top: 1px solid rgba(255,255,255,0.16);
}
.connect-contact-list {
  list-style: none;
  margin: 0 0 var(--s-6);
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--s-3);
}
.connect-contact-list li {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  font-size: 0.925rem;
  color: rgba(255,255,255,0.88);
}
.connect-contact-list li svg { color: var(--color-teal); flex: 0 0 auto; }
.connect-contact-list a { color: rgba(255,255,255,0.92); }
.connect-contact-list a:hover { color: #fff; text-decoration: underline; }

.connect-map {
  position: relative;
  display: block;
  height: 118px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  background-size: cover;
  background-position: center;
  filter: grayscale(1) contrast(1.03);
  border: 1px solid rgba(255,255,255,0.22);
  transition: filter var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out);
}
.connect-map:hover { filter: grayscale(0.55) contrast(1.05); transform: translateY(-1px); }
.connect-map-pin {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -60%);
  color: var(--color-teal-deep);
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
}
.connect-map-label {
  position: absolute;
  left: 0; right: 0; bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(to top, rgba(0,0,0,0.72), rgba(0,0,0,0));
}

.connect-card-rise { animation: connectRise 600ms var(--ease-out) both; }
.connect-stagger { animation: connectFade 520ms var(--ease-out) both; }
@keyframes connectRise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: none; } }
@keyframes connectFade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }

/* MOBILE — the SAME design degrades: shortened image on top, SOLID (non-glass)
   sheet stacked beneath. Fully responsive. */
@media (max-width: 767px) {
  .connect-fullbleed { display: block; min-height: 0 !important; }
  .connect-hero-media { position: relative; height: 40vh; min-height: 240px; }
  .connect-scrim { display: none; }
  .connect-card-wrap {
    padding: 0;
    padding-inline: 0;
    display: block;
  }
  .glass-card {
    width: 100%;
    max-width: 100%;
    border: none;
    border-radius: 0;
    box-shadow: none;
    background: #14110e !important;
    -webkit-backdrop-filter: none !important;
    backdrop-filter: none !important;
    padding: clamp(1.75rem, 7vw, 2.25rem);
  }
}

@media (prefers-reduced-motion: reduce) {
  .connect-drift { animation: none !important; transform: scale(1.03); }
  .connect-card-rise, .connect-stagger {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
`;
