"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MISSION_DEFAULTS, type MissionContent } from "@/lib/home-content";
import { bleedBg } from "@/lib/section-bleed";

gsap.registerPlugin(ScrollTrigger);

/**
 * MissionBlock — the ONE place on the site the mission statement lives.
 * "We exist to meet Him, grow in Him, and serve through Him."
 * Do NOT add this sentence anywhere else in the codebase.
 */
export default function MissionBlock({
  content = MISSION_DEFAULTS,
  variant,
  bleed = false,
  continuous = false,
}: {
  content?: MissionContent;
  variant?: string;
  /** v7 R4 — opt-in gradient section-bleed (Tyler-advanced). Default OFF: clean edges. */
  bleed?: boolean;
  /** Home continuous mode (item 2): hero + mission share ONE seamless background image
   *  painted by PageComposer's SPAN layer behind both sections. When true this section
   *  renders TRANSPARENT (so that single image shows through — no seam, no duplicate) and
   *  keeps a scrim for legibility. Omit/false → standalone solid-dark mission. */
  continuous?: boolean;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const v = variant || "centered";

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

  /* ── centered (default) ─────────────────────────────────────────────── */
  if (v === "centered") {
    return (
      /* Full-width ink-dark — centered massive headline. Home continuous mode (item 2):
         when `continuous` this section renders TRANSPARENT so PageComposer's single
         span-layer image (shared with the hero above) shows through as ONE seamless
         photo — no seam, no duplicate; only a scrim is painted for legibility. Standalone
         (not continuous) keeps clean clipped edges + the solid dark look. */
      <section
        ref={sectionRef}
        className="relative flex items-center justify-center text-center overflow-hidden"
        style={{
          background: continuous ? "transparent" : bleedBg("#1b1c1c", undefined, bleed),
          /* Fluid vertical padding: generous on desktop, proportionate on tablet/phone */
          paddingTop: "clamp(5rem, 10vw, 10rem)",
          paddingBottom: "clamp(5rem, 10vw, 10rem)",
        }}
      >
        {continuous && (
          /* Scrim over the mission's slice of the shared span image — keeps the white
             statement legible. The image itself is painted by PageComposer's span layer
             behind this (transparent) section, so there is no per-section photo here. */
          <div aria-hidden="true" className="absolute inset-0 z-0" style={{ background: "linear-gradient(180deg, rgba(15,17,17,.74) 0%, rgba(15,17,17,.82) 100%)" }} />
        )}
        <div className="container-c3 relative z-10">
          <div className="mission-text max-w-4xl mx-auto">
            <h2
              className="text-white text-balance"
              data-cms="mission.html"
              style={{
                fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                fontWeight: 700,
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
              }}
              dangerouslySetInnerHTML={{ __html: content.html }}
            />
          </div>
        </div>
      </section>
    );
  }

  /* ── left ───────────────────────────────────────────────────────────── */
  /* Left-aligned layout: statement anchored to the left with a teal       */
  /* accent bar, giving the section an editorial, magazine-style weight.   */
  if (v === "left") {
    return (
      <section
        ref={sectionRef}
        style={{
          background: bleedBg("#1b1c1c", undefined, bleed),
          paddingTop: "clamp(5rem, 10vw, 10rem)",
          paddingBottom: "clamp(5rem, 10vw, 10rem)",
        }}
      >
        <div className="container-c3">
          <div className="mission-text" style={{ maxWidth: "56rem" }}>
            {/* teal accent bar */}
            <div
              aria-hidden="true"
              style={{
                width: "4rem",
                height: "4px",
                backgroundColor: "#1cc3af",
                borderRadius: "var(--radius-md, 0.375rem)",
                marginBottom: "2rem",
              }}
            />
            <h2
              className="text-white text-balance"
              data-cms="mission.html"
              style={{
                fontSize: "clamp(2.75rem, 7vw, 5.5rem)",
                fontWeight: 700,
                lineHeight: 1.1,
                letterSpacing: "-0.025em",
              }}
              dangerouslySetInnerHTML={{ __html: content.html }}
            />
          </div>
        </div>
      </section>
    );
  }

  /* ── boxed ──────────────────────────────────────────────────────────── */
  /* The mission statement floats inside a teal-bordered rounded panel     */
  /* set against a slightly lighter charcoal field, drawing the eye and    */
  /* giving the block a distinct, contained presence on the page.          */
  return (
    <section
      ref={sectionRef}
      style={{
        background: bleedBg("#252727", undefined, bleed),
        paddingTop: "clamp(5rem, 10vw, 10rem)",
        paddingBottom: "clamp(5rem, 10vw, 10rem)",
      }}
    >
      <div className="container-c3">
        <div className="mission-text flex justify-center">
          <div
            style={{
              maxWidth: "52rem",
              width: "100%",
              border: "2px solid #1cc3af",
              borderRadius: "var(--radius-md, 0.75rem)",
              backgroundColor: "#1b1c1c",
              padding: "clamp(2.5rem, 6vw, 5rem) clamp(2rem, 5vw, 4rem)",
              textAlign: "center",
            }}
          >
            {/* teal glow accent above the text */}
            <div
              aria-hidden="true"
              style={{
                display: "inline-block",
                width: "2.5rem",
                height: "3px",
                backgroundColor: "#1cc3af",
                borderRadius: "var(--radius-md, 0.375rem)",
                marginBottom: "1.75rem",
              }}
            />
            <h2
              className="text-white text-balance"
              data-cms="mission.html"
              style={{
                fontSize: "clamp(2rem, 5vw, 3.75rem)",
                fontWeight: 700,
                lineHeight: 1.18,
                letterSpacing: "-0.02em",
              }}
              dangerouslySetInnerHTML={{ __html: content.html }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
