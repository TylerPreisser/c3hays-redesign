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

      {/* ── Background — full-bleed photo with cinematic dim overlay ── */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/congregation.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover animate-ken-burns"
        />
        {/* Cinematic gradient overlay — dark at top + bottom, slightly lighter middle */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,10,10,0.72) 0%, rgba(10,10,10,0.55) 45%, rgba(10,10,10,0.78) 100%)",
          }}
        />
      </div>

      {/* ── Hero content — centered both axes ── */}
      <div
        className="relative z-10 flex-1 flex flex-col items-center justify-center container-c3 text-center"
        style={{ paddingTop: "6rem", paddingBottom: "6rem" }}
      >
        {/* H1 — word-by-word stagger, Bricolage display font */}
        <h1 className="display-hero text-white mb-16 md:mb-20">
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
