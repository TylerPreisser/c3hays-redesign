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
  bgImage,
}: {
  content?: MissionContent;
  variant?: string;
  /** v7 R4 — opt-in gradient section-bleed (Tyler-advanced). Default OFF: clean edges. */
  bleed?: boolean;
  /** Fix 1: when set (home continuous mode), THIS section hosts the ONE shared
   *  hero.bg photo, sized to span the whole hero+mission area and bled UP behind the
   *  hero (which paints none of its own) so the two read as a single continuous
   *  image — no seam, no duplicate. It is the only data-cms-img="hero.bg" element on
   *  the page, so one edit swaps the whole photo. Omit → solid dark (standalone). */
  bgImage?: string;
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
      /* Full-width ink-dark — centered massive headline. Fix 1: when `bgImage` is set
         (home continuous mode) this section hosts the ONE shared hero.bg photo, sized
         to span the whole hero+mission area and anchored to bleed UP behind the hero
         (which paints none of its own) — so the two sections read as a single
         continuous image. overflow is left VISIBLE so that upward bleed isn't clipped;
         standalone (no bgImage) keeps clean clipped edges + the solid dark look. */
      <section
        ref={sectionRef}
        className={`relative flex items-center justify-center text-center${bgImage ? "" : " overflow-hidden"}`}
        style={{
          background: bgImage ? "#0f1111" : bleedBg("#1b1c1c", undefined, bleed),
          /* Fluid vertical padding: generous on desktop, proportionate on tablet/phone */
          paddingTop: "clamp(5rem, 10vw, 10rem)",
          paddingBottom: "clamp(5rem, 10vw, 10rem)",
        }}
      >
        {bgImage && (
          <>
            {/* Fix 1: the SINGLE shared hero.bg photo. Sized to cover the combined
                hero+mission area and anchored to bleed UP (top:-100dvh reaches the
                hero's top since the hero is exactly 100dvh; height = that 100dvh +
                this section's own height via 100%). object-cover over that tall box
                means the hero shows the top slice and the mission the continuation —
                no seam, no duplicate. This is the ONLY data-cms-img="hero.bg" on the
                page in continuous mode, so the editor swaps the whole photo at once. */}
            <div
              data-cms-img="hero.bg"
              aria-hidden="true"
              className="absolute left-0 right-0 z-0"
              style={{ top: "-100dvh", height: "calc(100dvh + 100%)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={bgImage} alt="" className="w-full h-full" style={{ objectFit: "cover", objectPosition: "center" }} />
            </div>
            {/* scrim keeps the white statement legible over the mission's slice */}
            <div aria-hidden="true" className="absolute inset-0 z-0" style={{ background: "linear-gradient(180deg, rgba(15,17,17,.74) 0%, rgba(15,17,17,.82) 100%)" }} />
          </>
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
