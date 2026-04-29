"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Prevent ScrollTrigger from recalculating on every iOS address bar resize
// (iOS collapses/expands the address bar constantly while scrolling, which would
// cause expensive layout recalculations and animation jumps without this flag)
ScrollTrigger.config({ ignoreMobileResize: true });

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Detect touch/mobile devices. On iOS Safari, Lenis smooth scroll
    // fights the native rubber-band overscroll bounce and causes jank.
    // Disabling Lenis on touch devices preserves native momentum scrolling
    // while still syncing ScrollTrigger via a minimal RAF loop.
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;

    if (isTouchDevice) {
      // On touch devices: skip Lenis, just run a minimal RAF for ScrollTrigger
      function rafLoop(time: number) {
        ScrollTrigger.update();
        // Convert GSAP time (seconds) to ms for consistency
        void time;
      }
      gsap.ticker.add(rafLoop);
      gsap.ticker.lagSmoothing(0);

      // Refresh ScrollTrigger after fonts + images settle
      ScrollTrigger.refresh();

      return () => {
        gsap.ticker.remove(rafLoop);
      };
    }

    // Desktop: full Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      // syncTouch disabled — we gate on isTouchDevice above, but be explicit.
      // (Lenis 1.3+ renamed smoothTouch → syncTouch.)
      syncTouch: false,
    });

    lenisRef.current = lenis;

    // Sync Lenis scroll position with GSAP ScrollTrigger on every frame
    lenis.on("scroll", ScrollTrigger.update);

    function rafLoop(time: number) {
      lenis.raf(time * 1000);
    }

    gsap.ticker.add(rafLoop);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(rafLoop);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
