@AGENTS.md

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
