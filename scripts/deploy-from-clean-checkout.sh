#!/usr/bin/env bash
# Deploy a commit that is already on origin/main and green on ci-local, from a clean scratch worktree.
# Production is the Cloudflare Worker `c3hays-live` (wrangler.jsonc), built and shipped with OpenNext
# (`npm run cf:build`, then `wrangler deploy`). Build and rollout are separate commands below.
# .github/workflows/deploy.yml stays as the manual fallback. Workspace CLAUDE.md §4a.
# Usage: _workspace/tools/deploy.sh <repo dir> <sha> [--dry-run]   (the launcher exports the vault CLOUDFLARE_API_TOKEN;
#        this script is FATAL without it and never uses a wrangler login).
#   --dry-run  every gate, npm ci, the wrangler pin, tsc and the full OpenNext build; Cloudflare is only READ (whoami,
#              deployments list); prints the rollback target and what it would roll out; touches nothing in production.
# Rollback: the serving version id is recorded BEFORE the rollout and the exact command is printed.
set -euo pipefail

SHA_ARG=""; DRY=0
for a in "$@"; do
  case "$a" in
    --dry-run) DRY=1 ;;
    -*) echo "unknown flag: $a (usage: deploy-from-clean-checkout.sh <sha on origin/main> [--dry-run])" >&2; exit 2 ;;
    *) [ -z "$SHA_ARG" ] || { echo "only one sha" >&2; exit 2; }; SHA_ARG="$a" ;;
  esac
done
[ -n "$SHA_ARG" ] || { echo "usage: deploy-from-clean-checkout.sh <sha on origin/main> [--dry-run]" >&2; exit 2; }
REPO="$(cd "$(dirname "$0")/.." && pwd)"
GH_REPO="TylerPreisser/c3hays-redesign"
LIVE_URL="https://c3hays-live.tylerpreisser.workers.dev/"
CMS_URL="https://c3-studio.tylerpreisser.workers.dev"
export CLOUDFLARE_ACCOUNT_ID="${CLOUDFLARE_ACCOUNT_ID:-af76b8aeaa433c3fd3c17ce77375062f}"

[ -n "${CLOUDFLARE_API_TOKEN:-}" ] || { echo "FATAL: CLOUDFLARE_API_TOKEN is not set; run through _workspace/tools/deploy.sh (it exports the vault token), never a wrangler login" >&2; exit 1; }

REFUSALS=0
refuse() {
  if [ "$DRY" = 1 ]; then echo "DRY-RUN would refuse: $*" >&2; REFUSALS=$((REFUSALS + 1)); else echo "FATAL: $*" >&2; exit 1; fi
}
[ "$DRY" = 1 ] && echo "== DRY RUN: nothing will be changed in production"

# One deployer at a time (house Deploying rule).
LOCK="${TMPDIR:-/tmp}/c3hays-redesign-deploy.lock"
exec 9>"$LOCK"
flock -n 9 || { echo "FATAL: another c3hays-redesign deploy holds $LOCK; one deployer at a time" >&2; exit 1; }

git -C "$REPO" fetch -q origin main
SHA="$(git -C "$REPO" rev-parse "${SHA_ARG}^{commit}")"
git -C "$REPO" merge-base --is-ancestor "$SHA" origin/main || refuse "$SHA is not on origin/main (push it first)"
# CI is the ci-local commit status (CLAUDE.md, Deploying). A sha without a green one does not ship.
# TylerPreisser's token explicitly: the gh active account can flip to another login on this PC.
GH_TOKEN="$(gh auth token --user TylerPreisser 2>/dev/null || true)"; export GH_TOKEN
STATUS_LINE="$(gh api "repos/$GH_REPO/commits/$SHA/status" --jq '[.statuses[] | select(.context=="ci-local")][0] | "\(.state)\t\(.description)"' 2>/dev/null || true)"
STATE="${STATUS_LINE%%$'\t'*}"
if [ "$STATE" = "success" ]; then
  echo "ci-local green for $SHA: ${STATUS_LINE#*$'\t'}"
else
  refuse "$SHA has no green ci-local status (found '${STATE:-none}'); run _workspace/tools/ci-local/run.sh --repo c3hays-redesign --status $SHA and wait for it"
fi
unset GH_TOKEN

SCRATCH="$(mktemp -d)"
WT="$SCRATCH/c3hays-deploy"
git -C "$REPO" worktree add --detach "$WT" "$SHA" >/dev/null
cleanup() { git -C "$REPO" worktree remove --force "$WT" >/dev/null 2>&1 || true; rm -rf "$SCRATCH"; }
trap cleanup EXIT

cd "$WT"
echo "== building $SHA from $WT"
npm ci --no-audit --no-fund > "$SCRATCH/npm-ci.log" 2>&1 || { cat "$SCRATCH/npm-ci.log"; exit 1; }

# Wrangler must be the exact version the lockfile pins, not whatever a range resolves to.
WANT="$(node -p 'require("./package-lock.json").packages["node_modules/wrangler"].version')"
HAVE="$(node -p 'require("wrangler/package.json").version')"
[ "$WANT" = "$HAVE" ] || { echo "FATAL: wrangler $HAVE installed, lockfile pins $WANT; not deploying" >&2; exit 1; }

