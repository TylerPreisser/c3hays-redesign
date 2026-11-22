#!/usr/bin/env bash
# STAGING deploy of the public site: Worker `c3hays-live-staging` at https://c3hays-staging.preissersolutions.com.
# It reads the Studio STAGING Worker through the CMS service binding and is public (no Access: Studio's editor canvas
# frames it), but tells search engines to stay out. Never touches the production Worker `c3hays-live`. Three commands:
#   build <sha>        no remote write. Clean detached worktree of <sha>, npm ci, tsc, `cf:build` with the staging
#                      origins, `wrangler deploy --dry-run --env staging`, then scripts/smoke-workerd.mjs (the built Worker
#                      under workerd). Writes BUILD_ID = <sha>-<UTC> beside the worktree; the sha is re-read from the built tree.
#   rollout <worktree> remote write. Prints the rollback command first, then `wrangler deploy --env staging`.
#   verify <BUILD_ID>  fetches the live address: 200 on / /news /locations/hays /search, 404 on an unknown path, x-c3-build = BUILD_ID,
#                      X-Robots-Tag noindex, robots.txt disallow-all, frame-ancestors = Studio staging only.
# From this PC (ALLOW_DEPLOY=1 on rollout is the owner's say-so for STAGING ONLY):
#   export CLOUDFLARE_ACCOUNT_ID=af76b8aeaa433c3fd3c17ce77375062f
#   bash scripts/deploy-staging.sh build <sha>
#   ALLOW_DEPLOY=1 python3 ~/.claude/tools/secrets.py env CLOUDFLARE_API_TOKEN_PREISSER:CLOUDFLARE_API_TOKEN -- bash scripts/deploy-staging.sh rollout <worktree>
#   bash scripts/deploy-staging.sh verify <BUILD_ID>
set -euo pipefail
REPO="$(cd "$(dirname "$0")/.." && pwd)"
URL="${STAGING_URL:-https://c3hays-staging.preissersolutions.com}"
STUDIO="https://c3-studio-staging.preissersolutions.com"
die() { echo "FATAL: $*" >&2; exit 1; }

# The Worker name wrangler resolves for --env staging; anything but c3hays-live-staging (above all c3hays-live) stops the run.
resolved_name() {
  (cd "$1" && node -e "import('wrangler').then(w=>{const c=w.unstable_readConfig({config:'wrangler.jsonc',env:'staging'},{});process.stdout.write(c.name||'')})")
}
guard_name() {
  local n; n="$(resolved_name "$1")"
  [ "$n" != "c3hays-live" ] || die "env staging resolves to the PRODUCTION Worker c3hays-live: refusing"
  [ "$n" = "c3hays-live-staging" ] || die "env staging resolves to '$n', expected c3hays-live-staging: refusing"
}

cmd_build() {
  local SHA_ARG="${1:?usage: deploy-staging.sh build <sha>}" SHA BASE WT BUILD_ID BUILT
  git -C "$REPO" fetch -q origin
  SHA="$(git -C "$REPO" rev-parse --verify --quiet "${SHA_ARG}^{commit}" || true)"
  [ -n "$SHA" ] || die "$SHA_ARG is not a commit"
  BASE="$(mktemp -d)"; WT="$BASE/c3site-staging-${SHA:0:8}"
  git -C "$REPO" worktree add --detach "$WT" "$SHA" >/dev/null
  cd "$WT"
  npm ci --no-audit --no-fund > "$BASE/npm-ci.log" 2>&1 || { cat "$BASE/npm-ci.log"; exit 1; }
  guard_name "$WT"
  npx --no-install tsc --noEmit
  # The id is named from the tree about to be built (HEAD of the worktree, read now) and re-checked after the build.
  BUILD_ID="$(git rev-parse HEAD)-$(date -u +%Y%m%dT%H%M%SZ)"
  CMS_LIVE=1 SITE_NOINDEX=1 SITE_BUILD_ID="$BUILD_ID" STUDIO_ORIGIN="$STUDIO" NEXT_PUBLIC_STUDIO_ORIGIN="$STUDIO" NEXT_PUBLIC_CMS_URL="$STUDIO" \
    npm run cf:build > "$BASE/build.log" 2>&1 || { tail -60 "$BASE/build.log"; exit 1; }
  [ -f .open-next/worker.js ] || die "build left no .open-next/worker.js"
  # Static files (/_next/static, images) are answered by the assets binding, not by Next: give them the no-index header too.
  printf '/*\n  X-Robots-Tag: noindex, nofollow\n' > .open-next/assets/_headers
  BUILT="$(git rev-parse HEAD)"
  case "$BUILD_ID" in "$BUILT"-*) ;; *) die "built tree is $BUILT, build id says $BUILD_ID" ;; esac
  [ "$BUILT" = "$SHA" ] || die "built tree is $BUILT, requested $SHA"
  npx --no-install wrangler deploy --dry-run --env staging --outdir "$BASE/dist" > "$BASE/dry.log" 2>&1 || { cat "$BASE/dry.log"; exit 1; }
  node "$REPO/scripts/smoke-workerd.mjs" --dir "$WT" --env staging --port "${SMOKE_PORT:-4641}" > "$BASE/smoke.log" 2>&1 || { cat "$BASE/smoke.log"; die "the built Worker failed under workerd: no rollout"; }
  cat "$BASE/smoke.log"
  printf '%s\n' "$BUILD_ID" > "$BASE/build-id"
  echo "== built $BUILD_ID in $WT (no remote write)"
  echo "== ROLLOUT, its own command: ALLOW_DEPLOY=1 python3 ~/.claude/tools/secrets.py env CLOUDFLARE_API_TOKEN_PREISSER:CLOUDFLARE_API_TOKEN -- bash \"$REPO/scripts/deploy-staging.sh\" rollout \"$WT\""
}

