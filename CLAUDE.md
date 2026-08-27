@AGENTS.md

# c3hays-redesign

**WHAT:** Next.js marketing site for Celebration Community Church (Hays/Colby, KS). Ships to two
coexisting production targets from one codebase, switched only by env vars.

**WHY:** Static export (GitHub Pages) is the always-working fallback; SSR pulls live content from
the sibling C3 Studio CMS so staff can edit without a redeploy.

## Stack
Next.js 16.2.10 (App Router) · React 19.2.4 · TypeScript 5 (strict) · Tailwind CSS v4 (CSS-first
`@theme`) · GSAP 3.15 + ScrollTrigger, Framer Motion 12, Lenis 1.3 (smooth scroll, desktop only) ·
Vitest 3.2.7 · ESLint 9 (`eslint-config-next`) · wrangler 4 + `@opennextjs/cloudflare` for the
Worker deploy path.

## Commands
- `npm run dev` — Next dev server
- `npm run build` — static export (`CMS_LIVE` unset) → `out/`, what CI (`.github/workflows/deploy.yml`) ships to GitHub Pages
- `CMS_LIVE=1 NEXT_PUBLIC_CMS_URL=https://studio.c3hays.com npm run build` — SSR build for Vercel (`vercel.json` sets these automatically on Vercel)
- `npm run cf:build` / `cf:deploy` / `cf:preview` — OpenNext build + deploy to the Cloudflare Worker target (`wrangler.jsonc`, Worker name `c3hays-live`) — **live deploy, needs explicit go-ahead**
- `npm run lint` — ESLint (baseline has pre-existing debt: 541 errors / 12859 warnings as of 2026-08-26 — don't chase unrelated ones in an unrelated PR)
- `npx tsc --noEmit` — typecheck
- `npm run test` / `test:watch` — Vitest (one-shot / watch)

## Key directories
- `src/app/` — App Router routes; `src/app/page.tsx` tries CMS content first, falls back to hand-built sections
- `src/components/cms/` — renders CMS blocks; `src/components/{home,about,beliefs,events,...}` — hand-built fallback sections
- `src/lib/cms.ts` — CMS fetch: fail-soft, `cache: "no-store"`, 2.5s timeout, returns `null` when `NEXT_PUBLIC_CMS_URL` is empty (keeps static export safe)
- `src/data/*.ts` — typed static content (site, navigation, locations, beliefs, staff, news) — source of truth for the static-export target
- `DEPLOY_READY.md`, `C3_DESIGN_TOKENS.md`, `WEBSITE_MAP.md` — deploy-target detail, design tokens, content/route map; read before touching build config or the visual system

## Conventions
- **Editable-by-construction:** every `[data-cms-link]` element must contain a `[data-cms-link-label]`
  descendant, or the Studio editor collapses the whole card into one button label
  (`tests/editable-by-construction.test.ts`, `EditBridge.tsx:402`). Keep this shape in any new interactive/link component.
- One `next.config.ts` serves both targets (`output: cmsLive ? undefined : "export"`); never fork it — add another env-gated branch instead.
- On the Cloudflare Worker target, `CMS_LIVE` must be read at request time via `getCloudflareContext().env`, not `process.env` (empty on the Worker) — see `wrangler.jsonc` comments.
- Cross-Worker CMS calls use the `CMS` service binding, not `c3-studio`'s public `workers.dev` URL — a Worker→Worker subrequest to the public URL does not deliver the body.

## Domain terms
- **C3 Studio** — sibling CMS Worker this site pulls live content from (`NEXT_PUBLIC_CMS_URL` / the `CMS` service binding).
- **CMS_LIVE** — the one env flag switching static-export vs. SSR-from-Studio.
- Public production domain: celebratejesus.org / c3hays.com — cutover to any new host is a separate, gated decision (see `DECISIONS/`).

## Decisions & graphify
`DECISIONS/` (this repo) plus GLOBAL `~/.claude-shared/DECISIONS/` (wins on conflict) are the source
of truth for settled intent — read before reviewing; routing details in `AGENTS.md`. graphify-out/
holds the code knowledge graph — run `graphify query "<question>"` before raw grep for codebase
questions. GitHub MCP + Context7 are connected globally; no per-repo wiring needed.