npx tsc --noEmit
# The build step (separate from the rollout): the production SSR shape, then the OpenNext Worker bundle.
CMS_LIVE=1 NEXT_PUBLIC_CMS_URL="$CMS_URL" npm run cf:build > "$SCRATCH/cf-build.log" 2>&1 || { tail -60 "$SCRATCH/cf-build.log"; exit 1; }
[ -f .next/BUILD_ID ] || { echo "FATAL: build left no .next/BUILD_ID; not deploying" >&2; exit 1; }
[ -f .open-next/worker.js ] || { echo "FATAL: build left no .open-next/worker.js; not deploying" >&2; exit 1; }

# The version tag names the tree that was actually built: read HEAD now, after the build, and refuse a
# tree that is not the requested sha or that the build changed.
BUILT="$(git rev-parse HEAD)"
[ "$BUILT" = "$SHA" ] || { echo "FATAL: built tree is $BUILT, expected $SHA; not deploying" >&2; exit 1; }
[ -z "$(git status --porcelain)" ] || { echo "FATAL: the build changed tracked files; not deploying" >&2; git status --short >&2; exit 1; }
TAG="${BUILT:0:12}-$(date -u +%Y%m%dT%H%M%SZ)"
BUILD_ID="$(cat .next/BUILD_ID)"
echo "== built $BUILT (Next build id $BUILD_ID); rolling out as $TAG"

# ---- prove the token and record the rollback target BEFORE rolling out ---------------------------------------------------
npx --no-install wrangler whoami > "$SCRATCH/whoami.txt" 2>&1 || true
grep -q "$CLOUDFLARE_ACCOUNT_ID" "$SCRATCH/whoami.txt" || { echo "FATAL: the Cloudflare token cannot see account $CLOUDFLARE_ACCOUNT_ID" >&2; cat "$SCRATCH/whoami.txt" >&2; exit 1; }
echo "cloudflare token ok for account $CLOUDFLARE_ACCOUNT_ID"
npx --no-install wrangler deployments list --name c3hays-live --json > "$SCRATCH/deployments.json"
ROLLBACK_VERSION="$(python3 - "$SCRATCH/deployments.json" <<'PY'
import json, sys
d = json.load(open(sys.argv[1]))
if not d:
    print(""); sys.exit(0)
cur = max(d, key=lambda x: x.get("created_on", ""))
vs = cur.get("versions") or []
print(max(vs, key=lambda v: v.get("percentage", 0))["version_id"] if vs else "")
PY
)"
[ -n "$ROLLBACK_VERSION" ] || { echo "FATAL: cannot read the serving version from 'wrangler deployments list --json'; no rollback target, not deploying" >&2; exit 1; }
PREV_PAGE="$(curl -sS --max-time 30 "$LIVE_URL" || true)"   # a variable, not a pipe into grep: pipefail + early exit = EPIPE
PREV_ID="$(grep -o '"b":"[^"]*"' <<<"$PREV_PAGE" | head -1 || true)"
ROLLBACK="CLOUDFLARE_ACCOUNT_ID=$CLOUDFLARE_ACCOUNT_ID python3 \$HOME/.claude/tools/secrets.py env PS_ADMIN_ENV.cloudflare_api_token:CLOUDFLARE_API_TOKEN -- npx --no-install wrangler rollback $ROLLBACK_VERSION --name c3hays-live -y -m 'rollback from $TAG'   # run inside a checkout of the repo (node_modules installed)"
echo "ROLLBACK target: version $ROLLBACK_VERSION (serving now at $LIVE_URL; page build marker ${PREV_ID:-unknown})"
echo "ROLLBACK command: $ROLLBACK"
if [ "$DRY" = 1 ]; then
  echo "== DRY RUN: would run: wrangler deploy --tag $TAG --message 'deploy $TAG'"
  echo "== DRY RUN: would then require $LIVE_URL to answer 200 with Next build id $BUILD_ID"
  echo "DRY-RUN COMPLETE for $BUILT (build $BUILD_ID): $REFUSALS gate(s) would refuse; nothing was deployed. Serving now: version $ROLLBACK_VERSION"
  exit 0
fi

# The rollout (separate command): the Worker bundle `cf:build` just made, shipped by the pinned wrangler, tagged.
# This is what `npm run cf:deploy` runs for this repo (OpenNext's deploy only wraps `wrangler deploy`; there is no
# incremental or tag cache to populate, see open-next.config.ts), but it does not forward --tag, so call wrangler.
npx --no-install wrangler deploy --tag "$TAG" --message "deploy $TAG"

# A 200 alone is also returned by the previous version: the served HTML must carry THIS build's id.
for attempt in 1 2 3 4 5 6 7 8 9 10 11 12; do
  status="$(curl -sS -o "$SCRATCH/live.html" -w '%{http_code}' "$LIVE_URL" || echo 000)"
  if [ "$status" = "200" ] && grep -qF "$BUILD_ID" "$SCRATCH/live.html"; then
    echo "$LIVE_URL -> $status, serving build $BUILD_ID ($TAG)"
    echo "ROLLBACK: $ROLLBACK"
    exit 0
  fi
  echo "attempt $attempt: status $status, build $BUILD_ID not served yet"
  sleep 10
done
echo "FATAL: $LIVE_URL did not serve build $BUILD_ID within 120s (last status $status)" >&2
echo "ROLLBACK: $ROLLBACK" >&2
exit 1
