import dotenv from "dotenv";
import {
  TBD_NUMBER,
  TBD_STRING,
  type AppKey,
  type AppProfile,
} from "./app.profile";
import { squadiApp } from "./squadi.app";
import { basketballApp } from "./basketball.app";

// quiet: dotenv's banner would otherwise pollute stdout for scripts/app-value.ts,
// whose output is captured by CI.
dotenv.config({ quiet: true });

export * from "./app.profile";

const registry: Record<AppKey, AppProfile> = {
  squadi: squadiApp,
  basketball: basketballApp,
};

/**
 * Aliases so the workflow dropdown / .env can use whatever spelling is
 * natural ("Basketball", "bb", "squadi") and still resolve to one profile.
 */
const aliases: Record<string, AppKey> = {
  squadi: "squadi",
  soccer: "squadi",
  football: "squadi",
  basketball: "basketball",
  bb: "basketball",
  basket: "basketball",
};

export function resolveAppKey(raw = process.env.APP): AppKey {
  const normalised = String(raw ?? "squadi")
    .trim()
    .toLowerCase();

  const key = aliases[normalised];

  if (!key) {
    throw new Error(
      `Unknown APP "${raw}". Supported values: ${Object.keys(aliases).join(", ")}`,
    );
  }

  return key;
}

/**
 * Runtime overrides. Anything in the active profile can be nudged from .env
 * without editing a profile file - useful while a new app's environment IDs
 * are still being nailed down.
 */
function applyEnvOverrides(profile: AppProfile): AppProfile {
  const num = (name: string, current: number) => {
    const raw = process.env[name];
    return raw === undefined || raw === "" ? current : Number(raw);
  };
  const str = (name: string, current: string) => {
    const raw = process.env[name];
    return raw === undefined || raw === "" ? current : raw;
  };

  return {
    ...profile,
    binaries: {
      ...profile.binaries,
      apk: str("APP_APK", profile.binaries.apk),
      ipa: str("APP_IPA", profile.binaries.ipa),
      browserstackAndroidAppId: str(
        "BROWSERSTACK_APP_ID",
        profile.binaries.browserstackAndroidAppId,
      ),
      browserstackIosAppId: str(
        "BROWSERSTACK_IOS_APP_ID",
        profile.binaries.browserstackIosAppId,
      ),
    },
    api: {
      usersBaseUrl: str("API_USERS_BASE_URL", profile.api.usersBaseUrl),
      livescoresBaseUrl: str(
        "API_LIVESCORES_BASE_URL",
        profile.api.livescoresBaseUrl,
      ),
    },
    seed: {
      ...profile.seed,
      competitionId: num("SEED_COMPETITION_ID", profile.seed.competitionId),
      organisationId: num("SEED_ORGANISATION_ID", profile.seed.organisationId),
      divisionId: num("SEED_DIVISION_ID", profile.seed.divisionId),
      team1Id: num("SEED_TEAM1_ID", profile.seed.team1Id),
      team2Id: num("SEED_TEAM2_ID", profile.seed.team2Id),
      venueCourtId: num("SEED_VENUE_COURT_ID", profile.seed.venueCourtId),
      roundId: num("SEED_ROUND_ID", profile.seed.roundId),
    },
    accounts: {
      ...profile.accounts,
      scorer: {
        ...profile.accounts.scorer,
        // Lets CI inject the scorer's TOTP secret without committing it.
        tfaSecret:
          process.env.SCORER_TFA_SECRET || profile.accounts.scorer.tfaSecret,
      },
    },
    matchFormat: {
      ...profile.matchFormat,
      type: str("SEED_MATCH_TYPE", profile.matchFormat.type),
    },
  };
}

export const APP_KEY: AppKey = resolveAppKey();

/** The active app profile. Import this anywhere instead of hardcoding. */
export const App: AppProfile = applyEnvOverrides(registry[APP_KEY]);

/**
 * Fail loudly, and with a useful message, the first time a test reaches for a
 * value this app has not been configured with yet - rather than POSTing a
 * placeholder ID at the back end and getting an opaque 400.
 */
/**
 * Look up the TOTP secret for a given login email in the active app profile.
 * Used by the API auth flow to complete two-factor logins without any of the
 * ~50 call sites needing to know whether the current app uses TFA.
 */
export function tfaSecretForEmail(email: string): string | undefined {
  for (const account of Object.values(App.accounts)) {
    if (account?.email?.toLowerCase() === email.toLowerCase()) {
      return account.tfaSecret;
    }
  }
  return undefined;
}

export function assertAppConfigured(
  fields: Record<string, number | string | undefined>,
  context: string,
): void {
  const missing = Object.entries(fields)
    .filter(([, value]) => value === TBD_NUMBER || value === TBD_STRING)
    .map(([name]) => name);

  if (missing.length) {
    throw new Error(
      `[${App.displayName}] ${context} needs values that are not configured yet: ` +
        `${missing.join(", ")}. Fill them in tests/config/apps/${App.key}.app.ts ` +
        `(or override via .env) before running this spec against ${App.displayName}.`,
    );
  }
}

/**
 * Wrap a per-app lookup table so that reading a key this app has not defined
 * fails with a named error instead of silently yielding `undefined` (which
 * would end up interpolated into a locator as the string "undefined" and cause
 * a baffling "element not found" ten steps later).
 */
export function strictRecord<T extends object>(
  record: T,
  label: string,
): T {
  return new Proxy(record, {
    get(target, prop, receiver) {
      if (typeof prop === "string" && !(prop in target)) {
        throw new Error(
          `[${App.displayName}] ${label}.${prop} is not defined for this app. ` +
            `Add it to tests/config/apps/${App.key}.app.ts, or gate the spec ` +
            `behind a feature flag if the screen does not exist here.`,
        );
      }
      return Reflect.get(target, prop, receiver);
    },
  });
}
