"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

/* Word-stagger easing — snappy pop-in */
const WORD_EASE = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  return (
    <section
      className="relative flex items-center justify-center overflow-hidden"
      style={{ minHeight: "100dvh" }}
    >
      {/* Background image with Ken Burns */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-2.webp"
          alt="Congregation gathered in worship"
          fill
          className="object-cover animate-ken-burns"
          priority
          quality={90}
        />
        {/* Cinematic gradient overlay — darkened for legibility over bright sky */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.65) 100%)",
          }}
        />
      </div>

      {/* Hero content — fully centered */}
      <div
        className="relative z-10 container-c3 flex flex-col items-center text-center"
        style={{ paddingTop: "env(safe-area-inset-top)", paddingBottom: "6rem" }}
      >
        {/* H1 — word-by-word stagger on just two words */}
        <h1 className="display-hero text-white mb-5" style={{ lineHeight: 1.0 }}>
          {"Welcome Home.".split(" ").map((word, wi) => (
            <motion.span
              key={`hero-word-${wi}`}
              className="inline-block mr-[0.2em] last:mr-0"
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
          className="mb-10"
          style={{ fontSize: "1.125rem", lineHeight: 1.6, color: "rgba(255,255,255,0.82)" }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.5 }}
        >
          A church family in Hays &amp; Colby, Kansas.
        </motion.p>

        {/* CTAs — centered */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-4 mb-14"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.7 }}
        >
          <Link href="/visit/" className="btn btn-primary btn-lg">
            Plan Your Visit
          </Link>
          <Link href="/watch/" className="btn btn-outline btn-lg">
            Watch Online
          </Link>
        </motion.div>

        {/* Service times — single centered row */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 1.0 }}
        >
          {serviceTimes.map((s, i) => (
            <div key={s.label} className="flex items-center gap-2">
              {i > 0 && (
                <span
                  className="hidden sm:block w-px h-3 shrink-0"
                  style={{ background: "rgba(255,255,255,0.2)" }}
                />
              )}
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: "#10405D" }}
              />
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.75)" }}>
                {s.label}
              </span>
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
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
  { label: "Hays · Sat", times: "5:00 PM" },
  { label: "Hays · Sun", times: "8:00 · 9:30 · 11:00 AM" },
  { label: "Colby · Sun", times: "10:00 AM" },
];
