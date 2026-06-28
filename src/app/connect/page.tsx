"use client";

import Image from "next/image";
import { useState } from "react";
import { assetPath } from "@/lib/asset-path";

const campuses = ["Hays", "Colby", "Online"];
const howHeard = [
  "Friend or family",
  "Drove by",
  "Social media",
  "Google search",
  "Event or outreach",
  "Other",
];
const interests = [
  "Sunday service",
  "Small groups",
  "Kids ministry",
  "Student ministry",
  "Volunteering",
  "Counseling",
  "Giving",
];

export default function ConnectPage() {
  const [submitted, setSubmitted] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  function toggleInterest(item: string) {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <>
      {/* Hero */}
      <section className="relative flex items-end overflow-hidden" style={{ minHeight: "50vh" }}>
        <div className="absolute inset-0">
          <Image
            src={assetPath("/images/congregation.webp")}
            alt="C3 congregation"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0" style={{ background: "rgba(10,10,10,0.60)" }} />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.2) 60%, transparent 100%)",
            }}
          />
        </div>
        <div className="relative z-10 container-c3 pb-16 pt-40">
          <h1 className="display-1 text-white">Let&apos;s connect.</h1>
          <p className="body-lg mt-3 max-w-lg" style={{ color: "rgba(255,255,255,0.65)" }}>
            Tell us a little about you so we can help you find your place.
          </p>
        </div>
      </section>

      {/* Form section — 2-col on lg: LEFT = brand photo + info, RIGHT = form */}
      <section className="section" style={{ backgroundColor: "#ffffff" }}>
        <div className="container-c3">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-16 xl:gap-24 items-start">

            {/* ── LEFT column: photo + reassurance copy + contact info ── */}
            {/* Hidden on mobile so the form stays first and clean */}
            <div className="hidden lg:flex flex-col" style={{ minHeight: "100%" }}>
              {/* Brand photo with gradient overlay */}
              <div className="relative overflow-hidden flex-1" style={{ minHeight: 420 }}>
                <Image
                  src={assetPath("/images/gather.webp")}
                  alt="C3 community gathering"
                  fill
                  className="object-cover"
                />
                {/* Dark gradient: bottom-heavy so text is legible */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.30) 55%, rgba(10,10,10,0.10) 100%)",
                  }}
                />
                {/* Overlay copy */}
                <div className="absolute bottom-0 left-0 right-0 p-10">
                  <p
                    className="text-xs font-bold uppercase tracking-widest mb-3"
                    style={{ color: "#1cc3af" }}
                  >
                    A real conversation
                  </p>
                  <p className="heading-3 text-white mb-2" style={{ maxWidth: "26ch" }}>
                    No spam. We&apos;ll connect you with a real person.
                  </p>
                  <p className="body-sm" style={{ color: "rgba(255,255,255,0.60)" }}>
                    Every card goes directly to our team — not a mailing list.
                  </p>
                </div>
              </div>

              {/* Contact info block below the photo */}
              <div
                className="p-10 flex flex-col gap-6"
                style={{ backgroundColor: "#f6f6f6" }}
              >
                <div>
                  <p
                    className="text-xs font-bold uppercase tracking-widest mb-3"
                    style={{ color: "#1cc3af" }}
                  >
                    Hays Campus
                  </p>
                  <p className="body-sm font-semibold" style={{ color: "#1b1c1c" }}>
                    5790 230th Ave, Hays KS 67601
                  </p>
                </div>
                <div>
                  <p
                    className="text-xs font-bold uppercase tracking-widest mb-3"
                    style={{ color: "#1cc3af" }}
                  >
                    Get in Touch
                  </p>
                  <div className="flex flex-col gap-1">
                    <a
                      href="tel:+17856255483"
                      className="body-sm font-semibold"
                      style={{ color: "#1b1c1c", textDecoration: "none" }}
                    >
                      (785) 625-5483
                    </a>
                    <a
                      href="mailto:office@c3hays.com"
                      className="body-sm"
                      style={{ color: "rgba(27,28,28,0.65)", textDecoration: "none" }}
                    >
                      office@c3hays.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT column: form (full width on mobile) ── */}
            <div>
              {submitted ? (
                /* Success state */
                <div
                  className="text-center py-16 animate-fade-in"
                  style={{ animationDuration: "0.5s" }}
                >
                  {/* Large teal checkmark */}
                  <div
                    className="w-16 h-16 flex items-center justify-center mx-auto mb-6"
                    style={{ border: "2px solid #1cc3af" }}
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1cc3af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <h2 className="heading-1 mb-3" style={{ color: "#1b1c1c" }}>
                    Thanks. We&apos;ll be in touch.
                  </h2>
                  <p className="body-base" style={{ color: "rgba(27,28,28,0.65)" }}>
                    We&apos;d love to see you on Sunday.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  {/* Fields — single column, 24px gap */}
                  <div className="flex flex-col gap-6">

                    {/* First name */}
                    <FieldGroup label="First Name" required>
                      <input
                        type="text"
                        required
                        autoComplete="given-name"
                        inputMode="text"
                        className="input-c3"
                        placeholder="Jane"
                      />
                    </FieldGroup>

                    {/* Last name */}
                    <FieldGroup label="Last Name" required>
                      <input
                        type="text"
                        required
                        autoComplete="family-name"
                        inputMode="text"
                        className="input-c3"
                        placeholder="Smith"
                      />
                    </FieldGroup>

                    {/* Email */}
                    <FieldGroup label="Email" required>
                      <input
                        type="email"
                        required
                        autoComplete="email"
                        inputMode="email"
                        className="input-c3"
                        placeholder="jane@example.com"
                      />
                    </FieldGroup>

                    {/* Phone */}
                    <FieldGroup label="Phone">
                      <input
                        type="tel"
                        autoComplete="tel"
                        inputMode="tel"
                        className="input-c3"
                        placeholder="(785) 555-0100"
                      />
                    </FieldGroup>

                    {/* Campus */}
                    <FieldGroup label="Campus">
                      <select
                        className="input-c3"
                        style={{
                          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%231b1c1c' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "right 0.75rem center",
                          appearance: "none",
                          paddingRight: "2.5rem",
                          cursor: "pointer",
                        }}
                      >
                        <option value="">Select a campus…</option>
                        {campuses.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </FieldGroup>

                    {/* How did you hear */}
                    <FieldGroup label="How did you hear about C3?">
                      <select
                        className="input-c3"
                        style={{
                          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%231b1c1c' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "right 0.75rem center",
                          appearance: "none",
                          paddingRight: "2.5rem",
                          cursor: "pointer",
                        }}
                      >
                        <option value="">Select…</option>
                        {howHeard.map((h) => (
                          <option key={h} value={h}>{h}</option>
                        ))}
                      </select>
                    </FieldGroup>

                    {/* Interests */}
                    <div>
                      <label
                        className="block mb-3"
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          color: "rgba(27,28,28,0.85)",
                        }}
                      >
                        I&apos;m interested in
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {interests.map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => toggleInterest(item)}
                            className="px-4 py-2.5 min-h-[44px] text-sm font-semibold border transition-all duration-150"
                            style={{
                              borderRadius: 999,
                              backgroundColor: selected.includes(item) ? "#1b1c1c" : "transparent",
                              color: selected.includes(item) ? "#fff" : "#1b1c1c",
                              borderColor: selected.includes(item) ? "#1b1c1c" : "rgba(27,28,28,0.20)",
                            }}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Message */}
                    <FieldGroup label="Anything else?">
                      <textarea
                        className="input-c3 textarea-c3"
                        placeholder="Prayer requests, questions, or just say hi…"
                      />
                    </FieldGroup>

                    {/* Submit */}
                    <button type="submit" className="btn btn-primary btn-lg w-full">
                      Send Connect Card
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>
    </>
  );
}

/* ─── Reusable field group: overline label + input/select/textarea ─── */
function FieldGroup({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        style={{
          fontSize: "0.875rem",
          fontWeight: 600,
          color: "rgba(27,28,28,0.85)",
        }}
      >
        {label}
        {required && (
          <span className="ml-1" style={{ color: "#1cc3af" }}>*</span>
        )}
      </label>
      {children}
    </div>
  );
}
