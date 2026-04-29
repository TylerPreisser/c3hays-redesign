import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Smartphone, CreditCard, Banknote } from "lucide-react";
import { site } from "@/data/site";

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
    color: "#d4a056",
    colorBg: "rgba(212,160,86,0.1)",
  },
  {
    icon: CreditCard,
    title: "Online",
    body: "Give securely through Pushpay — one-time or recurring. Choose your campus.",
    cta: "Give Online",
    href: site.giving.online,
    color: "#10405d",
    colorBg: "rgba(16,64,93,0.08)",
  },
  {
    icon: Smartphone,
    title: "C3 App",
    body: "Download the C3 app and give in seconds — anywhere, anytime.",
    cta: "Download App",
    href: site.appStore,
    color: "#3a89b8",
    colorBg: "rgba(58,137,184,0.1)",
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
      <section className="relative min-h-72 md:min-h-96 flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/worship.webp"
            alt="Worship service"
            fill
            className="object-cover"
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(105deg, rgba(10,31,46,0.97) 0%, rgba(10,31,46,0.82) 50%, rgba(16,64,93,0.7) 100%)",
            }}
          />
        </div>
        <div className="relative z-10 container-c3 pb-14 pt-28">
          <p className="overline text-[#d4a056] mb-3">Generosity</p>
          <h1 className="display-1 text-white">
            Your giving is
            <br />
            changing the world.
          </h1>
          <p className="body-lg text-white/65 mt-5 max-w-lg">
            At C3 we understand that God owns everything. We invite you to join
            us in stewardship — generously giving toward what God values.
          </p>
        </div>
      </section>

      {/* Ways to give */}
      <section className="section bg-[#fdfcfb]">
        <div className="container-c3">
          <div className="max-w-xl mb-14">
            <p className="overline text-[#10405d]/60 mb-3">Stewardship</p>
            <h2 className="display-2 text-[#0e1b26]">Three ways to give</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
            {givingOptions.map((opt) => {
              const Icon = opt.icon;
              return (
                <div key={opt.title} className="card p-7">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                    style={{ background: opt.colorBg }}
                  >
                    <Icon size={20} style={{ color: opt.color }} strokeWidth={1.75} />
                  </div>
                  <h3 className="font-medium text-[#0e1b26] mb-2">{opt.title}</h3>
                  <p className="text-sm text-[#3d5566] leading-relaxed mb-5">
                    {opt.body}
                  </p>
                  {opt.href && opt.cta && (
                    <a
                      href={opt.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-sm inline-flex items-center gap-1.5"
                    >
                      {opt.cta}
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              );
            })}
          </div>

          {/* Campus giving links */}
          <div className="max-w-lg">
            <h3 className="heading-3 text-[#0e1b26] mb-6">Give by campus</h3>
            <div className="flex flex-col gap-3">
              {campusGiving.map((cg) => (
                <a
                  key={cg.name}
                  href={cg.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-xl border border-[#10405d]/12 hover:border-[#10405d]/30 hover:bg-[#f0f5f9] transition-all duration-150 group"
                >
                  <span className="font-medium text-[#0e1b26]">
                    {cg.name} Campus
                  </span>
                  <ExternalLink
                    size={15}
                    className="text-[#7a9aac] group-hover:text-[#10405d] transition-colors"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Scripture quote */}
      <section className="section bg-[#0a1f2e]">
        <div className="container-c3 text-center max-w-2xl">
          <p className="overline text-[#d4a056] mb-6">Scripture</p>
          <blockquote className="display-2 text-white mb-5 text-balance">
            &ldquo;Each of you should give what you have decided in your heart to
            give, not reluctantly or under compulsion, for God loves a
            cheerful giver.&rdquo;
          </blockquote>
          <p className="text-white/50 font-medium">2 Corinthians 9:7</p>
          <div className="mt-10">
            <Link href="/connect/" className="btn btn-outline btn-lg">
              Questions? Connect With Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
