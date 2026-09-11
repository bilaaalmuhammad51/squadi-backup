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
    // Real IDs from basketball-stg1 competition 1083 (comp + match payloads
    // captured 2026-09-07). This comp is "HR-ASN2-MD-Only" (short name "MD").
    competitionId: 1083,
    competitionName: "HR-ASN2-MD-Only",
    organisationId: 809,
    yearRefId: 8,
    divisionId: 5171,
    team1Id: 30525,
    team2Id: 30526,
    venueCourtId: 2045,
    venueIds: [882],
    roundId: 33604,
    // The captured match had subCourt: null (Squadi used "H").
    subCourt: null,
    // The captured match was created with empty rosters; fill once we have the
    // roster user IDs from this environment.
    rosters: [],
    courtScorerUserId: 303499,
    // "Syed Referee1 Only" (shahshahbaz64+referee1only@) in comp 1083 - the same
    // referee persona Squadi uses. Note there is also a "Referee1" (id 303567,
    // +referee1@); the suite uses "Referee1 Only".
    umpire: { userId: 303568, roleId: 15, name: "Syed Referee1 Only" },
    // Real persona user IDs in basketball-stg1 comp 1083 (assigned 2026-09-07).
    // Manager1 303564 -> team1 (30525, HR-ASN2Club1-D1-T2);
    // Manager2 303565 -> team2 (30526, HR-ASN2Club2-D1-T3);
    // Coach1  303566 -> both teams (so it is both team1 & team2 coach).
    officials: {
      team1ManagerUserId: 303564,
      team1CoachUserId: 303566,
      team2ManagerUserId: 303565,
      team2CoachUserId: 303566,
    },
    roleIds: { manager: 3, coach: 4 },
    // teamOfficialRoleList ids for comp 1083 (Manager row id 239, Coach 240).
    teamOfficialRoleIds: { manager: 239, coach: 240 },
    teamOfficialRoleList: [
      { id: 239, roleId: 3, lookupRoleId: 3, sequence: 1 },
      { id: 240, roleId: 17, lookupRoleId: 17, sequence: 2 },
    ],
    bestAndFairestIds: [939, 938],
  },

  matchFormat: {
    // The captured match on comp 1083 was created as TWO_HALVES with
    // matchDuration 4, mainBreakDuration null, breakDuration 2 - i.e. this
    // test competition is configured the same way Squadi is, NOT as quarters.
    // Match what the environment actually uses so seeded matches are valid.
    type: "TWO_HALVES",
    matchDuration: 4,
    mainBreakDuration: null,
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
      // basketball-stg1 has 2FA on this account; the seeder generates the code.
      // Override at runtime with SCORER_TFA_SECRET in .env / CI if it rotates.
      tfaSecret: "JVUTQP2RHQ",
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
    // Confirmed from comp 1083 team assignments: team1 30525 / team2 30526.
    teams: {
      homeTeam: "HR-ASN2Club1-D1-T2",
      awayTeam: "HR-ASN2Club2-D1-T3",
    },
    players: {
      ClubPlayer1: "Player1 T1",
      ClubPlayer2: "Player1 T2",
    },
    positions: {
      Bench: "Bench",
      Guard: "Guard",
      Forward: "Forward",
      Centre: "Centre",
    },
    playersInStartingFormation: {},
  },

  confirmBtnForSavingTeamSheetOrSelection: {
    confirmTeam: "Confirm team",
  },

  register: {
    // Affiliate org in comp 1083 (from the referee assignment data).
    organisation: "PVT-ASN1",
    // Basketball drops "Profile" from the wording.
    heading: "Create Account or Register",
  },

  teamAttendance: {
    name: "Team Selection",
  },

  teamSheetNotAvailableMsg: {
    message: "Team List is not available yet",
  },

  matchYesButtonAndroidSelector:
    '//android.view.View[@content-desc="Match ID: {matchId}"]/following-sibling::android.view.View[@content-desc="Yes"][1]',

  fieldOption: {
    label: "Court",
  },

  pauseOrStopButton: {
    label: "STOP",
  },

  // Distinct from the initial startBtn's "Start" - Basketball shows "START"
  // (all caps) when resuming a stopped match.
  resumeOrStartButton: {
    label: "START",
  },

  reportIncidentTitle: {
    title: "Report Incident",
  },

  calendarBtn: { selector: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[1]/android.view.View[1]/android.widget.Button[2]'},

  backBtnInCalendar: { selector: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[1]/android.view.View[1]/android.widget.Button'},

  appNameFinderOptionInMoreTab: { label: "Basketball Finder" },
  // Basketball has no separate heading per referee slot - the slot name is
  // only the placeholder/hint text on the search field itself, so this
  // matches the EditText by its hint rather than an accessibility id.
  // iOS predicate is a best-effort guess (no iOS page source captured yet
  // for this screen) - verify against a real iOS run before relying on it.
  refereeSlots: {
    slot1: {
      android: '//android.widget.EditText[contains(@hint,"Referee 1")]',
      ios: '-ios predicate string:label CONTAINS "Referee 1"',
    },
    slot2: {
      android: '//android.widget.EditText[contains(@hint,"Referee 2")]',
      ios: '-ios predicate string:label CONTAINS "Referee 2"',
    },
    slot3: {
      android: '//android.widget.EditText[contains(@hint,"Referee 3")]',
      ios: '-ios predicate string:label CONTAINS "Referee 3"',
    },
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
    startingFormation: false,
    substitutions: false,
    ladderGoalDifference: false,
    shop: true,
    incidents: true,
    fieldClosure: false,
    matchStartConfirmation: false,
    refereeMustAcceptMatchBeforeScoring: true,
  },

  rules: {
    fouls: {
      perPlayerLimit: 5,
      teamBonusThreshold: 5,
      // Confirmed from the real foul pad (page-source capture 2026-09-11):
      // PERSONAL / TECHNICAL / UNSPORTSMANLIKE / DISQUALIFYING - not the
      // Flagrant/Offensive labels this used to list.
      types: ["Personal", "Technical", "Unsportsmanlike", "Disqualifying"],
      resetsEachPeriod: true,
    },
  },
};
