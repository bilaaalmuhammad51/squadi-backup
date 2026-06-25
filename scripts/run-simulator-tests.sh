#!/usr/bin/env bash
#
# Runs the WDIO suite against a booted iOS Simulator using a local Appium
# server (XCUITest driver). Invoked from
# .github/workflows/ios-simulator-daily.yml on a macOS runner. Mirrors
# scripts/run-emulator-tests.sh (the Android version).

set -uo pipefail

APP="${APP:-Squadi}"
TEST_ENV="${TEST_ENV:-Dev}"
SPEC_PATH="${SPEC_PATH:-tests/specs/**/*.ts}"

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

# Build the --spec args. SPEC_PATH may be a single glob/file or a
# comma-separated list of files; WDIO needs each one as its own --spec.
SPEC_ARGS=()
IFS=',' read -ra _specs <<< "$SPEC_PATH"
for _s in "${_specs[@]}"; do
  _s="$(echo "$_s" | xargs)" # trim surrounding whitespace
  [ -n "$_s" ] && SPEC_ARGS+=(--spec "$_s")
done

# Execute the suite against the iOS Simulator. IOS_TARGET=simulator makes
# wdio.conf select the simulator capabilities; Appium boots the named device.
PLATFORM=ios ENV=local IOS_TARGET=simulator APP="$APP" TEST_ENV="$TEST_ENV" \
  ./node_modules/.bin/wdio run ./wdio.conf.ts "${SPEC_ARGS[@]}"
STATUS=$?

# Record the real WDIO result so later steps decide pass/fail from THIS.
echo "$STATUS" > "${GITHUB_WORKSPACE:-.}/wdio-exit-code.txt"

# Stop the Appium server and shut the simulators down so the job ends promptly.
kill "$APPIUM_PID" 2>/dev/null || true
xcrun simctl shutdown all 2>/dev/null || true

exit $STATUS
