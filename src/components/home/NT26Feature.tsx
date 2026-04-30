"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { assetPath } from "@/lib/asset-path";

gsap.registerPlugin(ScrollTrigger);

export default function NT26Feature() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Text content stagger */
      gsap.fromTo(
        ".nt26-content > *",
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            once: true,
          },
        }
      );

      /* Image clip-path wipe */
      gsap.fromTo(
        ".nt26-img",
        { clipPath: "inset(0 0 100% 0)" },
        {
          clipPath: "inset(0 0 0% 0)",
          duration: 1.3,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".nt26-img",
            start: "top 75%",
            once: true,
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    /* Dark ink section */
    <section
      ref={sectionRef}
      className="section overflow-hidden"
      style={{ backgroundColor: "#1b1c1c" }}
    >
      <div className="container-c3">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Text left */}
          <div className="nt26-content">
            <p className="overline mb-6" style={{ color: "rgba(255,255,255,0.55)" }}>
              Bible Reading Plan
            </p>
            <h2 className="display-2 text-white mb-8 text-balance">
              Have you read your{" "}
              <em className="not-italic" style={{ color: "#1cc3af" }}>Bible</em>{" "}
              today?
            </h2>
            <p className="mb-6" style={{ fontSize: "1.125rem", color: "rgba(255,255,255,0.85)", lineHeight: 1.65 }}>
              The NT26 Reading Plan takes you through the entire New Testament
              in 2026 — one chapter at a time, together as a church family. No
              experience required. Just a willing heart.
            </p>
            <p className="mb-10" style={{ fontSize: "1rem", color: "rgba(255,255,255,0.70)", lineHeight: 1.65 }}>
              Join thousands reading alongside C3. We&apos;ll walk through every word
              Jesus spoke, every letter Paul wrote, and every vision John
              received — together.
            </p>
            <Link
              href="/messages/"
              className="btn btn-primary"
            >
              Start Reading
            </Link>
          </div>

          {/* Image right — sharp corners, clip-path reveal */}
          <div
            className="nt26-img relative overflow-hidden"
            style={{ aspectRatio: "4/3", minHeight: 280, borderRadius: 0 }}
          >
            <Image
              src={assetPath("/images/nt26.webp")}
              alt="NT26 Bible Reading Plan"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
