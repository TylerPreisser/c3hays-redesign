import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, Navigation } from "lucide-react";
import { locations } from "@/data/locations";

export const metadata: Metadata = {
  title: "Locations",
  description:
    "Find a Celebration Community Church campus near you — Hays and Colby, Kansas.",
};

export default function LocationsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-64 md:min-h-80 flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/exterior.webp"
            alt="C3 Hays campus exterior"
            fill
            className="object-cover"
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(10,31,46,0.92) 0%, rgba(10,31,46,0.55) 60%, rgba(10,31,46,0.2) 100%)",
            }}
          />
        </div>
        <div className="relative z-10 container-c3 pb-14 pt-28">
          <p className="overline text-[#d4a056] mb-3">Find Us</p>
          <h1 className="display-1 text-white">Our Campuses</h1>
          <p className="body-lg text-white/65 mt-4 max-w-lg">
            Two campuses. One church family. You&apos;re welcome at both.
          </p>
        </div>
      </section>

      {/* Campus cards */}
      <section className="section bg-[#fdfcfb]">
        <div className="container-c3">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {locations.map((loc) => (
              <div key={loc.id} className="card group overflow-hidden">
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={loc.image}
                    alt={`C3 ${loc.name} campus`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a1f2e]/70 to-transparent" />
                  <div className="absolute bottom-4 left-5">
                    <span
                      className="px-3 py-1 text-xs font-medium text-white bg-[#10405d]/80 backdrop-blur-sm"
                      style={{ borderRadius: "9999px" }}
                    >
                      {loc.name}
                    </span>
                  </div>
                </div>
                <div className="p-7">
                  <h2 className="heading-2 text-[#0e1b26] mb-2">
                    {loc.name} Campus
                  </h2>
                  <p className="body-base text-[#3d5566] mb-6">
                    {loc.description}
                  </p>
                  <div className="flex items-start gap-2.5 mb-3">
                    <MapPin
                      size={15}
                      className="text-[#10405d] mt-0.5 shrink-0"
                    />
                    <address className="not-italic text-sm text-[#3d5566]">
                      {loc.street}
                      <br />
                      {loc.city}, {loc.state} {loc.zip}
                    </address>
                  </div>
                  <div className="flex items-start gap-2.5 mb-7">
                    <Clock
                      size={15}
                      className="text-[#10405d] mt-0.5 shrink-0"
                    />
                    <div className="text-sm text-[#3d5566]">
                      {loc.services.map((s) => (
                        <p key={s.day}>
                          {s.day}: {s.times.join(" · ")}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/locations/${loc.slug}/`}
                      className="btn btn-primary btn-sm"
                    >
                      Campus Details
                    </Link>
                    <a
                      href={loc.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-navy btn-sm inline-flex items-center gap-1.5"
                    >
                      <Navigation size={13} />
                      Get Directions
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
