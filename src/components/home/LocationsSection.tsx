"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { locations } from "@/data/locations";
import { assetPath } from "@/lib/asset-path";

gsap.registerPlugin(ScrollTrigger);

export default function LocationsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Section header */
      gsap.fromTo(
        ".locations-heading",
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
          },
        }
      );

      /* Campus cards stagger */
      gsap.fromTo(
        ".campus-card",
        { opacity: 0, y: 48 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".campus-grid",
            start: "top 75%",
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    /* Mist off-white section */
    <section ref={sectionRef} className="section" style={{ backgroundColor: "#f6f6f6" }}>
      <div className="container-c3">
        {/* Header */}
        <div className="locations-heading" style={{ marginBottom: "5rem" }}>
          <h2 className="display-2" style={{ color: "#1b1c1c" }}>
            Find a location near you.
          </h2>
        </div>

        {/* Campus grid — 2-up full bleed image cards */}
        <div className="campus-grid grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12">
          {locations.map((loc) => (
            <div
              key={loc.id}
              className="campus-card group relative overflow-hidden"
              style={{ height: 560, borderRadius: 0 }}
            >
              {/* Full-bleed background image */}
              <Image
                src={assetPath(loc.image)}
                alt={`C3 ${loc.name} campus`}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />

              {/* Dark overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.45) 50%, rgba(10,10,10,0.15) 100%)",
                }}
              />

              {/* Content — positioned at bottom, name + CTAs only */}
              <div
                className="absolute inset-0 flex flex-col justify-end"
                style={{ padding: "3.5rem 3rem" }}
              >
                <h3 className="heading-1 text-white" style={{ marginBottom: "2.5rem" }}>{loc.name}</h3>
                <div className="flex flex-wrap gap-4">
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
                    className="btn btn-outline btn-sm"
                  >
                    Get Directions
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
