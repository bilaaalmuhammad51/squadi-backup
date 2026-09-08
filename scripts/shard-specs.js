#!/usr/bin/env node
/**
 * Splits the suite across parallel shards WITHOUT letting specs corrupt each
 * other's server-side state.
 *
 * WebdriverIO has no built-in sharding (that's a Playwright feature), and we
 * deliberately do NOT parallelise inside a single runner: one GitHub runner has
 * 2 cores and one emulator, so raising maxInstances would just make two
 * sessions fight over the same device. Each shard is its own job, on its own
 * runner, with its own emulator and its own Appium server.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS IS MORE THAN A ROUND-ROBIN
 * ---------------------------------------------------------------------------
 * Device state is isolated by construction (separate emulators), and every
 * spec that mutates match data creates its own match via
 * MatchApiHelper.createMatch(). But `MatchApiHelper.updateCompetitionSettings`
 * is different: it PUTs the whole configuration of competition 239 - one
 * global record that the entire suite reads. A spec that flips
 * `gameTimeTrackingEnabled` to false (to assert the Starting Formation row is
 * hidden) makes every concurrently-running team-sheet spec see a missing
 * formation row and fail; and each of these specs resets the competition to
 * defaults when it finishes, clobbering whatever another shard had just set.
 *
 * That is measured, not theoretical: sequential run #95 was 103 passed / 5
 * failed, while the first naive 6-way parallel run (#70) was 82 passed / 23
 * failed + 3 broken - and the ~21 extra failures were almost entirely
 * team-sheet and team-officials specs, i.e. the readers of that global record.
 *
 * So specs are split into two populations:
 *   - PARALLEL-SAFE: never writes competition settings. Free to run on any
 *     shard, concurrently with anything else.
 *   - EXCLUSIVE: writes competition settings. These must not overlap with any
 *     other spec, so they run in a single dedicated job after the parallel
 *     phase, grouped so that specs needing the SAME competition state run
 *     back to back.
 *
 * Membership is DERIVED from the spec source (see readCompetitionState), not
 * hand-listed, so a newly added spec that touches competition settings is
 * classified automatically instead of silently reintroducing the bug.
 *
 * Balancing uses real measured durations from scripts/spec-weights.json
 * (harvested from a full sequential run) via longest-processing-time bin
 * packing. Specs range from 18s to 190s - an 8.6x spread - so balancing by
 * spec COUNT leaves the slowest shard far behind the others.
 *
 * Usage:
 *   node scripts/shard-specs.js              # this shard's spec files
 *   node scripts/shard-specs.js --count      # how many files matched
 *   node scripts/shard-specs.js --plan       # human-readable schedule
 *
 * Env:
 *   SPEC_PATH    glob or comma-separated file list
 *   SHARD_INDEX  1-based index of this shard (default 1)
 *   SHARD_TOTAL  number of parallel shards (default 1)
 *   SHARD_MODE   parallel (default) | exclusive | all
 *                  parallel  - parallel-safe specs only, this shard's bin
 *                  exclusive - the competition-settings specs, state-grouped
 *                  all       - everything, ignoring the split (SHARD_TOTAL=1
 *                              reproduces the old sequential behaviour)
 */
const fs = require("fs");
const path = require("path");

const SPEC_PATH = process.env.SPEC_PATH || "tests/specs/**/*.ts";
const SHARD_INDEX = parseInt(process.env.SHARD_INDEX || "1", 10);
const SHARD_TOTAL = parseInt(process.env.SHARD_TOTAL || "1", 10);
const SHARD_MODE = (process.env.SHARD_MODE || "parallel").toLowerCase();

if (!["parallel", "exclusive", "all"].includes(SHARD_MODE)) {
  throw new Error(`SHARD_MODE must be parallel|exclusive|all, got "${SHARD_MODE}"`);
}
if (!Number.isInteger(SHARD_TOTAL) || SHARD_TOTAL < 1) {
  throw new Error(`SHARD_TOTAL must be a positive integer, got "${process.env.SHARD_TOTAL}"`);
}
if (!Number.isInteger(SHARD_INDEX) || SHARD_INDEX < 1 || SHARD_INDEX > SHARD_TOTAL) {
  throw new Error(`SHARD_INDEX must be between 1 and ${SHARD_TOTAL}, got "${process.env.SHARD_INDEX}"`);
}

// ---------------------------------------------------------------------------
// Spec discovery
// ---------------------------------------------------------------------------

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
 * Turns a glob into a regex. Only the forms this suite actually uses are
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

// ---------------------------------------------------------------------------
// Conflict classification
// ---------------------------------------------------------------------------

/**
 * Returns the competition state a spec imposes on the shared competition
 * record, or null when it never writes one.
 *
 * A call with no options - updateCompetitionSettings(token) - is the "restore
 * defaults" teardown every one of these specs ends with. On its own that is
 * still a global write, so it counts: a bare restore landing mid-flight in
 * another shard is exactly what breaks that shard.
 */
