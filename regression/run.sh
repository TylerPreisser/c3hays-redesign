#!/bin/sh
# Replays every entry in bed.txt. Oracle failures fail; characterization changes only print.
set -u
cd "$(dirname "$0")/.."
rc=0
while read -r kind entry; do
  [ -z "$kind" ] && continue
  case "$kind" in \#*) continue ;; esac
  # dispatch per kind, e.g.:  vitest) npx vitest run "$entry" || rc=1 ;;
  case "$kind" in
    vitest) npx vitest run "$entry" || rc=1 ;;
    *) echo "regression: unknown kind '$kind' for '$entry'"; rc=1 ;;
  esac
done < regression/bed.txt
exit $rc
