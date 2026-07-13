import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Phone, DollarSign, CheckCircle } from "lucide-react";
import { counselors } from "@/data/counselors";
import { assetPath } from "@/lib/asset-path";
import { getCMSPage } from "@/lib/cms";
import { tx, imgCss } from "@/lib/home-content";

export const metadata: Metadata = {
  title: "Counseling",
  description:
    "Bible-based counseling at C3 — trained counselors helping you develop spiritually healthy relationships with God and others.",
};

export default async function CounselingPage() {
  const ov = (await getCMSPage("/counseling")) || {};
  const t = ov.text || {};
  const media = ov.media || {};

  return (
    <>
      {/* ── Hero — full-bleed with gradient scrim ── */}
      <section className="relative flex items-end overflow-hidden" style={{ minHeight: "56vh" }}>
        <div className="absolute inset-0" data-cms-img="counseling-hero-bg">
          <Image
            src={assetPath(media["counseling-hero-bg"] || "/images/congregation.webp")}
            alt="C3 congregation worshipping together"
            fill
            className="object-cover"
            priority
            style={imgCss(ov.img?.["counseling-hero-bg"])}
          />
          {/* Base scrim */}
          <div className="absolute inset-0" style={{ background: "rgba(10,10,10,0.55)" }} />
          {/* Bottom-to-top gradient for headline readability */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.18) 60%, transparent 100%)",
            }}
          />
        </div>

        <div className="relative z-10 container-c3 pb-16 pt-44">
          {/* Eyebrow */}
          <p
            data-cms="t:counseling-hero-eyebrow"
            className="font-bold uppercase tracking-[0.18em] mb-4"
            style={{ color: "#1cc3af", fontSize: "0.75rem" }}
            dangerouslySetInnerHTML={{ __html: tx(t, "counseling-hero-eyebrow", "C3 Counseling") }}
          />
          <h1
            data-cms="t:counseling-hero-heading"
            className="display-1 text-white text-balance"
            dangerouslySetInnerHTML={{ __html: tx(t, "counseling-hero-heading", "Counseling") }}
          />
          <p
            data-cms="t:counseling-hero-sub"
            className="body-lg mt-4 max-w-lg text-balance"
            style={{ color: "rgba(255,255,255,0.65)" }}
            dangerouslySetInnerHTML={{
              __html: tx(
                t,
                "counseling-hero-sub",
                "Professional, Bible-based counseling — for people who want to grow in wholeness."
              ),
            }}
          />
        </div>
      </section>

      {/* ── Vision intro ── */}
      <section className="section" style={{ backgroundColor: "#ffffff" }}>
        <div className="container-c3">
          <div className="max-w-3xl mb-16">
            {/* Section eyebrow */}
            <p
              data-cms="t:counseling-vision-eyebrow"
              className="font-bold uppercase tracking-[0.16em] mb-4"
              style={{ color: "#1cc3af", fontSize: "0.75rem" }}
              dangerouslySetInnerHTML={{
                __html: tx(t, "counseling-vision-eyebrow", "Our Mission"),
              }}
            />
            <h2
              data-cms="t:counseling-vision-heading"
              className="display-2 mb-6 text-balance"
              style={{ color: "#1b1c1c" }}
              dangerouslySetInnerHTML={{
                __html: tx(t, "counseling-vision-heading", "Whole people, through Christ."),
              }}
            />
            <p
              data-cms="t:counseling-vision-body"
              className="body-lg"
              style={{ color: "rgba(27,28,28,0.65)" }}
              dangerouslySetInnerHTML={{
                __html: tx(
                  t,
                  "counseling-vision-body",
                  "Helping people develop spiritually healthy relationships with God through Jesus Christ — and supporting emotional and relational wellness with a team of trained, Bible-based counselors."
                ),
              }}
            />
          </div>

          {/* ── Counselor cards ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {counselors.map((c) => (
              <div
                key={c.id}
                className="flex flex-col p-8"
                style={{
                  background: "#fff",
                  border: "1px solid rgba(27,28,28,0.10)",
                  borderRadius: "var(--radius-md)",
                  boxShadow: "0 2px 16px rgba(27,28,28,0.04)",
                }}
              >
                {/* Monogram avatar */}
                <div
                  className="w-14 h-14 flex items-center justify-center mb-6 rounded-full shrink-0"
                  style={{
                    background: "rgba(28, 195, 175, 0.10)",
                    border: "2px solid #1cc3af",
                  }}
                >
                  <span className="text-base font-bold tracking-wide" style={{ color: "#1cc3af" }}>
                    {c.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>

                {/* Name + credentials */}
                <h3
                  className="font-bold leading-snug mb-0.5"
                  style={{ color: "#1b1c1c", fontSize: "1rem" }}
                >
                  {c.name}
                  {c.credentials && (
                    <span className="font-normal text-sm ml-1" style={{ color: "rgba(27,28,28,0.5)" }}>
                      {c.credentials}
                    </span>
                  )}
                </h3>
                <p className="text-sm font-semibold mb-4" style={{ color: "#1cc3af" }}>
                  {c.title}
                </p>
                <p className="text-sm leading-relaxed mb-5 flex-1" style={{ color: "rgba(27,28,28,0.65)" }}>
                  {c.bio}
                </p>

                {/* Specialties */}
                <div className="mb-4">
                  <p
                    className="text-xs font-bold uppercase tracking-widest mb-3"
                    style={{ color: "rgba(27,28,28,0.4)" }}
                  >
                    Specialties
                  </p>
                  <ul className="flex flex-col gap-1.5">
                    {c.specialties.map((s) => (
                      <li
                        key={s}
                        className="flex items-center gap-2 text-sm"
                        style={{ color: "rgba(27,28,28,0.65)" }}
                      >
                        <CheckCircle size={12} style={{ color: "#1cc3af" }} className="shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Education */}
                <div>
                  <p
                    className="text-xs font-bold uppercase tracking-widest mb-2"
                    style={{ color: "rgba(27,28,28,0.4)" }}
                  >
                    Education
                  </p>
                  <ul className="flex flex-col gap-1">
                    {c.education.map((e) => (
                      <li key={e} className="text-xs" style={{ color: "rgba(27,28,28,0.45)" }}>
                        {e}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Fees & Policies — dark charcoal section ── */}
      <section className="section" style={{ backgroundColor: "#1b1c1c" }}>
        <div className="container-c3">
          {/* Section header */}
          <div className="mb-12">
            <p
              data-cms="t:counseling-policies-eyebrow"
              className="font-bold uppercase tracking-[0.16em] mb-4"
              style={{ color: "#1cc3af", fontSize: "0.75rem" }}
              dangerouslySetInnerHTML={{
                __html: tx(t, "counseling-policies-eyebrow", "Practical Details"),
              }}
            />
            <h2
              data-cms="t:counseling-policies-heading"
              className="display-2 text-white text-balance"
              dangerouslySetInnerHTML={{
                __html: tx(t, "counseling-policies-heading", "Fees &amp; Policies"),
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Fees card */}
            <div
              className="p-8"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <DollarSign size={24} style={{ color: "#1cc3af" }} className="mb-5" />
              <h3
                data-cms="t:counseling-fees-heading"
                className="font-bold text-white mb-4"
                dangerouslySetInnerHTML={{
                  __html: tx(t, "counseling-fees-heading", "Fees"),
                }}
              />
              <ul className="flex flex-col gap-2.5 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                <li className="flex items-start gap-2">
                  <CheckCircle size={13} style={{ color: "#1cc3af", marginTop: 2 }} className="shrink-0" />
                  <span
                    data-cms="t:counseling-fee-rate"
                    dangerouslySetInnerHTML={{
                      __html: tx(t, "counseling-fee-rate", "$75 / session (reduced rate)"),
                    }}
                  />
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={13} style={{ color: "#1cc3af", marginTop: 2 }} className="shrink-0" />
                  <span
                    data-cms="t:counseling-fee-payment"
                    dangerouslySetInnerHTML={{
                      __html: tx(t, "counseling-fee-payment", "Cash, check; some counselors accept credit / Venmo"),
                    }}
                  />
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={13} style={{ color: "#1cc3af", marginTop: 2 }} className="shrink-0" />
                  <span
                    data-cms="t:counseling-fee-due"
                    dangerouslySetInnerHTML={{
                      __html: tx(t, "counseling-fee-due", "Payment due at appointment"),
                    }}
                  />
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={13} style={{ color: "#1cc3af", marginTop: 2 }} className="shrink-0" />
                  <span
                    data-cms="t:counseling-fee-scholarship"
                    dangerouslySetInnerHTML={{
                      __html: tx(t, "counseling-fee-scholarship", "Scholarships available on a case-by-case basis"),
                    }}
                  />
                </li>
              </ul>
            </div>

            {/* Cancellation card */}
            <div
              className="p-8"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <Phone size={24} style={{ color: "#1cc3af" }} className="mb-5" />
              <h3
                data-cms="t:counseling-cancel-heading"
                className="font-bold text-white mb-4"
                dangerouslySetInnerHTML={{
                  __html: tx(t, "counseling-cancel-heading", "Cancellation Policy"),
                }}
              />
              <ul className="flex flex-col gap-2.5 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                <li className="flex items-start gap-2">
                  <CheckCircle size={13} style={{ color: "#1cc3af", marginTop: 2 }} className="shrink-0" />
                  <span
                    data-cms="t:counseling-cancel-notice"
                    dangerouslySetInnerHTML={{
                      __html: tx(t, "counseling-cancel-notice", "24-hour notice required for cancellations"),
                    }}
                  />
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={13} style={{ color: "#1cc3af", marginTop: 2 }} className="shrink-0" />
                  <span
                    data-cms="t:counseling-cancel-noshow"
                    dangerouslySetInnerHTML={{
                      __html: tx(t, "counseling-cancel-noshow", "No-shows are charged the $75 session fee"),
                    }}
                  />
                </li>
              </ul>
            </div>

            {/* Getting started card */}
            <div
              className="p-8"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <CheckCircle size={24} style={{ color: "#1cc3af" }} className="mb-5" />
              <h3
                data-cms="t:counseling-start-heading"
                className="font-bold text-white mb-4"
                dangerouslySetInnerHTML={{
                  __html: tx(t, "counseling-start-heading", "Getting Started"),
                }}
              />
              <ul className="flex flex-col gap-2.5 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                <li className="flex items-start gap-2">
                  <CheckCircle size={13} style={{ color: "#1cc3af", marginTop: 2 }} className="shrink-0" />
                  <span
                    data-cms="t:counseling-start-step1"
                    dangerouslySetInnerHTML={{
                      __html: tx(t, "counseling-start-step1", "Reach out via our connect form or call the church office"),
                    }}
                  />
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={13} style={{ color: "#1cc3af", marginTop: 2 }} className="shrink-0" />
                  <span
                    data-cms="t:counseling-start-step2"
                    dangerouslySetInnerHTML={{
                      __html: tx(t, "counseling-start-step2", "We&apos;ll match you with the right counselor for your needs"),
                    }}
                  />
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={13} style={{ color: "#1cc3af", marginTop: 2 }} className="shrink-0" />
                  <span
                    data-cms="t:counseling-start-step3"
                    dangerouslySetInnerHTML={{
                      __html: tx(t, "counseling-start-step3", "Confidential — your privacy is always protected"),
                    }}
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Connect CTA ── */}
      <section className="section" style={{ backgroundColor: "#ffffff" }}>
        <div className="container-c3 text-center" style={{ maxWidth: "42rem" }}>
          <p
            data-cms="t:counseling-cta-eyebrow"
            className="font-bold uppercase tracking-[0.16em] mb-5"
            style={{ color: "#1cc3af", fontSize: "0.75rem" }}
            dangerouslySetInnerHTML={{
              __html: tx(t, "counseling-cta-eyebrow", "Take the first step"),
            }}
          />
          <h2
            data-cms="t:counseling-cta-heading"
            className="display-2 mb-5 text-balance"
            style={{ color: "#1b1c1c" }}
            dangerouslySetInnerHTML={{
              __html: tx(t, "counseling-cta-heading", "You don&apos;t have to carry it alone."),
            }}
          />
          <p
            data-cms="t:counseling-cta-body"
            className="body-lg mb-10"
            style={{ color: "rgba(27,28,28,0.65)" }}
            dangerouslySetInnerHTML={{
              __html: tx(
                t,
                "counseling-cta-body",
                "Reach out to our team and we&apos;ll connect you with the right counselor for your needs."
              ),
            }}
          />
          <Link
            href={t["counseling-cta-btn-href"] || "/connect/"}
            data-cms-link="counseling-cta-btn"
            className="btn btn-primary btn-lg"
          >
            <span data-cms-link-label>
              {tx(t, "counseling-cta-btn-label", "Get Connected")}
            </span>
          </Link>
        </div>
      </section>
    </>
  );
}
