/**
 * v6 R6/§1.5 — reduced-motion guard, BUILT FRESH for c3hays (the repo had no
 * prefers-reduced-motion path; that motion commit lived in a different repo).
 *
 * The premium scroll reveals (GSAP ScrollTrigger + the <Reveal> primitive) must
 * honor the OS "reduce motion" setting: when true, content appears in its final
 * resting state with NO transform/opacity animation. Call this at the top of any
 * entrance-animation effect and bail early when it returns true.
 *
 * SSR-safe: returns false when `window`/`matchMedia` are unavailable so nothing
 * animates on the server and the first client paint is stable (no hydration flash).
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
