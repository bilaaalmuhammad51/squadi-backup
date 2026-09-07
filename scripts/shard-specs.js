#!/usr/bin/env node
/**
 * Deterministically splits the suite's spec files across N parallel shards.
 *
 * WebdriverIO has no built-in sharding (that's a Playwright feature), and we
 * deliberately do NOT parallelise inside a single runner: one GitHub runner has
 * 2 cores and one emulator, so raising maxInstances would just make two sessions
 * fight over the same device. Instead each shard is its own job, on its own
 * runner, with its own emulator and its own Appium server - which is also why
 * shards cannot affect each other's device state at all.
 *
 * Usage:
 *   node scripts/shard-specs.js                 # prints this shard's spec files
 *   node scripts/shard-specs.js --count         # prints how many files matched
 *
 * Env:
 *   SPEC_PATH    glob (e.g. "tests/specs/ **\/*.ts") or comma-separated file list
 *   SHARD_INDEX  1-based index of this shard (default 1)
 *   SHARD_TOTAL  total number of shards (default 1)
 *
 * Output: one spec path per line, so callers can read it into an array.
 */
const fs = require("fs");
const path = require("path");

const SPEC_PATH = process.env.SPEC_PATH || "tests/specs/**/*.ts";
const SHARD_INDEX = parseInt(process.env.SHARD_INDEX || "1", 10);
const SHARD_TOTAL = parseInt(process.env.SHARD_TOTAL || "1", 10);

if (!Number.isInteger(SHARD_TOTAL) || SHARD_TOTAL < 1) {
  throw new Error(`SHARD_TOTAL must be a positive integer, got "${process.env.SHARD_TOTAL}"`);
}
if (!Number.isInteger(SHARD_INDEX) || SHARD_INDEX < 1 || SHARD_INDEX > SHARD_TOTAL) {
  throw new Error(`SHARD_INDEX must be between 1 and ${SHARD_TOTAL}, got "${process.env.SHARD_INDEX}"`);
}

/** Recursively lists every file under `dir` as a posix-style relative path. */
function walk(dir) {
  let out = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out = out.concat(walk(full));
    } else if (entry.isFile()) {
      out.push(full.split(path.sep).join("/"));
    }
  }

  return out;
}

/**
 * Turns a glob into a regex. Only the three forms this suite actually uses are
 * supported - `**` (any depth), `*` (anything but a slash) and `?` - which is
 * enough for SPEC_PATH and keeps this dependency-free.
 */
function globToRegExp(glob) {
  let re = "";

  for (let i = 0; i < glob.length; i++) {
    const ch = glob[i];

    if (ch === "*") {
      if (glob[i + 1] === "*") {
        // `**/` should also match zero directories, so the slash is optional.
        i++;
        if (glob[i + 1] === "/") i++;
        re += "(?:.*/)?";
      } else {
        re += "[^/]*";
      }
    } else if (ch === "?") {
      re += "[^/]";
    } else {
      re += ch.replace(/[.+^${}()|[\]\\]/g, "\\$&");
    }
  }

  return new RegExp(`^${re}$`);
}

/** Expands one SPEC_PATH entry (a glob or a literal path) to matching files. */
function expand(entry) {
  if (!entry.includes("*") && !entry.includes("?")) {
    return fs.existsSync(entry) ? [entry.split(path.sep).join("/")] : [];
  }

  // Walk from the deepest static directory prefix so we don't scan the repo
  // (and node_modules) for a pattern rooted at tests/specs.
  const segments = entry.split("/");
  const staticSegments = [];
  for (const segment of segments) {
    if (segment.includes("*") || segment.includes("?")) break;
    staticSegments.push(segment);
  }

  const root = staticSegments.join("/") || ".";
  if (!fs.existsSync(root)) return [];

  const pattern = globToRegExp(entry);
  return walk(root).filter((file) => pattern.test(file));
}

const matched = [
  ...new Set(
    SPEC_PATH.split(",")
      .map((entry) => entry.trim())
      .filter(Boolean)
      .flatMap(expand),
  ),
].sort();

if (matched.length === 0) {
  console.error(`No spec files matched SPEC_PATH="${SPEC_PATH}"`);
  process.exit(1);
}

if (process.argv.includes("--count")) {
  console.log(matched.length);
  process.exit(0);
}

// Round-robin over the SORTED list rather than handing each shard a contiguous
// block. Sorting groups specs by directory, and the directories are very
// uneven (team-sheet-permissions alone holds 20 of 71 specs), so contiguous
// blocks would leave one shard with the whole slow group. Round-robin spreads
// every directory evenly across all shards.
const mine = matched.filter((_, i) => i % SHARD_TOTAL === SHARD_INDEX - 1);

console.log(mine.join("\n"));
