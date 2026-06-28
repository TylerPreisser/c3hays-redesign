# WEBSITE_MAP.md — C3 (Celebration Community Church) Website

_Generated during the autonomous polish + reskin session. Source of truth for what exists, what is broken, and what is missing._

## Brand (derived from existing files — `src/data/site.ts`, `globals.css`)
- **Name:** Celebration Community Church · **Short:** C3 · **Domain (prod):** celebratejesus.org
- **Tagline:** "Welcome Home." · **Mission:** "Jesus is central to everything we do at C3. We exist to meet with Him, grow in Him, and serve through Him." (Meet · Grow · Serve)
- **Campuses:** Hays, KS (5790 230th Ave) + Colby, KS (1923 S Range) — multi-campus, NW Kansas.
- **Palette:** Ink `#1b1c1c`, Bone/white `#ffffff`, Mist `#f6f6f6`, and a single chromatic accent — **Teal `#1cc3af`** (soft `#4acfbf`, deep `#179c8c`). B&W + teal editorial system.
- **Type:** Hanken Grotesk (Google, `--font-hanken`) as display + sans. (Untitled Sans woff2 files present in `/public/fonts` + `_recon` but not currently wired; Hanken is the active face.)
- **Voice:** warm, plain, invitational, scripture-anchored. No hype.

## Stack
- **Next.js 16.2.4** (App Router, Turbopack) · **React 19.2** · **Tailwind CSS v4** (CSS-first `@theme` in `globals.css`)
- **Motion:** GSAP 3.15 + ScrollTrigger, Framer Motion 12, **Lenis 1.3** smooth scroll (desktop only; disabled on touch)
- **Output:** `output: "export"` → fully static `out/`. `trailingSlash: true`. `images.unoptimized: true`.
- **Deploy target (prod):** GitHub Pages (basePath `/c3hays-redesign` via `NEXT_PUBLIC_BASE_PATH` in CI) — **local build uses empty basePath → serves at root.** _This session is LOCAL ONLY; nothing deployed._

## Routes (13 pages, all static-prerendered, all return 200)
| Route | File | Notes |
|---|---|---|
| `/` | `app/page.tsx` | Home — Hero, Mission, MeetGrowServe (3-up), NT26Feature, Locations (2-up), StayConnected (4-up), Give |
| `/about` | `app/about/page.tsx` | Hero, two-col mission, "Our Values" 6-up, visit CTA |
| `/visit` | `app/visit/page.tsx` | Plan-a-visit |
| `/beliefs` | `app/beliefs/page.tsx` | Statement of faith (data: `beliefs.ts`) |
| `/locations` | `app/locations/page.tsx` | Campus index |
| `/locations/hays` | `app/locations/hays/page.tsx` | Hays campus detail |
| `/locations/colby` | `app/locations/colby/page.tsx` | Colby campus detail |
| `/messages` | `app/messages/page.tsx` | Sermon archive (links to Vimeo) |
| `/watch` | `app/watch/page.tsx` | Live + on-demand. **Was a live Vimeo `<iframe>` → replaced with labeled MOCK player this session.** |
| `/counseling` | `app/counseling/page.tsx` | Counselors (data: `counselors.ts`) |
| `/connect` | `app/connect/page.tsx` | Connect-card form (mock submit, `preventDefault`) |
| `/give` | `app/give/page.tsx` | Three ways to give + by-campus (Pushpay links) |
| `not-found` | `app/not-found.tsx` | Styled 404 (returns real 404 status) |

## Design system / components
- **Tokens:** `src/app/globals.css` `@theme` block — colors, type scale (`.display-hero/.display-1/2`, `.heading-1/2/3`, `.body-*`), `.container-c3`, `.section` (6/8/10rem rhythm), buttons (`.btn-*`, sharp 0-radius), cards, nav states, `.reveal`, Lenis hooks, form inputs. **Documented in `C3_DESIGN_TOKENS.md`.**
- **Layout:** `Header` (transparent→solid on scroll, mobile drawer), `Footer` (campus info + nav + newsletter + socials), `NewsletterForm`.
- **Home:** `Hero`, `MissionBlock`, `MeetGrowServe`, `NT26Feature`, `LocationsSection`, `StayConnected`, `GiveSection`.
- **Brand:** `Logo` (interlocked-C mark, light/dark variants in `/public/brand`).
- **Data layer:** `src/data/*` — `site`, `navigation`, `locations`, `beliefs`, `counselors`. Clean, typed, single-source.
- **Assets:** 10 brand photos in `/public/images` (hero-1/2, worship, congregation, gather, building, exterior, bg-1/2, nt26) — all webp.

## State at session start (production `out/` build)
- **Build:** clean (TypeScript + lint pass, 15/15 static pages).
- **Console errors:** **0** on every real page (a React hydration warning appears in `next dev` only — dev-only, see DECISIONS).
- **Failed requests:** **0 real** (the 350 `net::ERR_ABORTED` seen are benign aborted `<Link>` prefetches on page-close in the audit harness).
- **Horizontal overflow:** **0** defects at 390 / 834 / 1440.
- **Responsive / a11y:** mobile already hardened in a prior round (safe-area insets, 44px touch targets, `100dvh`, iOS zoom prevention — see `_recon/images/.claude/agent-memory/ui-mobile/`).

## Broken / to-fix (this session)
1. **`/watch` live Vimeo `<iframe>`** (`src="https://vimeo.com/event/1/embed"`, a placeholder) — loads a broken/black player and reaches an external service. → **Replaced with a labeled local MOCK live-stream player** (poster + state + no external calls). _Safety floor: external services mocked._
2. **Dev-only hydration warning** from `NewsletterForm` inline `style` (`max()` + invalid `bg-white/8`). Not present in prod, but cleaned up to a CSS class for correctness.
3. **Aesthetic:** unbalanced/empty vertical gaps and left-weighted sections (Give "by campus", Watch player void, About/Give bottom voids) — tightened toward intentional Apple-grade rhythm.

## Missing / invented tastefully
- **Content API contract:** the app references `/api/content` + `/api/content/sermons` (404 — backend not built this session). Documented as the shared content layer in DECISIONS; site renders against typed `src/data/*` as the stub/mock adapter so it lines up with a future admin backend.
- Sermon/stream media are mock (no real Vimeo/CDN in a local internal build).

## Run commands
```bash
cd "/Users/tylerpreisser/Projects/Coding Projects/c3hays-redesign"
npm install                 # deps (already installed)
npm run dev                 # live dev at http://localhost:3000 (Turbopack)
npm run build               # static export → ./out
node scripts/serve-out.mjs  # serve production ./out at http://localhost:4321 (stable; used for audits)
node scripts/shoot.mjs <label>   # Playwright audit: screenshots + console/overflow report → screenshots/<label>/
```
