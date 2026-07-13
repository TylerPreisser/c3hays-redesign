import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Smartphone, CreditCard, Banknote } from "lucide-react";
import { site } from "@/data/site";
import { assetPath } from "@/lib/asset-path";
import { getCMSPage } from "@/lib/cms";
import { tx, imgCss } from "@/lib/home-content";

export const metadata: Metadata = {
  title: "Give",
  description:
    "Give generously to Celebration Community Church — online, by app, or in person at Hays or Colby.",
};

export default async function GivePage() {
  const ov = (await getCMSPage("/give")) || {};
  const t = ov.text || {};
  const media = ov.media || {};

  const givingOptions = [
    {
      icon: Banknote,
      id: "cash",
      title: "Cash or Check",
      body: 'Give during any weekend service at the offering box in the lobby. Make checks payable to "Celebration Community Church."',
      cta: null,
      href: null,
    },
    {
      icon: CreditCard,
      id: "online",
      title: "Online",
      body: "Give securely through Pushpay — one-time or recurring. Choose your campus.",
      cta: "Give Online",
      href: site.giving.online,
    },
    {
      icon: Smartphone,
      id: "app",
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

  const whereItGoes: [string, string, string][] = [
    ["give-impact-0-title", "give-impact-0-body", "Right here at home"],
    ["give-impact-1-title", "give-impact-1-body", "The next generation"],
    ["give-impact-2-title", "give-impact-2-body", "Beyond our walls"],
  ];

  const whereItGoesBodies = [
    "Weekend gatherings, kids & students, and care for our Hays and Colby communities.",
    "Investing in young families and raising up the church Jesus is building.",
    "Local outreach and global missions — the love of Christ to the ends of the earth.",
  ];

  return (
    <>
      {/* ── Hero — full-bleed image with dark gradient scrim ── */}
      <section
        className="relative flex items-end overflow-hidden"
        style={{ minHeight: "68vh" }}
      >
        {/* Background image */}
        <div
          className="absolute inset-0"
          data-cms-img="give-hero-bg"
          style={{ borderRadius: 0 }}
        >
          <Image
            src={assetPath(media["give-hero-bg"] || "/images/worship.webp")}
            alt="Worship service"
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={imgCss(ov.img?.["give-hero-bg"])}
          />
          {/* Bottom-up gradient — headline reads over any photo */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.45) 55%, rgba(10,10,10,0.25) 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(10,10,10,0.55) 0%, transparent 40%)",
            }}
          />
        </div>

        {/* Text block at the bottom of the hero */}
        <div className="relative z-10 container-c3 pb-20 pt-44">
          {/* Eyebrow */}
          <span
            data-cms="t:give-hero-eyebrow"
            dangerouslySetInnerHTML={{
              __html: tx(t, "give-hero-eyebrow", "Generosity"),
            }}
            style={{
              display: "inline-block",
              textTransform: "uppercase",
              letterSpacing: "0.16em",
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "#1cc3af",
              marginBottom: "1.25rem",
            }}
          />

          <h1
            className="display-1 text-white text-balance"
            data-cms="t:give-hero-heading"
            dangerouslySetInnerHTML={{
              __html: tx(
                t,
                "give-hero-heading",
                'Your giving is <em class="not-italic" style="color:#1cc3af">changing</em> the world.'
              ),
            }}
          />

          <p
            className="body-lg mt-6"
            data-cms="t:give-hero-body"
            style={{ color: "rgba(255,255,255,0.65)", maxWidth: "32rem" }}
            dangerouslySetInnerHTML={{
              __html: tx(
                t,
                "give-hero-body",
                "At C3 we understand that God owns everything. We invite you to join us in stewardship — generously giving toward what God values."
              ),
            }}
          />

          {/* Primary CTA */}
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href={t["give-hero-cta-href"] || site.giving.online}
              target="_blank"
              rel="noopener noreferrer"
              data-cms-link="give-hero-cta"
              className="btn btn-primary btn-lg"
            >
              <span data-cms-link-label>
                {tx(t, "give-hero-cta-label", "Give Now")}
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* ── Three ways to give ── */}
      <section className="section" style={{ backgroundColor: "#ffffff" }}>
        <div className="container-c3">
          {/* Section header */}
          <div className="max-w-xl mb-14">
            <span
              data-cms="t:give-ways-eyebrow"
              dangerouslySetInnerHTML={{
                __html: tx(t, "give-ways-eyebrow", "Options"),
              }}
              style={{
                display: "inline-block",
                textTransform: "uppercase",
                letterSpacing: "0.16em",
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "#1cc3af",
                marginBottom: "1rem",
              }}
            />
            <h2
              className="display-2"
              data-cms="t:give-ways-heading"
              style={{ color: "#1b1c1c" }}
              dangerouslySetInnerHTML={{
                __html: tx(t, "give-ways-heading", "Three ways to give"),
              }}
            />
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {givingOptions.map((opt) => {
              const Icon = opt.icon;
              return (
                <div
                  key={opt.id}
                  className="flex flex-col"
                  style={{
                    background: "#fff",
                    border: "1px solid rgba(27,28,28,0.10)",
                    borderRadius: "var(--radius-md)",
                    padding: "2rem",
                  }}
                >
                  {/* Icon tile */}
                  <div
                    className="grid place-items-center mb-6"
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 14,
                      background: "rgba(28,195,175,0.12)",
                    }}
                  >
                    <Icon
                      size={24}
                      strokeWidth={1.75}
                      style={{ color: "#179c8c" }}
                    />
                  </div>

                  <h3
                    className="heading-3 mb-3"
                    data-cms={`t:give-opt-${opt.id}-title`}
                    style={{ color: "#1b1c1c" }}
                    dangerouslySetInnerHTML={{
                      __html: tx(t, `give-opt-${opt.id}-title`, opt.title),
                    }}
                  />

                  <p
                    className="flex-1 text-sm leading-relaxed mb-6"
                    data-cms={`t:give-opt-${opt.id}-body`}
                    style={{ color: "rgba(27,28,28,0.65)" }}
                    dangerouslySetInnerHTML={{
                      __html: tx(t, `give-opt-${opt.id}-body`, opt.body),
                    }}
                  />

                  {opt.href && opt.cta ? (
                    <a
                      href={t[`give-opt-${opt.id}-cta-href`] || opt.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cms-link={`give-opt-${opt.id}-cta`}
                      className="btn btn-outline btn-sm self-start"
                    >
                      <span data-cms-link-label>
                        {tx(t, `give-opt-${opt.id}-cta-label`, opt.cta)}
                      </span>
                    </a>
                  ) : (
                    <span
                      className="text-xs font-semibold uppercase tracking-widest"
                      style={{ color: "rgba(27,28,28,0.35)" }}
                    >
                      In-person
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Divider */}
          <div
            style={{
              borderTop: "1px solid rgba(27,28,28,0.1)",
              marginBottom: "4rem",
            }}
          />

          {/* Campus giving + where it goes — balanced 2-col */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Left — give by campus */}
            <div>
              <h3
                className="heading-3 mb-3"
                data-cms="t:give-campus-heading"
                style={{ color: "#1b1c1c" }}
                dangerouslySetInnerHTML={{
                  __html: tx(
                    t,
                    "give-campus-heading",
                    "Give by campus"
                  ),
                }}
              />
              <p
                className="text-sm mb-8 max-w-sm"
                data-cms="t:give-campus-subhead"
                style={{ color: "rgba(27,28,28,0.6)" }}
                dangerouslySetInnerHTML={{
                  __html: tx(
                    t,
                    "give-campus-subhead",
                    "Choose your home campus so your gift reaches the right community."
                  ),
                }}
              />

              {/* Campus list */}
              <div
                className="flex flex-col gap-0 overflow-hidden"
                style={{
                  background: "#fff",
                  border: "1px solid rgba(27,28,28,0.10)",
                  borderRadius: "var(--radius-md)",
                }}
              >
                {campusGiving.map((cg, i) => (
                  <a
                    key={cg.name}
                    href={cg.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between p-5 transition-colors duration-150 hover:bg-[rgba(28,195,175,0.06)]"
                    style={{
                      borderBottom:
                        i < campusGiving.length - 1
                          ? "1px solid rgba(27,28,28,0.12)"
                          : "none",
                    }}
                  >
                    <span
                      className="font-semibold text-sm uppercase tracking-wider transition-colors duration-150 group-hover:text-[#179c8c]"
                      style={{ color: "#1b1c1c" }}
                    >
                      {cg.name} Campus
                    </span>
                    <ExternalLink
                      size={15}
                      style={{ color: "rgba(27,28,28,0.4)" }}
                    />
                  </a>
                ))}
              </div>
            </div>

            {/* Right — where your giving goes */}
            <div className="lg:pt-1">
              <h3
                className="heading-3 mb-3"
                data-cms="t:give-impact-heading"
                style={{ color: "#1b1c1c" }}
                dangerouslySetInnerHTML={{
                  __html: tx(
                    t,
                    "give-impact-heading",
                    "Where your giving goes"
                  ),
                }}
              />
              <p
                className="text-sm mb-8 max-w-sm"
                data-cms="t:give-impact-subhead"
                style={{ color: "rgba(27,28,28,0.6)" }}
                dangerouslySetInnerHTML={{
                  __html: tx(
                    t,
                    "give-impact-subhead",
                    "Every gift, across every campus, fuels one mission."
                  ),
                }}
              />

              <ul className="flex flex-col">
                {whereItGoes.map(([titleKey, bodyKey, defaultTitle], i) => (
                  <li
                    key={titleKey}
                    className="flex gap-4 py-5"
                    style={{
                      borderTop:
                        i === 0 ? "none" : "1px solid rgba(27,28,28,0.1)",
                    }}
                  >
                    <span
                      className="shrink-0 text-xs font-bold tabular-nums pt-1"
                      style={{ color: "#1cc3af" }}
                    >
                      0{i + 1}
                    </span>
                    <div>
                      <p
                        className="font-semibold mb-1"
                        data-cms={`t:${titleKey}`}
                        style={{ color: "#1b1c1c", fontSize: "1rem" }}
                        dangerouslySetInnerHTML={{
                          __html: tx(t, titleKey, defaultTitle),
                        }}
                      />
                      <p
                        className="text-sm leading-relaxed"
                        data-cms={`t:${bodyKey}`}
                        style={{ color: "rgba(27,28,28,0.6)" }}
                        dangerouslySetInnerHTML={{
                          __html: tx(t, bodyKey, whereItGoesBodies[i]),
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Scripture quote — dark charcoal section ── */}
      <section className="section" style={{ backgroundColor: "#1b1c1c" }}>
        <div className="container-c3 text-center" style={{ maxWidth: "42rem" }}>
          {/* Teal overline accent */}
          <span
            data-cms="t:give-quote-ref"
            dangerouslySetInnerHTML={{
              __html: tx(t, "give-quote-ref", "2 Corinthians 9:7"),
            }}
            style={{
              display: "inline-block",
              textTransform: "uppercase",
              letterSpacing: "0.16em",
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "#1cc3af",
              marginBottom: "1.5rem",
            }}
          />

          <blockquote
            className="text-white text-balance"
            data-cms="t:give-quote-text"
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
              fontWeight: 600,
              lineHeight: 1.25,
              letterSpacing: "-0.01em",
              marginBottom: "3rem",
            }}
            dangerouslySetInnerHTML={{
              __html: tx(
                t,
                "give-quote-text",
                "“Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.”"
              ),
            }}
          />

          <Link
            href={t["give-connect-cta-href"] || "/connect/"}
            data-cms-link="give-connect-cta"
            className="btn btn-outline btn-lg"
          >
            <span data-cms-link-label>
              {tx(t, "give-connect-cta-label", "Questions? Connect With Us")}
            </span>
          </Link>
        </div>
      </section>
    </>
  );
}
