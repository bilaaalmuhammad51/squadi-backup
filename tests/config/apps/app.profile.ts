/**
 * A single place that describes everything which differs between the mobile
 * apps this suite drives (Squadi, Basketball, and whatever comes next).
 *
 * The apps are ~80-90% identical, so the rule is: specs and page objects stay
 * app-agnostic and read from the active profile. Nothing outside
 * tests/config/apps should ever branch on the app NAME - branch on a
 * capability (`App.features.x`) or read a value (`App.seed.competitionId`)
 * instead. That way app #3 ships as one new profile file and zero test edits.
 */

export type AppKey = "squadi" | "basketball";

/** Sentinel for a value we do not know yet for a given app. */
export const TBD_NUMBER = -1;
export const TBD_STRING = "__TBD__";

export interface Account {
  email: string;
  password: string;
  /** Display name as it renders in the app (search results, team sheets, ...). */
  name?: string;
  /**
   * Base32 TOTP secret, set only for accounts whose login requires two-factor
   * (e.g. basketball-stg1). When present, MatchApiHelper.getToken() completes
   * the confirmTfa step automatically; when absent, the plain login is used.
   */
  tfaSecret?: string;
}

export interface RosterEntry {
  roleId: number;
  userId: number;
  teamId: number | null;
  sequence: number;
}

export interface AppBinaries {
  /** File name inside tests/apps (NOT a full path - capabilities resolve it). */
  apk: string;
  ipa: string;
  /** Android application id, e.g. for activateApp()/forceStop in lifecycle specs. */
  androidPackage: string;
  /** BrowserStack `bs://` app id for the Android build. */
  browserstackAndroidAppId: string;
  /** BrowserStack `bs://` app id for the iOS build. */
  browserstackIosAppId: string;
}

export interface AppApi {
  usersBaseUrl: string;
  livescoresBaseUrl: string;
}

/**
 * Everything MatchApiHelper needs to seed a match in this app's back end.
 * All of these are environment-specific record IDs.
 */
export interface AppSeed {
  competitionId: number;
  competitionName: string;
  organisationId: number;
  yearRefId: number;
  divisionId: number;
  team1Id: number;
  team2Id: number;
  venueCourtId: number;
  venueIds: number[];
  roundId: number;
  subCourt: string | null;
  /** Rosters attached to a freshly created match (scorer + court scorer etc). */
  rosters: RosterEntry[];
  /** Default court-scorer user for competition settings. */
  courtScorerUserId: number;
  /** Umpire assigned by assignReferee(). */
  umpire: { userId: number; roleId: number; name: string };
  officials: {
    team1ManagerUserId: number;
    team1CoachUserId: number;
    team2ManagerUserId: number;
    team2CoachUserId: number;
  };
  roleIds: { manager: number; coach: number };
  teamOfficialRoleIds: { manager: number; coach: number };
  /** teamOfficialRoleList rows posted with the competition settings form. */
  teamOfficialRoleList: Array<{
    id: number;
    roleId: number;
    lookupRoleId: number;
    sequence: number;
  }>;
  bestAndFairestIds: [number, number];
}

/** Shape of a match created by the seeder - differs per sport. */
export interface AppMatchFormat {
  /** e.g. "TWO_HALVES" for soccer, "FOUR_QUARTERS" for basketball. */
  type: string;
  matchDuration: number;
  mainBreakDuration: number | null;
  breakDuration: number;
}

export interface AppTeamSheetData {
  teams: { homeTeam: string; awayTeam: string };
  players: Record<string, string>;
  /** Positions offered by this sport's starting formation screen. */
  positions: Record<string, string>;
  /** Abbreviated names as they render inside the starting formation grid. */
  playersInStartingFormation: Record<string, string>;
}

/**
 * Capability flags. Specs gate on these (see tests/utils/features.ts), never on
 * the app key, so a screen that only one app has is skipped - not failed - on
 * the others.
 */
