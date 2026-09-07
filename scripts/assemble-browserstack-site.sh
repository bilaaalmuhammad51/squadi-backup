#!/usr/bin/env bash
#
# Builds the full GitHub Pages site (_site/) for the BrowserStack workflow,
# sharing ONE accumulated site with the emulator workflow so their reports
# coexist (nothing is wiped). Mirrors scripts/assemble-allure-site.sh.
#
# Every BrowserStack run (weekly schedule OR manual dispatch) publishes its own
# unique report under browserstack/<platform>/<run#>/ - just like the emulator's
# emulator/<run#>/. The whole site is carried forward as the "pages-site"
# artifact: this run restores it, adds its report, prunes browserstack runs
# older than RETENTION_DAYS, and rebuilds the combined root index. The workflow
# then deploys _site and re-uploads it as pages-site.
#
# Required env:
#   GH_TOKEN          - token with actions:read (the workflow GITHUB_TOKEN)
#   GITHUB_REPOSITORY - owner/repo
#   GITHUB_WORKSPACE  - checkout dir containing allure-report/
#   PLATFORM          - android | ios
#   RUN_NUMBER        - github.run_number (this run's unique id)
# Optional:
#   RETENTION_DAYS    - days of BrowserStack reports to keep (default 30)

set -uo pipefail

: "${GH_TOKEN:?GH_TOKEN is required}"
: "${GITHUB_REPOSITORY:?GITHUB_REPOSITORY is required}"
: "${PLATFORM:?PLATFORM is required}"
: "${RUN_NUMBER:?RUN_NUMBER is required}"
WORKSPACE="${GITHUB_WORKSPACE:-$(pwd)}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"

cd "$WORKSPACE"
rm -rf _site
mkdir -p _site

# 1. Restore the shared accumulated site (emulator + any prior browserstack
#    reports) from the latest "pages-site" artifact.
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
mkdir -p "_site/browserstack/${PLATFORM}"

# 2. Add this run's report under its own immutable path.
rm -rf "_site/browserstack/${PLATFORM}/${RUN_NUMBER}"
mkdir -p "_site/browserstack/${PLATFORM}/${RUN_NUMBER}"
cp -r "${WORKSPACE}/allure-report/." "_site/browserstack/${PLATFORM}/${RUN_NUMBER}/"
date +%s > "_site/browserstack/${PLATFORM}/${RUN_NUMBER}/.published-at"

# 3. Prune browserstack run folders older than RETENTION_DAYS (both platforms).
now="$(date +%s)"
cutoff=$(( RETENTION_DAYS * 86400 ))
for dir in _site/browserstack/*/*/; do
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
#    browserstack) so this run preserves the emulator links in the shared site.
{
  echo '<!doctype html><meta charset="utf-8"><title>Mobile Test Reports</title>'
  echo '<h1>Mobile Test Reports</h1>'
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

echo "Assembled site. Published browserstack/${PLATFORM}/${RUN_NUMBER}/. Sections present:"
ls -1d _site/emulator/*/ _site/browserstack/*/*/ 2>/dev/null || true