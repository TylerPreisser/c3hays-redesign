#!/usr/bin/env bash
# Deploy a commit that is already on origin/main and green on ci-local, from a clean scratch worktree.
# Production is the Cloudflare Worker `c3hays-live` (wrangler.jsonc), built and shipped with OpenNext
# (`npm run cf:build`, then `wrangler deploy`). Build and rollout are separate commands below.
# .github/workflows/deploy.yml stays as the manual fallback. Workspace CLAUDE.md §4a.
# Usage: scripts/deploy-from-clean-checkout.sh <sha>
set -euo pipefail

SHA_ARG="${1:?usage: deploy-from-clean-checkout.sh <sha on origin/main>}"
REPO="$(cd "$(dirname "$0")/.." && pwd)"
GH_REPO="TylerPreisser/c3hays-redesign"
LIVE_URL="https://c3hays-live.tylerpreisser.workers.dev/"
CMS_URL="https://c3-studio.tylerpreisser.workers.dev"
export CLOUDFLARE_ACCOUNT_ID="${CLOUDFLARE_ACCOUNT_ID:-af76b8aeaa433c3fd3c17ce77375062f}"

git -C "$REPO" fetch -q origin main
SHA="$(git -C "$REPO" rev-parse "${SHA_ARG}^{commit}")"
git -C "$REPO" merge-base --is-ancestor "$SHA" origin/main || { echo "FATAL: $SHA is not on origin/main (push it first)" >&2; exit 1; }
# CI is the ci-local commit status (CLAUDE.md, Deploying). A sha without a green one does not ship.
STATE="$(gh api "repos/$GH_REPO/commits/$SHA/status" --jq '[.statuses[] | select(.context=="ci-local")][0].state' 2>/dev/null || true)"
[ "$STATE" = "success" ] || { echo "FATAL: $SHA has no green ci-local status (found '${STATE:-none}'); run _workspace/tools/ci-local/run.sh --repo c3hays-redesign --status $SHA and wait for it" >&2; exit 1; }

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

# The rollout (separate command): the Worker bundle `cf:build` just made, shipped by the pinned wrangler, tagged.
# This is what `npm run cf:deploy` runs for this repo (OpenNext's deploy only wraps `wrangler deploy`; there is no
# incremental or tag cache to populate, see open-next.config.ts), but it does not forward --tag, so call wrangler.
npx --no-install wrangler deploy --tag "$TAG" --message "deploy $TAG"

# A 200 alone is also returned by the previous version: the served HTML must carry THIS build's id.
for attempt in 1 2 3 4 5 6 7 8 9 10 11 12; do
  status="$(curl -sS -o "$SCRATCH/live.html" -w '%{http_code}' "$LIVE_URL" || echo 000)"
  if [ "$status" = "200" ] && grep -qF "$BUILD_ID" "$SCRATCH/live.html"; then
    echo "$LIVE_URL -> $status, serving build $BUILD_ID ($TAG)"
    exit 0
  fi
  echo "attempt $attempt: status $status, build $BUILD_ID not served yet"
  sleep 10
done
echo "FATAL: $LIVE_URL did not serve build $BUILD_ID within 120s (last status $status)" >&2
exit 1
