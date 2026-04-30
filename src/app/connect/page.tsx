"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CheckCircle } from "lucide-react";

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
            src="/images/congregation.webp"
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
          <p className="overline mb-4" style={{ color: "rgba(255,255,255,0.55)" }}>New Here?</p>
          <h1 className="display-1 text-white">Connect Card</h1>
          <p className="body-lg mt-3 max-w-lg" style={{ color: "rgba(255,255,255,0.65)" }}>
            Let us know you&apos;re here. We&apos;d love to reach out and say hello.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="section" style={{ backgroundColor: "#f2efed" }}>
        <div className="container-c3">
          <div className="max-w-2xl mx-auto">
            {submitted ? (
              /* Success state */
              <div className="text-center py-16">
                <div
                  className="w-16 h-16 flex items-center justify-center mx-auto mb-6"
                  style={{ background: "#10405D" }}
                >
                  <CheckCircle size={28} className="text-white" />
                </div>
                <h2 className="heading-1 mb-3" style={{ color: "#232e2c" }}>
                  Thanks for connecting!
                </h2>
                <p className="body-lg mb-10" style={{ color: "rgba(35,46,44,0.65)" }}>
                  We&apos;ll be in touch soon. In the meantime, we&apos;d love to see
                  you on Sunday.
                </p>
                <Link href="/" className="btn btn-primary btn-lg">
                  Back to Home
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                <div>
                  <p className="overline mb-6" style={{ color: "rgba(35,46,44,0.45)" }}>
                    Your Information
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2" htmlFor="first-name" style={{ color: "#232e2c" }}>
                        First name <span style={{ color: "#10405D" }}>*</span>
                      </label>
                      <input
                        id="first-name"
                        type="text"
                        required
                        autoComplete="given-name"
                        inputMode="text"
                        className="input-c3"
                        placeholder="Jane"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2" htmlFor="last-name" style={{ color: "#232e2c" }}>
                        Last name <span style={{ color: "#10405D" }}>*</span>
                      </label>
                      <input
                        id="last-name"
                        type="text"
                        required
                        autoComplete="family-name"
                        inputMode="text"
                        className="input-c3"
                        placeholder="Smith"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2" htmlFor="email" style={{ color: "#232e2c" }}>
                        Email <span style={{ color: "#10405D" }}>*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        autoComplete="email"
                        inputMode="email"
                        className="input-c3"
                        placeholder="jane@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2" htmlFor="phone" style={{ color: "#232e2c" }}>
                        Phone
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        autoComplete="tel"
                        inputMode="tel"
                        className="input-c3"
                        placeholder="(785) 555-0100"
                      />
                    </div>
                  </div>
                </div>

                {/* Campus */}
                <div>
                  <label className="block text-sm font-semibold mb-2" htmlFor="campus" style={{ color: "#232e2c" }}>
                    Which campus do you attend?
                  </label>
                  <select
                    id="campus"
                    className="input-c3"
                    style={{
                      backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23232e2c' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 0.75rem center",
                      appearance: "none",
                      paddingRight: "2.5rem",
                    }}
                  >
                    <option value="">Select a campus…</option>
                    {campuses.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* How did you hear */}
                <div>
                  <label className="block text-sm font-semibold mb-2" htmlFor="how-heard" style={{ color: "#232e2c" }}>
                    How did you hear about C3?
                  </label>
                  <select
                    id="how-heard"
                    className="input-c3"
                    style={{
                      backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23232e2c' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 0.75rem center",
                      appearance: "none",
                      paddingRight: "2.5rem",
                    }}
                  >
                    <option value="">Select…</option>
                    {howHeard.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>

                {/* Interests */}
                <div>
                  <p className="text-sm font-semibold mb-3" style={{ color: "#232e2c" }}>
                    I&apos;m interested in…{" "}
                    <span className="font-normal" style={{ color: "rgba(35,46,44,0.45)" }}>(select all that apply)</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {interests.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleInterest(item)}
                        className="px-4 py-2.5 min-h-[44px] text-sm font-semibold border-2 transition-all duration-150 uppercase tracking-wider"
                        style={{
                          borderRadius: 0,
                          backgroundColor: selected.includes(item) ? "#232e2c" : "transparent",
                          color: selected.includes(item) ? "#fff" : "#232e2c",
                          borderColor: selected.includes(item) ? "#232e2c" : "rgba(35,46,44,0.25)",
                        }}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold mb-2" htmlFor="message" style={{ color: "#232e2c" }}>
                    Anything else you&apos;d like us to know?
                  </label>
                  <textarea
                    id="message"
                    className="input-c3 textarea-c3"
                    placeholder="Prayer requests, questions, or just say hi…"
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-lg self-start">
                  Send Connect Card
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
