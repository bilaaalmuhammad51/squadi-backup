#!/usr/bin/env bash
#
# Builds the full GitHub Pages site (_site/) that is published to the
# "gh-pages" branch, while preserving per-run history.
#
# History lives in the gh-pages BRANCH itself (git storage), NOT in an Actions
# artifact - so the report publishes even when the Actions artifact storage
# quota is full. Each run restores the previous site from the checked-out
# gh-pages branch (PREV_SITE_DIR), adds its own report under
# emulator/<run_number>/, prunes anything older than RETENTION_DAYS, rebuilds
# an index, and the workflow then pushes _site back to gh-pages.
#
# Required env:
#   RUN_NUMBER        - github.run_number (this run's unique id)
# Optional:
#   GITHUB_WORKSPACE  - checkout dir containing allure-report/ (default: pwd)
#   PREV_SITE_DIR     - dir holding the previous gh-pages branch content
#                       (default: gh-pages-prev). Missing/empty = start fresh.
#   RETENTION_DAYS    - days of reports to keep (default 3)

set -uo pipefail

: "${RUN_NUMBER:?RUN_NUMBER is required}"
WORKSPACE="${GITHUB_WORKSPACE:-$(pwd)}"
RETENTION_DAYS="${RETENTION_DAYS:-3}"
PREV_SITE_DIR="${PREV_SITE_DIR:-gh-pages-prev}"

cd "$WORKSPACE"
rm -rf _site
mkdir -p _site/emulator

# 1. Restore the previously accumulated site from the checked-out gh-pages
#    branch content (if any). This is git storage, not an Actions artifact.
if [ -d "${PREV_SITE_DIR}" ] && [ -n "$(ls -A "${PREV_SITE_DIR}" 2>/dev/null | grep -v '^\.git$' || true)" ]; then
  echo "Restoring previous site from ${PREV_SITE_DIR}"
  # Copy everything except the branch's own .git metadata.
  rsync -a --exclude '.git' "${PREV_SITE_DIR}/" _site/ 2>/dev/null \
    || cp -r "${PREV_SITE_DIR}/." _site/
  rm -rf _site/.git
else
  echo "No previous gh-pages content - starting fresh"
fi
mkdir -p _site/emulator

# 2. Add this run's report under its own immutable path.
rm -rf "_site/emulator/${RUN_NUMBER}"
mkdir -p "_site/emulator/${RUN_NUMBER}"
cp -r "${WORKSPACE}/allure-report/." "_site/emulator/${RUN_NUMBER}/"
date +%s > "_site/emulator/${RUN_NUMBER}/.published-at"

# 3. Prune run folders older than RETENTION_DAYS.
#
# A folder with no .published-at marker is treated as stale and pruned. Older
# runs uploaded before include-hidden-files was set lost their markers in the
# artifact round-trip; without this they would never age out. This run's own
# folder always has a fresh marker (written in step 2), so it is never at risk.
now="$(date +%s)"
cutoff=$(( RETENTION_DAYS * 86400 ))
for dir in _site/emulator/*/; do
  [ -d "$dir" ] || continue
  marker="${dir}.published-at"
  ts=0
  [ -f "$marker" ] && ts="$(cat "$marker" 2>/dev/null || echo 0)"
  if [ "$ts" -le 0 ]; then
    echo "Pruning $dir (no age marker)"
    rm -rf "$dir"
    continue
  fi
  age=$(( now - ts ))
  if [ "$age" -gt "$cutoff" ]; then
    echo "Pruning $dir (age $(( age / 86400 ))d > ${RETENTION_DAYS}d)"
    rm -rf "$dir"
  fi
done

# 4. Rebuild the combined root index listing BOTH sections (emulator +
#    browserstack) so a daily run doesn't drop the BrowserStack links that the
#    weekly workflow added to the shared site.
touch _site/.nojekyll
{
  echo '<!doctype html><meta charset="utf-8"><title>Squadi Test Reports</title>'
  echo '<h1>Squadi Test Reports</h1>'
  if ls -1d _site/emulator/*/ >/dev/null 2>&1; then
    echo '<h2>Emulator (daily)</h2><ul>'
    for d in $(ls -1d _site/emulator/*/ 2>/dev/null | sed 's#_site/emulator/##; s#/##' | sort -nr); do
      echo "<li><a href=\"./emulator/${d}/\">Run #${d}</a></li>"
    done
    echo '</ul>'
  fi
  for plat in android ios; do
    if ls -1d "_site/browserstack/$plat/"*/ >/dev/null 2>&1; then
      echo "<h2>BrowserStack - ${plat} (weekly)</h2><ul>"
      for d in $(ls -1d "_site/browserstack/$plat/"*/ 2>/dev/null | sed "s#_site/browserstack/$plat/##; s#/##" | sort -nr); do
        echo "<li><a href=\"./browserstack/${plat}/${d}/\">Run #${d}</a></li>"
      done
      echo '</ul>'
    fi
  done
} > _site/index.html

echo "Assembled site. Reports currently retained:"
ls -1d _site/emulator/*/ 2>/dev/null | sed 's#_site/emulator/##; s#/##' | sort -nr
