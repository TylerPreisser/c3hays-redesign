"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { assetPath } from "@/lib/asset-path";

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

      {/* ── Background — B&W worship moment with subtle gradient ── */}
      <div className="absolute inset-0 z-0">
        <Image
          src={assetPath("/images/worship.webp")}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover animate-ken-burns"
          style={{ objectPosition: "center 30%" }}
        />
        {/* Lighter overlay — image is already dark/B&W, no need to crush it */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.35) 40%, rgba(10,10,10,0.65) 100%)",
          }}
        />
      </div>

      {/* ── Hero content — centered both axes ── */}
      <div
        className="relative z-10 flex-1 flex flex-col items-center justify-center container-c3 text-center"
        style={{ paddingTop: "6rem", paddingBottom: "6rem" }}
      >
        {/* H1 — word-by-word stagger */}
        <h1 className="display-hero text-white" style={{ marginBottom: "clamp(4rem, 12vh, 10rem)" }}>
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

        {/* CTAs — small + spaced */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-6 md:gap-8"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.7 }}
        >
          <Link href="/visit/" className="btn btn-primary btn-sm">
            Plan Your Visit
          </Link>
          <Link href="/watch/" className="btn btn-hero-ghost btn-sm">
            Watch Live
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
