# Active - c3hays-redesign            updated 2026-11-21T01:00Z by the 2026-11-20 revival session
## Goal
Owner, 2026-11-20: bring the C3 repos up to current standards and ready to be worked on. This repo is the
church's rebuilt public website. With `CMS_LIVE=1` it reads its content live from C3 Studio, so staff edit the
site without a redeploy. The whole-project map lives in the private `c3-backend` repo (`docs/PROJECT-MAP.md`).
## State (verified 2026-11-20)
- House-standards pass and Next 16.4.6 are on main (PR #3); the gated sha is the `ci-local` status on main's tip.
  The gate now runs typecheck, the 247 unit tests, the SSR build, a production dependency audit and the
  regression bed.
- Live: Worker `c3hays-live`, on its workers.dev address only. Last deployment 2026-09-16
  (`wrangler deployments list --name c3hays-live`, read 2026-11-20). main is ahead of what is live.
- The church's real website is separate and untouched by this repo.
- Remote branches: main only. The abandoned `infra/claude-setup` branch is kept as tag `archive/infra/claude-setup`.
## Next
1. First real run of `scripts/deploy-from-clean-checkout.sh <sha>` for main's tip, watched end to end (the
   script has only been proven on its refusal path). Needs the owner's go.
2. The events page still embeds a third-party calendar (`src/app/events/page.tsx`); move it to Studio's events
   when the owner decides the cutover.
3. The visit, connect and counseling forms still post to the church's current system; the cutover is the
   owner's decision.
## Blocked / waiting
- Cutover decisions (forms, events calendar, custom domain): the owner, open since 2026-08.
## Not doing
- Pointing the church's domain at this Worker without the owner's say-so.
