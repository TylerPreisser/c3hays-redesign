"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { assetPath } from "@/lib/asset-path";

gsap.registerPlugin(ScrollTrigger);

export default function GiveSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".give-content > *",
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.9,
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
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ minHeight: "85vh" }}
    >
      {/* Background image — absolute, z-0 */}
      <div className="absolute inset-0 z-0">
        <Image
          src={assetPath("/images/worship.webp")}
          alt=""
          fill
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.82) 100%)",
          }}
        />
      </div>

      {/* Centering wrapper — section class for vertical padding + flex for centering */}
      <div
        className="relative z-10 section flex items-center justify-center"
        style={{ minHeight: "inherit" }}
      >
        <div className="give-content w-full max-w-2xl mx-auto px-6 text-center">
          <p className="overline mb-10" style={{ color: "rgba(255,255,255,0.55)" }}>
            Generosity
          </p>
          <h2 className="display-2 text-white mb-10 text-balance">
            Your giving is{" "}
            <em style={{ color: "#1cc3af", fontStyle: "italic" }}>changing</em>{" "}
            the world.
          </h2>
          <p
            className="mb-14"
            style={{
              fontSize: "1.125rem",
              color: "rgba(255,255,255,0.88)",
              lineHeight: 1.75,
              maxWidth: "32rem",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            At C3 we understand that God owns everything. We invite you to join
            us in stewardship — generously giving toward what God values.
          </p>
          <Link href="/give/" className="btn btn-primary">
            Give Now
          </Link>
        </div>
      </div>
    </section>
  );
}
