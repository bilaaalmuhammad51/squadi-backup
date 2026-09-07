import { APP_KEY, type AppKey } from "../config/apps";

/** Per-app locator overrides: only the platforms that actually differ. */
export type SelectorOverrides = Partial<
  Record<AppKey, { android?: string; ios?: string }>
>;

export type DualSelector = {
  android: string;
  ios: string;
  name?: string;
  overrides?: SelectorOverrides;
  readonly log: string;
};

/**
 * Build a locator.
 *
 * The apps are mostly identical, so the default android/ios pair is shared.
 * Where one app's screen genuinely differs, pass an override for that app only
 * - the rest keep using the default, and a new app inherits the default until
 * it is proven to need its own:
 *
 *   selector("~Home score", "~Home score", "Home Team Score", {
 *     basketball: { android: "~HOME points", ios: "~HOME points" },
 *   })
 */
export function selector(
  android: string,
  ios: string,
  name?: string,
  overrides?: SelectorOverrides,
): DualSelector {
  return {
    android,
    ios,
    name,
    overrides,
    get log() {
      return name ?? JSON.stringify({ android, ios });
    },
  };
}

/**
 * Resolve a DualSelector down to the locator string for the running app and
 * platform. Order: per-app override -> shared default.
 *
 * This is the single choke point - everything that needs a raw locator string
 * (BasePage.resolve, the scroll helpers, ...) must go through it, otherwise it
 * would silently ignore overrides.
 */
export function resolveLocator(
  dual: DualSelector,
  platform: "android" | "ios",
  appKey: AppKey = APP_KEY,
): string {
  const override = dual.overrides?.[appKey]?.[platform];
  return override ?? dual[platform];
}

export async function $(dual: DualSelector) {
  const platform = driver.isAndroid ? "android" : "ios";
  const locator = resolveLocator(dual, platform);

  if (!locator) {
    throw new Error(
      `No selector defined for ${dual.log} on ${platform} (app: ${APP_KEY})`,
    );
  }

  return await browser.$(locator);
}
