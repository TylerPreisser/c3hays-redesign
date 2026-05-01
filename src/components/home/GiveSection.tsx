"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { assetPath } from "@/lib/asset-path";

gsap.registerPlugin(ScrollTrigger);

/**
 * GiveSection — proportional CTA strip, NOT a full-bleed marketing section.
 * Celebrate Jesus' actual site treats giving as a small footer CTA + nav link;
 * we keep this section deliberately modest in scope.
 */
export default function GiveSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".give-content > *",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ minHeight: "50vh" }}
    >
      {/* Background — different image than hero (which uses worship.webp) */}
      <div className="absolute inset-0 z-0">
        <Image
          src={assetPath("/images/building.webp")}
          alt=""
          fill
          className="object-cover"
          style={{ objectPosition: "center 25%" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.78) 100%)",
          }}
        />
      </div>

      {/* Centered content — modest scope */}
      <div
        className="relative z-10 flex items-center justify-center"
        style={{ minHeight: "inherit", paddingTop: "5rem", paddingBottom: "5rem" }}
      >
        <div className="give-content w-full max-w-xl mx-auto px-6 text-center">
          <h2
            className="text-white text-balance"
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3rem)",
              fontWeight: 600,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              marginBottom: "1.75rem",
            }}
          >
            Give.
          </h2>
          <p
            style={{
              fontSize: "1rem",
              color: "rgba(255,255,255,0.82)",
              lineHeight: 1.7,
              marginBottom: "2.5rem",
            }}
          >
            Partner with what God is doing through C3.
          </p>
          <Link href="/give/" className="btn btn-primary btn-sm">
            Give Now
          </Link>
        </div>
      </div>
    </section>
  );
}
