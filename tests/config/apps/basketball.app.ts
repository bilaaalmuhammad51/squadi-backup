import { TBD_NUMBER, TBD_STRING, type AppProfile } from "./app.profile";

/**
 * Basketball.
 *
 * Values marked TBD_NUMBER / TBD_STRING still need real IDs from the
 * basketball QA environment. They are deliberately sentinels rather than
 * copies of the Squadi IDs: assertAppConfigured() (see ./index.ts) throws a
 * named error the moment a test tries to use one, so a missing ID fails loudly
 * at the seeding step instead of silently seeding into the wrong competition.
 *
 * Every value below can also be overridden at run time from .env without
 * touching this file - see APP_* / SEED_* in ./index.ts.
 */
export const basketballApp: AppProfile = {
  key: "basketball",
  displayName: "Basketball",

  binaries: {
    // tests/apps/ is gitignored, so CI downloads a file with this exact name
    // from the APK GitHub Release. Upload the basketball build there under
    // this name.
    apk: "basketball-qa.apk",
    ipa: "basketball-qa.ipa",
    // Upload each build to BrowserStack and paste the bs://... ids here
    // (or set BROWSERSTACK_APP_ID / BROWSERSTACK_IOS_APP_ID in .env).
    androidPackage: "com.wsa.basketball.qa",
    browserstackAndroidAppId: TBD_STRING,
    browserstackIosAppId: TBD_STRING,
  },

  api: {
    // Confirmed from the Flutter snapshot inside basketball-qa.apk
    // (lib/arm64-v8a/libapp.so) and verified with a real auth call: the
    // basketball build talks to api-basketball-stg1, NOT api-dev1. Its web
    // admin is admin-stg.basketballconnect.com.
    usersBaseUrl: "https://api-basketball-stg1.squadi.com/users",
    livescoresBaseUrl: "https://api-basketball-stg1.squadi.com/livescores",
  },

  seed: {
    competitionId: TBD_NUMBER,
    competitionName: TBD_STRING,
    organisationId: TBD_NUMBER,
    yearRefId: 6,
    divisionId: TBD_NUMBER,
    team1Id: TBD_NUMBER,
    team2Id: TBD_NUMBER,
    venueCourtId: TBD_NUMBER,
    venueIds: [],
    roundId: TBD_NUMBER,
    subCourt: "H",
    rosters: [],
    courtScorerUserId: TBD_NUMBER,
    umpire: { userId: TBD_NUMBER, roleId: 15, name: TBD_STRING },
    officials: {
      team1ManagerUserId: TBD_NUMBER,
      team1CoachUserId: TBD_NUMBER,
      team2ManagerUserId: TBD_NUMBER,
      team2CoachUserId: TBD_NUMBER,
    },
    roleIds: { manager: 3, coach: 4 },
    teamOfficialRoleIds: { manager: TBD_NUMBER, coach: TBD_NUMBER },
    teamOfficialRoleList: [],
    bestAndFairestIds: [TBD_NUMBER, TBD_NUMBER],
  },

  matchFormat: {
    // Basketball is played in quarters. VERIFY the exact enum the back end
    // accepts for this competition before the first seeded run.
    type: "FOUR_QUARTERS",
    matchDuration: 4,
    mainBreakDuration: 2,
    breakDuration: 2,
  },

  // NOTE: basketball has its own backend (api-basketball-stg1), and only the
  // scorer below actually exists there - verified against
  // /users/loginWithTfa. The other five are Squadi addresses kept as
  // placeholders and WILL fail with "Incorrect Username or Password" until
  // real basketball accounts are created. Replace them, do not trust them.
  accounts: {
    scorer: {
      email: "shahshahbaz64@gmail.com",
      password: "Connect123",
      name: "syed shah",
    },
    manager1: {
      email: "shahshahbaz64+manager1@gmail.com",
      password: "Connect123",
      name: "Syed Manager1",
    },
    manager2: {
      email: "shahshahbaz64+manager2@gmail.com",
      password: "Connect123",
      name: "Syed Manager2",
    },
    coach: {
      email: "shahshahbaz64+coach1@gmail.com",
      password: "Connect123",
      name: "Syed Coach1",
    },
    referee: {
      email: "shahshahbaz64+referee1only@gmail.com",
      password: "Connect123",
      name: "Syed Referee1 Only",
    },
    parent: {
      email: "testparentemail1@gmail.com",
      password: "Connect123",
      name: "Test child User",
    },
  },

  names: {
    scorerName: "syed shah",
    caochName: "Syed Coach1",
    refereeName: "Syed Referee1 Only",
    homeTeamManagerName: "Syed Manager1",
    awayTeamManagerName: "Syed Manager2",
    childFullName: "Test child User",
  },

  teamSheet: {
    teams: { homeTeam: TBD_STRING, awayTeam: TBD_STRING },
    players: {},
    positions: {
      Bench: "Bench",
      Guard: "Guard",
      Forward: "Forward",
      Centre: "Centre",
    },
    playersInStartingFormation: {},
  },

  register: {
    organisation: TBD_STRING,
    // Basketball drops "Profile" from the wording.
    heading: "Create Account or Register",
  },

  terminology: {
    scoreUnit: "Point",
    ladderFor: "PF",
    ladderAgainst: "PA",
    period: "Quarter",
  },

  features: {
    fouls: true,
    sendOffReports: false,
    startingFormation: true,
    substitutions: true,
    ladderGoalDifference: false,
    shop: true,
    incidents: true,
    fieldClosure: false,
  },

  rules: {
    fouls: {
      perPlayerLimit: 5,
      teamBonusThreshold: 5,
      types: ["Personal", "Technical", "Flagrant", "Offensive"],
      resetsEachPeriod: true,
    },
  },
};
