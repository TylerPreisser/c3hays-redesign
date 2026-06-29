"use client";

import Image from "next/image";
import { useState } from "react";
import { Hand, Heart, Users, HeartHandshake, MessageCircle, CalendarDays, Check } from "lucide-react";
import { assetPath } from "@/lib/asset-path";

/* Connect — a guided "next step" experience, not just a form.
   Pick what brings you here (big intent cards), then a short, friendly form. */

const INTENTS = [
  { id: "new", icon: Hand, title: "I'm new here", body: "Just looking around or planning a first visit." },
  { id: "jesus", icon: Heart, title: "I want to know Jesus", body: "Take a first step in faith — we'll walk with you." },
  { id: "group", icon: Users, title: "Find a group", body: "Do life with people. Small groups & community." },
  { id: "serve", icon: HeartHandshake, title: "Serve & volunteer", body: "Use your gifts to make a difference." },
  { id: "prayer", icon: MessageCircle, title: "Share a prayer request", body: "Our team would be honored to pray with you." },
  { id: "visit", icon: CalendarDays, title: "Plan a visit", body: "Know what to expect before you come." },
];

const campuses = ["Hays", "Colby", "Online"];

export default function ConnectPage() {
  const [submitted, setSubmitted] = useState(false);
  const [chosen, setChosen] = useState<string[]>([]);

  const toggle = (id: string) =>
    setChosen((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  return (
    <>
      {/* Hero */}
      <section className="relative flex items-end overflow-hidden" style={{ minHeight: "52vh" }}>
        <div className="absolute inset-0">
          <Image src={assetPath("/images/congregation.webp")} alt="C3 congregation" fill className="object-cover" priority />
          <div className="absolute inset-0" style={{ background: "rgba(10,10,10,0.6)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.2) 60%, transparent 100%)" }} />
        </div>
        <div className="relative z-10 container-c3 pb-16 pt-40">
          <h1 className="display-1 text-white">Let&apos;s connect.</h1>
          <p className="body-lg mt-4 max-w-xl" style={{ color: "rgba(255,255,255,0.7)" }}>
            However you&apos;re arriving, there&apos;s a next step for you — and a real
            person ready to take it with you.
          </p>
        </div>
      </section>

      {/* Intent cards */}
      <section className="section" style={{ backgroundColor: "#ffffff", paddingBottom: "3rem" }}>
        <div className="container-c3">
          <div className="mb-12 max-w-2xl">
            <h2 className="display-2" style={{ color: "#1b1c1c" }}>What brings you here?</h2>
            <p className="body-lg" style={{ color: "rgba(27,28,28,0.6)", marginTop: "1rem" }}>
              Pick anything that fits — it helps us point you to the right people.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {INTENTS.map((it) => {
              const Icon = it.icon;
              const on = chosen.includes(it.id);
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
                  <span className="block font-bold mb-1.5" style={{ fontSize: "1.125rem", color: on ? "#fff" : "#1b1c1c" }}>
                    {it.title}
                  </span>
                  <span className="block text-sm leading-relaxed" style={{ color: on ? "rgba(255,255,255,0.6)" : "rgba(27,28,28,0.6)" }}>
                    {it.body}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Form card */}
      <section className="section" style={{ backgroundColor: "#f6f6f6", paddingTop: "3rem" }}>
        <div className="container-c3">
          <div
            className="mx-auto"
            style={{ maxWidth: 720, background: "#fff", borderRadius: "var(--radius-md)", padding: "clamp(1.75rem, 4vw, 3rem)", boxShadow: "0 20px 50px rgba(10,10,10,0.06)" }}
          >
            {submitted ? (
              <div className="text-center py-10 animate-fade-in" style={{ animationDuration: "0.5s" }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "rgba(28,195,175,0.14)", border: "2px solid #1cc3af" }}>
                  <Check size={28} style={{ color: "#1cc3af" }} />
                </div>
                <h2 className="heading-1 mb-3" style={{ color: "#1b1c1c" }}>Thanks — we&apos;ll be in touch.</h2>
                <p className="body-base" style={{ color: "rgba(27,28,28,0.65)" }}>
                  A real person from our team will reach out personally. We&apos;d love to see you Sunday.
                </p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} noValidate>
                <h3 className="heading-2 mb-2" style={{ color: "#1b1c1c" }}>Tell us where to find you</h3>
                <p className="text-sm mb-7" style={{ color: "rgba(27,28,28,0.55)" }}>
                  No bots, no spam — every card goes straight to a person on our team.
                </p>

                {/* selected intents as chips */}
                {chosen.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-7">
                    {chosen.map((id) => {
                      const it = INTENTS.find((x) => x.id === id)!;
                      return (
                        <span key={id} className="inline-flex items-center gap-1.5 text-sm font-semibold" style={{ background: "rgba(28,195,175,0.12)", color: "var(--color-teal)", padding: "0.4rem 0.85rem", borderRadius: 999 }}>
                          <Check size={14} /> {it.title}
                        </span>
                      );
                    })}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="First name" required>
                    <input type="text" required autoComplete="given-name" className="input-c3" placeholder="Jane" />
                  </Field>
                  <Field label="Last name" required>
                    <input type="text" required autoComplete="family-name" className="input-c3" placeholder="Smith" />
                  </Field>
                  <Field label="Email" required>
                    <input type="email" required autoComplete="email" inputMode="email" className="input-c3" placeholder="jane@example.com" />
                  </Field>
                  <Field label="Phone">
                    <input type="tel" autoComplete="tel" inputMode="tel" className="input-c3" placeholder="(785) 555-0100" />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="Which campus?">
                      <select className="input-c3" style={selectStyle}>
                        <option value="">Select a campus…</option>
                        {campuses.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </Field>
                  </div>
                  <div className="sm:col-span-2">
                    <Field label="Anything else?">
                      <textarea className="input-c3 textarea-c3" placeholder="Prayer requests, questions, or just say hi…" />
                    </Field>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-lg w-full" style={{ marginTop: "1.75rem" }}>
                  Send my connect card
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

const selectStyle: React.CSSProperties = {
  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%231b1c1c' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 0.75rem center",
  appearance: "none",
  paddingRight: "2.5rem",
  cursor: "pointer",
};

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
