#!/usr/bin/env bash
#
# Runs ONE SHARD of the WDIO suite against a booted Android emulator using a
# local Appium server. Invoked from .github/workflows/emulator-daily.yml inside
# the reactivecircus/android-emulator-runner "script" (which boots the emulator
# first). Kept as a single file because the runner executes each line of an
# inline "script" as a separate shell, which breaks multi-line constructs.
#
# Parallelism is achieved by running this script in a job MATRIX: shard i of N
# on its own runner, with its own emulator, its own Appium server and its own
# allure-results. Nothing is shared between shards at runtime, so no shard can
# see or disturb another shard's device, app install or session state. Which
# specs belong to this shard is decided by scripts/shard-specs.js.

set -uo pipefail

APP="${APP:-Squadi}"
TEST_ENV="${TEST_ENV:-Dev}"
SPEC_PATH="${SPEC_PATH:-tests/specs/**/*.ts}"
SHARD_INDEX="${SHARD_INDEX:-1}"
SHARD_TOTAL="${SHARD_TOTAL:-1}"
SHARD_MODE="${SHARD_MODE:-parallel}"

if [ "$SHARD_MODE" = "exclusive" ]; then
  echo "Running the EXCLUSIVE phase: specs that rewrite competition settings,"
  echo "serialised and grouped by the state each one needs."
else
  echo "Running shard ${SHARD_INDEX} of ${SHARD_TOTAL} (mode=${SHARD_MODE}, SPEC_PATH=${SPEC_PATH})"
fi

# Work out this shard's specs BEFORE booting anything else. If the suite has
# fewer specs than shards the tail shards legitimately get nothing to do -
# exit 0 rather than letting WDIO fail with "no specs found", which would
# report a green suite as failed.
# Resolve via a temp file, not a pipeline, so a genuine failure (a SPEC_PATH
# that matches nothing at all, a bad SHARD_INDEX) is reported as a failure
# instead of being flattened into the same empty list as a legitimately idle
# tail shard.
SHARD_LIST="$(mktemp)"
if ! SPEC_PATH="$SPEC_PATH" SHARD_INDEX="$SHARD_INDEX" SHARD_TOTAL="$SHARD_TOTAL" \
  SHARD_MODE="$SHARD_MODE" node scripts/shard-specs.js > "$SHARD_LIST"; then
  echo "Could not work out the specs for shard ${SHARD_INDEX}/${SHARD_TOTAL} (mode=${SHARD_MODE})"
  echo "1" > "${GITHUB_WORKSPACE:-.}/wdio-exit-code.txt"
  exit 1
fi

SHARD_SPECS=()
while IFS= read -r _line; do
  [ -n "$_line" ] && SHARD_SPECS+=("$_line")
done < "$SHARD_LIST"
rm -f "$SHARD_LIST"

if [ "${#SHARD_SPECS[@]}" -eq 0 ]; then
  echo "This shard has no specs to run - nothing to do."
  echo "0" > "${GITHUB_WORKSPACE:-.}/wdio-exit-code.txt"
  exit 0
fi

echo "This job will run ${#SHARD_SPECS[@]} spec(s):"
printf '  %s\n' "${SHARD_SPECS[@]}"

# Let the device settle after boot_completed. The launcher can still be warming
# up and throw a "Pixel Launcher isn't responding" ANR that overlays the app
# and breaks the first test. A short pause lets it finish coming up.
echo "Waiting for the device to settle after boot..."
adb wait-for-device
adb shell 'while [ "$(getprop sys.boot_completed)" != "1" ]; do sleep 1; done' || true

# Suppress Android's system "isn't responding" (ANR) / crash dialogs so they
# can't overlay the app and block the test. This is the key fix for smaller CI
# runners (e.g. private-repo 2-core runners) where System UI / the launcher
# briefly stalls during the app's heavy onboarding screen and Android would
# otherwise pop a blocking "System UI isn't responding" dialog.
adb shell settings put global hide_error_dialogs 1 || true
adb shell settings put secure anr_show_background 0 || true

sleep 20

# Dismiss any system ANR / "isn't responding" dialog so it can't cover the app.
# Tapping "Wait" (or sending keyevents) clears the modal if one is present.
if adb shell dumpsys window 2>/dev/null | grep -qiE "Application Not Responding|isn't responding|Wait"; then
  echo "System ANR dialog detected - dismissing it"
  adb shell input keyevent KEYCODE_DPAD_RIGHT || true
  adb shell input keyevent KEYCODE_ENTER || true
  adb shell input keyevent KEYCODE_BACK || true
fi
# Make sure the launcher is foregrounded and stable before tests start.
adb shell input keyevent KEYCODE_HOME || true

# Start a local Appium server on 127.0.0.1:4723 (matches the wdio local config)
npx appium --base-path / --log-timestamp --log appium.log &
APPIUM_PID=$!

# Wait for Appium to be ready (poll /status for up to 60s)
for i in $(seq 1 60); do
  if curl -sSf http://127.0.0.1:4723/status >/dev/null 2>&1; then
    echo "Appium is up"
    break
  fi
  if [ "$i" -eq 60 ]; then
    echo "Appium did not start within 60s"
    cat appium.log || true
    kill "$APPIUM_PID" 2>/dev/null || true
    exit 1
  fi
  sleep 1
done

# Build the --spec args. shard-specs.js already expanded SPEC_PATH and kept
# only this shard's files, so each one is passed as its own --spec.
SPEC_ARGS=()
for _s in "${SHARD_SPECS[@]}"; do
  SPEC_ARGS+=(--spec "$_s")
done

# Execute the suite locally against the booted emulator
PLATFORM=android ENV=local APP="$APP" TEST_ENV="$TEST_ENV" \
  ./node_modules/.bin/wdio run ./wdio.conf.ts "${SPEC_ARGS[@]}"
STATUS=$?

# Record the real WDIO result so later steps can decide pass/fail from THIS,
# not from the android-emulator-runner step's exit code. We hard-kill the
# emulator below, which makes the action exit non-zero even when tests passed,
# so the step outcome is not a reliable signal.
echo "$STATUS" > "${GITHUB_WORKSPACE:-.}/wdio-exit-code.txt"

# Stop the Appium server
kill "$APPIUM_PID" 2>/dev/null || true

# Tear the emulator down ourselves so the android-emulator-runner action's own
# shutdown has nothing left to wait on. Its teardown is known to hang for
# 10+ minutes when the emulator process doesn't exit cleanly; killing it here
# lets the job move straight on to the report/Slack steps and finish - whether
# we ran 1 spec or 10, and regardless of pass/fail.
echo "Tests finished (status $STATUS). Shutting the emulator down..."
# Hard-kill the emulator/qemu process directly. Do NOT run `adb kill-server`
# here - that breaks the action's own post-script adb calls and makes its
# teardown wait even longer. Just make the emulator process gone so the
# action's cleanup returns immediately.
adb emu kill 2>/dev/null || true
pkill -9 -f qemu 2>/dev/null || true
pkill -9 -f emulator 2>/dev/null || true
# Give the OS a moment to reap the processes before the action's teardown runs.
sleep 3
echo "Emulator processes after kill:"
pgrep -af qemu || echo "  (none)"

exit $STATUS
