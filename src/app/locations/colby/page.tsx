import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, Navigation } from "lucide-react";
import { assetPath } from "@/lib/asset-path";
import { getCMSPage } from "@/lib/cms";
import { tx, imgCss } from "@/lib/home-content";

export const metadata: Metadata = {
  title: "Colby Campus",
  description:
    "Celebration Community Church — Colby, Kansas. Sunday 10 AM at 1923 S Range.",
};

export default async function ColbyCampusPage() {
  const ov = (await getCMSPage("/locations/colby")) || {};
  const t = ov.text || {};
  const media = ov.media || {};

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section
        className="relative flex items-end overflow-hidden"
        style={{ minHeight: "62vh" }}
      >
        {/* Background image */}
        <div
          className="absolute inset-0"
          data-cms-img="colby-hero-bg"
          style={{ borderRadius: 0 }}
        >
          <Image
            src={assetPath(media["colby-hero-bg"] || "/images/building.webp")}
            alt="C3 Colby campus"
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={imgCss(ov.img?.["colby-hero-bg"])}
          />
        </div>

        {/* Dark scrim — bottom-weighted for headline legibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(10,10,10,0.90) 0%, rgba(10,10,10,0.45) 55%, rgba(10,10,10,0.25) 100%)",
          }}
        />

        {/* Hero content */}
        <div className="relative z-10 container-c3 pb-16 pt-44">
          <Link
            href="/locations/"
            className="back-link inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest mb-6"
          >
            ← Campuses
          </Link>

          {/* Eyebrow */}
          <p
            className="overline mb-3"
            style={{ color: "var(--color-teal)" }}
            data-cms="t:colby-hero-eyebrow"
            dangerouslySetInnerHTML={{
              __html: tx(t, "colby-hero-eyebrow", "Northwest Kansas"),
            }}
          />

          {/* Headline */}
          <h1
            className="display-1 text-white"
            data-cms="t:colby-hero-title"
            dangerouslySetInnerHTML={{
              __html: tx(t, "colby-hero-title", "Colby"),
            }}
          />

          {/* Sub-tagline */}
          <p
            className="body-lg mt-4"
            style={{
              color: "rgba(255,255,255,0.72)",
              maxWidth: "36rem",
            }}
            data-cms="t:colby-hero-tagline"
            dangerouslySetInnerHTML={{
              __html: tx(
                t,
                "colby-hero-tagline",
                "One service. Every Sunday. Welcome home."
              ),
            }}
          />
        </div>
      </section>

      {/* ── Details ──────────────────────────────────────────────── */}
      <section className="section" style={{ backgroundColor: "#ffffff" }}>
        <div className="container-c3">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">

            {/* Main content */}
            <div className="lg:col-span-2">
              {/* Section eyebrow */}
              <p
                className="overline mb-4"
                style={{ color: "var(--color-teal)" }}
                data-cms="t:colby-details-eyebrow"
                dangerouslySetInnerHTML={{
                  __html: tx(t, "colby-details-eyebrow", "About This Campus"),
                }}
              />

              <h2
                className="heading-1 mb-6"
                style={{ color: "#1b1c1c" }}
                data-cms="t:colby-details-title"
                dangerouslySetInnerHTML={{
                  __html: tx(
                    t,
                    "colby-details-title",
                    "Northwest Kansas, welcome home."
                  ),
                }}
              />

              <p
                className="body-lg mb-5"
                style={{ color: "rgba(27,28,28,0.65)" }}
                data-cms="t:colby-details-body-1"
                dangerouslySetInnerHTML={{
                  __html: tx(
                    t,
                    "colby-details-body-1",
                    "The Colby campus brings the same heart, the same vision, and the same Jesus-centered community that defines C3 — to northwest Kansas. One service on Sunday morning, with everything you&apos;d expect from a full C3 experience."
                  ),
                }}
              />

              <p
                className="body-base mb-10"
                style={{ color: "rgba(27,28,28,0.55)" }}
                data-cms="t:colby-details-body-2"
                dangerouslySetInnerHTML={{
                  __html: tx(
                    t,
                    "colby-details-body-2",
                    "Kids programming runs during Sunday service. We&apos;d love to see you."
                  ),
                }}
              />

              <Link
                href={t["colby-visit-btn-href"] || "/visit/"}
                data-cms-link="colby-visit-btn"
                className="btn btn-primary"
              >
                <span data-cms-link-label>
                  {tx(t, "colby-visit-btn-label", "Plan Your Visit")}
                </span>
              </Link>
            </div>

            {/* Sidebar info cards */}
            <div className="flex flex-col gap-4">
              {/* Service times card */}
              <div
                className="p-7"
                style={{
                  backgroundColor: "#f6f6f6",
                  borderRadius: "var(--radius-md)",
                }}
              >
                <h3
                  className="overline mb-5"
                  style={{ color: "#1b1c1c" }}
                  data-cms="t:colby-times-heading"
                  dangerouslySetInnerHTML={{
                    __html: tx(t, "colby-times-heading", "Service Times"),
                  }}
                />
                <div className="flex items-start gap-3">
                  <Clock
                    size={15}
                    style={{ color: "#1cc3af", marginTop: 3 }}
                    className="shrink-0"
                  />
                  <div className="text-sm" style={{ color: "rgba(27,28,28,0.70)" }}>
                    <p
                      className="font-semibold mb-0.5"
                      style={{ color: "#1b1c1c" }}
                      data-cms="t:colby-service-day"
                      dangerouslySetInnerHTML={{
                        __html: tx(t, "colby-service-day", "Sunday"),
                      }}
                    />
                    <p
                      data-cms="t:colby-service-time"
                      dangerouslySetInnerHTML={{
                        __html: tx(t, "colby-service-time", "10:00 AM"),
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Location card */}
              <div
                className="p-7"
                style={{
                  backgroundColor: "#f6f6f6",
                  borderRadius: "var(--radius-md)",
                }}
              >
                <h3
                  className="overline mb-5"
                  style={{ color: "#1b1c1c" }}
                  data-cms="t:colby-location-heading"
                  dangerouslySetInnerHTML={{
                    __html: tx(t, "colby-location-heading", "Location"),
                  }}
                />
                <div className="flex items-start gap-3 mb-5">
                  <MapPin
                    size={15}
                    style={{ color: "#1cc3af", marginTop: 3 }}
                    className="shrink-0"
                  />
                  <address
                    className="not-italic text-sm"
                    style={{ color: "rgba(27,28,28,0.65)" }}
                    data-cms="t:colby-address"
                    dangerouslySetInnerHTML={{
                      __html: tx(
                        t,
                        "colby-address",
                        "1923 S Range<br />Colby, KS 67701"
                      ),
                    }}
                  />
                </div>
                <a
                  href={
                    t["colby-directions-btn-href"] ||
                    "https://maps.google.com/?q=1923+S+Range,+Colby,+KS+67701"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cms-link="colby-directions-btn"
                  className="btn btn-outline-navy btn-sm inline-flex items-center gap-1.5 w-full justify-center"
                >
                  <Navigation size={13} />
                  <span data-cms-link-label>
                    {tx(t, "colby-directions-btn-label", "Get Directions")}
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Campus visual band ────────────────────────────────────── */}
      <section style={{ backgroundColor: "#1b1c1c" }}>
        <div className="container-c3 py-12 md:py-16">
          <div
            className="relative overflow-hidden"
            style={{ height: 400, borderRadius: "var(--radius-md)" }}
            data-cms-img="colby-congregation-img"
          >
            <Image
              src={assetPath(
                media["colby-congregation-img"] || "/images/congregation.webp"
              )}
              alt="C3 Colby congregation"
              fill
              className="object-cover"
              style={imgCss(ov.img?.["colby-congregation-img"])}
            />

            {/* Gradient scrim */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(10,10,10,0.93) 0%, rgba(10,10,10,0.50) 50%, rgba(10,10,10,0.18) 100%)",
              }}
            />

            {/* Overlaid content */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
              <p
                className="overline mb-3"
                style={{ color: "var(--color-teal)" }}
                data-cms="t:colby-band-eyebrow"
                dangerouslySetInnerHTML={{
                  __html: tx(t, "colby-band-eyebrow", "Campus Location"),
                }}
              />
              <p
                className="heading-2 text-white mb-2"
                data-cms="t:colby-band-address"
                dangerouslySetInnerHTML={{
                  __html: tx(
                    t,
                    "colby-band-address",
                    "1923 S Range, Colby, KS 67701"
                  ),
                }}
              />
              <a
                href={
                  t["colby-maps-btn-href"] ||
                  "https://maps.google.com/?q=1923+S+Range,+Colby,+KS+67701"
                }
                target="_blank"
                rel="noopener noreferrer"
                data-cms-link="colby-maps-btn"
                className="btn btn-primary btn-sm inline-flex items-center gap-2 mt-5 self-start"
              >
                <Navigation size={13} />
                <span data-cms-link-label>
                  {tx(t, "colby-maps-btn-label", "Open in Google Maps")}
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Visit CTA strip ───────────────────────────────────────── */}
      <section
        className="section"
        style={{ backgroundColor: "var(--color-mist)" }}
      >
        <div className="container-c3 text-center" style={{ maxWidth: 680, marginInline: "auto" }}>
          <p
            className="overline mb-4"
            style={{ color: "var(--color-teal)" }}
            data-cms="t:colby-cta-eyebrow"
            dangerouslySetInnerHTML={{
              __html: tx(t, "colby-cta-eyebrow", "Join Us This Sunday"),
            }}
          />
          <h2
            className="display-2 mb-6"
            style={{ color: "#1b1c1c" }}
            data-cms="t:colby-cta-title"
            dangerouslySetInnerHTML={{
              __html: tx(
                t,
                "colby-cta-title",
                "Come as you are."
              ),
            }}
          />
          <p
            className="body-lg mb-10"
            style={{ color: "rgba(27,28,28,0.60)" }}
            data-cms="t:colby-cta-body"
            dangerouslySetInnerHTML={{
              __html: tx(
                t,
                "colby-cta-body",
                "No perfect person required. Just show up Sunday at 10 AM and experience C3 Colby for yourself."
              ),
            }}
          />
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href={t["colby-cta-primary-href"] || "/visit/"}
              data-cms-link="colby-cta-primary"
              className="btn btn-primary btn-lg"
            >
              <span data-cms-link-label>
                {tx(t, "colby-cta-primary-label", "Plan Your Visit")}
              </span>
            </Link>
            <Link
              href={t["colby-cta-secondary-href"] || "/about/"}
              data-cms-link="colby-cta-secondary"
              className="btn btn-outline-navy btn-lg"
            >
              <span data-cms-link-label>
                {tx(t, "colby-cta-secondary-label", "Learn About C3")}
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
