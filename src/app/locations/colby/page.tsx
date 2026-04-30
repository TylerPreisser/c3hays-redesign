import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, Navigation } from "lucide-react";

export const metadata: Metadata = {
  title: "Colby Campus",
  description:
    "Celebration Community Church — Colby, Kansas. Sunday 10 AM at 1923 S Range.",
};

export default function ColbyCampusPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex items-end overflow-hidden" style={{ minHeight: "56vh" }}>
        <div className="absolute inset-0">
          <Image
            src="/images/building.webp"
            alt="C3 Colby campus"
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
          <p className="overline mb-4" style={{ color: "rgba(255,255,255,0.55)" }}>Campus</p>
          <h1 className="display-1 text-white">Colby</h1>
        </div>
      </section>

      {/* Details */}
      <section className="section" style={{ backgroundColor: "#f2efed" }}>
        <div className="container-c3">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main */}
            <div className="lg:col-span-2">
              <h2 className="heading-1 mb-5" style={{ color: "#232e2c" }}>
                Northwest Kansas, welcome home.
              </h2>
              <p className="body-lg mb-5" style={{ color: "rgba(35,46,44,0.65)" }}>
                The Colby campus brings the same heart, the same vision, and
                the same Jesus-centered community that defines C3 — to
                northwest Kansas. One service on Sunday morning, with
                everything you&apos;d expect from a full C3 experience.
              </p>
              <p className="body-base mb-10" style={{ color: "rgba(35,46,44,0.55)" }}>
                Kids programming runs during Sunday service. We&apos;d love to see you.
              </p>
              <Link href="/visit/" className="btn btn-primary btn-lg">
                Plan Your Visit
              </Link>
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-4">
              <div className="p-7" style={{ backgroundColor: "#fff" }}>
                <h3 className="font-bold text-xs uppercase tracking-widest mb-5" style={{ color: "#232e2c" }}>
                  Service Times
                </h3>
                <div className="flex items-start gap-3">
                  <Clock size={14} style={{ color: "#e53539", marginTop: 2 }} className="shrink-0" />
                  <div className="text-sm" style={{ color: "rgba(35,46,44,0.7)" }}>
                    <p className="font-semibold" style={{ color: "#232e2c" }}>Sunday</p>
                    <p>10:00 AM</p>
                  </div>
                </div>
              </div>

              <div className="p-7" style={{ backgroundColor: "#fff" }}>
                <h3 className="font-bold text-xs uppercase tracking-widest mb-5" style={{ color: "#232e2c" }}>
                  Location
                </h3>
                <div className="flex items-start gap-3 mb-5">
                  <MapPin size={14} style={{ color: "#e53539", marginTop: 2 }} className="shrink-0" />
                  <address className="not-italic text-sm" style={{ color: "rgba(35,46,44,0.65)" }}>
                    1923 S Range
                    <br />
                    Colby, KS 67701
                  </address>
                </div>
                <a
                  href="https://maps.google.com/?q=1923+S+Range,+Colby,+KS+67701"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-navy btn-sm inline-flex items-center gap-1.5 w-full justify-center"
                >
                  <Navigation size={13} />
                  Get Directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <section style={{ backgroundColor: "#232e2c" }}>
        <div className="container-c3 py-8">
          <div
            className="flex items-center justify-center"
            style={{ height: 280, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            aria-label="Campus map"
          >
            <a
              href="https://maps.google.com/?q=1923+S+Range,+Colby,+KS+67701"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-lg inline-flex items-center gap-2"
            >
              <Navigation size={16} />
              Open in Google Maps
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
