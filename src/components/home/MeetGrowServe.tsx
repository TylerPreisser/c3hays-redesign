"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { assetPath } from "@/lib/asset-path";
import { prefersReducedMotion } from "@/lib/reduced-motion";
import { MEET_GROW_SERVE_DEFAULTS, imgCss, type MeetGrowServeContent, type ImgStyle } from "@/lib/home-content";

gsap.registerPlugin(ScrollTrigger);

export default function MeetGrowServe({
  content = MEET_GROW_SERVE_DEFAULTS,
  img = {},
  variant,
}: {
  content?: MeetGrowServeContent;
  img?: Record<string, ImgStyle>;
  variant?: string;
}) {
  const v = variant || "cards";
  const pillars = content.pillars;
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // v6 §1.5 — honor reduced motion: skip all entrance animation so content
    // renders in its final resting state (GSAP never applies the opacity:0 from).
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      /* Section heading */
      gsap.fromTo(
        ".mgs-heading",
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
          },
        }
      );

      /* Tile cards / row items stagger */
      gsap.fromTo(
        ".pillar-tile",
        { opacity: 0, y: 48 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".pillar-grid",
            start: "top 75%",
            once: true,
          },
        }
      );

      /* Image clip-path wipe reveal per tile (cards + list variants) */
      gsap.utils.toArray<HTMLElement>(".pillar-img-wrap").forEach((el, i) => {
        gsap.fromTo(
          el,
          { clipPath: "inset(0 0 100% 0)" },
          {
            clipPath: "inset(0 0 0% 0)",
            duration: 1.2,
            ease: "power4.out",
            delay: i * 0.1,
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              once: true,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* ─── VARIANT: cards (default — current look) ─────────────────────── */
  if (v === "cards") {
    return (
      <section ref={sectionRef} className="section" style={{ backgroundColor: "transparent" }}>
        <div className="container-c3">
          {/* Header */}
          <div className="mgs-heading mb-10 md:mb-14 lg:mb-20">
            <p className="overline" style={{ marginBottom: "var(--s-4, 16px)" }}>Take a next step</p>
            <h2
              className="display-2"
              data-cms="meetGrowServe.heading"
              style={{ color: "#1b1c1c" }}
              dangerouslySetInnerHTML={{ __html: content.heading }}
            />
          </div>

          {/* 3-up tile grid */}
          <div className="pillar-grid grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-10">
            {pillars.map((pillar, pi) => (
              <div key={pillar.word} className="pillar-tile group" data-cms-bg={`tile:meetGrowServe.${pi}`}>
                {/* Image */}
                <div
                  className="pillar-img-wrap relative overflow-hidden mb-6"
                  data-cms-img={`meetGrowServe.pillars.${pi}.image`}
                  style={{ borderRadius: "var(--radius-md)" }}
                >
                  <Image
                    src={assetPath(pillar.image)}
                    alt={pillar.headline}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    style={imgCss(img[`meetGrowServe.pillars.${pi}.image`])}
                  />
                  <div
                    className="absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                    style={{ background: "rgba(10,10,10,0.15)" }}
                  />
                </div>

                {/* Text */}
                <h3
                  className="heading-2 mb-4"
                  data-cms={`meetGrowServe.pillars.${pi}.headline`}
                  style={{ color: "#1b1c1c" }}
                  dangerouslySetInnerHTML={{ __html: pillar.headline }}
                />
                <p
                  className="mb-5 leading-relaxed"
                  data-cms={`meetGrowServe.pillars.${pi}.body`}
                  style={{ fontSize: "1rem", color: "rgba(27,28,28,0.80)", lineHeight: 1.65 }}
                  dangerouslySetInnerHTML={{ __html: pillar.body }}
                />
                <Link href={pillar.href} className="arrow-link" style={{ color: "#1b1c1c" }}>
                  Learn More <span className="arrow">→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ─── VARIANT: list ───────────────────────────────────────────────── */
  /* Horizontal rows: image left (fixed 40% width), text right, stacked vertically. */
  if (v === "list") {
    return (
      <section ref={sectionRef} className="section" style={{ backgroundColor: "transparent" }}>
        <div className="container-c3">
          {/* Header */}
          <div className="mgs-heading mb-10 md:mb-14 lg:mb-16">
            <h2
              className="display-2"
              data-cms="meetGrowServe.heading"
              style={{ color: "#1b1c1c" }}
              dangerouslySetInnerHTML={{ __html: content.heading }}
            />
          </div>

          {/* Stacked list rows */}
          <div className="pillar-grid flex flex-col gap-0">
            {pillars.map((pillar, pi) => (
              <div
                key={pillar.word}
                className="pillar-tile group flex flex-col md:flex-row items-stretch"
                style={{
                  borderTop: pi === 0 ? "1px solid rgba(27,28,28,0.10)" : undefined,
                  borderBottom: "1px solid rgba(27,28,28,0.10)",
                  padding: "2.5rem 0",
                  gap: "2.5rem",
                }}
              >
                {/* Image — full-width 16:9 on mobile, 38% 4:3 on md+ */}
                <div
                  className="pillar-img-wrap relative overflow-hidden shrink-0 w-full aspect-video md:w-[38%] md:aspect-[4/3]"
                  data-cms-img={`meetGrowServe.pillars.${pi}.image`}
                  style={{ borderRadius: "var(--radius-md)" }}
                >
                  <Image
                    src={assetPath(pillar.image)}
                    alt={pillar.headline}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    style={imgCss(img[`meetGrowServe.pillars.${pi}.image`])}
                  />
                </div>

                {/* Text content */}
                <div className="flex flex-col justify-center flex-1 min-w-0">
                  <h3
                    className="heading-2 mb-3"
                    data-cms={`meetGrowServe.pillars.${pi}.headline`}
                    style={{ color: "#1b1c1c" }}
                    dangerouslySetInnerHTML={{ __html: pillar.headline }}
                  />
                  <p
                    className="mb-5 leading-relaxed"
                    data-cms={`meetGrowServe.pillars.${pi}.body`}
                    style={{ fontSize: "1rem", color: "rgba(27,28,28,0.78)", lineHeight: 1.7, maxWidth: "52ch" }}
                    dangerouslySetInnerHTML={{ __html: pillar.body }}
                  />
                  <Link href={pillar.href} className="arrow-link" style={{ color: "#1b1c1c" }}>
                    Learn More <span className="arrow">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ─── VARIANT: bento (v6 R1) ──────────────────────────────────────── */
  /* Asymmetric bento — first pillar is a large 2-col hero tile with an image
     backdrop + overlaid label; the rest are smaller supporting tiles. Apple's
     bento trend, on the design-standard tokens (--radius-md, soft shadow, hover
     lift). Reads from the same `pillars` content — no shape change. */
  if (v === "bento") {
    return (
      <section ref={sectionRef} className="section" style={{ backgroundColor: "transparent" }}>
        <div className="container-c3">
          <div className="mgs-heading mb-10 md:mb-14 lg:mb-16" style={{ maxWidth: "40ch" }}>
            <p className="overline" style={{ marginBottom: "var(--s-4, 16px)" }}>Take a next step</p>
            <h2 className="display-2" data-cms="meetGrowServe.heading" style={{ color: "#1b1c1c" }} dangerouslySetInnerHTML={{ __html: content.heading }} />
          </div>

          <div
            className="pillar-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6"
            style={{ gridAutoRows: "1fr" }}
          >
            {pillars.map((pillar, pi) => {
              const isHero = pi === 0;
              return (
                <Link
                  key={pillar.word}
                  href={pillar.href}
                  className={`pillar-tile bento-tile group relative overflow-hidden flex flex-col justify-end ${isHero ? "md:col-span-2 lg:col-span-2 md:row-span-2" : ""}`}
                  data-cms-bg={`tile:meetGrowServe.${pi}`}
                  style={{
                    borderRadius: "var(--radius-md)",
                    minHeight: isHero ? "clamp(320px, 42vw, 460px)" : "clamp(220px, 26vw, 300px)",
                    boxShadow: "var(--shadow-rest)",
                    textDecoration: "none",
                    color: "#fff",
                  }}
                >
                  {/* Image backdrop */}
                  <div className="pillar-img-wrap absolute inset-0" data-cms-img={`meetGrowServe.pillars.${pi}.image`} aria-hidden>
                    <Image
                      src={assetPath(pillar.image)}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                      style={imgCss(img[`meetGrowServe.pillars.${pi}.image`])}
                    />
                  </div>
                  {/* Scrim for AA-legible overlaid label */}
                  <div className="absolute inset-0" aria-hidden style={{ background: "linear-gradient(180deg, rgba(10,10,10,0) 30%, rgba(10,10,10,0.72) 100%)" }} />

                  {/* Overlaid label */}
                  <div className="relative p-6 lg:p-8">
                    <h3
                      className={isHero ? "heading-1" : "heading-3"}
                      data-cms={`meetGrowServe.pillars.${pi}.headline`}
                      style={{ color: "#fff", marginBottom: isHero ? "var(--s-3, 12px)" : "var(--s-2, 8px)" }}
                      dangerouslySetInnerHTML={{ __html: pillar.headline }}
                    />
                    {isHero && (
                      <p
                        className="body-base"
                        data-cms={`meetGrowServe.pillars.${pi}.body`}
                        style={{ color: "rgba(255,255,255,0.82)", maxWidth: "46ch", margin: 0 }}
                        dangerouslySetInnerHTML={{ __html: pillar.body }}
                      />
                    )}
                    <span className="arrow-link" style={{ color: "#fff", marginTop: "var(--s-4, 16px)", display: "inline-flex" }}>
                      Learn More <span className="arrow">→</span>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  /* ─── VARIANT: minimal ────────────────────────────────────────────── */
  /* No images — big text links with teal accent number, generous spacing. */
  return (
    <section ref={sectionRef} className="section" style={{ backgroundColor: "transparent" }}>
      <div className="container-c3">
        {/* Header */}
        <div
          className="mgs-heading"
          style={{ marginBottom: "4rem", maxWidth: "36ch" }}
        >
          <h2
            className="display-2"
            data-cms="meetGrowServe.heading"
            style={{ color: "#1b1c1c" }}
            dangerouslySetInnerHTML={{ __html: content.heading }}
          />
        </div>

        {/* Big-text link list */}
        <div className="pillar-grid flex flex-col" style={{ gap: "0" }}>
          {pillars.map((pillar, pi) => (
            <div
              key={pillar.word}
              className="pillar-tile group"
              style={{
                borderTop: pi === 0 ? "1px solid rgba(27,28,28,0.12)" : undefined,
                borderBottom: "1px solid rgba(27,28,28,0.12)",
              }}
            >
              {/* Hidden image wrapper — preserves data-cms-img for CMS editability */}
              <div
                className="pillar-img-wrap sr-only"
                data-cms-img={`meetGrowServe.pillars.${pi}.image`}
                aria-hidden="true"
                style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
              >
                <Image
                  src={assetPath(pillar.image)}
                  alt=""
                  fill
                  style={imgCss(img[`meetGrowServe.pillars.${pi}.image`])}
                />
              </div>

              <Link
                href={pillar.href}
                className="flex items-center justify-between group/link"
                style={{
                  padding: "2.25rem 0",
                  textDecoration: "none",
                  transition: "gap 0.3s ease",
                }}
              >
                <div className="flex items-baseline gap-6 md:gap-10 min-w-0">
                  {/* Teal index number */}
                  <span
                    style={{
                      fontVariantNumeric: "tabular-nums",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "#1cc3af",
                      letterSpacing: "0.06em",
                      flexShrink: 0,
                    }}
                  >
                    {String(pi + 1).padStart(2, "0")}
                  </span>

                  <div className="min-w-0">
                    <h3
                      className="display-3 md:display-2"
                      data-cms={`meetGrowServe.pillars.${pi}.headline`}
                      style={{
                        color: "#1b1c1c",
                        transition: "color 0.25s ease",
                        margin: 0,
                      }}
                      dangerouslySetInnerHTML={{ __html: pillar.headline }}
                    />
                    <p
                      className="mt-2"
                      data-cms={`meetGrowServe.pillars.${pi}.body`}
                      style={{
                        fontSize: "1rem",
                        color: "rgba(27,28,28,0.65)",
                        lineHeight: 1.65,
                        maxWidth: "60ch",
                        margin: "0.5rem 0 0",
                      }}
                      dangerouslySetInnerHTML={{ __html: pillar.body }}
                    />
                  </div>
                </div>

                {/* Arrow indicator */}
                <span
                  style={{
                    fontSize: "1.5rem",
                    color: "#1cc3af",
                    flexShrink: 0,
                    marginLeft: "1.5rem",
                    transition: "transform 0.25s ease",
                  }}
                  className="group-hover/link:translate-x-1"
                >
                  →
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
