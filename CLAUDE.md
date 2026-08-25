@AGENTS.md

## Settled decisions — see DECISIONS/

`DECISIONS/` is the source of truth for settled intent; review agents read it before reviewing.
Walk up from the working directory to find it (a parent workspace may own it).
- **Conformance to an Accepted ADR is NEVER a defect.** Do not "fix", re-add, or recommend re-adding what an ADR removed.
- **If you believe a settled decision is wrong, DO NOT change code or file a bug** — put a note under "Decision Concerns" in your review output citing the ADR number. Nothing more.
- **Accepted ADRs are immutable — supersede, never edit.** New decision = next number; the old file gets one line: `Status: Superseded by ADR-000N`.
- Deterministic gates live in `.claude/hooks/` (live-deploy block, ADR/secret protection); this file is advisory, the hooks are not.
