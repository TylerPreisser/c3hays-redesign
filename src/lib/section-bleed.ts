/**
 * v6 R5/§1.6 — inter-section gradient BLEED for dark "moment" sections.
 *
 * The seamless canvas is light; a dark section that hard-cuts into it reads as a
 * block. Instead, each dark "moment" owns its OWN top+bottom fade: the section's
 * vertical edges fade to `transparent` (so the fixed light canvas shows through)
 * and ease into the solid dark toward the middle — a soft gradient entry/exit,
 * not a hard edge (§1.6 "dark moments entered via gradient, not a hard cut").
 *
 * SELF-CONTAINED + REORDER-SAFE: the bleed lives on the dark section itself, so
 * it eases in/out regardless of which section lands adjacent — no page.tsx
 * adjacency logic. STATIC (a plain gradient, no animation) so it's inherently
 * prefers-reduced-motion safe. A per-section bgFill override (buildBgCss
 * `!important`) still replaces the whole background, so "Custom" bg wins as before.
 *
 * The edge band is smaller than every dark section's vertical padding
 * (clamp(96px,10vw,160px) via .section, or ~clamp(80px,10vw,160px) here), so the
 * heading always sits in the solid-dark zone — legibility is never at risk.
 */
export function bleedBg(dark: string, edge = "clamp(72px, 9vw, 120px)"): string {
  return `linear-gradient(180deg, transparent 0, ${dark} ${edge}, ${dark} calc(100% - ${edge}), transparent 100%)`;
}
