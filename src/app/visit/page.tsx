import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, Smile, Users, Baby, Shirt } from "lucide-react";
import { locations } from "@/data/locations";
import { assetPath } from "@/lib/asset-path";
import { getCMSPage } from "@/lib/cms";
import { tx, imgCss } from "@/lib/home-content";

export const metadata: Metadata = {
  title: "Plan Your Visit",
  description:
    "Everything you need to know before your first visit to Celebration Community Church in Hays or Colby, Kansas.",
};

const whatToExpect = [
  {
    id: "clock",
    icon: Clock,
    title: "How long is a service?",
    body: "Services are typically 60–70 minutes — worship, a practical message from Scripture, and communion on the first Sunday of the month.",
  },
  {
    id: "shirt",
    icon: Shirt,
    title: "What should I wear?",
    body: "Come as you are — seriously. You'll see jeans, boots, and dress clothes all in the same row. There is no dress code at C3.",
  },
  {
    id: "baby",
    icon: Baby,
    title: "What about my kids?",
    body: "We have programming for every age, birth through 5th grade, during all services. Student ministry meets on Friday evenings.",
  },
  {
    id: "smile",
    icon: Smile,
    title: "What if I'm not a Christian?",
    body: "Perfect — come anyway. We're a church full of imperfect people on a journey. You won't be called out, embarrassed, or pressured.",
  },
  {
    id: "users",
    icon: Users,
    title: "Can I bring a friend?",
    body: "Please do. There's always room for one more. C3 is at its best when it's full of people experiencing Jesus for the first time.",
  },
  {
    id: "mappin",
    icon: MapPin,
    title: "Where do I park?",
    body: "Ample free parking at both campuses. Look for first-time guest parking spots near the main entrance — they're saved for you.",
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
        <div
          className="absolute inset-0"
          data-cms-img="visit-hero-bg"
        >
          <Image
            src={assetPath(media["visit-hero-bg"] || "/images/hero-2.webp")}
            alt="Family arriving at C3"
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={imgCss(ov.img?.["visit-hero-bg"])}
          />
          {/* Base dark scrim */}
          <div
            className="absolute inset-0"
            style={{ background: "rgba(10,10,10,0.45)" }}
          />
          {/* Bottom-up gradient to ground the headline */}
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
              __html: tx(t, "visit-hero-heading", "Plan your first visit."),
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

      {/* ── What to Expect ──────────────────────────────────────── */}
      <section className="section" style={{ backgroundColor: "#ffffff" }}>
        <div className="container-c3">
          {/* Section header */}
          <div className="max-w-xl mb-16">
            <p
              className="overline mb-4"
              style={{ color: "#1cc3af" }}
              data-cms="t:visit-expect-eyebrow"
              dangerouslySetInnerHTML={{
                __html: tx(t, "visit-expect-eyebrow", "What to expect"),
              }}
            />
            <h2
              className="display-2 text-balance"
              style={{ color: "#1b1c1c" }}
              data-cms="t:visit-expect-heading"
              dangerouslySetInnerHTML={{
                __html: tx(
                  t,
                  "visit-expect-heading",
                  "No surprises. Just welcome."
                ),
              }}
            />
          </div>

          {/* FAQ grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-8">
            {whatToExpect.map((item) => {
              const Icon = item.icon;
              const titleId = `visit-faq-${item.id}-title` as const;
              const bodyId = `visit-faq-${item.id}-body` as const;
              return (
                <div key={item.id}>
                  {/* Icon tile */}
                  <div
                    className="grid place-items-center mb-6"
                    data-cms-icon={`visit-faq-${item.id}-icon`}
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 14,
                      background: "rgba(28,195,175,0.12)",
                    }}
                  >
                    <Icon
                      size={24}
                      style={{ color: "#179c8c" }}
                      strokeWidth={1.75}
                    />
                  </div>

                  <h3
                    className="heading-3 mb-3"
                    style={{ color: "#1b1c1c" }}
                    data-cms={`t:${titleId}`}
                    dangerouslySetInnerHTML={{
                      __html: tx(t, titleId, item.title),
                    }}
                  />
                  <p
                    className="body-sm leading-relaxed"
                    style={{ color: "rgba(27,28,28,0.65)" }}
                    data-cms={`t:${bodyId}`}
                    dangerouslySetInnerHTML={{
                      __html: tx(t, bodyId, item.body),
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Service Times — dark split ───────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: "#1b1c1c" }}
      >
        <div className="flex flex-col lg:flex-row lg:min-h-[640px]">

          {/* Left: heading + campus cards */}
          <div className="flex-1 min-w-0 section lg:py-20 xl:py-24">
            <div className="container-c3 lg:pr-0 xl:pr-0">
              <div className="mb-12">
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
                    __html: tx(
                      t,
                      "visit-times-heading",
                      "When do services meet?"
                    ),
                  }}
                />
              </div>

              {/* Campus cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {locations.map((loc) => (
                  <div
                    key={loc.id}
                    className="p-8"
                    style={{
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: "var(--radius-md)",
                    }}
                  >
                    <h3
                      className="font-bold text-sm uppercase tracking-widest mb-5"
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
                    <div className="flex items-start gap-3 mb-4">
                      <MapPin
                        size={14}
                        style={{ color: "rgba(255,255,255,0.4)", marginTop: 2 }}
                        className="shrink-0"
                      />
                      <address
                        className="not-italic text-sm"
                        style={{ color: "rgba(255,255,255,0.55)" }}
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
                    <div className="flex flex-col gap-2 mb-6">
                      {loc.services.map((s) => (
                        <div key={s.day} className="flex items-center gap-2.5">
                          <Clock
                            size={13}
                            style={{ color: "rgba(255,255,255,0.35)" }}
                          />
                          <span
                            className="text-sm"
                            style={{ color: "rgba(255,255,255,0.65)" }}
                          >
                            <strong className="text-white font-semibold">
                              {s.day}:
                            </strong>{" "}
                            {s.times.join(" · ")}
                          </span>
                        </div>
                      ))}
                    </div>
                    <a
                      href={loc.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-sm inline-flex items-center gap-1.5"
                    >
                      <MapPin size={13} />
                      Directions
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: worship photo — desktop only */}
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
            {/* Left-edge fade into dark section */}
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

      {/* ── Connect CTA ─────────────────────────────────────────── */}
      <section className="section" style={{ backgroundColor: "#ffffff" }}>
        <div className="container-c3">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p
                className="overline mb-5"
                style={{ color: "#1cc3af" }}
                data-cms="t:visit-cta-eyebrow"
                dangerouslySetInnerHTML={{
                  __html: tx(t, "visit-cta-eyebrow", "Ready to visit?"),
                }}
              />
              <h2
                className="display-2 mb-5 text-balance"
                style={{ color: "#1b1c1c" }}
                data-cms="t:visit-cta-heading"
                dangerouslySetInnerHTML={{
                  __html: tx(
                    t,
                    "visit-cta-heading",
                    "We&apos;re saving you a seat."
                  ),
                }}
              />
              <p
                className="body-lg mb-10"
                style={{ color: "rgba(27,28,28,0.65)" }}
                data-cms="t:visit-cta-body"
                dangerouslySetInnerHTML={{
                  __html: tx(
                    t,
                    "visit-cta-body",
                    "Fill out a quick connect card and we&apos;ll send you everything you need to know before Sunday. No spam, ever."
                  ),
                }}
              />
              <div className="flex flex-wrap gap-4">
                <Link
                  href={t["visit-cta-primary-href"] || "/connect/"}
                  data-cms-link="visit-cta-primary"
                  className="btn btn-primary btn-lg"
                >
                  <span data-cms-link-label>
                    {tx(t, "visit-cta-primary-label", "Fill Out a Connect Card")}
                  </span>
                </Link>
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

            <div
              className="relative overflow-hidden"
              style={{ height: 400, borderRadius: "var(--radius-md)" }}
              data-cms-img="visit-cta-photo"
            >
              <Image
                src={assetPath(
                  media["visit-cta-photo"] || "/images/congregation.webp"
                )}
                alt="Warm welcome at C3"
                fill
                className="object-cover"
                style={imgCss(ov.img?.["visit-cta-photo"])}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
