"use client";

import Link from "next/link";
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

      {/* ── Background — deep ink gradient + subtle noise overlay ── */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "linear-gradient(180deg, #1b1c1c 0%, #0d0d0d 100%)",
        }}
      >
        {/* Subtle grain texture overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`,
            backgroundSize: "256px 256px",
            opacity: 0.5,
          }}
        />
      </div>

      {/* ── Hero content — centered both axes ── */}
      <div
        className="relative z-10 flex-1 flex flex-col items-center justify-center container-c3 text-center"
        style={{ paddingTop: "6rem", paddingBottom: "6rem" }}
      >
        {/* H1 — word-by-word stagger, Fraunces display font */}
        <h1 className="display-hero text-white mb-10" style={{ lineHeight: 1.0 }}>
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

        {/* CTAs */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-4"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.55 }}
        >
          <Link href="/visit/" className="btn btn-primary btn-lg">
            Plan Your Visit
          </Link>
          <Link href="/watch/" className="btn btn-hero-ghost btn-lg">
            Watch Live
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
