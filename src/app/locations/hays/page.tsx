import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, Navigation, Phone, Mail } from "lucide-react";
import { site } from "@/data/site";
import { assetPath } from "@/lib/asset-path";
import { getCMSPage } from "@/lib/cms";
import { tx, imgCss } from "@/lib/home-content";

export const metadata: Metadata = {
  title: "Hays Campus",
  description:
    "Celebration Community Church — Hays, Kansas. Saturday 5 PM and Sunday 8, 9:30, and 11 AM at 5790 230th Ave.",
};

export default async function HaysCampusPage() {
  const ov = (await getCMSPage("/locations/hays")) || {};
  const t = ov.text || {};
  const media = ov.media || {};

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section
        className="relative flex flex-col justify-end overflow-hidden"
        style={{ minHeight: "clamp(480px, 62vh, 780px)" }}
      >
        {/* Background image */}
        <div
          className="absolute inset-0"
          data-cms-img="hays-hero-img"
          style={{ borderRadius: 0 }}
        >
          <Image
            src={assetPath(media["hays-hero-img"] || "/images/exterior.webp")}
            alt="C3 Hays campus exterior"
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={imgCss(ov.img?.["hays-hero-img"])}
          />
          {/* Flat dark overlay for consistent readability */}
          <div
            className="absolute inset-0"
            style={{ background: "rgba(10,10,10,0.52)" }}
          />
          {/* Stronger bottom-up gradient so headline + nav back-link read clearly */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(10,10,10,0.90) 0%, rgba(10,10,10,0.28) 55%, transparent 100%)",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 container-c3 pb-16 pt-44">
          <Link
            href="/locations/"
            className="inline-flex items-center gap-1.5 mb-5 text-white/70 hover:text-white transition-colors duration-150"
            style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em" }}
          >
            ← Campuses
          </Link>

          {/* Eyebrow */}
          <p
            data-cms="t:hays-hero-eyebrow"
            className="mb-3"
            style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--color-teal)" }}
            dangerouslySetInnerHTML={{ __html: tx(t, "hays-hero-eyebrow", "Hays, Kansas") }}
          />

          <h1
            className="display-1 text-white"
            data-cms="t:hays-hero-title"
            dangerouslySetInnerHTML={{ __html: tx(t, "hays-hero-title", "Our main campus.") }}
          />
        </div>
      </section>

      {/* ── Campus Details ────────────────────────────────────────────── */}
      <section className="section" style={{ backgroundColor: "#ffffff" }}>
        <div className="container-c3">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">

            {/* Main column */}
            <div className="lg:col-span-2">
              {/* Section eyebrow */}
              <p
                data-cms="t:hays-details-eyebrow"
                className="mb-4"
                style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--color-teal)" }}
                dangerouslySetInnerHTML={{ __html: tx(t, "hays-details-eyebrow", "Welcome home") }}
              />

              <h2
                className="heading-1 mb-6"
                data-cms="t:hays-details-title"
                style={{ color: "#1b1c1c" }}
                dangerouslySetInnerHTML={{ __html: tx(t, "hays-details-title", "Where C3 began.") }}
              />

              <p
                className="body-lg mb-5"
                data-cms="t:hays-details-body-1"
                style={{ color: "rgba(27,28,28,0.65)" }}
                dangerouslySetInnerHTML={{
                  __html: tx(
                    t,
                    "hays-details-body-1",
                    "Our Hays campus is home base — where C3 began and where we continue to grow. Four weekend services give you options that fit your schedule. Whether you&apos;re a first-time guest or a decades-long family, you belong here."
                  ),
                }}
              />

              <p
                className="body-base mb-10"
                data-cms="t:hays-details-body-2"
                style={{ color: "rgba(27,28,28,0.55)" }}
                dangerouslySetInnerHTML={{
                  __html: tx(
                    t,
                    "hays-details-body-2",
                    "Kids programming runs during all services for infants through 5th grade. Student ministry meets on Friday evenings. Come check us out — we&apos;re glad you&apos;re here."
                  ),
                }}
              />

              <Link
                href={t["hays-visit-href"] || "/visit/"}
                data-cms-link="hays-visit"
                className="btn btn-primary"
              >
                <span data-cms-link-label>{tx(t, "hays-visit-label", "Plan Your Visit")}</span>
              </Link>
            </div>

            {/* Info sidebar */}
            <div className="flex flex-col gap-5">

              {/* Service times card */}
              <div
                className="p-7"
                style={{
                  backgroundColor: "#f6f6f6",
                  borderRadius: "var(--radius-md)",
                }}
              >
                <h3
                  className="mb-5"
                  data-cms="t:hays-sidebar-times-heading"
                  style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", color: "#1b1c1c" }}
                  dangerouslySetInnerHTML={{ __html: tx(t, "hays-sidebar-times-heading", "Service Times") }}
                />
                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-3">
                    <Clock size={14} style={{ color: "#1cc3af", marginTop: 3 }} className="shrink-0" />
                    <div className="text-sm" style={{ color: "rgba(27,28,28,0.70)" }}>
                      <p
                        className="font-semibold mb-0.5"
                        data-cms="t:hays-times-sat-label"
                        style={{ color: "#1b1c1c" }}
                        dangerouslySetInnerHTML={{ __html: tx(t, "hays-times-sat-label", "Saturday") }}
                      />
                      <p
                        data-cms="t:hays-times-sat-time"
                        dangerouslySetInnerHTML={{ __html: tx(t, "hays-times-sat-time", "5:00 PM") }}
                      />
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock size={14} style={{ color: "#1cc3af", marginTop: 3 }} className="shrink-0" />
                    <div className="text-sm" style={{ color: "rgba(27,28,28,0.70)" }}>
                      <p
                        className="font-semibold mb-0.5"
                        data-cms="t:hays-times-sun-label"
                        style={{ color: "#1b1c1c" }}
                        dangerouslySetInnerHTML={{ __html: tx(t, "hays-times-sun-label", "Sunday") }}
                      />
                      <p
                        data-cms="t:hays-times-sun-times"
                        dangerouslySetInnerHTML={{ __html: tx(t, "hays-times-sun-times", "8:00 AM · 9:30 AM · 11:00 AM") }}
                      />
                    </div>
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
                  className="mb-5"
                  data-cms="t:hays-sidebar-location-heading"
                  style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", color: "#1b1c1c" }}
                  dangerouslySetInnerHTML={{ __html: tx(t, "hays-sidebar-location-heading", "Location") }}
                />
                <div className="flex items-start gap-3 mb-5">
                  <MapPin size={14} style={{ color: "#1cc3af", marginTop: 3 }} className="shrink-0" />
                  <address
                    className="not-italic text-sm"
                    style={{ color: "rgba(27,28,28,0.65)" }}
                  >
                    <span
                      data-cms="t:hays-address-street"
                      dangerouslySetInnerHTML={{ __html: tx(t, "hays-address-street", site.address.street) }}
                    />
                    <br />
                    <span
                      data-cms="t:hays-address-citystatezip"
                      dangerouslySetInnerHTML={{
                        __html: tx(
                          t,
                          "hays-address-citystatezip",
                          `${site.address.city}, ${site.address.state} ${site.address.zip}`
                        ),
                      }}
                    />
                  </address>
                </div>
                <a
                  href={t["hays-directions-href"] || "https://maps.google.com/?q=5790+230th+Ave,+Hays,+KS+67601"}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cms-link="hays-directions"
                  className="btn btn-outline-ink btn-sm inline-flex items-center gap-1.5 w-full justify-center"
                >
                  <Navigation size={13} />
                  <span data-cms-link-label>{tx(t, "hays-directions-label", "Get Directions")}</span>
                </a>
              </div>

              {/* Contact card */}
              <div
                className="p-7"
                style={{
                  backgroundColor: "#f6f6f6",
                  borderRadius: "var(--radius-md)",
                }}
              >
                <h3
                  className="mb-5"
                  data-cms="t:hays-sidebar-contact-heading"
                  style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", color: "#1b1c1c" }}
                  dangerouslySetInnerHTML={{ __html: tx(t, "hays-sidebar-contact-heading", "Contact") }}
                />
                <div className="flex flex-col gap-3">
                  <a
                    href={`tel:${site.phone.replace(/\D/g, "")}`}
                    className="flex items-center gap-2.5 text-sm transition-colors duration-150 hover:text-[#1cc3af]"
                    style={{ color: "rgba(27,28,28,0.65)" }}
                  >
                    <Phone size={14} style={{ color: "#1cc3af" }} className="shrink-0" />
                    <span
                      data-cms="t:hays-contact-phone"
                      dangerouslySetInnerHTML={{ __html: tx(t, "hays-contact-phone", site.phone) }}
                    />
                  </a>
                  <a
                    href={`mailto:${site.email}`}
                    className="flex items-center gap-2.5 text-sm transition-colors duration-150 hover:text-[#1cc3af]"
                    style={{ color: "rgba(27,28,28,0.65)" }}
                  >
                    <Mail size={14} style={{ color: "#1cc3af" }} className="shrink-0" />
                    <span
                      data-cms="t:hays-contact-email"
                      dangerouslySetInnerHTML={{ __html: tx(t, "hays-contact-email", site.email) }}
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Campus Location Visual ────────────────────────────────────── */}
      <section
        className="section"
        style={{ backgroundColor: "#1b1c1c", paddingTop: "3.5rem", paddingBottom: "3.5rem" }}
      >
        <div className="container-c3">
          {/* Section headline */}
          <div className="mb-8">
            <p
              data-cms="t:hays-location-eyebrow"
              style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--color-teal)", marginBottom: "0.5rem" }}
              dangerouslySetInnerHTML={{ __html: tx(t, "hays-location-eyebrow", "Find Us") }}
            />
            <h2
              className="heading-2 text-white"
              data-cms="t:hays-location-title"
              dangerouslySetInnerHTML={{ __html: tx(t, "hays-location-title", "Come see us in Hays.") }}
            />
          </div>

          {/* Full-bleed campus image card */}
          <div
            className="relative overflow-hidden"
            data-cms-img="hays-building-img"
            style={{ height: "clamp(280px, 38vw, 480px)", borderRadius: "var(--radius-md)" }}
          >
            <Image
              src={assetPath(media["hays-building-img"] || "/images/building.webp")}
              alt="C3 Hays campus building"
              fill
              className="object-cover"
              style={imgCss(ov.img?.["hays-building-img"])}
            />
            {/* Scrim — bottom reads clearly, top fades to the photo */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(10,10,10,0.93) 0%, rgba(10,10,10,0.50) 45%, rgba(10,10,10,0.15) 100%)",
              }}
            />

            {/* Address + CTA overlaid at bottom-left */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">
              <p
                data-cms="t:hays-building-address"
                className="font-semibold text-white mb-1"
                style={{ fontSize: "1.05rem" }}
                dangerouslySetInnerHTML={{
                  __html: tx(
                    t,
                    "hays-building-address",
                    `${site.address.street}, ${site.address.city}, ${site.address.state} ${site.address.zip}`
                  ),
                }}
              />
              <a
                href={t["hays-maps-href"] || "https://maps.google.com/?q=5790+230th+Ave,+Hays,+KS+67601"}
                target="_blank"
                rel="noopener noreferrer"
                data-cms-link="hays-maps"
                className="btn btn-primary btn-sm inline-flex items-center gap-2 mt-4 self-start"
              >
                <Navigation size={13} />
                <span data-cms-link-label>{tx(t, "hays-maps-label", "Open in Google Maps")}</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
