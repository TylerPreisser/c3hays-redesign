"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { assetPath } from "@/lib/asset-path";
import CampusChooser from "./CampusChooser";
import { HERO_DEFAULTS, type HeroContent, type BtnStyle } from "@/lib/home-content";

/** Build inline button CSS from an editable button style (overrides the class). */
export function btnCss(b?: BtnStyle): React.CSSProperties | undefined {
  if (!b) return undefined;
  return {
    background: b.variant === "outline" ? "transparent" : b.bg,
    color: b.variant === "outline" ? b.bg : b.color,
    border: b.variant === "outline" ? `2px solid ${b.bg}` : "none",
    borderRadius: b.radius,
    fontFamily: b.font || undefined,
  };
}

/* Word-stagger easing — snappy pop-in */
const WORD_EASE = [0.16, 1, 0.3, 1] as const;

export default function Hero({ content = HERO_DEFAULTS, btnStyle, text = {}, btn = {}, variant }: { content?: HeroContent; btnStyle?: BtnStyle; text?: Record<string, string>; btn?: Record<string, BtnStyle>; variant?: string }) {
  const v = variant || "classic";
  const isLive = content.isLive;

  /* ── Shared live-stream strip ── */
  const liveStrip = isLive ? (
    <div
      className="relative z-20 flex items-center justify-center gap-3 py-3 px-4"
      style={{ backgroundColor: "#1cc3af" }}
    >
      <span
        className="animate-pulse-dot w-2 h-2 rounded-full shrink-0"
        style={{ backgroundColor: "#fff" }}
      />
      <span className="text-xs font-bold uppercase tracking-[0.18em] text-white">
        We&apos;re live now
      </span>
      <span className="text-white/50 text-xs">·</span>
      <Link
        href="/watch/"
        className="text-xs font-bold uppercase tracking-[0.18em] text-white underline underline-offset-2 hover:no-underline transition-all"
      >
        Watch Live →
      </Link>
    </div>
  ) : null;

  /* ════════════════════════════════════════════════════════════════
     CLASSIC — full-bleed background photo, centered headline + CTAs
  ════════════════════════════════════════════════════════════════ */
  if (v === "classic") {
    return (
      <section
        className="relative flex flex-col overflow-hidden"
        style={{ minHeight: "100dvh" }}
      >
        {liveStrip}

        {/* ── Background — B&W worship moment with subtle gradient ── */}
        <div className="absolute inset-0 z-0">
          <Image
            src={assetPath(content.bgImage)}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover animate-ken-burns"
            style={{ objectPosition: "center 35%" }}
          />
          {/* Scrim — guarantees the centered white headline reads at AA over any
              part of the photo (vertical gradient + a soft center vignette). */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(10,10,10,0.6) 0%, rgba(10,10,10,0.42) 45%, rgba(10,10,10,0.8) 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 55% at 50% 50%, rgba(10,10,10,0.45) 0%, transparent 70%)",
            }}
          />
        </div>

        {/* ── Hero content — centered both axes ── */}
        <div
          className="relative z-10 flex-1 flex flex-col items-center justify-center container-c3 text-center"
          style={{ paddingTop: "6rem", paddingBottom: "6rem" }}
        >
          {/* H1 — CMS-editable rich text (formatting preserved as HTML) */}
          <motion.h1
            className="display-hero text-white"
            data-cms="hero.heading"
            style={{ marginBottom: "clamp(2rem, 5vh, 4rem)" }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: WORD_EASE, delay: 0.15 }}
            dangerouslySetInnerHTML={{ __html: content.heading }}
          />

          {/* CTAs — campus chooser leads (the COTM "Find a Church" move), then secondary links */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-4 md:gap-5"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.7 }}
          >
            <CampusChooser variant="light" id="findcampus-hero" text={text} btn={btn} />
            <Link href={content.ctaHref} data-cms-link="hero.cta" className="btn btn-hero-ghost btn-sm" style={btnCss(btnStyle)}>
              <span data-cms-link-label>{content.ctaLabel}</span>
            </Link>
          </motion.div>
        </div>
      </section>
    );
  }

  /* ════════════════════════════════════════════════════════════════
     SPLIT — charcoal bg, content left column, image in rounded card right
  ════════════════════════════════════════════════════════════════ */
  if (v === "split") {
    return (
      <section
        className="relative flex flex-col overflow-hidden"
        style={{ minHeight: "100dvh", backgroundColor: "#1b1c1c" }}
      >
        {liveStrip}

        <div
          className="flex-1 flex flex-col justify-center container-c3"
          style={{ paddingTop: "6rem", paddingBottom: "6rem" }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* ── Left: headline + CTAs ── */}
            <motion.div
              className="flex flex-col items-start gap-8"
              initial={{ opacity: 0, x: -32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: WORD_EASE, delay: 0.1 }}
            >
              <h1
                className="display-hero text-white"
                data-cms="hero.heading"
                dangerouslySetInnerHTML={{ __html: content.heading }}
              />

              <div className="flex flex-wrap items-center gap-4">
                <CampusChooser variant="light" id="findcampus-hero" text={text} btn={btn} />
                <Link
                  href={content.ctaHref}
                  data-cms-link="hero.cta"
                  className="btn btn-hero-ghost btn-sm"
                  style={btnCss(btnStyle)}
                >
                  <span data-cms-link-label>{content.ctaLabel}</span>
                </Link>
              </div>
            </motion.div>

            {/* ── Right: image inside a large rounded card ── */}
            <motion.div
              className="relative w-full overflow-hidden"
              style={{
                borderRadius: "var(--radius-md, 1.25rem)",
                aspectRatio: "4 / 3",
              }}
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: WORD_EASE, delay: 0.25 }}
            >
              <Image
                src={assetPath(content.bgImage)}
                alt=""
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                style={{ objectPosition: "center 35%" }}
              />
              {/* Subtle teal bottom-fade for brand grounding */}
              <div
                className="absolute inset-x-0 bottom-0 h-1/3"
                style={{
                  background:
                    "linear-gradient(to top, rgba(28,195,175,0.18) 0%, transparent 100%)",
                }}
              />
            </motion.div>

          </div>
        </div>
      </section>
    );
  }

  /* ════════════════════════════════════════════════════════════════
     MINIMAL — clean white bg, centered headline + CTA, no photo
  ════════════════════════════════════════════════════════════════ */
  /* v === "minimal" (and any future/unknown key falls through here) */
  return (
    <section
      className="relative flex flex-col overflow-hidden"
      style={{ minHeight: "100dvh", backgroundColor: "#fff" }}
    >
      {liveStrip}

      <div
        className="flex-1 flex flex-col items-center justify-center container-c3 text-center"
        style={{ paddingTop: "8rem", paddingBottom: "8rem" }}
      >
        {/* Subtle teal accent bar above the headline */}
        <motion.div
          className="rounded-full"
          style={{
            width: "3rem",
            height: "4px",
            backgroundColor: "#1cc3af",
            marginBottom: "2rem",
          }}
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        />

        <motion.h1
          className="display-hero"
          data-cms="hero.heading"
          style={{
            color: "#1b1c1c",
            marginBottom: "clamp(2.5rem, 6vh, 5rem)",
            maxWidth: "820px",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: WORD_EASE, delay: 0.2 }}
          dangerouslySetInnerHTML={{ __html: content.heading }}
        />

        <motion.div
          className="flex flex-wrap items-center justify-center gap-4 md:gap-5"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.55 }}
        >
          <CampusChooser variant="teal" id="findcampus-hero" text={text} btn={btn} />
          <Link
            href={content.ctaHref}
            data-cms-link="hero.cta"
            className="btn btn-sm"
            style={{
              ...btnCss(btnStyle),
              backgroundColor: btnCss(btnStyle)?.background ? undefined : "#1b1c1c",
              color: btnCss(btnStyle)?.color ?? "#fff",
              borderRadius: btnCss(btnStyle)?.borderRadius ?? "var(--radius-md)",
            }}
          >
            <span data-cms-link-label>{content.ctaLabel}</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