export interface AppFeatures {
  /** Basketball-style foul recording (personal/team fouls, bonus, foul-out). */
  fouls: boolean;
  /** Soccer-style send-off / card reports. */
  sendOffReports: boolean;
  /** Starting formation + positions on the team sheet. */
  startingFormation: boolean;
  /** Substitutions / interchange screen. */
  substitutions: boolean;
  /** Ladder shows goal difference / goal average columns. */
  ladderGoalDifference: boolean;
  /** Shop + payment terminal personas. */
  shop: boolean;
  /** Incident reporting. */
  incidents: boolean;
  /** Field Closure (outdoor-venue closures) in the More tab. */
  fieldClosure: boolean;
  /** Whether tapping Start on a match shows a Confirm popup before scoring begins. */
  matchStartConfirmation: boolean;
  /** Whether the referee must log in and accept (Yes) the match assignment before the scorer can set up the match. */
  refereeMustAcceptMatchBeforeScoring: boolean;
}

/** Sport rules that tests assert against - keep them data, not code. */
export interface AppRules {
  fouls?: {
    /** Personal fouls before a player fouls out. */
    perPlayerLimit: number;
    /** Team fouls in a period before the bonus/penalty kicks in. */
    teamBonusThreshold: number;
    /** Foul types selectable in the UI. */
    types: string[];
    /** Whether the team foul counter resets each period. */
    resetsEachPeriod: boolean;
  };
}

/** Scoring/ladder vocabulary, so assertions read the right label per sport. */
export interface AppTerminology {
  /** What one score increment is called ("Goal" / "Point"). */
  scoreUnit: string;
  /** Ladder "for" column accessibility label. */
  ladderFor: string;
  /** Ladder "against" column accessibility label. */
  ladderAgainst: string;
  /** What a match period is called ("Half" / "Quarter"). */
  period: string;
}

export interface AppProfile {
  key: AppKey;
  /** Human label used in reports and Slack. */
  displayName: string;
  binaries: AppBinaries;
  api: AppApi;
  seed: AppSeed;
  matchFormat: AppMatchFormat;
  accounts: {
    scorer: Account;
    manager1: Account;
    manager2: Account;
    coach: Account;
    referee: Account;
    parent: Account;
  };
  /** Display names used to find people in the app UI. */
  names: {
    scorerName: string;
    caochName: string;
    refereeName: string;
    homeTeamManagerName: string;
    awayTeamManagerName: string;
    childFullName: string;
  };
  teamSheet: AppTeamSheetData;
  register: { organisation: string; heading: string };
  terminology: AppTerminology;
  features: AppFeatures;
  rules: AppRules;
  teamAttendance: { name: string };
  confirmBtnForSavingTeamSheetOrSelection: { confirmTeam: string };
  teamSheetNotAvailableMsg: { message: string };
  reportIncidentTitle: { title: string };
  calendarBtn: { selector: string };
  backBtnInCalendar: { selector: string };
  appNameFinderOptionInMoreTab: { label: string };
  /**
   * Android locator for the "Yes" button on a match card in Home (accepting a
   * match/referee assignment). Use the literal placeholder "{matchId}" where
   * the match id should be interpolated - HomePage.matchYesButton() does the
   * substitution. The iOS locator is shared across apps for now (see
   * HomePage.matchYesButton()).
   */
  matchYesButtonAndroidSelector: string;
  /** Label of the match-detail row that opens the field/court screen ("Field" for Squadi, "Court" for Basketball). */
  fieldOption: { label: string };
  /** Label of the button that pauses/stops the match clock on the scoring screen ("Pause" for Squadi, "STOP" for Basketball). */
  pauseOrStopButton: { label: string };
  /** Label of the button that resumes a paused/stopped match ("Resume" for Squadi, "START" for Basketball - distinct from the initial startBtn's "Start"). */
  resumeOrStartButton: { label: string };
  /**
   * Selectors for the three referee slots on the Assign Referees screen, in
   * on-screen order (slot1 = first field, slot2 = second, slot3 = third).
   * Named positionally rather than by role because the apps don't share
   * role names for these slots: Squadi labels them "Match referee",
   * "Assistant Referee 1", "Assistant Referee 2"; Basketball labels them
   * "Referee 1", "Referee 2", "Referee 3".
   * Squadi renders a separate labelled heading per slot as its own
   * accessibility element. Basketball has no such heading - the slot name
   * only appears as the placeholder/hint text on the search field itself,
   * so it needs an XPath hint match instead of an accessibility id. The two
   * apps therefore need different locator strategies, not just different
   * label text, hence full selector strings per app rather than a shared
   * label.
   */
  refereeSlots: {
    slot1: { android: string; ios: string };
    slot2: { android: string; ios: string };
    slot3: { android: string; ios: string };
  };
}
