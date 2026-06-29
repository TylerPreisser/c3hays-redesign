"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { assetPath } from "@/lib/asset-path";
import { NT26_DEFAULTS, type NT26Content } from "@/lib/home-content";

gsap.registerPlugin(ScrollTrigger);

export default function NT26Feature({ content = NT26_DEFAULTS }: { content?: NT26Content }) {
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
            <h2 className="display-2 text-white text-balance" style={{ marginBottom: "3rem" }}>
              {content.pre}
              {content.em && <em className="not-italic" style={{ color: "#1cc3af" }}>{content.em}</em>}
              {content.post}
            </h2>
            <p style={{ fontSize: "1.125rem", color: "rgba(255,255,255,0.85)", lineHeight: 1.7, marginBottom: "3.5rem" }}>
              {content.body}
            </p>
            <Link
              href={content.ctaHref}
              className="btn btn-primary btn-sm"
            >
              {content.ctaLabel}
            </Link>
          </div>

          {/* Image right — rounded, clip-path reveal */}
          <div
            className="nt26-img relative overflow-hidden"
            style={{ aspectRatio: "4/3", minHeight: 280, borderRadius: "var(--radius-md)" }}
          >
            <Image
              src={assetPath(content.image)}
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
