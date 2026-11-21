# c3hays-redesign

Public website for Celebration Community Church (Hays). Next.js 16 + React 19 + Tailwind 4, Node 22, TypeScript.
Production is the Cloudflare Worker `c3hays-live` (OpenNext), reading live content from the C3 Studio editor.

## Commands
- Dev: `npm run dev`. Typecheck: `npx tsc --noEmit`. Lint: `npm run lint`. Tests: `npm test` (vitest, `tests/`).
- Build (production SSR shape): `CMS_LIVE=1 npm run build`. Worker bundle: `npm run cf:build`.
- Boot + smoke: after the build, `CMS_LIVE=1 npx next start -p 3999`, then `curl -s -o /dev/null -w '%{http_code}' localhost:3999/` returns 200.
- Gate: `scripts/ci-steps.sh` (run by the global pre-push hook). Deploy: `scripts/deploy-from-clean-checkout.sh <sha>`
  (a sha on `main` with a green `ci-local` status; `deploy.yml` is the manual fallback). Never deploy without sign-off.

## Agent instructions
<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- agent-kit -->
Agent instructions for this repo live in `CLAUDE.md` (read it in full); settled decisions in `DECISIONS/` (or the nearest parent's). Conformance to an Accepted ADR is never a defect.
A reviewer may block only with cited code; objections to a settled decision go in a non-blocking "Decision Concerns" section citing the ADR. Never run a live deploy without explicit human say-so.

## Settled decisions — see DECISIONS/

`DECISIONS/` is the source of truth for settled intent; review agents read it before reviewing.
Walk up from the working directory to find it (a parent workspace may own it).

- **Conformance to an Accepted ADR is NEVER a defect.** Do not "fix", re-add, or recommend re-adding what an ADR removed.
- **If you believe a settled decision is wrong, DO NOT change code or file a bug** — put a note under "Decision Concerns" in your review output citing the ADR number. Nothing more.
- **Accepted ADRs are immutable — supersede, never edit.** New decision = next number; the old file gets one line: `Status: Superseded by ADR-000N`.
- Deterministic gates live in `.claude/hooks/` (live-deploy block, ADR/secret protection); this file is advisory, the hooks are not.

### Record decisions as they happen — do not wait to be asked
When the owner settles a question, WRITE THE ADR IMMEDIATELY as `Status: Accepted`, then say in
one line what you recorded and its number. Do not ask permission first.
- **Settled** = he picks between real alternatives, reverses something previously settled, or
  rules a course of action in or out. Architecture, libraries, schemas, boundaries, security
  posture, scope, workflow and tooling all count.
- **Not settled** = task direction ("fix this bug"), questions, thinking aloud, an option still
  being weighed. If he has not landed on it, there is nothing to record.
- Next free `NNNN`, never reused; start from `DECISIONS/0000-template.md`. Quote what he actually
  said and cite where. Say under "Open / not yet decided" what the ADR does NOT settle.
- A wrong capture is fixed by SUPERSEDING, not editing (that write needs `ADR_SUPERSEDE=1`).
- `/decide` forces a capture on demand; the rule above is automatic and does not need it.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
