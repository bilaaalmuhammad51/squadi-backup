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

exit $STATUS
