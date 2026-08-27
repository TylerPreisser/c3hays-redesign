---
paths: ["next.config.ts", "wrangler.jsonc", "vercel.json", ".github/workflows/**", ".env.example"]
---

# Deploy conventions — c3hays-redesign

- Three production paths share one `next.config.ts`: static export → GitHub Pages (default,
  `.github/workflows/deploy.yml`, untouched fallback), SSR → Vercel (`vercel.json` pins
  `CMS_LIVE=1` + `NEXT_PUBLIC_CMS_URL`), SSR → Cloudflare Worker (`npm run cf:build`/`cf:deploy`,
  `wrangler.jsonc`, Worker name `c3hays-live`). The switch is `output: cmsLive ? undefined :
  "export"` in `next.config.ts` — never fork the config per target; add another env-gated branch.
- `NEXT_PUBLIC_BASE_PATH` is GitHub-Pages-only (sub-path prefix); it must stay unset on Vercel and
  the Cloudflare Worker, both served at the domain root.
- The Cloudflare Worker target is deliberately scoped to `*.workers.dev` in Phase 1
  (`wrangler.jsonc` top comment) — the public church domain cutover is an explicit, separate,
  gated decision. Do not add a `routes`/`custom_domain` entry without that go-ahead.
- `.env.example` is committed and holds no secrets; real values stay in `.env*.local` (gitignored).
  Don't add a real secret to `.env.example` or to `wrangler.jsonc`'s `vars`.
- `npm run cf:deploy` and any push to `main` that triggers the Pages workflow are live-deploy
  actions — never run them without explicit sign-off, same as any other repo under GLOBAL ADR
  live-deploy gating.
