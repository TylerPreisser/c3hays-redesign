"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function MissionBlock() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".mission-text > *",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            once: true,
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    /* Full-width evergreen — centered massive italic headline */
    <section
      ref={sectionRef}
      className="flex items-center justify-center text-center"
      style={{
        backgroundColor: "#232e2c",
        minHeight: "60vh",
        paddingTop: "8rem",
        paddingBottom: "8rem",
      }}
    >
      <div className="container-c3">
        <div className="mission-text max-w-4xl mx-auto">
          <p className="overline mb-8" style={{ color: "rgba(255,255,255,0.35)" }}>
            Our Mission
          </p>
          <h2
            className="text-white text-balance"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            We exist to{" "}
            <em className="not-italic" style={{ color: "#10405D" }}>meet</em>{" "}
            Him, grow in Him, and{" "}
            <em className="not-italic" style={{ color: "#10405D" }}>serve</em>{" "}
            through Him.
          </h2>
          <div
            className="mt-10 w-12 mx-auto"
            style={{ height: 2, backgroundColor: "#10405D" }}
          />
        </div>
      </div>
    </section>
  );
}
