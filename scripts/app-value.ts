/**
 * Prints a single value from the active app profile, so shell scripts and CI
 * workflows can ask the profile instead of hardcoding per-app names.
 *
 *   APP=Basketball ./node_modules/.bin/tsx scripts/app-value.ts binaries.apk
 *   -> basketball-qa.apk
 */
import { App } from "../tests/config/apps";

const path = process.argv[2];

if (!path) {
  console.error("Usage: tsx scripts/app-value.ts <dotted.path>");
  process.exit(2);
}

const value = path
  .split(".")
  .reduce<any>((acc, key) => (acc == null ? acc : acc[key]), App);

if (value === undefined || value === null) {
  console.error(`No value at "${path}" for app "${App.key}"`);
  process.exit(1);
}

process.stdout.write(String(value));
