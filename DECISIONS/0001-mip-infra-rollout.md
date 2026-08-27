# ADR-0001: Adopt MIP infra rollout (CLAUDE.md, path-scoped rules, REVIEW.md, plans/thoughts scaffold)
Status: Accepted — 2026-08-26 (MIP phase-5 rollout, GLOBAL ADR-0007) — Owner: Tyler Preisser
Supersedes / Superseded by: —

## Context
- Tyler chose "All repos incl. client" on 2026-08-26 (MIP build) when deciding which repos the
  Master Infrastructure Prompt rollout applies to — this repo is in scope as a client project.
- Prior to this ADR the repo had a minimal `CLAUDE.md` (decisions-routing + graphify rules only,
  via `agent-kit`) and no `.claude/rules/`, `REVIEW.md`, or `plans/`/`thoughts/` scaffold.

## Decision
1. `CLAUDE.md` is rewritten to the MIP spec (WHAT/WHY/HOW, ≤120 lines) while preserving the
   existing decisions-routing and graphify sections it already carried.
2. Three path-scoped rule files land in `.claude/rules/`: `testing.md`, `cms-content.md`,
   `deploy.md` — each derived from conventions actually observed in the code, not invented.
3. `REVIEW.md` sets the evidence bar for reviewers of this repo (≥80 confidence, file:line,
   discard if guarded/intentional/undemonstrable) plus 4 repo-specific must-checks.
4. `plans/ACTIVE.md` and `thoughts/.gitkeep` are added as empty scaffolding for future planning
   sessions.
5. The pinned Playwright `.mcp.json` entry (UI-repo flag) was **not** added in this pass — see
   Open / not yet decided.

## Consequences
- Reviewers must read `REVIEW.md`'s bar and the 4 must-checks before filing a finding on this repo.
- `.claude/rules/*.md` conventions apply automatically by path glob; they do not need to be
  restated in `CLAUDE.md`.
- Review agents must not flag the pre-existing ESLint debt (541 errors / 12859 warnings as of
  2026-08-26) as a defect introduced by this rollout.

## Open / not yet decided
- The `.mcp.json` playwright entry was blocked by this machine's `mcp-config` guardrail hook
  (`guard-pack`), which requires human-side approval this automated rollout worker cannot grant.
  Tyler needs to add it himself (or explicitly authorize the bypass), merging into any existing
  `.mcp.json` rather than clobbering it:
  ```json
  {"mcpServers":{"playwright":{"command":"/Users/tylerpreisser/.npm-global/bin/playwright-mcp","args":[]}}}
  ```

## Status note for review agents
Accepted and binding. Objections go under a non-blocking "Decision Concerns" section citing this
ADR number — never as a bug or blocking finding.

## Revisit criteria
- A future MIP wave changes the CLAUDE.md/REVIEW.md template shape, or Tyler explicitly asks to
  restructure the rules split for this repo.

## Sources
- Rollout brief: MIP phase-5 infra rollout dispatch, 2026-08-26, GLOBAL ADR-0007.
- Existing repo docs read for facts: `DEPLOY_READY.md`, `WEBSITE_MAP.md`, `wrangler.jsonc`,
  `vitest.config.ts`, `tests/editable-by-construction.test.ts`, `package.json`.