cmd_rollout() {
  local WT="${1:?usage: deploy-staging.sh rollout <worktree from build>}" BASE BUILD_ID
  [ -f "$WT/.open-next/worker.js" ] || die "$WT is not a built worktree"
  WT="$(cd "$WT" && pwd)"; BASE="$(dirname "$WT")"
  [ -f "$BASE/build-id" ] || die "no build-id beside $WT: run build first"
  BUILD_ID="$(cat "$BASE/build-id")"
  [ -n "${CLOUDFLARE_ACCOUNT_ID:-}" ] && [ -n "${CLOUDFLARE_API_TOKEN:-}" ] || die "CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN must be set in the environment"
  [[ "$CLOUDFLARE_ACCOUNT_ID" =~ ^[0-9a-f]{32}$ ]] || die "CLOUDFLARE_ACCOUNT_ID is not 32 hex"
  case "$BUILD_ID" in "$(git -C "$WT" rev-parse HEAD)"-*) ;; *) die "build-id $BUILD_ID does not start with this worktree's sha" ;; esac
  guard_name "$WT"
  cd "$WT"
  echo "== rollback (returns c3hays-live-staging to its previous version): ( cd \"$WT\" && npx wrangler rollback --env staging --message 'rollback $BUILD_ID' )"
  npx --no-install wrangler deploy --env staging --tag "${BUILD_ID:0:25}" --message "$BUILD_ID"
  echo "== deployed c3hays-live-staging $BUILD_ID"
  echo "== VERIFY, its own command: bash scripts/deploy-staging.sh verify $BUILD_ID"
}

header_of() { grep -i "^$1:" "$2" | tail -1 | sed -e 's/^[^:]*: *//' -e 's/\r$//' || true; }

cmd_verify() {
  local ID="${1:?usage: deploy-staging.sh verify <BUILD_ID>}" T code p attempt csp
  T="$(mktemp -d)"; trap "rm -rf '$T'" EXIT
  for attempt in 1 2 3 4 5 6 7 8; do
    code="$(curl -sS -L --max-time 30 -o "$T/h.body" -D "$T/h.head" -w '%{http_code}' "$URL/" || echo 000)"
    [ "$code" = 200 ] && [ "$(header_of x-c3-build "$T/h.head")" = "$ID" ] && break
    echo "attempt $attempt: / -> $code, x-c3-build '$(header_of x-c3-build "$T/h.head")'"
    [ "$attempt" = 8 ] && die "the live page is not build $ID"
    sleep 10
  done
  echo "ok: / -> 200, x-c3-build $ID"
  [ "$(header_of x-c3-content "$T/h.head")" = "studio" ] || die "x-c3-content is '$(header_of x-c3-content "$T/h.head")', not 'studio': the site cannot read Studio and is serving its built-in content"
  echo "ok: x-c3-content studio (the site reads Studio)"
  grep -q 'turnstileSiteKey\\":\\"[A-Za-z0-9_-][A-Za-z0-9_-]*\\"' "$T/h.body" || die "the signup form carries no Turnstile site key (TURNSTILE_SITE_KEY is empty), so signup shows no widget"
  echo "ok: the signup form carries a Turnstile site key"
  for p in /news /locations/hays /search; do
    code="$(curl -sS -L --max-time 30 -o /dev/null -w '%{http_code}' "$URL$p")"; [ "$code" = 200 ] || die "$p -> $code"; echo "ok: $p -> 200"
  done
  for p in /nope-xyz /nope/xyz; do
    code="$(curl -sS -L --max-time 30 -o /dev/null -w '%{http_code}' "$URL$p")"; [ "$code" = 404 ] || die "unknown path $p -> $code (expected 404)"; echo "ok: $p -> 404"
  done
  code="$(curl -sS -L --max-time 30 -o "$T/m.body" -D "$T/m.head" -w '%{http_code}' "$URL/media/site/no-such-upload.png")"
  [ "$code" = 404 ] && grep -qi '^content-type: text/plain' "$T/m.head" || die "/media/<missing name> -> $code (expected the media route's plain 404)"
  echo "ok: /media/<missing name> -> 404 from the media route"
  [ "$(header_of x-robots-tag "$T/h.head")" = "noindex, nofollow" ] || die "X-Robots-Tag missing on /"
  echo "ok: X-Robots-Tag noindex, nofollow"
  p="$(curl -sS --max-time 30 "$URL/" | grep -o '/_next/static/[^"]*\.js' | head -1)"; [ -n "$p" ] || die "no static asset found on /"
  [ "$(curl -sSI --max-time 30 "$URL$p" | grep -i '^x-robots-tag:' | tr -d '\r' | sed 's/^[^:]*: *//')" = "noindex, nofollow" ] || die "X-Robots-Tag missing on the static asset $p"
  echo "ok: X-Robots-Tag on the static asset $p"
  curl -sS --max-time 30 "$URL/robots.txt" | grep -q '^Disallow: /$' || die "robots.txt is not disallow-all"
  echo "ok: robots.txt disallow-all"
  csp="$(header_of content-security-policy "$T/h.head")"
  [[ "$csp" == *"frame-ancestors $STUDIO;"* || "$csp" == *"frame-ancestors $STUDIO" ]] || die "frame-ancestors is not exactly $STUDIO"
  echo "ok: frame-ancestors $STUDIO"
}

case "${1:-}" in
  build) shift; cmd_build "$@" ;;
  rollout) shift; cmd_rollout "$@" ;;
  verify) shift; cmd_verify "$@" ;;
  *) echo "usage: deploy-staging.sh build <sha> | rollout <worktree> | verify <BUILD_ID>" >&2; exit 2 ;;
esac
