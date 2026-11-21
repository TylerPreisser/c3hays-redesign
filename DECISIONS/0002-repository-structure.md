# ADR-0002: Repository structure as inherited, adopted in the house-standards pass
Status: Accepted — 2026-11-20 (house-standards pass) — Owner: Tyler Preisser
Supersedes / Superseded by: —

## Context
- The repo grew without a recorded layout. `DECISIONS/0001-mip-infra-rollout.md` already holds number 0001, so this record takes the next free number rather than reusing it.
- This pass adopts the structure as it is today; nothing was moved.

## Decision
1. `src/app/` holds the Next.js App Router pages (one folder per route, `[slug]` for CMS pages, `section-preview` for the editor).
2. `src/components/` holds UI by area (`home/`, `layout/`, ...); `src/lib/` holds CMS access (`cms.ts`) and content helpers; `src/data/` holds static content; `src/providers/` holds React providers.
3. `tests/` holds the vitest suite, `regression/` the real-input regression bed, `scripts/` the gate (`ci-steps.sh`), the deploy script and screenshot tools.
4. Deploy config lives in `wrangler.jsonc`, `open-next.config.ts` and `.github/workflows/` (manual fallback only).
5. `DECISIONS/` is the ADR folder; the root `DECISIONS.md` is a legacy log and stays untouched.

## Consequences
- New code goes into these folders; moves are behaviour-preserving and alone in their PR.

## Revisit when
- A second app or package is added to the repo, or `src/components/` outgrows its area folders.
