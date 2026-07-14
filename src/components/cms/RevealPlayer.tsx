"use client";

import { useEffect } from "react";
import { stampReveals } from "@/lib/reveal";

/**
 * Website Editor v6 — R6 (6b): the entrance-reveal player.
 *
 * Reads the per-element animation map (HomeContent.anim / globals.anim), stamps
 * `data-anim` onto each addressed element (composite tile → its data-cms-bg
 * container), then reveals them on viewport-enter via IntersectionObserver. Adds
 * `c3-anim-ready` to <html> ONLY when it actually runs, so animations.css never
 * hides content before/without JS. Honors prefers-reduced-motion (stamps for the
 * editor's benefit but skips hiding/observing, and the CSS guard forces visible).
 */
export default function RevealPlayer({ anim }: { anim?: Record<string, string> }) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    // Stamp data-anim so the editor's chosen presets are visible in the DOM either way.
    stampReveals(document, anim);

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-anim]"));
    if (reduce || !("IntersectionObserver" in window) || targets.length === 0) return;

    const root = document.documentElement;
    root.classList.add("c3-anim-ready");
    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("c3-revealed");
            obs.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    targets.forEach((el) => io.observe(el));
    return () => {
      io.disconnect();
      root.classList.remove("c3-anim-ready");
    };
  }, [anim]);

  return null;
}
