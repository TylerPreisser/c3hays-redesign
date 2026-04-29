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
      <section className="relative min-h-72 md:min-h-96 flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/building.webp"
            alt="C3 Colby campus"
            fill
            className="object-cover"
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(10,31,46,0.92) 0%, rgba(10,31,46,0.5) 60%, rgba(10,31,46,0.2) 100%)",
            }}
          />
        </div>
        <div className="relative z-10 container-c3 pb-14 pt-28">
          <Link
            href="/locations/"
            className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white mb-5 transition-colors"
          >
            ← Campuses
          </Link>
          <p className="overline text-[#d4a056] mb-3">Campus</p>
          <h1 className="display-1 text-white">Colby</h1>
        </div>
      </section>

      {/* Details */}
      <section className="section bg-[#fdfcfb]">
        <div className="container-c3">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main */}
            <div className="lg:col-span-2">
              <h2 className="heading-1 text-[#0e1b26] mb-4">
                Northwest Kansas, welcome home.
              </h2>
              <p className="body-lg text-[#3d5566] mb-5">
                The Colby campus brings the same heart, the same vision, and
                the same Jesus-centered community that defines C3 — to
                northwest Kansas. One service on Sunday morning, with
                everything you&apos;d expect from a full C3 experience.
              </p>
              <p className="body-base text-[#3d5566] mb-8">
                Kids programming runs during Sunday service. We&apos;d love to see you.
              </p>
              <Link href="/visit/" className="btn btn-primary btn-lg">
                Plan Your Visit
              </Link>
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-5">
              <div className="card p-6">
                <h3 className="font-medium text-[#0e1b26] mb-4">
                  Service Times
                </h3>
                <div className="flex items-start gap-2.5">
                  <Clock size={14} className="text-[#10405d] mt-0.5 shrink-0" />
                  <div className="text-sm text-[#3d5566]">
                    <p className="font-medium text-[#0e1b26]">Sunday</p>
                    <p>10:00 AM</p>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <h3 className="font-medium text-[#0e1b26] mb-4">
                  Location
                </h3>
                <div className="flex items-start gap-2.5 mb-4">
                  <MapPin size={14} className="text-[#10405d] mt-0.5 shrink-0" />
                  <address className="not-italic text-sm text-[#3d5566]">
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
      <section className="bg-[#f7f4ef] py-0">
        <div className="container-c3 py-6">
          <div
            className="rounded-2xl overflow-hidden h-72 bg-[#bdd9ea]/30 flex items-center justify-center"
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
