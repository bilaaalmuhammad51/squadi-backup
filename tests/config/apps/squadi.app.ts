import type { AppProfile } from "./app.profile";

/**
 * Squadi (soccer) - the original app this suite was built against.
 * Every value here was previously hardcoded in matchApi.helper.ts,
 * tests/data/*.ts or the capability files; moving it here is a pure
 * refactor, so a green run against Squadi proves parity.
 */
export const squadiApp: AppProfile = {
  key: "squadi",
  displayName: "Squadi",

  binaries: {
    apk: "squadi-dev.apk",
    ipa: "squadi-dev.ipa",
    androidPackage: "com.wsa.netball.dev",
    browserstackAndroidAppId: "bs://40e820f9f7baa012fd9b49127042221acd45c4b6",
    browserstackIosAppId: "bs://290b5edb7a9799a60fb68d939f2fe8b0861ed185",
  },

  api: {
    usersBaseUrl: "https://api-dev1.squadi.com/users",
    livescoresBaseUrl: "https://api-dev1.squadi.com/livescores",
  },

  seed: {
    competitionId: 239,
    competitionName: "HR-ASN2-MD-Only",
    organisationId: 58,
    yearRefId: 6,
    divisionId: 541,
    team1Id: 2269,
    team2Id: 2270,
    venueCourtId: 42,
    venueIds: [12, 112],
    roundId: 13215,
    subCourt: "H",
    rosters: [
      { roleId: 21, userId: 8364, teamId: null, sequence: 1 },
      { roleId: 4, userId: 160547, teamId: 2269, sequence: 1 },
    ],
    courtScorerUserId: 160547,
    umpire: { userId: 161700, roleId: 15, name: "Syed Referee1 Only" },
    officials: {
      team1ManagerUserId: 161275, // Syed Manager1
      team1CoachUserId: 161628, // Syed Coach1
      team2ManagerUserId: 161431, // Syed Manager2
      team2CoachUserId: 161628, // Syed Coach1 (same person coaches both)
    },
    roleIds: { manager: 3, coach: 4 },
    teamOfficialRoleIds: { manager: 435, coach: 436 },
    teamOfficialRoleList: [
      { id: 435, roleId: 3, lookupRoleId: 3, sequence: 1 },
      { id: 436, roleId: 17, lookupRoleId: 17, sequence: 2 },
    ],
    bestAndFairestIds: [1728, 1727],
  },

  matchFormat: {
    type: "TWO_HALVES",
    matchDuration: 4,
    mainBreakDuration: 2,
    breakDuration: 2,
  },

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

  teamAttendance: {
    name: "Team Sheet",
  },

  teamSheetNotAvailableMsg: {
    message: "Team Sheet is not available yet",
  },

  matchYesButtonAndroidSelector:
    '//*[@content-desc="Match ID: {matchId}"]/following-sibling::*[@content-desc="Yes"][1]',

  fieldOption: {
    label: "Field",
  },

  pauseOrStopButton: {
    label: "Pause",
  },

  resumeOrStartButton: {
    label: "Resume",
  },

  reportIncidentTitle: {
    title: "Report Other Incident",
  },

  calendarBtn: { selector: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[1]/android.view.View[1]/android.widget.Button[2]',},

  backBtnInCalendar: { selector: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[1]/android.view.View[1]/android.widget.Button',},

  appNameFinderOptionInMoreTab: { label: "squadi Finder" },

  refereeSlots: {
    slot1: { android: "~Match referee", ios: "~Match referee" },
    slot2: {
      android: "~Assistant Referee 1",
      ios: "~Assistant Referee 1",
    },
    slot3: {
      android: "~Assistant Referee 2",
      ios: "~Assistant Referee 2",
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
    teams: {
      homeTeam: "HR-ASN2Club1-D1-T2",
      awayTeam: "HR-ASN2Club2-D1-T3",
    },
    players: {
      ClubPlayer1: "HR-ASN2Club1 -D1-T2",
      ClubPlayer2: "HR-ASN2Club2-D1-T3 Player",
      HomePlayer1: "ImpPlyr1 Test1",
      HomePlayer2: "ImpPlyr2 Test2",
      HomePlayer3: "ImpPlyr17 Test17",
      AwayPlayer1: "ImpPlyr3 Test3",
      AwayPlayer2: "ImpPlyr4 Test4",
      AwayPlayer3: "ImpPlyr18 Test18",
      BorrowPlayerTeam1: "HR-ASN2Club1-D2-T5 Player",
      BorrowPlayerTeam2: "HR-ASN2Club2-D2-T6 Player",
    },
    positions: {
      Bench: "Bench",
      Forward: "Forward",
      Midfielder: "Midfielder",
      Defender: "Defender",
      Goalkeeper: "Goalkeeper",
    },
    playersInStartingFormation: {
      ClubPlayer1: "H. -D1-T2",
      ClubPlayer2: "H. Player",
      HomePlayer1: "Test1",
      HomePlayer2: "Test2",
      HomePlayer3: "Test17",
      AwayPlayer1: "Test3",
      AwayPlayer2: "Test4",
      AwayPlayer3: "Test18",
    },
  },

  confirmBtnForSavingTeamSheetOrSelection: {
    confirmTeam: "Confirm",
  },

  register: {
    organisation: "Anas Test State",
    heading: "Create Account or Register Profile",
  },

  terminology: {
    scoreUnit: "Goal",
    ladderFor: "GF",
    ladderAgainst: "GA",
    period: "Half",
  },

  features: {
    fouls: false, // Squadi records send-off reports, not basketball fouls
    sendOffReports: true,
    startingFormation: true,
    substitutions: true,
    ladderGoalDifference: true,
    shop: true,
    incidents: true,
    fieldClosure: true,
    matchStartConfirmation: true,
    refereeMustAcceptMatchBeforeScoring: false,
  },

  rules: {},
};
