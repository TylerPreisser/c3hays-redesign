import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, HeartHandshake, Shirt, Baby } from "lucide-react";
import { locations } from "@/data/locations";
import { assetPath } from "@/lib/asset-path";
import { getCMSPage } from "@/lib/cms";
import { tx, imgCss } from "@/lib/home-content";
import Section from "@/components/ui/Section";
import FeatureCard from "@/components/ui/FeatureCard";

export const metadata: Metadata = {
  title: "Plan Your Visit",
  description:
    "Everything you need to know before your first visit to Celebration Community Church in Hays or Colby, Kansas.",
};

const CCB_FORM = "https://celebration.ccbchurch.com/goto/forms/47/responses/new";

/* Verbatim from celebratejesus.org /plan-your-visit (captured 2026-07-15). */
const expectBlocks = [
  {
    id: "expect",
    icon: HeartHandshake,
    title: "What To Expect",
    body: "We know that showing up to a new place for the first time can be intimidating, but at C3 it&apos;s our desire that you feel right at home from the moment you pull into the parking lot. As a first-time guest, you are VIP to us so we&apos;ll be there with you every step of the way! We even have a gift for you - just to say &lsquo;thank you&rsquo; for checking out our church. Fill out the form at the bottom of this page and we&apos;ll have a member of our greeting team ready to meet you at the door, show you around, help you check in your kids and find a seat.",
  },
  {
    id: "dress",
    icon: Shirt,
    title: "Come As You Are",
    body: "At C3, there is no dress code. Some people show up in suits, and others wear jeans and t-shirts. We want you to wear whatever makes you feel comfortable.",
  },
  {
    id: "kids",
    icon: Baby,
    title: "Bring The Kids",
    body: "C3Kids is available for children ages 3 through the 5th grade. The care and growth of every child is our highest priority and our passion is to create exciting, Bible-driven, interactive environments especially designed for your kids! C3Kids is available during our 9:30am service on Sunday so you can enjoy a great service knowing your child is being loved and nurtured.",
  },
];

