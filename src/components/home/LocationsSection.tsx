"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { locations } from "@/data/locations";
import { assetPath } from "@/lib/asset-path";
import CampusChooser from "./CampusChooser";

gsap.registerPlugin(ScrollTrigger);

/* "Our Churches" — Church-on-the-Move's campus-chooser pattern, reskinned to C3:
   a stylized northwest-Kansas map with Hays + Colby markers beside a teal
   "find your campus" card, then two rounded campus cards. */
export default function LocationsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".locations-heading", { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true },
      });
      gsap.fromTo(".campus-card", { opacity: 0, y: 48 }, {
        opacity: 1, y: 0, stagger: 0.15, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: ".campus-grid", start: "top 80%", once: true },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section" style={{ backgroundColor: "#f6f6f6" }}>
      <div className="container-c3">
        {/* Header */}
        <div className="locations-heading" style={{ marginBottom: "3.5rem", maxWidth: 640 }}>
          <h2 className="display-2" style={{ color: "#1b1c1c" }}>Our churches.</h2>
          <p className="body-lg" style={{ color: "rgba(27,28,28,0.6)", marginTop: "1.25rem" }}>
            We&apos;re one church family in two places across northwest Kansas. Find the
            campus closest to you — and come just as you are this weekend.
          </p>
        </div>

        {/* Map + chooser card */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 mb-8 items-stretch">
          {/* Stylized NW-Kansas map */}
          <div
            className="lg:col-span-3 relative overflow-hidden"
            style={{ background: "#fff", borderRadius: "var(--radius-md)", minHeight: 300 }}
          >
            <svg viewBox="0 0 500 320" className="w-full h-full" role="img" aria-label="Map of C3 campuses across northwest Kansas">
              <rect width="500" height="320" fill="#fff" />
              {/* faint county/road grid */}
              <g stroke="rgba(27,28,28,0.10)" strokeWidth="2" fill="none">
                <path d="M-10 120 C 120 100, 260 140, 520 110" />
                <path d="M-10 220 C 140 200, 300 250, 520 215" />
                <path d="M120 -10 C 100 120, 150 220, 130 330" />
                <path d="M360 -10 C 380 110, 340 230, 370 330" />
              </g>
              {/* I-70 corridor — teal, connects the two campuses */}
              <path d="M70 175 C 170 150, 300 195, 410 168" stroke="var(--color-teal)" strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="2 10" opacity="0.7" />
              {/* state label */}
              <text x="250" y="40" textAnchor="middle" fill="rgba(27,28,28,0.30)" fontSize="13" fontWeight="700" letterSpacing="3">NORTHWEST KANSAS</text>
              {/* Colby marker (NW) */}
              <g>
                <circle cx="80" cy="172" r="9" fill="var(--color-teal)" />
                <circle cx="80" cy="172" r="15" fill="none" stroke="var(--color-teal)" strokeWidth="2" opacity="0.35" />
                <text x="80" y="150" textAnchor="middle" fill="#1b1c1c" fontSize="16" fontWeight="700">Colby</text>
              </g>
              {/* Hays marker (E on I-70) */}
              <g>
                <circle cx="408" cy="166" r="9" fill="var(--color-teal)" />
                <circle cx="408" cy="166" r="15" fill="none" stroke="var(--color-teal)" strokeWidth="2" opacity="0.35" />
                <text x="408" y="144" textAnchor="middle" fill="#1b1c1c" fontSize="16" fontWeight="700">Hays</text>
              </g>
              <text x="245" y="205" textAnchor="middle" fill="rgba(27,28,28,0.30)" fontSize="11" fontWeight="600" letterSpacing="2">I-70 · ~100 MILES</text>
            </svg>
          </div>

          {/* Teal chooser card */}
          <div
            className="lg:col-span-2 flex flex-col justify-center"
            style={{ background: "var(--color-ink)", borderRadius: "var(--radius-md)", padding: "2.5rem 2.25rem" }}
          >
            <h3 className="heading-2 text-white" style={{ marginBottom: "0.875rem" }}>
              Find your campus
            </h3>
            <p className="body-base" style={{ color: "rgba(255,255,255,0.6)", marginBottom: "1.75rem" }}>
              Two campuses, one mission. Pick the one closest to you and we&apos;ll see you Sunday.
            </p>
            <CampusChooser variant="teal" />
          </div>
        </div>

        {/* Two rounded campus cards */}
        <div className="campus-grid grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {locations.map((loc) => (
            <div
              key={loc.id}
              className="campus-card group relative overflow-hidden"
              style={{ height: 420, borderRadius: "var(--radius-md)" }}
            >
              <Image
                src={assetPath(loc.image)}
                alt={`C3 ${loc.name} campus`}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.4) 55%, rgba(10,10,10,0.12) 100%)" }}
              />
              <div className="absolute inset-0 flex flex-col justify-end" style={{ padding: "2.5rem" }}>
                <h3 className="heading-1 text-white" style={{ marginBottom: "0.4rem" }}>{loc.name}</h3>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.7)", marginBottom: "1.75rem" }}>
                  {loc.street}, {loc.city}, {loc.state} · {loc.services[0]?.day} {loc.services[0]?.times.join(", ")}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href={`/locations/${loc.slug}/`} className="btn btn-primary btn-sm">
                    Campus Info
                  </Link>
                  <a href={loc.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
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
