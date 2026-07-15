"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Hand,
  HeartHandshake,
  MessageCircle,
  CalendarDays,
  Check,
  ArrowUpRight,
} from "lucide-react";
import { tx } from "@/lib/home-content";

/* Connect — a spacious, premium contact card FIRST, then real next-step links.
   The connect actions on the live site run on Church Community Builder (CCB)
   forms — those exact URLs are wired below (sourced from the content inventory). */

const CCB = "https://celebration.ccbchurch.com/goto/forms";
const CCB_VISIT = `${CCB}/47/responses/new`; // "Let us know you're coming"
const CCB_SERVE = `${CCB}/397/responses/new`; // Hays serve
const CCB_COUNSELING = `${CCB}/258/responses/new`; // Counseling appt

const CAMPUSES = ["Hays", "Colby", "Online"];

const REASONS = [
  "I'm new here",
  "I want to know Jesus",
  "Find a group",
  "Serve & volunteer",
  "Share a prayer request",
  "Something else",
];

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

interface ConnectClientProps {
  text: Record<string, string>;
}

export default function ConnectClient({ text }: ConnectClientProps) {
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      {/* ── Contact form FIRST ─────────────────────────────────── */}
      <section className="section" style={{ backgroundColor: "#f6f6f6" }}>
        <div className="container-c3">
          <div
            className="mx-auto"
            style={{
              maxWidth: 760,
              background: "#fff",
              borderRadius: "var(--radius-lg, 1.5rem)",
              padding: "clamp(2rem, 5vw, 4rem)",
              boxShadow: "0 30px 70px rgba(10,10,10,0.08)",
              border: "1px solid rgba(27,28,28,0.06)",
            }}
          >
            {submitted ? (
              /* Success state */
              <div className="text-center" style={{ padding: "2.5rem 0", animation: "fadeIn 0.5s ease both" }}>
                <div
                  className="flex items-center justify-center mx-auto"
                  style={{ width: 68, height: 68, borderRadius: 999, marginBottom: "1.75rem", background: "rgba(28,195,175,0.14)", border: "2px solid #1cc3af" }}
                >
                  <Check size={30} style={{ color: "#1cc3af" }} />
                </div>
                <h2
                  className="heading-1 mb-4"
                  style={{ color: "#1b1c1c" }}
                  data-cms="t:connect-thanks-heading"
                  dangerouslySetInnerHTML={{ __html: tx(text, "connect-thanks-heading", "Thanks &mdash; we&rsquo;ll be in touch.") }}
                />
                <p
                  className="body-lg mx-auto"
                  style={{ color: "rgba(27,28,28,0.62)", maxWidth: 460 }}
                  data-cms="t:connect-thanks-body"
                  dangerouslySetInnerHTML={{ __html: tx(text, "connect-thanks-body", "A real person from our team will reach out personally. We&rsquo;d love to see you this weekend.") }}
                />
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} noValidate>
                {/* Header */}
                <div className="mb-9" style={{ maxWidth: 520 }}>
                  <span
                    className="overline"
                    style={{ display: "inline-block", color: "var(--color-teal)", marginBottom: "1rem" }}
                    data-cms="t:connect-form-eyebrow"
                    dangerouslySetInnerHTML={{ __html: tx(text, "connect-form-eyebrow", "Say hello") }}
                  />
                  <h2
                    className="display-2 mb-4"
                    style={{ color: "#1b1c1c" }}
                    data-cms="t:connect-form-heading"
                    dangerouslySetInnerHTML={{ __html: tx(text, "connect-form-heading", "We&rsquo;d love to hear from you") }}
                  />
                  <p
                    className="body-lg"
                    style={{ color: "rgba(27,28,28,0.6)" }}
                    data-cms="t:connect-form-subhead"
                    dangerouslySetInnerHTML={{ __html: tx(text, "connect-form-subhead", "Send us a note and someone on our team will personally get back to you.") }}
                  />
                </div>

                {/* Fields — generous vertical rhythm */}
                <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: "1.5rem" }}>
                  <Field label={tx(text, "connect-field-firstname", "First name")} required>
                    <input type="text" required autoComplete="given-name" className="input-c3" placeholder="Jane" />
                  </Field>
                  <Field label={tx(text, "connect-field-lastname", "Last name")} required>
                    <input type="text" required autoComplete="family-name" className="input-c3" placeholder="Smith" />
                  </Field>
                  <Field label={tx(text, "connect-field-email", "Email")} required>
                    <input type="email" required autoComplete="email" inputMode="email" className="input-c3" placeholder="jane@example.com" />
                  </Field>
                  <Field label={tx(text, "connect-field-phone", "Phone")}>
                    <input type="tel" autoComplete="tel" inputMode="tel" className="input-c3" placeholder="(785) 555-0100" />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label={tx(text, "connect-field-campus", "Which campus?")}>
                      <select className="input-c3" style={selectStyle} defaultValue="">
                        <option value="">{tx(text, "connect-field-campus-placeholder", "Select a campus…")}</option>
                        {CAMPUSES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </Field>
                  </div>
                  <div className="sm:col-span-2">
                    <Field label={tx(text, "connect-field-reason", "What can we help with?")}>
                      <select className="input-c3" style={selectStyle} defaultValue="">
                        <option value="">{tx(text, "connect-field-reason-placeholder", "Pick what fits best…")}</option>
                        {REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </Field>
                  </div>
                  <div className="sm:col-span-2">
                    <Field label={tx(text, "connect-field-message", "Your message")}>
                      <textarea
                        className="input-c3 textarea-c3"
                        rows={4}
                        placeholder={tx(text, "connect-field-message-placeholder", "Prayer requests, questions, or just say hi…")}
                      />
                    </Field>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-full"
                  style={{ marginTop: "2.25rem" }}
                  data-cms-link="connect-submit"
                >
                  <span data-cms-link-label>{tx(text, "connect-submit-label", "Send message")}</span>
                </button>

                {/* Real CCB alternative */}
                <p
                  className="text-center"
                  style={{ marginTop: "1.5rem", fontSize: "0.9rem", color: "rgba(27,28,28,0.55)" }}
                >
                  {tx(text, "connect-ccb-pretext", "Planning a first visit? ")}
                  <a
                    href={text["connect-ccb-href"] || CCB_VISIT}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold"
                    style={{ color: "var(--color-teal-deep, #179c8c)" }}
                    data-cms-link="connect-ccb"
                  >
                    <span data-cms-link-label>{tx(text, "connect-ccb-label", "Let us know you're coming")}</span>
                  </a>
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── Real next steps ─────────────────────────────────────── */}
      <section className="section" style={{ backgroundColor: "#ffffff", paddingTop: "clamp(2.5rem,5vw,4rem)" }}>
        <div className="container-c3">
          <div className="mb-12 max-w-2xl">
            <span
              className="overline"
              style={{ display: "inline-block", color: "var(--color-teal)", marginBottom: "0.75rem" }}
              data-cms="t:connect-intents-eyebrow"
              dangerouslySetInnerHTML={{ __html: tx(text, "connect-intents-eyebrow", "Take a next step") }}
            />
            <h2
              className="display-2"
              style={{ color: "#1b1c1c" }}
              data-cms="t:connect-intents-heading"
              dangerouslySetInnerHTML={{ __html: tx(text, "connect-intents-heading", "Ways to get connected") }}
            />
            <p
              className="body-lg"
              style={{ color: "rgba(27,28,28,0.6)", marginTop: "1rem" }}
              data-cms="t:connect-intents-body"
              dangerouslySetInnerHTML={{ __html: tx(text, "connect-intents-body", "Pick a step and we&rsquo;ll take it with you &mdash; each one goes straight to the right team.") }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {NEXT_STEPS.map((s) => {
              const Icon = s.icon;
              const title = tx(text, `connect-step-${s.id}-title`, s.defaultTitle);
              const body = tx(text, `connect-step-${s.id}-body`, s.defaultBody);
              const cta = tx(text, `connect-step-${s.id}-cta`, s.defaultCta);
              const inner = (
                <>
                  <span
                    className="inline-flex items-center justify-center mb-6"
                    style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(28,195,175,0.12)", color: "var(--color-teal)" }}
                  >
                    <Icon size={24} />
                  </span>
                  <h3 className="heading-2 mb-2" style={{ color: "#1b1c1c", fontSize: "1.35rem" }} dangerouslySetInnerHTML={{ __html: title }} />
                  <p className="body-base" style={{ color: "rgba(27,28,28,0.6)", marginBottom: "1.5rem" }} dangerouslySetInnerHTML={{ __html: body }} />
                  <span className="mt-auto inline-flex items-center gap-1.5 font-semibold" style={{ color: "var(--color-teal-deep, #179c8c)" }}>
                    {cta}
                    <ArrowUpRight size={17} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </>
              );
              const cardStyle: React.CSSProperties = {
                display: "flex",
                flexDirection: "column",
                borderRadius: "var(--radius-md)",
                padding: "2rem",
                minHeight: 220,
                background: "#fff",
                border: "1px solid rgba(27,28,28,0.10)",
              };
              return s.external ? (
                <a
                  key={s.id}
                  href={text[`connect-step-${s.id}-href`] || s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group transition-all duration-200 hover:-translate-y-1"
                  style={cardStyle}
                  data-cms-link={`connect-step-${s.id}`}
                >
                  {inner}
                </a>
              ) : (
                <Link
                  key={s.id}
                  href={text[`connect-step-${s.id}-href`] || s.href}
                  className="group transition-all duration-200 hover:-translate-y-1"
                  style={cardStyle}
                  data-cms-link={`connect-step-${s.id}`}
                >
                  {inner}
                </Link>
              );
            })}
          </div>
        </div>
      </section>
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

/* ── Field wrapper ── */
function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5">
      <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "rgba(27,28,28,0.85)" }}>
        {label}
        {required && <span className="ml-1" style={{ color: "#1cc3af" }}>*</span>}
      </label>
      {children}
    </div>
  );
}