export default async function VisitPage() {
  const ov = (await getCMSPage("/visit")) || {};
  const t = ov.text || {};
  const media = ov.media || {};

  return (
    <>
      {/* ── Hero ────────────────────────────────────────────────── */}
      <section
        className="relative flex items-end overflow-hidden"
        style={{ minHeight: "70vh" }}
      >
        <div className="absolute inset-0" data-cms-img="visit-hero-bg">
          <Image
            src={assetPath(media["visit-hero-bg"] || "/images/hero-2.webp")}
            alt="Family arriving at C3"
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={imgCss(ov.img?.["visit-hero-bg"])}
          />
          <div
            className="absolute inset-0"
            style={{ background: "rgba(10,10,10,0.45)" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.22) 55%, transparent 100%)",
            }}
          />
        </div>

        <div className="relative z-10 container-c3 pb-24 pt-48">
          <p
            className="overline mb-5"
            style={{ color: "#1cc3af" }}
            data-cms="t:visit-hero-eyebrow"
            dangerouslySetInnerHTML={{
              __html: tx(t, "visit-hero-eyebrow", "First visit"),
            }}
          />
          <h1
            className="display-1 text-white text-balance"
            data-cms="t:visit-hero-heading"
            dangerouslySetInnerHTML={{
              __html: tx(t, "visit-hero-heading", "Plan your visit."),
            }}
          />
          <p
            className="body-lg mt-6 max-w-lg"
            style={{ color: "rgba(255,255,255,0.65)" }}
            data-cms="t:visit-hero-sub"
            dangerouslySetInnerHTML={{
              __html: tx(
                t,
                "visit-hero-sub",
                "What to expect when you walk through our doors."
              ),
            }}
          />
        </div>
      </section>

      {/* ── Welcome! — verbatim intro, generous rhythm ──────────── */}
      <section className="section" style={{ backgroundColor: "#ffffff" }}>
        <div
          className="container-c3 text-center"
          style={{ maxWidth: "48rem", marginInline: "auto" }}
        >
          <p
            className="overline"
            style={{ color: "#1cc3af", marginBottom: "clamp(1.25rem, 2.5vw, 1.75rem)" }}
            data-cms="t:visit-welcome-eyebrow"
            dangerouslySetInnerHTML={{
              __html: tx(t, "visit-welcome-eyebrow", "Welcome!"),
            }}
          />
          <h2
            className="display-2 text-balance"
            style={{ color: "#1b1c1c", marginBottom: "clamp(1.75rem, 3.5vw, 2.5rem)" }}
            data-cms="t:visit-welcome-heading"
            dangerouslySetInnerHTML={{
              __html: tx(t, "visit-welcome-heading", "You&apos;re invited — just as you are."),
            }}
          />
          <p
            className="body-lg"
            style={{ color: "rgba(27,28,28,0.70)", lineHeight: 1.8, marginInline: "auto", maxWidth: "42rem" }}
            data-cms="t:visit-welcome-body"
            dangerouslySetInnerHTML={{
              __html: tx(
                t,
                "visit-welcome-body",
                "No matter what stage, age, or season you find yourself in, Celebration Community Church is for you! We invite you to come just as you are and be part of this community of people who are striving together to discover God&apos;s purpose and plan for their lives!"
              ),
            }}
          />
        </div>
      </section>

      {/* ── What To Expect / Come As You Are / Bring The Kids ───── */}
      {/* V2: premium, equal-height FeatureCard trio (Wave-0 primitive) —
          contained tiles, icon chips, balanced type. Verbatim content preserved
          via data-cms spans + dangerouslySetInnerHTML. */}
      <Section tone="mist" size="default">
        <div className="container-c3">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {expectBlocks.map((block) => {
              const Icon = block.icon;
              return (
                <FeatureCard
                  key={block.id}
                  bgKey={`visit-block-${block.id}-bg`}
                  icon={<Icon size={24} strokeWidth={1.75} />}
                  title={
                    <span
                      data-cms={`t:visit-block-${block.id}-title`}
                      dangerouslySetInnerHTML={{
                        __html: tx(t, `visit-block-${block.id}-title`, block.title),
                      }}
                    />
                  }
                  body={
                    <span
                      data-cms={`t:visit-block-${block.id}-body`}
                      dangerouslySetInnerHTML={{
                        __html: tx(t, `visit-block-${block.id}-body`, block.body),
                      }}
                    />
                  }
                />
              );
            })}
          </div>
        </div>
      </Section>

      {/* ── When & Where — dark split ───────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: "#1b1c1c" }}
      >
        <div className="flex flex-col lg:flex-row lg:min-h-[640px]">
          <div className="flex-1 min-w-0 section lg:py-24 xl:py-28">
            <div className="container-c3 lg:pr-0 xl:pr-0">
              <div style={{ marginBottom: "clamp(2.5rem, 5vw, 3.5rem)" }}>
                <p
                  className="overline mb-4"
                  style={{ color: "#1cc3af" }}
                  data-cms="t:visit-times-eyebrow"
                  dangerouslySetInnerHTML={{
                    __html: tx(t, "visit-times-eyebrow", "Join Us"),
                  }}
                />
                <h2
                  className="heading-1 text-white"
                  data-cms="t:visit-times-heading"
                  dangerouslySetInnerHTML={{
                    __html: tx(t, "visit-times-heading", "When & where we meet"),
                  }}
                />
              </div>

              {/* V4: equal-height campus cards, de-crammed rhythm. Only campus
                  name + address + service times + a Directions button (no
                  campus-details filler). Two-campus layout preserved. */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 items-stretch">
                {locations.map((loc) => (
                  <div
                    key={loc.id}
                    className="flex flex-col h-full"
                    style={{
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: "var(--radius-md)",
                      padding: "clamp(1.75rem, 3vw, 2.5rem)",
                    }}
                  >
                    <h3
                      className="font-bold text-sm uppercase tracking-widest mb-6"
                      style={{ color: "#1cc3af" }}
                      data-cms={`t:visit-campus-${loc.id}-name`}
                      dangerouslySetInnerHTML={{
                        __html: tx(
                          t,
                          `visit-campus-${loc.id}-name`,
                          `${loc.name} Campus`
                        ),
                      }}
                    />
                    <div className="flex items-start gap-3 mb-6">
                      <MapPin
                        size={15}
                        style={{ color: "rgba(255,255,255,0.4)", marginTop: 3 }}
                        className="shrink-0"
                      />
                      <address
                        className="not-italic body-base"
                        style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}
                        data-cms={`t:visit-campus-${loc.id}-address`}
                        dangerouslySetInnerHTML={{
                          __html: tx(
                            t,
                            `visit-campus-${loc.id}-address`,
                            `${loc.street}, ${loc.city}, ${loc.state} ${loc.zip}`
                          ),
                        }}
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      {loc.services.map((s) => (
                        <div key={s.day} className="flex items-center gap-2.5">
                          <Clock
                            size={14}
                            style={{ color: "rgba(255,255,255,0.35)" }}
                            className="shrink-0"
                          />
                          <span
                            className="body-base"
                            style={{ color: "rgba(255,255,255,0.68)" }}
                          >
                            <strong className="text-white font-semibold">
                              {s.day}:
                            </strong>{" "}
                            {s.times.join(" · ")}
                          </span>
                        </div>
                      ))}
                    </div>
                    {/* Spacer flexes so Directions pins to the bottom → equal-height cards align. */}
                    <div style={{ flex: 1, minHeight: "var(--space-cta)" }} />
                    <a
                      href={loc.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-sm inline-flex items-center gap-1.5 self-start"
                    >
                      <MapPin size={14} />
                      Directions
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            className="hidden lg:block lg:w-2/5 xl:w-1/2 relative shrink-0"
            aria-hidden="true"
            data-cms-img="visit-times-photo"
          >
            <Image
              src={assetPath(media["visit-times-photo"] || "/images/gather.webp")}
              alt=""
              fill
              className="object-cover object-center"
              style={imgCss(ov.img?.["visit-times-photo"])}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to right, rgba(27,28,28,0.85) 0%, rgba(27,28,28,0.25) 40%, transparent 100%)",
              }}
            />
          </div>
        </div>
      </section>

      {/* ── Let Us Know You're Coming — CCB form CTA ────────────── */}
      {/* V3: clean centered single-column terminal moment — copy centered on a
          readable measure, image as a contained rounded banner, buttons centered. */}
      <Section tone="white" size="default">
        <div className="container-c3">
          <div
            className="text-center"
            style={{ maxWidth: "60rem", marginInline: "auto" }}
          >
            <div
              className="relative overflow-hidden"
              style={{
                height: "clamp(240px, 34vw, 380px)",
                borderRadius: "var(--radius-md)",
                marginBottom: "var(--space-block)",
              }}
              data-cms-img="visit-cta-photo"
            >
              <Image
                src={assetPath(
                  media["visit-cta-photo"] || "/images/congregation.webp"
                )}
                alt="Warm welcome at C3"
                fill
                sizes="(min-width: 1024px) 60rem, 100vw"
                className="object-cover"
                style={imgCss(ov.img?.["visit-cta-photo"])}
              />
            </div>

            <p
              className="overline"
              style={{ color: "#1cc3af", marginBottom: "var(--space-eyebrow)" }}
              data-cms="t:visit-cta-eyebrow"
              dangerouslySetInnerHTML={{
                __html: tx(t, "visit-cta-eyebrow", "Coming this weekend?"),
              }}
            />
            <h2
              className="display-2 text-balance"
              style={{ color: "#1b1c1c", marginBottom: "var(--space-heading)" }}
              data-cms="t:visit-cta-heading"
              dangerouslySetInnerHTML={{
                __html: tx(t, "visit-cta-heading", "Let us know you&apos;re coming."),
              }}
            />
            <p
              className="body-lg"
              style={{
                color: "rgba(27,28,28,0.65)",
                lineHeight: 1.8,
                maxWidth: "44rem",
                marginInline: "auto",
                marginBottom: "var(--space-cta)",
              }}
              data-cms="t:visit-cta-body"
              dangerouslySetInnerHTML={{
                __html: tx(
                  t,
                  "visit-cta-body",
                  "Fill out the form and a member of our greeting team will be ready to meet you at the door, show you around, help you check in your kids, and find you a seat. We even have a gift for you — just to say thank you for checking out our church."
                ),
              }}
            />
            <div className="flex flex-wrap gap-5 justify-center">
              <a
                href={t["visit-cta-primary-href"] || CCB_FORM}
                target="_blank"
                rel="noopener noreferrer"
                data-cms-link="visit-cta-primary"
                className="btn btn-primary btn-lg"
              >
                <span data-cms-link-label>
                  {tx(t, "visit-cta-primary-label", "Let Us Know You're Coming")}
                </span>
              </a>
              <Link
                href={t["visit-cta-secondary-href"] || "/messages/"}
                data-cms-link="visit-cta-secondary"
                className="btn btn-outline-navy btn-lg"
              >
                <span data-cms-link-label>
                  {tx(t, "visit-cta-secondary-label", "Watch Online First")}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
