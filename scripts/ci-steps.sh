#!/usr/bin/env bash
# THIS REPO'S CI GATE: .github/workflows/ci.yml step for step (npm ci; tsc --noEmit; CMS_LIVE=1 npm run build --
# the production SSR shape), run by the canonical runner (_workspace/tools/ci-local/run.sh, through the global
# pre-push hook) inside a CLEAN worktree ($WT). The first failing step ends the gate, as the workflow stops. Keep it in step with ci.yml, which stays in the repo on workflow_dispatch
# only (workspace CLAUDE.md §4a). The vitest suite (tests/) runs here too: it runs standalone on this repo's own
# lockfile (vitest ^3 is a devDependency, vitest.config.ts), unlike the old note in ci.yml. The dependency audit and
# the regression bed (regression/run.sh) are extra steps beyond ci.yml. deploy.yml is a deploy workflow, not CI,
# and is not mirrored.
CI_NODE=22
# Fallbacks for an older runner without the helper (hospital-membership scripts/ci-steps.sh does the same).
declare -f ci_vitest > /dev/null 2>&1 || ci_vitest() { [ "$1" = --no-bed ] && shift; npm run "$@"; }
ci_steps() {
  run npm-ci . npm ci --no-audit --no-fund
  run typecheck . npx tsc --noEmit
  run test . ci_vitest --no-bed test
  run build . env CMS_LIVE=1 npm run build
  [ -f "$WT/.next/BUILD_ID" ] || { echo "next build left no .next/BUILD_ID" >> "$LOG"; return 1; }
  run audit . npm audit --omit=dev --audit-level=high
  run regression-bed . bash regression/run.sh
  # Ready to switch on once `playwright` is an exact-version devDependency (then set PLAYWRIGHT_DIR=$WT in the step); today it runs in scripts/deploy-staging.sh build:
  # run csp-crawl . env PLAYWRIGHT_DIR="$WT" npm run check:csp
}
ci_summary() { printf 'tsc clean; SSR build %s' "$(cat "$WT/.next/BUILD_ID" 2>/dev/null)"; }
