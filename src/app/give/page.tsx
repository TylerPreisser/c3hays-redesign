import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Smartphone, CreditCard, Banknote } from "lucide-react";
import { site } from "@/data/site";
import { assetPath } from "@/lib/asset-path";

export const metadata: Metadata = {
  title: "Give",
  description:
    "Give generously to Celebration Community Church — online, by app, or in person at Hays or Colby.",
};

const givingOptions = [
  {
    icon: Banknote,
    title: "Cash or Check",
    body: "Give during any weekend service at the offering box in the lobby. Make checks payable to \"Celebration Community Church.\"",
    cta: null,
    href: null,
  },
  {
    icon: CreditCard,
    title: "Online",
    body: "Give securely through Pushpay — one-time or recurring. Choose your campus.",
    cta: "Give Online",
    href: site.giving.online,
  },
  {
    icon: Smartphone,
    title: "C3 App",
    body: "Download the C3 app and give in seconds — anywhere, anytime.",
    cta: "Download App",
    href: site.appStore,
  },
];

const campusGiving = [
  { name: "Hays", href: site.giving.hays },
  { name: "Colby", href: site.giving.colby },
  { name: "General / Online", href: site.giving.online },
];

export default function GivePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex items-end overflow-hidden" style={{ minHeight: "60vh" }}>
        <div className="absolute inset-0">
          <Image
            src={assetPath("/images/worship.webp")}
            alt="Worship service"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0" style={{ background: "rgba(10,10,10,0.65)" }} />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.25) 60%, transparent 100%)",
            }}
          />
        </div>
        <div className="relative z-10 container-c3 pb-20 pt-40">
          <p className="overline mb-4" style={{ color: "rgba(255,255,255,0.55)" }}>Generosity</p>
          <h1 className="display-1 text-white text-balance">
            Your giving is{" "}
            <em className="not-italic" style={{ color: "#1cc3af" }}>changing</em>{" "}
            the world.
          </h1>
          <p className="body-lg mt-6 max-w-lg" style={{ color: "rgba(255,255,255,0.65)" }}>
            At C3 we understand that God owns everything. We invite you to join
            us in stewardship — generously giving toward what God values.
          </p>
        </div>
      </section>

      {/* Ways to give */}
      <section className="section" style={{ backgroundColor: "#ffffff" }}>
        <div className="container-c3">
          <div className="max-w-xl mb-14">
            <p className="overline mb-4" style={{ color: "rgba(27,28,28,0.4)" }}>Stewardship</p>
            <h2 className="display-2" style={{ color: "#1b1c1c" }}>Three ways to give</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 mb-16"
            style={{ border: "1.5px solid rgba(27,28,28,0.1)" }}>
            {givingOptions.map((opt, i) => {
              const Icon = opt.icon;
              return (
                <div
                  key={opt.title}
                  className="give-card"
                  style={{
                    borderBottom: i < givingOptions.length - 1 ? "1.5px solid rgba(27,28,28,0.1)" : "none",
                  }}
                >
                  <div className="mb-6">
                    <Icon
                      size={28}
                      style={{ color: "#1cc3af" }}
                      strokeWidth={1.5}
                    />
                  </div>
                  <h3 className="heading-3 mb-3" style={{ color: "#1b1c1c" }}>{opt.title}</h3>
                  <p className="give-card-body text-sm leading-relaxed mb-6" style={{ color: "rgba(27,28,28,0.65)" }}>
                    {opt.body}
                  </p>
                  {opt.href && opt.cta ? (
                    <a
                      href={opt.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-navy btn-sm self-start"
                    >
                      {opt.cta} →
                    </a>
                  ) : (
                    <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(27,28,28,0.35)" }}>
                      In-person
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Divider */}
          <div style={{ borderTop: "1px solid rgba(27,28,28,0.1)", marginBottom: "3.5rem" }} />

          {/* Campus giving links */}
          <div className="max-w-lg">
            <h3 className="heading-3 mb-8" style={{ color: "#1b1c1c" }}>Give by campus</h3>
            <div className="flex flex-col gap-0" style={{ border: "1px solid rgba(27,28,28,0.12)" }}>
              {campusGiving.map((cg, i) => (
                <a
                  key={cg.name}
                  href={cg.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="giving-row flex items-center justify-between p-5"
                  style={{
                    borderBottom: i < campusGiving.length - 1 ? "1px solid rgba(27,28,28,0.12)" : "none",
                  }}
                >
                  <span className="font-semibold text-sm uppercase tracking-wider" style={{ color: "#1b1c1c" }}>
                    {cg.name} Campus
                  </span>
                  <ExternalLink size={15} style={{ color: "rgba(27,28,28,0.4)" }} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Scripture quote */}
      <section className="section" style={{ backgroundColor: "#1b1c1c" }}>
        <div className="container-c3 text-center max-w-2xl">
          <p className="overline mb-6" style={{ color: "rgba(255,255,255,0.35)" }}>Scripture</p>
          <blockquote
            className="text-white text-balance mb-6"
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
              fontWeight: 600,
              lineHeight: 1.25,
              letterSpacing: "-0.01em",
            }}
          >
            &ldquo;Each of you should give what you have decided in your heart to
            give, not reluctantly or under compulsion, for God loves a
            cheerful giver.&rdquo;
          </blockquote>
          <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: "#1cc3af" }}>
            2 Corinthians 9:7
          </p>
          <div className="mt-12">
            <Link href="/connect/" className="btn btn-outline btn-lg">
              Questions? Connect With Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
