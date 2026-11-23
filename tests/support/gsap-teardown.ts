import { afterAll } from "vitest";

/**
 * GSAP's ScrollTrigger starts a 250 ms sync interval the moment a component module registers it in a browser-like
 * environment. It calls requestAnimationFrame, which no longer exists once a jsdom test file's environment is torn
 * down, so the late tick surfaced as an unhandled error (whether it did depended on machine load). The components
 * themselves already kill their triggers on unmount; the module-level interval is the part only a test needs to stop.
 */
afterAll(async () => {
  if (typeof window === "undefined") return;
  const { ScrollTrigger } = await import("gsap/ScrollTrigger");
  ScrollTrigger.killAll();
  try {
    ScrollTrigger.disable(true); // removes its listeners and clears the interval
  } catch {
    // ScrollTrigger was imported but never enabled in this file (no window handle yet): there is no interval to stop
  }
});
