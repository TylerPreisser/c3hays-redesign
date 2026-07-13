"use client";

import { useState } from "react";
import { Hand, Heart, Users, HeartHandshake, MessageCircle, CalendarDays, Check } from "lucide-react";
import { tx } from "@/lib/home-content";

/* Connect — intent card selector + contact form.
   Receives CMS text overrides from the server page wrapper. */

const INTENTS = [
  { id: "new",    icon: Hand,          defaultTitle: "I'm new here",            defaultBody: "Just looking around or planning a first visit." },
  { id: "jesus",  icon: Heart,         defaultTitle: "I want to know Jesus",    defaultBody: "Take a first step in faith — we'll walk with you." },
  { id: "group",  icon: Users,         defaultTitle: "Find a group",            defaultBody: "Do life with people. Small groups & community." },
  { id: "serve",  icon: HeartHandshake, defaultTitle: "Serve & volunteer",     defaultBody: "Use your gifts to make a difference." },
  { id: "prayer", icon: MessageCircle, defaultTitle: "Share a prayer request", defaultBody: "Our team would be honored to pray with you." },
  { id: "visit",  icon: CalendarDays,  defaultTitle: "Plan a visit",           defaultBody: "Know what to expect before you come." },
];

const CAMPUSES = ["Hays", "Colby", "Online"];

interface ConnectClientProps {
  text: Record<string, string>;
}

