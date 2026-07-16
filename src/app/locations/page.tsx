import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Navigation } from "lucide-react";
import { locations } from "@/data/locations";
import { assetPath } from "@/lib/asset-path";
import { getCMSPage } from "@/lib/cms";
import { tx, imgCss } from "@/lib/home-content";
import Section from "@/components/ui/Section";
import Stack from "@/components/ui/Stack";

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
          <Stack gap="heading">
            <Stack gap="eyebrow">
              {/* Eyebrow */}
              <p
                className="overline"
                data-cms="t:locations-hero-eyebrow"
                style={{ color: "var(--color-teal)" }}
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
            </Stack>

            {/* Subheading */}
            <p
              className="body-lg"
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
          </Stack>
        </div>
      </section>

      {/* ── Campus cards ── */}
      <Section tone="white" container>
        {/* Section header */}
        <Stack gap="heading" style={{ maxWidth: 660, marginBottom: "var(--space-block)" }}>
          <h2
            className="display-2"
            data-cms="t:locations-section-heading"
            dangerouslySetInnerHTML={{
              __html: tx(t, "locations-section-heading", "Find your campus."),
            }}
          />
          <p
            className="body-lg"
            data-cms="t:locations-section-intro"
            style={{ color: "var(--color-mute)" }}
            dangerouslySetInnerHTML={{
              __html: tx(
                t,
                "locations-section-intro",
                "We have two locations across northwest Kansas — each with the same heart, the same mission, and a warm welcome waiting for you."
              ),
            }}
          />
        </Stack>

        {/* 2-up campus cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {locations.map((loc) => (
            <div
              key={loc.id}
              className="group relative overflow-hidden"
              style={{ height: 520, borderRadius: "var(--radius-md)" }}
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
                <Stack gap="cta">
                  <Stack gap="eyebrow">
                    {/* Campus name */}
                    <h3
                      className="heading-1 text-white"
                      data-cms={`t:locations-campus-${loc.id}-name`}
                      dangerouslySetInnerHTML={{
                        __html: tx(t, `locations-campus-${loc.id}-name`, loc.name),
                      }}
                    />

                    {/* Address */}
                    <p
                      className="body-sm"
                      data-cms={`t:locations-campus-${loc.id}-address`}
                      style={{ color: "rgba(255,255,255,0.68)" }}
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
                      style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}
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
                  </Stack>

                  {/* Directions button (Directions-only — no campus-details filler) */}
                  <a
                    href={t[`locations-campus-${loc.id}-dir-href`] || loc.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cms-link={`locations-campus-${loc.id}-dir`}
                    className="btn btn-primary inline-flex items-center gap-2 self-start"
                  >
                    <Navigation size={15} aria-hidden="true" />
                    <span data-cms-link-label>
                      {tx(t, `locations-campus-${loc.id}-dir-label`, "Directions")}
                    </span>
                  </a>
                </Stack>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Join Us strip (dark ink) ── */}
      <Section tone="dark" container centered>
        <Stack gap="cta" align="center">
          <Stack gap="heading" align="center">
            <Stack gap="eyebrow" align="center">
              <p
                className="overline"
                data-cms="t:locations-join-eyebrow"
                style={{ color: "var(--color-teal)" }}
                dangerouslySetInnerHTML={{
                  __html: tx(t, "locations-join-eyebrow", "This Weekend"),
                }}
              />
              <h2
                className="display-2 text-white"
                data-cms="t:locations-join-heading"
                dangerouslySetInnerHTML={{
                  __html: tx(t, "locations-join-heading", "We&rsquo;d love to see you."),
                }}
              />
            </Stack>
            <p
              className="body-lg"
              data-cms="t:locations-join-body"
              style={{ color: "rgba(255,255,255,0.72)" }}
              dangerouslySetInnerHTML={{
                __html: tx(
                  t,
                  "locations-join-body",
                  "No matter where you are in life, you&rsquo;re welcome here. Pick a campus, show up, and let us take care of the rest."
                ),
              }}
            />
          </Stack>
          <Link
            href={t["locations-join-cta-href"] || "/visit/"}
            data-cms-link="locations-join-cta"
            className="btn btn-primary"
          >
            <span data-cms-link-label>
              {tx(t, "locations-join-cta-label", "Plan Your Visit")}
            </span>
          </Link>
        </Stack>
      </Section>
    </>
  );
}
