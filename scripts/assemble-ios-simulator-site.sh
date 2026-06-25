#!/usr/bin/env bash
#
# Builds the full GitHub Pages site (_site/) for the iOS Simulator workflow,
# sharing ONE accumulated site with the emulator + BrowserStack workflows so
# all reports coexist. Mirrors scripts/assemble-allure-site.sh.
#
# Each run publishes its own report under ios-simulator/<run#>/. The whole site
# is carried forward via the "pages-site" artifact: restore it, add this run's
# report, prune folders older than RETENTION_DAYS, rebuild the combined index.
#
# Required env: GH_TOKEN, GITHUB_REPOSITORY, GITHUB_WORKSPACE, RUN_NUMBER
# Optional: RETENTION_DAYS (default 3)

set -uo pipefail

: "${GH_TOKEN:?GH_TOKEN is required}"
: "${GITHUB_REPOSITORY:?GITHUB_REPOSITORY is required}"
: "${RUN_NUMBER:?RUN_NUMBER is required}"
WORKSPACE="${GITHUB_WORKSPACE:-$(pwd)}"
RETENTION_DAYS="${RETENTION_DAYS:-3}"

cd "$WORKSPACE"
rm -rf _site
mkdir -p _site/ios-simulator

# 1. Restore the shared accumulated site from the latest "pages-site" artifact.
art_id="$(gh api "repos/${GITHUB_REPOSITORY}/actions/artifacts" --paginate \
  -q '[.artifacts[] | select(.name=="pages-site" and .expired==false)] | sort_by(.created_at) | last | .id' \
  2>/dev/null || true)"
if [ -n "${art_id:-}" ] && [ "${art_id}" != "null" ]; then
  echo "Restoring shared site from artifact ${art_id}"
  if gh api "repos/${GITHUB_REPOSITORY}/actions/artifacts/${art_id}/zip" > prev.zip 2>/dev/null; then
    unzip -q -o prev.zip -d _site || echo "Could not unzip previous site (starting fresh)"
    rm -f prev.zip
  fi
else
  echo "No previous pages-site artifact - starting fresh"
fi
touch _site/.nojekyll
mkdir -p _site/ios-simulator

# 2. Add this run's report under its own immutable path.
rm -rf "_site/ios-simulator/${RUN_NUMBER}"
mkdir -p "_site/ios-simulator/${RUN_NUMBER}"
cp -r "${WORKSPACE}/allure-report/." "_site/ios-simulator/${RUN_NUMBER}/"
date +%s > "_site/ios-simulator/${RUN_NUMBER}/.published-at"

# 3. Prune ios-simulator run folders older than RETENTION_DAYS.
now="$(date +%s)"
cutoff=$(( RETENTION_DAYS * 86400 ))
for dir in _site/ios-simulator/*/; do
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

# 4. Rebuild the combined root index listing ALL sections so this run preserves
#    the emulator + browserstack links in the shared site.
{
  echo '<!doctype html><meta charset="utf-8"><title>Squadi Test Reports</title>'
  echo '<h1>Squadi Test Reports</h1>'
  if ls -1d _site/emulator/*/ >/dev/null 2>&1; then
    echo '<h2>Android Emulator (daily)</h2><ul>'
    for d in $(ls -1d _site/emulator/*/ 2>/dev/null | sed 's#_site/emulator/##; s#/##' | sort -nr); do
      echo "<li><a href=\"./emulator/${d}/\">Run #${d}</a></li>"
    done
    echo '</ul>'
  fi
  if ls -1d _site/ios-simulator/*/ >/dev/null 2>&1; then
    echo '<h2>iOS Simulator (daily)</h2><ul>'
    for d in $(ls -1d _site/ios-simulator/*/ 2>/dev/null | sed 's#_site/ios-simulator/##; s#/##' | sort -nr); do
      echo "<li><a href=\"./ios-simulator/${d}/\">Run #${d}</a></li>"
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

echo "Assembled site. Published ios-simulator/${RUN_NUMBER}/."
