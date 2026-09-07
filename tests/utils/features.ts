import allureReporter from "@wdio/allure-reporter";
import { App, type AppFeatures, type AppKey } from "../config/apps";

/**
 * Feature gating for specs.
 *
 * The apps under test overlap by ~80-90%, but not completely: basketball has
 * foul recording, Squadi has send-off reports, and so on. Rather than
 * maintaining a separate suite per app, a spec declares which capability it
 * needs and is SKIPPED (not failed) on apps that lack it.
 *
 * Always gate on the capability, never on the app name - that way adding a
 * third app means writing one profile, not editing every spec.
 *
 *   describe("Fouls", () => {
 *     itIfFeature("fouls", "records a personal foul", async () => { ... });
 *   });
 */

export function hasFeature(feature: keyof AppFeatures): boolean {
  return App.features[feature] === true;
}

/** Assert a capability inside a test that is already running. */
export function requireFeature(feature: keyof AppFeatures): void {
  if (!hasFeature(feature)) {
    throw new Error(
      `Feature "${feature}" is not supported by ${App.displayName}.`,
    );
  }
}

type TestFn = Mocha.AsyncFunc;

/**
 * `it` that runs only when the active app has the capability. On other apps the
 * test is reported as skipped with a note saying why, so the suite stays green
 * and the report still shows the coverage gap explicitly.
 */
export function itIfFeature(
  feature: keyof AppFeatures,
  title: string,
  fn: TestFn,
): Mocha.Test {
  if (hasFeature(feature)) {
    return it(title, fn);
  }

  return it(title, function () {
    allureReporter.addDescription(
      `Skipped: "${feature}" is not a feature of ${App.displayName}.`,
      "text",
    );
    this.skip();
  });
}

/** `describe` that runs only when the active app has the capability. */
export function describeIfFeature(
  feature: keyof AppFeatures,
  title: string,
  fn: (this: Mocha.Suite) => void,
): void {
  if (hasFeature(feature)) {
    describe(title, fn);
    return;
  }

  describe.skip(
    `${title} [skipped: ${App.displayName} has no "${feature}"]`,
    fn,
  );
}

/**
 * Escape hatch for the rare case where a test is genuinely about one specific
 * app (e.g. verifying an app-specific label). Prefer a feature flag.
 */
export function itForApps(
  apps: AppKey[],
  title: string,
  fn: TestFn,
): Mocha.Test {
  if (apps.includes(App.key)) {
    return it(title, fn);
  }

  return it(title, function () {
    this.skip();
  });
}
