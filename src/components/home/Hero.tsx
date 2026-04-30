"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

/* Word-stagger easing — snappy pop-in */
const WORD_EASE = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  return (
    <section
      className="relative flex flex-col justify-end overflow-hidden"
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
        {/* Cinematic gradient overlay — dark at top for nav legibility,
            heavier at bottom for headline contrast */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,10,10,0.35) 0%, rgba(10,10,10,0.55) 60%, rgba(10,10,10,0.78) 100%)",
          }}
        />
      </div>

      {/* Hero content — bottom-left positioned */}
      <div
        className="relative z-10 container-c3 pb-20 md:pb-28 lg:pb-36"
        style={{ paddingTop: "calc(8rem + env(safe-area-inset-top))" }}
      >
        <div className="max-w-3xl">
          {/* Overline */}
          <motion.p
            className="overline mb-6"
            style={{ color: "rgba(255,255,255,0.6)", letterSpacing: "0.18em" }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            WELCOME HOME.
          </motion.p>

          {/* Headline — word-by-word stagger */}
          <h1 className="display-hero text-white mb-8" style={{ lineHeight: 1.05 }}>
            {/* Line 1 */}
            <span className="block">
              {"We exist to ".split(" ").map((word, wi) => (
                <motion.span
                  key={`l1-text-${wi}`}
                  className="inline-block mr-[0.25em]"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.8,
                    ease: WORD_EASE,
                    delay: 0.2 + wi * 0.06,
                  }}
                >
                  {word}
                </motion.span>
              ))}
              <motion.em
                className="not-italic"
                style={{ color: "#e53539" }}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: WORD_EASE, delay: 0.2 + 4 * 0.06 }}
              >
                meet
              </motion.em>
              <motion.span
                className="inline-block ml-[0.25em]"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: WORD_EASE, delay: 0.2 + 5 * 0.06 }}
              >
                Him,
              </motion.span>
            </span>

            {/* Line 2 */}
            <span className="block">
              {"grow in Him, and ".split(" ").filter(Boolean).map((word, wi) => (
                <motion.span
                  key={`l2-text-${wi}`}
                  className="inline-block mr-[0.25em]"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.8,
                    ease: WORD_EASE,
                    delay: 0.2 + (wi + 6) * 0.06,
                  }}
                >
                  {word}
                </motion.span>
              ))}
              <motion.em
                className="not-italic"
                style={{ color: "#e53539" }}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: WORD_EASE, delay: 0.2 + 11 * 0.06 }}
              >
                serve
              </motion.em>
              <motion.span
                className="inline-block ml-[0.25em]"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: WORD_EASE, delay: 0.2 + 12 * 0.06 }}
              >
                through Him.
              </motion.span>
            </span>
          </h1>

          {/* Subheading */}
          <motion.p
            className="text-white/70 mb-10 max-w-lg"
            style={{ fontSize: "1.125rem", lineHeight: 1.6 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.95 }}
          >
            Jesus is central to everything we do at C3 — a church family for
            everyone in Hays and Colby, Kansas.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 1.1 }}
          >
            <Link href="/visit/" className="btn btn-primary btn-lg">
              Plan Your Visit
            </Link>
            <Link href="/watch/" className="btn btn-outline btn-lg">
              Watch Online
            </Link>
          </motion.div>
        </div>

        {/* Service times — minimal text row */}
        <motion.div
          className="mt-14 flex flex-wrap gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 1.3 }}
        >
          {serviceTimes.map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-2"
            >
              <span
                className="w-1.5 h-1.5 shrink-0"
                style={{ background: "#e53539" }}
              />
              <span className="text-xs font-semibold uppercase tracking-widest text-white/60">
                {s.label}
              </span>
              <span className="text-xs text-white/40">{s.times}</span>
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
