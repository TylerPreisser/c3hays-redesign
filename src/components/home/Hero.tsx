"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

/* ─────────────────────────────────────────────
   LIVE STREAM CONFIG
   Set isLive = true when the service is broadcasting.
   The teal strip will appear automatically at the top of the hero.
   Set isLive = false (default) to hide the strip.
   ───────────────────────────────────────────── */
const isLive = false;

/* Word-stagger easing — snappy pop-in */
const WORD_EASE = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  return (
    <section
      className="relative flex flex-col overflow-hidden"
      style={{ minHeight: "100dvh" }}
    >
      {/* ── Live-stream strip (visible only when isLive === true) ── */}
      {isLive && (
        <div
          className="relative z-20 flex items-center justify-center gap-3 py-3 px-4"
          style={{ backgroundColor: "#1cc3af" }}
        >
          {/* Pulsing dot */}
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
      )}

      {/* ── Background image with Ken Burns ── */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/congregation.webp"
          alt="C3 congregation gathered in worship"
          fill
          className="object-cover animate-ken-burns"
          priority
          quality={90}
        />
        {/* Cinematic gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.70) 100%)",
          }}
        />
      </div>

      {/* ── Hero content — flex-1 so it fills remaining height ── */}
      <div
        className="relative z-10 flex-1 flex flex-col items-center justify-center container-c3 text-center"
        style={{ paddingTop: "6rem", paddingBottom: "6rem" }}
      >
        {/* H1 — word-by-word stagger */}
        <h1 className="display-hero text-white mb-5" style={{ lineHeight: 1.0 }}>
          {"Welcome home.".split(" ").map((word, wi) => (
            <motion.span
              key={`hero-word-${wi}`}
              className="inline-block mr-[0.22em] last:mr-0"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.9,
                ease: WORD_EASE,
                delay: 0.15 + wi * 0.1,
              }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Supporting line */}
        <motion.p
          className="mb-10 max-w-lg"
          style={{ fontSize: "1.125rem", lineHeight: 1.6, color: "rgba(255,255,255,0.80)" }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.5 }}
        >
          A church family in Hays &amp; Colby, Kansas — for everyone, just as you are.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-4 mb-16"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.7 }}
        >
          <Link href="/visit/" className="btn btn-primary btn-lg">
            Plan Your Visit
          </Link>
          <Link href="/watch/" className="btn btn-outline btn-lg">
            Watch Live
          </Link>
        </motion.div>

        {/* Service times — bottom row */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 1.0 }}
        >
          {serviceTimes.map((s, i) => (
            <div key={s.label} className="flex items-center gap-2">
              {i > 0 && (
                <span
                  className="hidden sm:block w-px h-3 shrink-0"
                  style={{ background: "rgba(255,255,255,0.20)" }}
                />
              )}
              {/* Teal square marker */}
              <span
                className="w-2 h-2 shrink-0"
                style={{ backgroundColor: "#1cc3af" }}
              />
              <span
                className="text-xs font-bold uppercase tracking-[0.12em]"
                style={{ color: "rgba(255,255,255,0.80)" }}
              >
                {s.label}
              </span>
              <span
                className="text-xs"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                {s.times}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

const serviceTimes = [
  { label: "Hays · Sat", times: "5PM" },
  { label: "Hays · Sun", times: "8 / 9:30 / 11AM" },
  { label: "Colby · Sun", times: "10AM" },
];
