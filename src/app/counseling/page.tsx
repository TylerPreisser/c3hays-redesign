import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Phone, DollarSign, AlertCircle, CheckCircle } from "lucide-react";
import { counselors } from "@/data/counselors";

export const metadata: Metadata = {
  title: "Counseling",
  description:
    "Bible-based counseling at C3 — trained counselors helping you develop spiritually healthy relationships with God and others.",
};

export default function CounselingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex items-end overflow-hidden" style={{ minHeight: "50vh" }}>
        <div className="absolute inset-0">
          <Image
            src="/images/bg-2.webp"
            alt="Peaceful counseling setting"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0" style={{ background: "rgba(10,10,10,0.60)" }} />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.2) 60%, transparent 100%)",
            }}
          />
        </div>
        <div className="relative z-10 container-c3 pb-16 pt-40">
          <p className="overline mb-4" style={{ color: "rgba(255,255,255,0.55)" }}>Care</p>
          <h1 className="display-1 text-white">Counseling</h1>
        </div>
      </section>

      {/* Vision + counselors */}
      <section className="section" style={{ backgroundColor: "#f2efed" }}>
        <div className="container-c3">
          <div className="max-w-3xl mb-16">
            <p className="overline mb-4" style={{ color: "rgba(35,46,44,0.45)" }}>Our Vision</p>
            <h2 className="display-2 mb-6 text-balance" style={{ color: "#232e2c" }}>
              Whole people, through Christ.
            </h2>
            <p className="body-lg" style={{ color: "rgba(35,46,44,0.65)" }}>
              Helping people develop spiritually healthy relationships with God
              through Jesus Christ — and supporting emotional and relational
              wellness with a team of trained, Bible-based counselors.
            </p>
          </div>

          {/* Crisis callout — high-visibility navy card */}
          <div className="crisis-card flex items-start gap-5 mb-16">
            <AlertCircle size={28} style={{ color: "#10405D" }} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-bold mb-2" style={{ color: "#232e2c", fontSize: "1.125rem" }}>
                In crisis? You&apos;re not alone.
              </p>
              <p className="mb-3" style={{ color: "rgba(35,46,44,0.75)", fontSize: "1rem", lineHeight: 1.6 }}>
                If you or someone you know is in immediate danger, please reach out now:
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="tel:988"
                  className="btn btn-primary btn-sm"
                >
                  Call or Text 988
                </a>
                <span className="flex items-center text-sm font-medium" style={{ color: "rgba(35,46,44,0.65)" }}>
                  Suicide &amp; Crisis Lifeline — available 24/7
                </span>
              </div>
            </div>
          </div>

          {/* Counselor cards */}
          <div className="grid grid-cols-1 md:grid-cols-3"
            style={{ border: "1px solid rgba(35,46,44,0.1)" }}>
            {counselors.map((c) => (
              <div
                key={c.id}
                className="counselor-card p-8"
              >
                {/* Monogram avatar */}
                <div
                  className="w-14 h-14 flex items-center justify-center mb-6"
                  style={{ background: "#232e2c" }}
                >
                  <span className="text-lg font-bold text-white">
                    {c.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
                <h3 className="font-bold leading-snug mb-0.5" style={{ color: "#232e2c", fontSize: "1rem" }}>
                  {c.name}
                  {c.credentials && (
                    <span className="font-normal text-sm ml-1" style={{ color: "rgba(35,46,44,0.5)" }}>
                      {c.credentials}
                    </span>
                  )}
                </h3>
                <p className="text-sm font-semibold mb-4" style={{ color: "#10405D" }}>{c.title}</p>
                <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(35,46,44,0.65)" }}>{c.bio}</p>
                {/* Specialties */}
                <div className="mb-4">
                  <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(35,46,44,0.4)" }}>
                    Specialties
                  </p>
                  <ul className="flex flex-col gap-1.5">
                    {c.specialties.map((s) => (
                      <li key={s} className="flex items-center gap-2 text-sm" style={{ color: "rgba(35,46,44,0.65)" }}>
                        <CheckCircle size={12} style={{ color: "#10405D" }} className="shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Education */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "rgba(35,46,44,0.4)" }}>
                    Education
                  </p>
                  <ul className="flex flex-col gap-1">
                    {c.education.map((e) => (
                      <li key={e} className="text-xs" style={{ color: "rgba(35,46,44,0.45)" }}>
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

      {/* Fees & policies */}
      <section className="section" style={{ backgroundColor: "#232e2c" }}>
        <div className="container-c3">
          <p className="overline mb-8" style={{ color: "rgba(255,255,255,0.35)" }}>Policies</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 max-w-2xl"
            style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
            <div className="p-8" style={{ borderRight: "1px solid rgba(255,255,255,0.1)" }}>
              <DollarSign size={24} style={{ color: "#10405D" }} className="mb-5" />
              <h3 className="font-bold text-white mb-4">Fees</h3>
              <ul className="flex flex-col gap-2.5 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                <li className="flex items-start gap-2">
                  <CheckCircle size={13} style={{ color: "#10405D", marginTop: 2 }} className="shrink-0" />
                  <span>$75 / session (reduced rate)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={13} style={{ color: "#10405D", marginTop: 2 }} className="shrink-0" />
                  <span>Cash, check; some counselors accept credit / Venmo</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={13} style={{ color: "#10405D", marginTop: 2 }} className="shrink-0" />
                  <span>Payment due at appointment</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={13} style={{ color: "#10405D", marginTop: 2 }} className="shrink-0" />
                  <span>Scholarships available on a case-by-case basis</span>
                </li>
              </ul>
            </div>
            <div className="p-8">
              <Phone size={24} style={{ color: "#10405D" }} className="mb-5" />
              <h3 className="font-bold text-white mb-4">Cancellation Policy</h3>
              <ul className="flex flex-col gap-2.5 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                <li className="flex items-start gap-2">
                  <CheckCircle size={13} style={{ color: "rgba(255,255,255,0.3)", marginTop: 2 }} className="shrink-0" />
                  <span>24-hour notice required for cancellations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={13} style={{ color: "rgba(255,255,255,0.3)", marginTop: 2 }} className="shrink-0" />
                  <span>No-shows are charged the $75 session fee</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Connect CTA */}
      <section className="section" style={{ backgroundColor: "#f2efed" }}>
        <div className="container-c3 text-center max-w-xl">
          <p className="overline mb-4" style={{ color: "rgba(35,46,44,0.45)" }}>Take the First Step</p>
          <h2 className="display-2 mb-5 text-balance" style={{ color: "#232e2c" }}>
            You don&apos;t have to carry it alone.
          </h2>
          <p className="body-lg mb-10" style={{ color: "rgba(35,46,44,0.65)" }}>
            Reach out to our team and we&apos;ll connect you with the right counselor
            for your needs.
          </p>
          <Link href="/connect/" className="btn btn-primary btn-lg">
            Get Connected
          </Link>
        </div>
      </section>
    </>
  );
}
