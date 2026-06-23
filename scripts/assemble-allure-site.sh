#!/usr/bin/env bash
#
# Builds the full GitHub Pages site (_site/) for the native "GitHub Actions"
# Pages deployment, while preserving per-run history.
#
# actions/deploy-pages replaces the whole site each run, so to keep multiple
# per-run reports we carry the accumulated site forward as a workflow artifact
# named "pages-site": each run restores the previous one, adds its own report
# under emulator/<run_number>/, prunes anything older than RETENTION_DAYS, and
# rebuilds an index. The workflow then deploys _site and re-uploads it as the
# next run's "pages-site".
#
# Required env:
#   GH_TOKEN          - token with actions:read (the workflow GITHUB_TOKEN)
#   GITHUB_REPOSITORY - owner/repo
#   GITHUB_WORKSPACE  - checkout dir containing allure-report/
#   RUN_NUMBER        - github.run_number (this run's unique id)
# Optional:
#   RETENTION_DAYS    - days of reports to keep (default 3)

set -uo pipefail

: "${GH_TOKEN:?GH_TOKEN is required}"
: "${GITHUB_REPOSITORY:?GITHUB_REPOSITORY is required}"
: "${RUN_NUMBER:?RUN_NUMBER is required}"
WORKSPACE="${GITHUB_WORKSPACE:-$(pwd)}"
RETENTION_DAYS="${RETENTION_DAYS:-3}"

cd "$WORKSPACE"
rm -rf _site
mkdir -p _site/emulator

# 1. Restore the previously accumulated site from the latest "pages-site"
#    artifact (if any). The artifact's contents are the _site tree.
art_id="$(gh api "repos/${GITHUB_REPOSITORY}/actions/artifacts" --paginate \
  -q '[.artifacts[] | select(.name=="pages-site" and .expired==false)] | sort_by(.created_at) | last | .id' \
  2>/dev/null || true)"
if [ -n "${art_id:-}" ] && [ "${art_id}" != "null" ]; then
  echo "Restoring previous site from artifact ${art_id}"
  if gh api "repos/${GITHUB_REPOSITORY}/actions/artifacts/${art_id}/zip" > prev.zip 2>/dev/null; then
    unzip -q -o prev.zip -d _site || echo "Could not unzip previous site (starting fresh)"
    rm -f prev.zip
  fi
else
  echo "No previous pages-site artifact - starting fresh"
fi
mkdir -p _site/emulator

# 2. Add this run's report under its own immutable path.
rm -rf "_site/emulator/${RUN_NUMBER}"
mkdir -p "_site/emulator/${RUN_NUMBER}"
cp -r "${WORKSPACE}/allure-report/." "_site/emulator/${RUN_NUMBER}/"
date +%s > "_site/emulator/${RUN_NUMBER}/.published-at"

# 3. Prune run folders older than RETENTION_DAYS.
now="$(date +%s)"
cutoff=$(( RETENTION_DAYS * 86400 ))
for dir in _site/emulator/*/; do
  [ -d "$dir" ] || continue
  marker="${dir}.published-at"
  ts=0
  [ -f "$marker" ] && ts="$(cat "$marker" 2>/dev/null || echo 0)"
  age=$(( now - ts ))
  if [ "$ts" -gt 0 ] && [ "$age" -gt "$cutoff" ]; then
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
