import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, Navigation, Phone, Mail } from "lucide-react";
import { site } from "@/data/site";
import { assetPath } from "@/lib/asset-path";

export const metadata: Metadata = {
  title: "Hays Campus",
  description:
    "Celebration Community Church — Hays, Kansas. Saturday 5 PM and Sunday 8, 9:30, and 11 AM at 5790 230th Ave.",
};

export default function HaysCampusPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex items-end overflow-hidden" style={{ minHeight: "56vh" }}>
        <div className="absolute inset-0">
          <Image
            src={assetPath("/images/exterior.webp")}
            alt="C3 Hays campus"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0" style={{ background: "rgba(10,10,10,0.58)" }} />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.2) 60%, transparent 100%)",
            }}
          />
        </div>
        <div className="relative z-10 container-c3 pb-16 pt-40">
          <Link
            href="/locations/"
            className="back-link inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest mb-6"
          >
            ← Campuses
          </Link>
          <h1 className="display-1 text-white">Hays</h1>
        </div>
      </section>

      {/* Details */}
      <section className="section" style={{ backgroundColor: "#ffffff", paddingBottom: "4.5rem" }}>
        <div className="container-c3">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main info */}
            <div className="lg:col-span-2">
              <h2 className="heading-1 mb-5" style={{ color: "#1b1c1c" }}>
                Our main campus
              </h2>
              <p className="body-lg mb-5" style={{ color: "rgba(27,28,28,0.65)" }}>
                Our Hays campus is home base — where C3 began and where
                we continue to grow. Four weekend services give you
                options that fit your schedule. Whether you&apos;re a first-time
                guest or a decades-long family, you belong here.
              </p>
              <p className="body-base mb-10" style={{ color: "rgba(27,28,28,0.55)" }}>
                Kids programming runs during all services for infants through
                5th grade. Student ministry meets on Friday evenings. Come
                check us out — we&apos;re glad you&apos;re here.
              </p>
              <Link href="/visit/" className="btn btn-primary">
                Plan Your Visit
              </Link>
            </div>

            {/* Info sidebar */}
            <div className="flex flex-col gap-4">
              {/* Service times */}
              <div className="p-7" style={{ backgroundColor: "#f6f6f6" }}>
                <h3 className="font-bold text-xs uppercase tracking-widest mb-5" style={{ color: "#1b1c1c" }}>
                  Service Times
                </h3>
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <Clock size={14} style={{ color: "#1cc3af", marginTop: 2 }} className="shrink-0" />
                    <div className="text-sm" style={{ color: "rgba(27,28,28,0.70)" }}>
                      <p className="font-semibold" style={{ color: "#1b1c1c" }}>Saturday</p>
                      <p>5:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock size={14} style={{ color: "#1cc3af", marginTop: 2 }} className="shrink-0" />
                    <div className="text-sm" style={{ color: "rgba(27,28,28,0.70)" }}>
                      <p className="font-semibold" style={{ color: "#1b1c1c" }}>Sunday</p>
                      <p>8:00 AM · 9:30 AM · 11:00 AM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="p-7" style={{ backgroundColor: "#f6f6f6" }}>
                <h3 className="font-bold text-xs uppercase tracking-widest mb-5" style={{ color: "#1b1c1c" }}>
                  Location
                </h3>
                <div className="flex items-start gap-3 mb-5">
                  <MapPin size={14} style={{ color: "#1cc3af", marginTop: 2 }} className="shrink-0" />
                  <address className="not-italic text-sm" style={{ color: "rgba(27,28,28,0.65)" }}>
                    {site.address.street}
                    <br />
                    {site.address.city}, {site.address.state}{" "}
                    {site.address.zip}
                  </address>
                </div>
                <a
                  href="https://maps.google.com/?q=5790+230th+Ave,+Hays,+KS+67601"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-navy btn-sm inline-flex items-center gap-1.5 w-full justify-center"
                >
                  <Navigation size={13} />
                  Get Directions
                </a>
              </div>

              {/* Contact */}
              <div className="p-7" style={{ backgroundColor: "#f6f6f6" }}>
                <h3 className="font-bold text-xs uppercase tracking-widest mb-5" style={{ color: "#1b1c1c" }}>
                  Contact
                </h3>
                <div className="flex flex-col gap-3">
                  <a
                    href={`tel:${site.phone.replace(/\D/g, "")}`}
                    className="flex items-center gap-2.5 text-sm transition-colors duration-150 hover:text-[#1cc3af]"
                    style={{ color: "rgba(27,28,28,0.65)" }}
                  >
                    <Phone size={14} style={{ color: "#1cc3af" }} />
                    {site.phone}
                  </a>
                  <a
                    href={`mailto:${site.email}`}
                    className="flex items-center gap-2.5 text-sm transition-colors duration-150 hover:text-[#1cc3af]"
                    style={{ color: "rgba(27,28,28,0.65)" }}
                  >
                    <Mail size={14} style={{ color: "#1cc3af" }} />
                    {site.email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Campus location visual */}
      <section style={{ backgroundColor: "#1b1c1c" }}>
        <div className="container-c3 py-8">
          <div
            className="relative overflow-hidden"
            style={{ height: 320 }}
          >
            <Image
              src={assetPath("/images/building.webp")}
              alt="C3 Hays campus building"
              fill
              className="object-cover"
            />
            {/* Dark gradient scrim for text legibility */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.55) 50%, rgba(10,10,10,0.20) 100%)",
              }}
            />
            {/* Address + CTA overlaid at bottom */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">
              <p
                className="text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: "#1cc3af" }}
              >
                Campus Location
              </p>
              <p
                className="font-semibold text-white mb-1"
                style={{ fontSize: "1.05rem" }}
              >
                5790 230th Ave, Hays, KS 67601
              </p>
              <a
                href="https://maps.google.com/?q=5790+230th+Ave,+Hays,+KS+67601"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm inline-flex items-center gap-2 mt-4 self-start"
              >
                <Navigation size={13} />
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
