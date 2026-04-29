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
      <section className="relative min-h-64 md:min-h-80 flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/bg-2.webp"
            alt="Peaceful counseling setting"
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
        <div className="relative z-10 container-c3 pb-14 pt-28">
          <p className="overline text-[#d4a056] mb-3">Care</p>
          <h1 className="display-1 text-white">Counseling</h1>
        </div>
      </section>

      {/* Vision */}
      <section className="section bg-[#fdfcfb]">
        <div className="container-c3">
          <div className="max-w-3xl mb-16">
            <p className="overline text-[#10405d]/60 mb-4">Our Vision</p>
            <h2 className="display-2 text-[#0e1b26] mb-6 text-balance">
              Whole people,
              <br />
              through Christ.
            </h2>
            <p className="body-lg text-[#3d5566]">
              Helping people develop spiritually healthy relationships with God
              through Jesus Christ — and supporting emotional and relational
              wellness with a team of trained, Bible-based counselors.
            </p>
          </div>

          {/* Crisis callout */}
          <div
            className="flex items-start gap-4 p-5 rounded-xl mb-14 border"
            style={{
              background: "rgba(16,64,93,0.04)",
              borderColor: "rgba(16,64,93,0.12)",
            }}
          >
            <AlertCircle size={20} className="text-[#10405d] mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-[#0e1b26] mb-1">
                In crisis? You&apos;re not alone.
              </p>
              <p className="text-sm text-[#3d5566]">
                Call or text{" "}
                <a
                  href="tel:988"
                  className="font-medium text-[#10405d] hover:underline"
                >
                  988
                </a>{" "}
                (Suicide &amp; Crisis Lifeline) — available 24/7.
              </p>
            </div>
          </div>

          {/* Counselor cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {counselors.map((c) => (
              <div key={c.id} className="card p-7">
                {/* Monogram avatar */}
                <div className="w-14 h-14 rounded-full bg-[#10405d]/8 flex items-center justify-center mb-5">
                  <span className="text-xl font-medium text-[#10405d]">
                    {c.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
                <h3 className="font-medium text-[#0e1b26] leading-snug mb-0.5">
                  {c.name}
                  {c.credentials && (
                    <span className="text-[#7a9aac] font-normal text-sm ml-1">
                      {c.credentials}
                    </span>
                  )}
                </h3>
                <p className="text-sm text-[#10405d] font-medium mb-4">{c.title}</p>
                <p className="body-sm text-[#3d5566] mb-5">{c.bio}</p>
                {/* Specialties */}
                <div className="mb-4">
                  <p className="text-xs font-medium text-[#10405d]/60 uppercase tracking-wider mb-2">
                    Specialties
                  </p>
                  <ul className="flex flex-col gap-1.5">
                    {c.specialties.map((s) => (
                      <li key={s} className="flex items-center gap-2 text-sm text-[#3d5566]">
                        <CheckCircle size={13} className="text-[#d4a056] shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Education */}
                <div>
                  <p className="text-xs font-medium text-[#10405d]/60 uppercase tracking-wider mb-2">
                    Education
                  </p>
                  <ul className="flex flex-col gap-1">
                    {c.education.map((e) => (
                      <li key={e} className="text-xs text-[#7a9aac]">
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
      <section className="section bg-[#f7f4ef]">
        <div className="container-c3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            <div className="card p-7">
              <div className="w-10 h-10 rounded-lg bg-[#d4a056]/10 flex items-center justify-center mb-5">
                <DollarSign size={18} className="text-[#d4a056]" />
              </div>
              <h3 className="font-medium text-[#0e1b26] mb-3">Fees</h3>
              <ul className="flex flex-col gap-2 text-sm text-[#3d5566]">
                <li className="flex items-start gap-2">
                  <CheckCircle size={13} className="text-[#d4a056] mt-0.5 shrink-0" />
                  <span>$75 / session (reduced rate)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={13} className="text-[#d4a056] mt-0.5 shrink-0" />
                  <span>Cash, check; some counselors accept credit / Venmo</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={13} className="text-[#d4a056] mt-0.5 shrink-0" />
                  <span>Payment due at appointment</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={13} className="text-[#d4a056] mt-0.5 shrink-0" />
                  <span>Scholarships available on a case-by-case basis</span>
                </li>
              </ul>
            </div>
            <div className="card p-7">
              <div className="w-10 h-10 rounded-lg bg-[#10405d]/8 flex items-center justify-center mb-5">
                <Phone size={18} className="text-[#10405d]" />
              </div>
              <h3 className="font-medium text-[#0e1b26] mb-3">
                Cancellation Policy
              </h3>
              <ul className="flex flex-col gap-2 text-sm text-[#3d5566]">
                <li className="flex items-start gap-2">
                  <CheckCircle size={13} className="text-[#10405d]/40 mt-0.5 shrink-0" />
                  <span>24-hour notice required for cancellations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={13} className="text-[#10405d]/40 mt-0.5 shrink-0" />
                  <span>No-shows are charged the $75 session fee</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Connect CTA */}
      <section className="section bg-[#0a1f2e]">
        <div className="container-c3 text-center max-w-xl">
          <p className="overline text-[#d4a056] mb-4">Take the First Step</p>
          <h2 className="display-2 text-white mb-5">
            You don&apos;t have to carry it alone.
          </h2>
          <p className="body-lg text-white/65 mb-8">
            Reach out to our team and we&apos;ll connect you with the right counselor
            for your needs.
          </p>
          <Link href="/connect/" className="btn btn-gold btn-lg">
            Get Connected
          </Link>
        </div>
      </section>
    </>
  );
}
