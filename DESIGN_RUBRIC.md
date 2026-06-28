# DESIGN_RUBRIC.md — C3 × (Church on the Move × Apple)

Every visual loop grades each screen 1–5 on these dimensions. **Target = 5/5 and zero defects.** A "premium church platform that feels like Apple designed it" — warm, human, spiritually weighty, flawless.

## Research distillation — current bar for premium faith / brand web
Studied: churchonthemove.com, Hillsong, Elevation, Life.Church, VOUS, plus Apple.com, Linear, Stripe, Vercel as the craft bar.
Concrete patterns that separate "great" from "templated":

1. **Commanding hero.** One full-bleed photo/video, one oversized confident headline, ≤2 CTAs, generous breathing room. No clutter. (Apple) + energy/invitation + service-time clarity. (COTM)
2. **Oversized refined typography.** Big display sizes, tight tracking on headlines (−0.02em), comfortable measure (60–75ch), real hierarchy. Type does the work, not boxes.
3. **Negative space is intentional, never accidental.** Space frames content; it never reads as "empty/unfinished." Every gap is balanced — no lone left-weighted block stranded beside dead space.
4. **Full-bleed, product-grade imagery.** Photography fills edges; gradients earn legibility; no gray placeholder rectangles, ever.
5. **Buttery scroll-triggered motion.** Reveals (fade/translate), subtle parallax, image clip-wipes, word-stagger headlines. Smooth (Lenis), never janky; always settles.
6. **Section rhythm.** Alternating light/mist/dark surfaces; consistent vertical scale; clear section "rooms." Each section has a job.
7. **Restrained palette + single accent.** B&W + one chromatic (teal). Accent used sparingly for emphasis/CTA, never decoration spam.
8. **Pixel-perfect alignment.** Shared grid/container; baseline-aligned; consistent gutters; nothing 1px off.
9. **Premium micro-interactions.** Hover states, underline grows, arrow nudges, image zoom-on-hover, focus rings. Everything that can be touched responds.
10. **Reverent calm.** Slow, confident pacing. Quiet luxury, not loud. Warmth through photography + copy, not effects.

## Scoring dimensions (1–5 each)
| # | Dimension | 5/5 means |
|---|---|---|
| D1 | **Hero impact** | Commanding headline + full-bleed image + clear CTA; cinematic, calm, on-brand. |
| D2 | **Typography** | Confident scale + hierarchy; tight display tracking; readable measure; no orphans/awkward wraps. |
| D3 | **Layout & negative space** | Balanced compositions; intentional space; **no stranded blocks beside dead space; no empty voids.** |
| D4 | **Imagery** | Full-bleed, well-cropped, gradient-legible; **zero gray placeholders.** |
| D5 | **Motion & interaction** | Smooth reveals/parallax; responsive hovers/focus; settles; no jank, no stuck-invisible content. |
| D6 | **Color & accent discipline** | B&W + teal only; accent purposeful; contrast AA+. |
| D7 | **Section rhythm** | Clear alternating rooms; consistent vertical scale; logical flow. |
| D8 | **Responsive integrity** | Flawless at 390 / 834 / 1440; zero overflow/overlap; touch targets ≥44px; safe-area aware. |
| D9 | **Polish / craft** | Pixel alignment, consistent gutters, no 1px slips, no broken/dead elements. |
| D10 | **Brand & spiritual weight** | Feels warm, human, reverent, unmistakably C3 — not a generic template. |

## Deterministic gates (must all pass every loop — binary)
- [ ] `npm run build` clean (TS + lint)
- [ ] 0 console errors (production `out/`)
- [ ] 0 real failed requests (external services mocked)
- [ ] 0 horizontal-overflow defects at all 3 breakpoints
- [ ] All internal links resolve; no 404s except the intentional not-found route
- [ ] Focus-visible rings present; images have alt text; AA contrast