export default function ConnectClient({ text }: ConnectClientProps) {
  const [submitted, setSubmitted] = useState(false);
  const [chosen, setChosen] = useState<string[]>([]);

  const toggle = (id: string) =>
    setChosen((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  return (
    <>
      {/* ── Intent cards ── */}
      <section className="section" style={{ backgroundColor: "#ffffff", paddingBottom: "3rem" }}>
        <div className="container-c3">
          {/* Section header */}
          <div className="mb-12 max-w-2xl">
            <span
              className="overline"
              style={{ display: "inline-block", color: "var(--color-teal)", marginBottom: "0.75rem" }}
              data-cms="t:connect-intents-eyebrow"
              dangerouslySetInnerHTML={{ __html: tx(text, "connect-intents-eyebrow", "We&rsquo;d love to hear from you") }}
            />
            <h2
              className="display-2"
              style={{ color: "#1b1c1c" }}
              data-cms="t:connect-intents-heading"
              dangerouslySetInnerHTML={{ __html: tx(text, "connect-intents-heading", "What brings you here?") }}
            />
            <p
              className="body-lg"
              style={{ color: "rgba(27,28,28,0.6)", marginTop: "1rem" }}
              data-cms="t:connect-intents-body"
              dangerouslySetInnerHTML={{ __html: tx(text, "connect-intents-body", "Pick anything that fits &mdash; it helps us point you to the right people.") }}
            />
          </div>

          {/* Intent card grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {INTENTS.map((it) => {
              const Icon = it.icon;
              const on = chosen.includes(it.id);
              const title = tx(text, `connect-intent-${it.id}-title`, it.defaultTitle);
              const body  = tx(text, `connect-intent-${it.id}-body`,  it.defaultBody);
              return (
                <button
                  key={it.id}
                  type="button"
                  onClick={() => toggle(it.id)}
                  aria-pressed={on}
                  className="group text-left transition-all duration-200 hover:-translate-y-1"
                  style={{
                    borderRadius: "var(--radius-md)",
                    padding: "1.75rem",
                    minHeight: 168,
                    background: on ? "var(--color-ink)" : "#fff",
                    border: `2px solid ${on ? "var(--color-ink)" : "rgba(27,28,28,0.12)"}`,
                    boxShadow: on ? "0 18px 40px rgba(10,10,10,0.18)" : "none",
                  }}
                >
                  {/* Icon badge */}
                  <span
                    className="inline-flex items-center justify-center mb-5 transition-colors"
                    style={{
                      width: 48, height: 48, borderRadius: 999,
                      background: on ? "rgba(28,195,175,0.22)" : "rgba(28,195,175,0.12)",
                      color: "var(--color-teal)",
                    }}
                  >
                    {on ? <Check size={22} /> : <Icon size={22} />}
                  </span>
                  {/* Title — NOT wrapped in data-cms (it wraps interactive children); shown as static text driven by tx() */}
                  <span
                    className="block font-bold mb-1.5"
                    style={{ fontSize: "1.125rem", color: on ? "#fff" : "#1b1c1c" }}
                    dangerouslySetInnerHTML={{ __html: title }}
                  />
                  <span
                    className="block text-sm leading-relaxed"
                    style={{ color: on ? "rgba(255,255,255,0.6)" : "rgba(27,28,28,0.6)" }}
                    dangerouslySetInnerHTML={{ __html: body }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Form card ── */}
      <section className="section" style={{ backgroundColor: "#f6f6f6", paddingTop: "3rem" }}>
        <div className="container-c3">
          <div
            className="mx-auto"
            style={{
              maxWidth: 720,
              background: "#fff",
              borderRadius: "var(--radius-md)",
              padding: "clamp(1.75rem, 4vw, 3rem)",
              boxShadow: "0 20px 50px rgba(10,10,10,0.06)",
            }}
          >
            {submitted ? (
              /* Success state */
              <div className="text-center py-10" style={{ animation: "fadeIn 0.5s ease both" }}>
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ background: "rgba(28,195,175,0.14)", border: "2px solid #1cc3af" }}
                >
                  <Check size={28} style={{ color: "#1cc3af" }} />
                </div>
                <h2
                  className="heading-1 mb-3"
                  style={{ color: "#1b1c1c" }}
                  data-cms="t:connect-thanks-heading"
                  dangerouslySetInnerHTML={{ __html: tx(text, "connect-thanks-heading", "Thanks &mdash; we&rsquo;ll be in touch.") }}
                />
                <p
                  className="body-base"
                  style={{ color: "rgba(27,28,28,0.65)" }}
                  data-cms="t:connect-thanks-body"
                  dangerouslySetInnerHTML={{ __html: tx(text, "connect-thanks-body", "A real person from our team will reach out personally. We&rsquo;d love to see you Sunday.") }}
                />
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} noValidate>
                {/* Form header */}
                <h3
                  className="heading-2 mb-2"
                  style={{ color: "#1b1c1c" }}
                  data-cms="t:connect-form-heading"
                  dangerouslySetInnerHTML={{ __html: tx(text, "connect-form-heading", "Tell us where to find you") }}
                />
                <p
                  className="text-sm mb-7"
                  style={{ color: "rgba(27,28,28,0.55)" }}
                  data-cms="t:connect-form-subhead"
                  dangerouslySetInnerHTML={{ __html: tx(text, "connect-form-subhead", "No bots, no spam &mdash; every card goes straight to a person on our team.") }}
                />

                {/* Selected-intent chips */}
                {chosen.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-7">
                    {chosen.map((id) => {
                      const it = INTENTS.find((x) => x.id === id)!;
                      const title = tx(text, `connect-intent-${it.id}-title`, it.defaultTitle);
                      return (
                        <span
                          key={id}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold"
                          style={{ background: "rgba(28,195,175,0.12)", color: "var(--color-teal)", padding: "0.4rem 0.85rem", borderRadius: 999 }}
                          dangerouslySetInnerHTML={{ __html: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline;margin-right:4px;vertical-align:middle"><polyline points="20 6 9 17 4 12"/></svg>${title}` }}
                        />
                      );
                    })}
                  </div>
                )}

                {/* Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                      <select className="input-c3" style={selectStyle}>
                        <option value="">{tx(text, "connect-field-campus-placeholder", "Select a campus…")}</option>
                        {CAMPUSES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </Field>
                  </div>
                  <div className="sm:col-span-2">
                    <Field label={tx(text, "connect-field-message", "Anything else?")}>
                      <textarea
                        className="input-c3 textarea-c3"
                        placeholder={tx(text, "connect-field-message-placeholder", "Prayer requests, questions, or just say hi…")}
                      />
                    </Field>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-full"
                  style={{ marginTop: "1.75rem" }}
                  data-cms-link="connect-submit"
                >
                  <span data-cms-link-label>{tx(text, "connect-submit-label", "Send my connect card")}</span>
                </button>
              </form>
            )}
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
    <div className="flex flex-col gap-2">
      <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "rgba(27,28,28,0.85)" }}>
        {label}
        {required && <span className="ml-1" style={{ color: "#1cc3af" }}>*</span>}
      </label>
      {children}
    </div>
  );
}