function readCompetitionState(file) {
  const src = fs.readFileSync(file, "utf8");
  if (!src.includes("updateCompetitionSettings")) return null;

  const states = new Set();
  const withOptions = /updateCompetitionSettings\(\s*[A-Za-z_$][\w$]*\s*,\s*\{([^}]*)\}/g;

  let m;
  while ((m = withOptions.exec(src)) !== null) {
    const signature = m[1]
      .split(",")
      .map((part) => part.replace(/\s+/g, "").replace(/\/\/.*$/, ""))
      .filter(Boolean)
      .sort()
      .join(",");
    if (signature) states.add(signature);
  }

  // Writes the record but only ever to defaults.
  if (states.size === 0) return "defaults";

  return [...states].sort().join(" + ");
}

const state = new Map(matched.map((file) => [file, readCompetitionState(file)]));
const parallelSafe = matched.filter((f) => state.get(f) === null);
const exclusive = matched.filter((f) => state.get(f) !== null);

// Group the exclusive specs by the state they need so specs sharing a state
// run back to back. That does not make them parallel - they still run one
// after another on a single emulator - but it keeps the number of times the
// competition record is rewritten (and the backend has to settle) to one per
// group instead of one per spec.
exclusive.sort((a, b) => {
  const sa = state.get(a);
  const sb = state.get(b);
  return sa === sb ? a.localeCompare(b) : sa.localeCompare(sb);
});

// ---------------------------------------------------------------------------
// Weighted balancing
// ---------------------------------------------------------------------------

let WEIGHTS = {};
try {
  WEIGHTS = JSON.parse(
    fs.readFileSync(path.join(__dirname, "spec-weights.json"), "utf8"),
  );
} catch {
  // No weights checked in - fall back to treating every spec as equal.
}

const knownWeights = Object.values(WEIGHTS);
const FALLBACK =
  knownWeights.length > 0
    ? Math.round(knownWeights.reduce((a, b) => a + b, 0) / knownWeights.length)
    : 1;

/** Measured wall-clock seconds for a spec file, mean-substituted if unknown. */
function weightOf(file) {
  return WEIGHTS[file] ?? FALLBACK;
}

/**
 * Longest-processing-time bin packing: hand each spec, heaviest first, to
 * whichever shard is currently lightest. For this suite's weight
 * distribution LPT lands within a few percent of a perfect split, which a
 * count-based round-robin cannot do when the slowest spec is 8.6x the
 * fastest.
 */
function packIntoBins(files, binCount) {
  const bins = Array.from({ length: binCount }, () => ({ total: 0, files: [] }));

  for (const file of [...files].sort(
    (a, b) => weightOf(b) - weightOf(a) || a.localeCompare(b),
  )) {
    const lightest = bins.reduce((min, b) => (b.total < min.total ? b : min));
    lightest.files.push(file);
    lightest.total += weightOf(file);
  }

  // Keep each shard's own run in a stable, readable order.
  for (const bin of bins) bin.files.sort();

  return bins;
}

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------

const population =
  SHARD_MODE === "exclusive" ? exclusive : SHARD_MODE === "all" ? matched : parallelSafe;

if (process.argv.includes("--count")) {
  console.log(population.length);
  process.exit(0);
}

const fmt = (s) => `${Math.floor(s / 60)}m${String(s % 60).padStart(2, "0")}s`;

if (process.argv.includes("--plan")) {
  const bins = packIntoBins(parallelSafe, SHARD_TOTAL);
  console.log(
    `${matched.length} spec(s): ${parallelSafe.length} parallel-safe, ${exclusive.length} exclusive (write competition settings)\n`,
  );
  console.log(`PARALLEL PHASE - ${SHARD_TOTAL} shard(s), balanced by measured duration:`);
  bins.forEach((b, i) =>
    console.log(`  shard ${i + 1}: ${String(b.files.length).padStart(2)} spec(s)  ${fmt(b.total)}`),
  );
  const slowest = Math.max(...bins.map((b) => b.total));
  const exclusiveTotal = exclusive.reduce((s, f) => s + weightOf(f), 0);

  console.log(`\nEXCLUSIVE PHASE - 1 job, serialised, grouped by required state:`);
  const groups = new Map();
  for (const f of exclusive) {
    const k = state.get(f);
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(f);
  }
  for (const [k, fl] of groups) {
    console.log(`  [${k}] ${fl.length} spec(s) ${fmt(fl.reduce((s, f) => s + weightOf(f), 0))}`);
    fl.forEach((f) => console.log(`      ${f.replace("tests/specs/", "")}`));
  }

  console.log(
    `\nProjected: parallel ${fmt(slowest)} + exclusive ${fmt(exclusiveTotal)} = ${fmt(slowest + exclusiveTotal)} of test time`,
  );
  console.log(`(plus ~7 min emulator boot per phase; the two phases run in sequence)`);
  process.exit(0);
}

const mine =
  SHARD_MODE === "parallel"
    ? packIntoBins(parallelSafe, SHARD_TOTAL)[SHARD_INDEX - 1].files
    : population;

console.log(mine.join("\n"));
