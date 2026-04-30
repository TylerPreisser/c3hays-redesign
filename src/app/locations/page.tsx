import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Navigation } from "lucide-react";
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
      <section className="relative flex items-end overflow-hidden" style={{ minHeight: "50vh" }}>
        <div className="absolute inset-0">
          <Image
            src="/images/exterior.webp"
            alt="C3 Hays campus exterior"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0" style={{ background: "rgba(10,10,10,0.58)" }} />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.2) 60%, transparent 100%)",
            }}
          />
        </div>
        <div className="relative z-10 container-c3 pb-16 pt-40">
          <p className="overline mb-4" style={{ color: "rgba(255,255,255,0.55)" }}>Find Us</p>
          <h1 className="display-1 text-white">Our Campuses</h1>
          <p className="body-lg mt-4 max-w-lg" style={{ color: "rgba(255,255,255,0.65)" }}>
            Two campuses. One church family. You&apos;re welcome at both.
          </p>
        </div>
      </section>

      {/* Campus cards — 2-up full-bleed */}
      <section className="section" style={{ backgroundColor: "#f2efed" }}>
        <div className="container-c3">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {locations.map((loc) => (
              <div
                key={loc.id}
                className="group relative overflow-hidden"
                style={{ height: 480 }}
              >
                <Image
                  src={loc.image}
                  alt={`C3 ${loc.name} campus`}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.4) 55%, rgba(10,10,10,0.1) 100%)",
                  }}
                />
                <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">
                  <p className="overline mb-3" style={{ color: "rgba(255,255,255,0.5)" }}>
                    {loc.name} Campus
                  </p>
                  <h2 className="heading-1 text-white mb-2">{loc.name}</h2>
                  <p className="text-sm mb-2" style={{ color: "rgba(255,255,255,0.65)" }}>
                    {loc.street}, {loc.city}, {loc.state} {loc.zip}
                  </p>
                  <div className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.55)" }}>
                    {loc.services.map((s) => (
                      <p key={s.day}>
                        {s.day}: {s.times.join(" · ")}
                      </p>
                    ))}
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
                      className="btn btn-outline btn-sm inline-flex items-center gap-2"
                    >
                      <Navigation size={13} />
                      Directions
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
