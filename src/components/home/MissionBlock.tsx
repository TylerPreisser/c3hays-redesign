"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MISSION_DEFAULTS, type MissionContent } from "@/lib/home-content";

gsap.registerPlugin(ScrollTrigger);

/**
 * MissionBlock — the ONE place on the site the mission statement lives.
 * "We exist to meet Him, grow in Him, and serve through Him."
 * Do NOT add this sentence anywhere else in the codebase.
 */
export default function MissionBlock({ content = MISSION_DEFAULTS }: { content?: MissionContent }) {
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
    /* Full-width ink-dark — centered massive headline */
    <section
      ref={sectionRef}
      className="flex items-center justify-center text-center"
      style={{
        backgroundColor: "#1b1c1c",
        minHeight: "60vh",
        paddingTop: "8rem",
        paddingBottom: "8rem",
      }}
    >
      <div className="container-c3">
        <div className="mission-text max-w-4xl mx-auto">
          <h2
            className="text-white text-balance"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
            }}
          >
            {content.segments.map((seg, i) =>
              seg.em ? (
                <em key={i} style={{ color: "#1cc3af", fontStyle: "italic" }}>{seg.text}</em>
              ) : (
                <span key={i}>{seg.text}</span>
              )
            )}
          </h2>
        </div>
      </div>
    </section>
  );
}
