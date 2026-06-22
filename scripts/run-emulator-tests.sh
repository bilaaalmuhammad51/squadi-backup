#!/usr/bin/env bash
#
# Runs the WDIO suite against a booted Android emulator using a local Appium
# server. Invoked from .github/workflows/emulator-daily.yml inside the
# reactivecircus/android-emulator-runner "script" (which boots the emulator
# first). Kept as a single file because the runner executes each line of an
# inline "script" as a separate shell, which breaks multi-line constructs.

set -uo pipefail

APP="${APP:-Squadi}"
TEST_ENV="${TEST_ENV:-Dev}"
SPEC_PATH="${SPEC_PATH:-tests/specs/**/*.ts}"

# Let the device settle after boot_completed. The launcher can still be warming
# up and throw a "Pixel Launcher isn't responding" ANR that overlays the app
# and breaks the first test. A short pause lets it finish coming up.
echo "Waiting for the device to settle after boot..."
adb wait-for-device
adb shell 'while [ "$(getprop sys.boot_completed)" != "1" ]; do sleep 1; done' || true
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

# Execute the suite locally against the booted emulator
PLATFORM=android ENV=local APP="$APP" TEST_ENV="$TEST_ENV" \
  ./node_modules/.bin/wdio run ./wdio.conf.ts --spec "$SPEC_PATH"
STATUS=$?

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
