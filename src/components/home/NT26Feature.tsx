"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { assetPath } from "@/lib/asset-path";
import { prefersReducedMotion } from "@/lib/reduced-motion";
import { NT26_DEFAULTS, imgCss, type NT26Content, type BtnStyle, type ImgStyle } from "@/lib/home-content";
import { btnCss } from "./Hero";
import { bleedBg } from "@/lib/section-bleed";

gsap.registerPlugin(ScrollTrigger);

export default function NT26Feature({
  content = NT26_DEFAULTS,
  btnStyle,
  img = {},
  variant,
  bleed = false,
}: {
  content?: NT26Content;
  btnStyle?: BtnStyle;
  img?: Record<string, ImgStyle>;
  variant?: string;
  /** v7 R4 — opt-in gradient section-bleed (Tyler-advanced). Default OFF: clean edges. */
  bleed?: boolean;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const v = variant || "imageRight";

  useEffect(() => {
    // v6 §1.5 — honor reduced motion: render final resting state, no reveal.
    if (prefersReducedMotion()) return;
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

  /* ─────────────────────────────────────────────────────────────
     imageRight (default) — text left, image right
  ───────────────────────────────────────────────────────────── */
  if (v === "imageRight") {
    return (
      <section
        ref={sectionRef}
        className="section overflow-hidden"
        style={{ background: bleedBg("#1b1c1c", undefined, bleed) }}
      >
        <div className="container-c3">
          {/* Side-by-side from md (768px); stacked single-col on phones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 lg:gap-20 items-center">

            {/* Text left */}
            <div className="nt26-content">
              <p className="overline" style={{ color: "#1cc3af", marginBottom: "var(--s-4, 16px)" }}>Grow deeper</p>
              <h2
                className="display-2 text-white text-balance"
                data-cms="nt26.heading"
                style={{ marginBottom: "clamp(1.5rem, 4vw, 3rem)" }}
                dangerouslySetInnerHTML={{ __html: content.heading }}
              />
              <p
                data-cms="nt26.body"
                style={{ fontSize: "1.125rem", color: "rgba(255,255,255,0.85)", lineHeight: 1.7, marginBottom: "clamp(2rem, 4vw, 3.5rem)" }}
                dangerouslySetInnerHTML={{ __html: content.body }}
              />
              <Link
                href={content.ctaHref}
                data-cms-link="nt26.cta"
                className="btn btn-primary btn-sm"
                style={btnCss(btnStyle)}
              >
                <span data-cms-link-label>{content.ctaLabel}</span>
              </Link>
            </div>

            {/* Image right — rounded, clip-path reveal.
                Phone: 4:3 landscape. md+ (side by side): 3:4 portrait to fill the column. */}
            <div
              className="nt26-img relative overflow-hidden nt26-img-wrap"
              data-cms-img="nt26.image"
              style={{ borderRadius: "var(--radius-md)", width: "100%" }}
            >
              <Image
                src={assetPath(content.image)}
                alt="NT26 Bible Reading Plan"
                fill
                className="object-cover"
                style={imgCss(img["nt26.image"])}
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ─────────────────────────────────────────────────────────────
     imageLeft — image left, text right (columns swapped)
  ───────────────────────────────────────────────────────────── */
  if (v === "imageLeft") {
    return (
      <section
        ref={sectionRef}
        className="section overflow-hidden"
        style={{ background: bleedBg("#1b1c1c", undefined, bleed) }}
      >
        <div className="container-c3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 lg:gap-20 items-center">

            {/* Image left */}
            <div
              className="nt26-img relative overflow-hidden nt26-img-wrap order-last md:order-first"
              data-cms-img="nt26.image"
              style={{ borderRadius: "var(--radius-md)", width: "100%" }}
            >
              <Image
                src={assetPath(content.image)}
                alt="NT26 Bible Reading Plan"
                fill
                className="object-cover"
                style={imgCss(img["nt26.image"])}
              />
            </div>

            {/* Text right */}
            <div className="nt26-content order-first md:order-last">
              <p className="overline" style={{ color: "#1cc3af", marginBottom: "var(--s-4, 16px)" }}>Grow deeper</p>
              <h2
                className="display-2 text-white text-balance"
                data-cms="nt26.heading"
                style={{ marginBottom: "clamp(1.5rem, 4vw, 3rem)" }}
                dangerouslySetInnerHTML={{ __html: content.heading }}
              />
              <p
                data-cms="nt26.body"
                style={{ fontSize: "1.125rem", color: "rgba(255,255,255,0.85)", lineHeight: 1.7, marginBottom: "clamp(2rem, 4vw, 3.5rem)" }}
                dangerouslySetInnerHTML={{ __html: content.body }}
              />
              <Link
                href={content.ctaHref}
                data-cms-link="nt26.cta"
                className="btn btn-primary btn-sm"
                style={btnCss(btnStyle)}
              >
                <span data-cms-link-label>{content.ctaLabel}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ─────────────────────────────────────────────────────────────
     stacked — centered heading, full-width image, body + CTA centered
  ───────────────────────────────────────────────────────────── */
  return (
    <section
      ref={sectionRef}
      className="section overflow-hidden"
      style={{ background: bleedBg("#1b1c1c") }}
    >
      <div className="container-c3">

        {/* Centered heading */}
        <div
          className="nt26-content"
          style={{ textAlign: "center", maxWidth: "52rem", margin: "0 auto" }}
        >
          {/* Teal pill above heading */}
          <div
            style={{
              display: "inline-block",
              backgroundColor: "rgba(28,195,175,0.15)",
              border: "1px solid rgba(28,195,175,0.4)",
              borderRadius: "var(--radius-md)",
              padding: "0.25rem 1rem",
              marginBottom: "clamp(1rem, 2.5vw, 1.75rem)",
            }}
          >
            <span style={{ fontSize: "0.8125rem", fontWeight: 600, letterSpacing: "0.06em", color: "#1cc3af", textTransform: "uppercase" }}>
              Reading Plan
            </span>
          </div>

          <h2
            className="display-2 text-white text-balance"
            data-cms="nt26.heading"
            style={{ marginBottom: "clamp(1.5rem, 4vw, 3rem)" }}
            dangerouslySetInnerHTML={{ __html: content.heading }}
          />
        </div>

        {/* Full-width image */}
        <div
          className="nt26-img relative overflow-hidden"
          data-cms-img="nt26.image"
          style={{
            borderRadius: "var(--radius-md)",
            width: "100%",
            aspectRatio: "16 / 7",
            margin: "0 0 clamp(2rem, 4vw, 3.5rem)",
          }}
        >
          <Image
            src={assetPath(content.image)}
            alt="NT26 Bible Reading Plan"
            fill
            className="object-cover"
            style={imgCss(img["nt26.image"])}
          />
        </div>

        {/* Centered body + CTA */}
        <div style={{ textAlign: "center", maxWidth: "52rem", margin: "0 auto" }}>
          <p
            data-cms="nt26.body"
            style={{ fontSize: "1.125rem", color: "rgba(255,255,255,0.85)", lineHeight: 1.7, marginBottom: "clamp(2rem, 4vw, 3.5rem)" }}
            dangerouslySetInnerHTML={{ __html: content.body }}
          />
          <Link
            href={content.ctaHref}
            data-cms-link="nt26.cta"
            className="btn btn-primary btn-sm"
            style={btnCss(btnStyle)}
          >
            <span data-cms-link-label>{content.ctaLabel}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
