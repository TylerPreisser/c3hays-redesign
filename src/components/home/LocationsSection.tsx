"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MapPin, Clock, Navigation } from "lucide-react";
import { locations } from "@/data/locations";

gsap.registerPlugin(ScrollTrigger);

export default function LocationsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".location-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.2,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%",
            once: true,
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section bg-[#fdfcfb]">
      <div className="container-c3">
        {/* Header */}
        <div className="max-w-xl mb-14">
          <p className="overline text-[#10405d]/60 mb-3">Our Campuses</p>
          <h2 className="display-2 text-[#0e1b26]">
            Find a location
            <br />
            near you.
          </h2>
          <p className="body-lg text-[#3d5566] mt-4">
            Two campuses, one church family. Come as you are.
          </p>
        </div>

        {/* Location cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {locations.map((loc) => (
            <div key={loc.id} className="location-card card group overflow-hidden">
              {/* Image */}
              <div className="relative h-52 lg:h-64 overflow-hidden">
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
                    {loc.name} Campus
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-7">
                <h3 className="heading-2 text-[#0e1b26] mb-3">{loc.name}</h3>
                <p className="body-base text-[#3d5566] mb-5">{loc.description}</p>

                {/* Address */}
                <div className="flex items-start gap-2.5 mb-3">
                  <MapPin size={15} className="text-[#10405d] mt-0.5 shrink-0" />
                  <p className="text-sm text-[#3d5566]">
                    {loc.street}, {loc.city}, {loc.state} {loc.zip}
                  </p>
                </div>

                {/* Service times */}
                <div className="flex items-start gap-2.5 mb-7">
                  <Clock size={15} className="text-[#10405d] mt-0.5 shrink-0" />
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
                    Campus Info
                  </Link>
                  <a
                    href={loc.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-navy btn-sm inline-flex items-center gap-1.5"
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
  );
}
