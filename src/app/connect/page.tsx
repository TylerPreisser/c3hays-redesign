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
      <section className="relative min-h-56 md:min-h-72 flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/congregation.webp"
            alt="C3 congregation"
            fill
            className="object-cover"
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(10,31,46,0.94) 0%, rgba(10,31,46,0.55) 60%, rgba(10,31,46,0.2) 100%)",
            }}
          />
        </div>
        <div className="relative z-10 container-c3 pb-12 pt-28">
          <p className="overline text-[#d4a056] mb-3">New Here?</p>
          <h1 className="display-1 text-white">Connect Card</h1>
          <p className="body-lg text-white/65 mt-3 max-w-lg">
            Let us know you&apos;re here. We&apos;d love to reach out and say hello.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="section bg-[#fdfcfb]">
        <div className="container-c3">
          <div className="max-w-2xl mx-auto">
            {submitted ? (
              /* Success state */
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-[#d4a056]/15 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={28} className="text-[#d4a056]" />
                </div>
                <h2 className="heading-1 text-[#0e1b26] mb-3">
                  Thanks for connecting!
                </h2>
                <p className="body-lg text-[#3d5566] mb-8">
                  We&apos;ll be in touch soon. In the meantime, we&apos;d love to see
                  you on Sunday.
                </p>
                <Link href="/" className="btn btn-primary btn-lg">
                  Back to Home
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-7">
                <div>
                  <p className="overline text-[#10405d]/60 mb-6">
                    Your Information
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#0e1b26] mb-1.5" htmlFor="first-name">
                        First name <span className="text-[#d4a056]">*</span>
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
                      <label className="block text-sm font-medium text-[#0e1b26] mb-1.5" htmlFor="last-name">
                        Last name <span className="text-[#d4a056]">*</span>
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
                      <label className="block text-sm font-medium text-[#0e1b26] mb-1.5" htmlFor="email">
                        Email <span className="text-[#d4a056]">*</span>
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
                      <label className="block text-sm font-medium text-[#0e1b26] mb-1.5" htmlFor="phone">
                        Phone
                      </label>
                      {/* inputMode="tel" shows the numeric phone keyboard on iOS/Android */}
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
                  <label className="block text-sm font-medium text-[#0e1b26] mb-1.5" htmlFor="campus">
                    Which campus do you attend?
                  </label>
                  <select id="campus" className="input-c3" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%237a9aac' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 0.75rem center", appearance: "none", paddingRight: "2.5rem" }}>
                    <option value="">Select a campus…</option>
                    {campuses.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* How did you hear */}
                <div>
                  <label className="block text-sm font-medium text-[#0e1b26] mb-1.5" htmlFor="how-heard">
                    How did you hear about C3?
                  </label>
                  <select id="how-heard" className="input-c3" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%237a9aac' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 0.75rem center", appearance: "none", paddingRight: "2.5rem" }}>
                    <option value="">Select…</option>
                    {howHeard.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>

                {/* Interests */}
                <div>
                  <p className="text-sm font-medium text-[#0e1b26] mb-3">
                    I&apos;m interested in… <span className="font-normal text-[#7a9aac]">(select all that apply)</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {/* py-2.5 + min-h-[44px] ensures Apple HIG 44px minimum touch target */}
                    {interests.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleInterest(item)}
                        className={`px-3.5 py-2.5 min-h-[44px] rounded-full text-sm font-medium border transition-all duration-150 ${
                          selected.includes(item)
                            ? "bg-[#10405d] text-white border-[#10405d]"
                            : "bg-white text-[#3d5566] border-[#10405d]/20 hover:border-[#10405d]/40"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-[#0e1b26] mb-1.5" htmlFor="message">
                    Anything else you&apos;d like us to know?
                  </label>
                  <textarea
                    id="message"
                    className="input-c3 textarea-c3"
                    placeholder="Prayer requests, questions, or just say hi…"
                  />
                </div>

                <button type="submit" className="btn btn-gold btn-lg self-start">
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
