#!/usr/bin/env bash
# THIS REPO'S CI GATE: .github/workflows/ci.yml step for step (npm ci; tsc --noEmit; CMS_LIVE=1 npm run build --
# the production SSR shape), run by the canonical runner (_workspace/tools/ci-local/run.sh, through the global
# pre-push hook) inside a CLEAN worktree ($WT). The first failing step ends the gate, as the workflow stops. Keep it in step with ci.yml, which stays in the repo on workflow_dispatch
# only (workspace CLAUDE.md §4a). Unit tests are not in ci.yml (they borrow the sibling c3-backend toolchain), so
# they are not here either. deploy.yml is a deploy workflow, not CI, and is not mirrored.
CI_NODE=22
ci_steps() {
  run npm-ci . npm ci --no-audit --no-fund
  run typecheck . npx tsc --noEmit
  run build . env CMS_LIVE=1 npm run build
  [ -f "$WT/.next/BUILD_ID" ] || { echo "next build left no .next/BUILD_ID" >> "$LOG"; return 1; }
}
ci_summary() { printf 'tsc clean; SSR build %s' "$(cat "$WT/.next/BUILD_ID" 2>/dev/null)"; }
