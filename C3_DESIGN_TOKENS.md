# C3_DESIGN_TOKENS.md — Shared design system (single source of truth)

Per the platform contract, **tokens already exist** in `src/app/globals.css` (`@theme`), so they are treated as canonical. The website, app, and admin UI should all consume these. This file documents them so the other surfaces can mirror them exactly.

## Color
| Token | Value | Role |
|---|---|---|
| `--color-ink` | `#1b1c1c` | Primary text · dark sections |
| `--color-ink-soft` | `#2a2929` | Secondary dark surface |
| `--color-bone` | `#ffffff` | Primary background / white |
| `--color-mist` | `#f6f6f6` | Off-white surface (alternating sections) |
| `--color-haze` | `#f8f8f8` | Lightest tint |
| `--color-rule` / `--color-rule-soft` | `#cccccc` / `#c5c5c5` | Dividers |
| `--color-mute` | `#494a4a` | Muted text |
| **`--color-teal`** | **`#1cc3af`** | **Primary accent (the only chromatic color)** |
| `--color-teal-soft` | `#4acfbf` | Hover / lighter |
| `--color-teal-deep` | `#179c8c` | Pressed / darker |
| `--color-accent` / `--color-bg` / `--color-text` | teal / white / ink | Semantic aliases |

Discipline: **B&W + a single teal accent.** Accent is for CTAs and one or two emphasis words per section — never decoration.

## Typography
- Family: `--font-sans` / `--font-display` = **Hanken Grotesk** (`--font-hanken`), system fallback.
- Scale (clamped, fluid):
  - `.display-hero` 2.75→5rem / 600 / lh 1.05 / −0.025em
  - `.display-1` 2.5→3.75rem · `.display-2` 2.25→3.5rem / 600 / −0.02em
  - `.heading-1` 1.75→2.5rem · `.heading-2` 1.5→2rem · `.heading-3` 1.25→1.5rem
  - `.body-lg` 1.125rem · `.body-base` 1rem · `.body-sm` 0.9375rem (lh ~1.6)
  - `.overline` 0.75rem / 600 / 0.18em / uppercase (used sparingly)

## Spacing / layout
- `.container-c3` — max 1280px, fluid padding 1.5→3rem.
- `.section` vertical rhythm — 6rem (mobile) → 8rem (md) → 10rem (lg). **Generous, COTM-scale.**
- Radius: **0** everywhere (sharp-edged, COTM style). `--radius* = 0.25rem` defined but UI is square.

## Components
- **Buttons** `.btn` (uppercase, 0.1em tracking, 700, sharp): `.btn-primary` (teal), `.btn-outline` (white-on-dark), `.btn-outline-ink`, `.btn-hero-ghost` (translucent on hero), sizes `.btn-sm/.btn-lg`.
- **Cards** `.card` (flat, no shadow), `.card-glass` (translucent on dark).
- **Nav** `.nav-transparent` → `.nav-solid` on scroll; `.nav-link-underline` (teal grow-underline on hover).
- **Forms** `.input-c3` (bottom-border only, teal focus, ≥16px to stop iOS zoom), `.newsletter-input` (footer dark variant — added this session, replaces inline styles).
- **Links** `.arrow-link` (arrow nudges +4px on hover).

## Motion
- Easing house curve: `cubic-bezier(0.16, 1, 0.3, 1)` (reveals) and `cubic-bezier(0.33, 0, 0.19, 1)` (UI transitions).
- Primitives: `.reveal`/`.is-visible`, `.animate-fade-in-up`, `.animate-ken-burns` (20s hero), `.animate-pulse-dot`, `.img-reveal` (clip-path wipe). GSAP ScrollTrigger drives section reveals; Framer drives hero word-stagger; Lenis drives desktop smooth scroll.

## Motion contract for automated capture
Reveals start at `opacity:0` and play on scroll via ScrollTrigger synced to Lenis. **Trusted wheel events** (not synthetic `scrollTo`) are required to drive them — the audit harness (`scripts/shoot.mjs`) uses `page.mouse.wheel`. Real users are unaffected.
