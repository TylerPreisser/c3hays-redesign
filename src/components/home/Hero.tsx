"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: "easeOut" as const, delay },
  }),
};

export default function Hero() {
  // min-h-dvh: iOS Safari 100vh bug fix — dvh accounts for the collapsible
  // address bar so the hero fills the actual visible viewport height.
  // Falls back to 100svh then 100vh for older browsers.
  return (
    <section
      className="relative flex flex-col justify-end overflow-hidden"
      style={{ minHeight: "100dvh" }}
    >
      {/* Full-bleed background image with Ken Burns */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-2.webp"
          alt="Congregation gathered in worship"
          fill
          className="object-cover animate-ken-burns"
          priority
          quality={90}
        />
        {/* Multi-layer gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(10,31,46,0.97) 0%, rgba(10,31,46,0.75) 35%, rgba(10,31,46,0.35) 65%, rgba(10,31,46,0.15) 100%)",
          }}
        />
        {/* Top navy gradient for header legibility */}
        <div
          className="absolute top-0 left-0 right-0 h-40"
          style={{
            background:
              "linear-gradient(to bottom, rgba(10,31,46,0.65) 0%, transparent 100%)",
          }}
        />
      </div>

      {/* Hero content — pt adds clearance for fixed header + Dynamic Island safe area.
          calc() ensures the content never overlaps the header regardless of safe-area size. */}
      <div
        className="relative z-10 container-c3 pb-20 md:pb-28 lg:pb-36"
        style={{ paddingTop: "calc(8rem + env(safe-area-inset-top))" }}
      >
        <div className="max-w-3xl">
          {/* Overline */}
          <motion.p
            className="overline text-[#d4a056] mb-5"
            variants={fadeUp}
            custom={0.1}
            initial="hidden"
            animate="visible"
          >
            {"—"} Welcome Home
          </motion.p>

          {/* Main headline */}
          <motion.h1
            className="display-hero text-white text-balance mb-7"
            variants={fadeUp}
            custom={0.25}
            initial="hidden"
            animate="visible"
          >
            We exist to{" "}
            <em className="not-italic text-[#d4a056]">meet</em> Him,{" "}
            <br className="hidden sm:block" />
            grow in Him,{" "}
            <br className="hidden sm:block" />
            and{" "}
            <em className="not-italic text-[#d4a056]">serve</em> through Him.
          </motion.h1>

          {/* Subhead */}
          <motion.p
            className="body-lg text-white/70 max-w-lg mb-10"
            variants={fadeUp}
            custom={0.4}
            initial="hidden"
            animate="visible"
          >
            Jesus is central to everything we do at C3 — a church family for
            everyone in Hays and Colby, Kansas.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-wrap gap-3"
            variants={fadeUp}
            custom={0.55}
            initial="hidden"
            animate="visible"
          >
            <Link href="/visit/" className="btn btn-gold btn-lg">
              Plan Your Visit
            </Link>
            <Link href="/watch/" className="btn btn-outline btn-lg">
              Watch Online
            </Link>
          </motion.div>
        </div>

        {/* Service times pill row — horizontal scroll on narrow viewports.
            overflow-x-auto + no-scrollbar keeps it tidy on iOS/Android.
            -mx/px trick extends the scroll area to the container edge. */}
        <motion.div
          className="mt-14 -mx-6 sm:mx-0"
          variants={fadeUp}
          custom={0.7}
          initial="hidden"
          animate="visible"
        >
          <div
            className="flex gap-3 overflow-x-auto px-6 sm:px-0 sm:flex-wrap pb-1"
            style={{
              scrollbarWidth: "none",        /* Firefox */
              msOverflowStyle: "none",       /* IE/Edge */
              WebkitOverflowScrolling: "touch",
            }}
          >
            {serviceTimes.map((s) => (
              <div
                key={s.label}
                className="card-glass px-4 py-2.5 flex items-center gap-3 shrink-0"
                style={{ borderRadius: "9999px" }}
              >
                <span className="w-2 h-2 rounded-full bg-[#d4a056] shrink-0" />
                <span className="text-xs font-medium text-white/70 whitespace-nowrap">{s.label}</span>
                <span className="text-xs text-white/50 whitespace-nowrap">{s.times}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <div className="flex flex-col items-center gap-2 text-white/35">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}

const serviceTimes = [
  { label: "Hays · Sat", times: "5:00 PM" },
  { label: "Hays · Sun", times: "8:00 · 9:30 · 11:00 AM" },
  { label: "Colby · Sun", times: "10:00 AM" },
];
