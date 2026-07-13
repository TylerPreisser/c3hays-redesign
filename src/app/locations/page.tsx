import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Navigation } from "lucide-react";
import { locations } from "@/data/locations";
import { assetPath } from "@/lib/asset-path";
import { getCMSPage } from "@/lib/cms";
import { tx, imgCss } from "@/lib/home-content";

export const metadata: Metadata = {
  title: "Locations",
  description:
    "Find a Celebration Community Church campus near you — Hays and Colby, Kansas.",
};

export default async function LocationsPage() {
  const ov = (await getCMSPage("/locations")) || {};
  const t = ov.text || {};
  const media = ov.media || {};

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative flex items-end overflow-hidden" style={{ minHeight: "62vh" }}>
        {/* Background image */}
        <div
          className="absolute inset-0"
          data-cms-img="locations-hero-bg"
          style={{ borderRadius: 0 }}
        >
          <Image
            src={assetPath(media["locations-hero-bg"] || "/images/exterior.webp")}
            alt="C3 campus exterior"
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={imgCss(ov.img?.["locations-hero-bg"])}
          />
        </div>

        {/* Gradient scrims */}
        <div
          className="absolute inset-0"
          style={{ background: "rgba(10,10,10,0.48)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.25) 55%, transparent 100%)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 container-c3 pb-16 pt-40">
          {/* Eyebrow */}
          <p
            className="overline"
            data-cms="t:locations-hero-eyebrow"
            style={{ color: "var(--color-teal)", marginBottom: "1rem" }}
            dangerouslySetInnerHTML={{
              __html: tx(t, "locations-hero-eyebrow", "Our Campuses"),
            }}
          />

          {/* Headline */}
          <h1
            className="display-1 text-white"
            data-cms="t:locations-hero-heading"
            style={{ maxWidth: 720 }}
            dangerouslySetInnerHTML={{
              __html: tx(t, "locations-hero-heading", "Two campuses. One church family."),
            }}
          />

          {/* Subheading */}
          <p
            className="body-lg mt-5"
            data-cms="t:locations-hero-sub"
            style={{ color: "rgba(255,255,255,0.68)", maxWidth: 500 }}
            dangerouslySetInnerHTML={{
              __html: tx(
                t,
                "locations-hero-sub",
                "You&rsquo;re welcome at both. Come just as you are this weekend."
              ),
            }}
          />
        </div>
      </section>

      {/* ── Campus cards ── */}
      <section className="section" style={{ backgroundColor: "#ffffff" }}>
        <div className="container-c3">
          {/* Section header */}
          <div style={{ marginBottom: "clamp(2.5rem, 5vw, 4rem)", maxWidth: 660 }}>
            <h2
              className="display-2"
              data-cms="t:locations-section-heading"
              style={{ color: "var(--color-ink)" }}
              dangerouslySetInnerHTML={{
                __html: tx(t, "locations-section-heading", "Find your campus."),
              }}
            />
            <p
              className="body-lg"
              data-cms="t:locations-section-intro"
              style={{ color: "rgba(27,28,28,0.6)", marginTop: "1.25rem" }}
              dangerouslySetInnerHTML={{
                __html: tx(
                  t,
                  "locations-section-intro",
                  "We have two locations across northwest Kansas — each with the same heart, the same mission, and a warm welcome waiting for you."
                ),
              }}
            />
          </div>

          {/* 2-up campus cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {locations.map((loc) => (
              <div
                key={loc.id}
                className="group relative overflow-hidden"
                style={{ height: 500, borderRadius: "var(--radius-md)" }}
              >
                {/* Campus image — CMS-editable */}
                <div
                  className="absolute inset-0"
                  data-cms-img={`locations-campus-${loc.id}-img`}
                  style={{ borderRadius: "var(--radius-md)" }}
                >
                  <Image
                    src={assetPath(media[`locations-campus-${loc.id}-img`] || loc.image)}
                    alt={`C3 ${loc.name} campus`}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    style={imgCss(ov.img?.[`locations-campus-${loc.id}-img`])}
                  />
                </div>

                {/* Gradient scrim */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.55) 45%, rgba(10,10,10,0.12) 80%, transparent 100%)",
                  }}
                />

                {/* Card content */}
                <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">
                  {/* Campus name */}
                  <h2
                    className="heading-1 text-white"
                    data-cms={`t:locations-campus-${loc.id}-name`}
                    style={{ marginBottom: "0.375rem" }}
                    dangerouslySetInnerHTML={{
                      __html: tx(t, `locations-campus-${loc.id}-name`, loc.name),
                    }}
                  />

                  {/* Address */}
                  <p
                    className="body-sm"
                    data-cms={`t:locations-campus-${loc.id}-address`}
                    style={{ color: "rgba(255,255,255,0.65)", marginBottom: "0.625rem" }}
                    dangerouslySetInnerHTML={{
                      __html: tx(
                        t,
                        `locations-campus-${loc.id}-address`,
                        `${loc.street}, ${loc.city}, ${loc.state} ${loc.zip}`
                      ),
                    }}
                  />

                  {/* Service times */}
                  <div
                    className="body-sm"
                    data-cms={`t:locations-campus-${loc.id}-times`}
                    style={{ color: "rgba(255,255,255,0.52)", marginBottom: "1.75rem" }}
                    dangerouslySetInnerHTML={{
                      __html: tx(
                        t,
                        `locations-campus-${loc.id}-times`,
                        loc.services
                          .map((s) => `${s.day}: ${s.times.join(" &middot; ")}`)
                          .join("<br/>")
                      ),
                    }}
                  />

                  {/* Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={t[`locations-campus-${loc.id}-details-href`] || `/locations/${loc.slug}/`}
                      data-cms-link={`locations-campus-${loc.id}-details`}
                      className="btn btn-primary btn-sm"
                    >
                      <span data-cms-link-label>
                        {tx(t, `locations-campus-${loc.id}-details-label`, "Campus Details")}
                      </span>
                    </Link>
                    <a
                      href={t[`locations-campus-${loc.id}-dir-href`] || loc.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cms-link={`locations-campus-${loc.id}-dir`}
                      className="btn btn-outline btn-sm inline-flex items-center gap-2"
                    >
                      <Navigation size={13} aria-hidden="true" />
                      <span data-cms-link-label>
                        {tx(t, `locations-campus-${loc.id}-dir-label`, "Directions")}
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Join Us strip (dark ink) ── */}
      <section className="section" style={{ backgroundColor: "var(--color-ink)" }}>
        <div
          className="container-c3"
          style={{ maxWidth: 720, textAlign: "center", marginInline: "auto" }}
        >
          <p
            className="overline"
            data-cms="t:locations-join-eyebrow"
            style={{ color: "var(--color-teal)", marginBottom: "1.25rem" }}
            dangerouslySetInnerHTML={{
              __html: tx(t, "locations-join-eyebrow", "This Weekend"),
            }}
          />
          <h2
            className="display-2 text-white"
            data-cms="t:locations-join-heading"
            style={{ marginBottom: "clamp(1.25rem, 3vw, 2rem)" }}
            dangerouslySetInnerHTML={{
              __html: tx(t, "locations-join-heading", "We&rsquo;d love to see you."),
            }}
          />
          <p
            className="body-lg"
            data-cms="t:locations-join-body"
            style={{ color: "rgba(255,255,255,0.72)", marginBottom: "clamp(2rem, 4vw, 3rem)" }}
            dangerouslySetInnerHTML={{
              __html: tx(
                t,
                "locations-join-body",
                "No matter where you are in life, you&rsquo;re welcome here. Pick a campus, show up, and let us take care of the rest."
              ),
            }}
          />
          <Link
            href={t["locations-join-cta-href"] || "/visit/"}
            data-cms-link="locations-join-cta"
            className="btn btn-primary"
          >
            <span data-cms-link-label>
              {tx(t, "locations-join-cta-label", "Plan Your Visit")}
            </span>
          </Link>
        </div>
      </section>
    </>
  );
}
