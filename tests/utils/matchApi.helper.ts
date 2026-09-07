import axios from "axios";
import FormData from "form-data";
import { LoginData } from "../data/login.data";
import { App, assertAppConfigured } from "../config/apps";

// Resolved from the active app profile (tests/config/apps/<app>.app.ts) so the
// same seeder drives Squadi, Basketball and whatever is added next.
const USERS_BASE_URL = App.api.usersBaseUrl;
const LIVESCORES_BASE_URL = App.api.livescoresBaseUrl;
const SEED = App.seed;

export class MatchApiHelper {
  static async getToken(username: string, password: string): Promise<string> {
    const encoded = Buffer.from(`${username}:${password}`).toString("base64");

    try {
      const response = await axios.get(`${USERS_BASE_URL}/users/loginWithTfa`, {
        headers: {
          Authorization: `BWSA ${encoded}`,
          SourceSystem: "WebAdmin",
          Accept: "application/json",
        },
      });

      const token = response.data?.authToken;

      if (!token) {
        throw new Error(
          `Auth token not found: ${JSON.stringify(response.data)}`,
        );
      }

      return token;
    } catch (err: any) {
      // TEMP DIAGNOSTICS: surface the real cause behind a 403 in CI.
      if (axios.isAxiosError(err)) {
        console.error("=== getToken request failed ===");
        console.error("URL:", `${USERS_BASE_URL}/users/loginWithTfa`);
        console.error(
          "Status:",
          err.response?.status,
          err.response?.statusText,
        );
        console.error(
          "Response headers:",
          JSON.stringify(err.response?.headers, null, 2),
        );
        console.error(
          "Response body:",
          typeof err.response?.data === "string"
            ? err.response?.data?.slice(0, 1000)
            : JSON.stringify(err.response?.data, null, 2),
        );
        console.error("================================");
      }
      throw err;
    }
  }

  static getPakistanFutureTimeUtc(minutesAhead: number = 3): string {
    const now = new Date();

    // Add minutes to current real time first
    now.setMinutes(now.getMinutes() + minutesAhead);

    // toISOString gives UTC automatically
    return now.toISOString();
  }

  static async createMatch(
    token: string,
    minutesAhead: number = 3,
    roundId?: number,
  ): Promise<number> {
    assertAppConfigured(
      {
        divisionId: SEED.divisionId,
        competitionId: SEED.competitionId,
        team1Id: SEED.team1Id,
        team2Id: SEED.team2Id,
        venueCourtId: SEED.venueCourtId,
        roundId: SEED.roundId,
      },
      "createMatch()",
    );

    const startTime = this.getPakistanFutureTimeUtc(minutesAhead);

    const payload = {
      id: 0,
      startTime,

      divisionId: SEED.divisionId,
      // Sport-specific: TWO_HALVES for Squadi, FOUR_QUARTERS for basketball.
      type: App.matchFormat.type,
      competitionId: SEED.competitionId,

      team1Id: SEED.team1Id,
      team2Id: SEED.team2Id,

      venueCourtId: SEED.venueCourtId,
      // Callers can pin a round (added with the draws-tab tests); otherwise
      // fall back to the active app profile's round.
      roundId: roundId || SEED.roundId,

      matchDuration: App.matchFormat.matchDuration,
      mainBreakDuration: App.matchFormat.mainBreakDuration,
      breakDuration: App.matchFormat.breakDuration,

      team1Score: 0,
      team2Score: 0,

      hasPenalty: false,

      team1PenaltyScore: null,
      team2PenaltyScore: null,

      resultStatus: null,
      team1ResultId: null,
      team2ResultId: null,

      matchStatus: "NOT_STARTED",
      matchSubstatusRefId: 1,

      endTime: null,

      rosters: SEED.rosters,

      isFinals: false,
      isLocked: false,

      extraTimeType: null,
      extraTimeDuration: null,
      extraTimeMainBreak: null,
      extraTimeBreak: null,
      extraTimeWinByGoals: null,
      extraTimeFor: null,

      subCourt: SEED.subCourt,

      competitionOrganisationId: null,

      matchScoresData: [],
      matchTeamOfficials: [],
      officials: [],

      canRegenLadderPoints: false,
      isEndingMatch: false,
    };

    const response = await axios.post(
      `${LIVESCORES_BASE_URL}/matches`,
      payload,
      {
        headers: {
          Authorization: `${token}`,
          SourceSystem: "WebAdmin",
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      },
    );

    const matchId = response.data?.id;

    if (!matchId) {
      throw new Error(`Match ID not found: ${JSON.stringify(response.data)}`);
    }

    return matchId;
  }

  static async getMatch(token: string, matchId: number): Promise<any> {
    const response = await axios.get(
      `${LIVESCORES_BASE_URL}/matches/id/${matchId}`,
      {
        headers: {
          Authorization: `${token}`,
          SourceSystem: "WebAdmin",
          Accept: "application/json",
        },
      },
    );
    return response.data;
  }

  static async updateMatchStartTime(
    token: string,
    matchId: number,
    minutesAhead: number = 3,
  ): Promise<void> {
    const startTime = this.getPakistanFutureTimeUtc(minutesAhead);
    const match = await this.getMatch(token, matchId);
    const payload = {
      id: match.id,
      startTime,

      divisionId: match.divisionId,
      type: match.type,
      competitionId: match.competitionId,

      team1Id: match.team1Id,
      team2Id: match.team2Id,

      venueCourtId: match.venueCourtId,
      roundId: match.roundId,

      matchDuration: match.matchDuration,
      mainBreakDuration: match.mainBreakDuration,
      breakDuration: match.breakDuration,

      team1Score: match.team1Score,
      team2Score: match.team2Score,

      hasPenalty: match.hasPenalty,
      team1PenaltyScore: match.team1PenaltyScore,
      team2PenaltyScore: match.team2PenaltyScore,

      resultStatus: match.resultStatus,
      team1ResultId: match.team1ResultId,
      team2ResultId: match.team2ResultId,

      matchStatus: match.matchStatus ?? "NOT_STARTED",
      matchSubstatusRefId: match.matchSubstatusRefId,

      endTime: match.endTime,

      // Preserve existing rosters, mapped to the shape the create/update endpoint expects.
      rosters: (match.rosters ?? []).map((r: any) => ({
        roleId: r.roleId,
        userId: r.userId,
        teamId: r.teamId,
        sequence: r.sequence,
      })),

      isFinals: match.isFinals,
      isLocked: match.isResultsLocked ?? false,

      extraTimeType: match.extraTimeType,
      extraTimeDuration: match.extraTimeDuration,
      extraTimeMainBreak: match.extraTimeMainBreak,
      extraTimeBreak: match.extraTimeBreak,
      extraTimeWinByGoals: match.extraTimeWinByGoals,
      extraTimeFor: match.extraTimeFor,

      subCourt: match.subCourt,

      competitionOrganisationId: match.competitionOrganisationId ?? null,

      matchScoresData: [],
      matchTeamOfficials: [],
      officials: [],

      canRegenLadderPoints: false,
      isEndingMatch: false,
    };

    await axios.post(`${LIVESCORES_BASE_URL}/matches`, payload, {
      headers: {
        Authorization: `${token}`,
        SourceSystem: "WebAdmin",
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  }

  static async deleteMatch(token: string, matchId: number): Promise<void> {
    await axios.delete(`${LIVESCORES_BASE_URL}/matches/id/${matchId}`, {
      headers: {
        Authorization: `${token}`,
        SourceSystem: "WebAdmin",
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  }

  static async assignReferee(
    token: string,
    matchId: number,
    umpireUserId = SEED.umpire.userId,
  ): Promise<void> {
    assertAppConfigured(
      {
        competitionId: SEED.competitionId,
        organisationId: SEED.organisationId,
        umpireUserId,
        umpireName: SEED.umpire.name,
      },
      "assignReferee()",
    );

    const payload = {
      matchId,
      competitionId: SEED.competitionId,
      organisationId: SEED.organisationId,
      rosters: [
        {
          userId: umpireUserId,
          roleId: SEED.umpire.roleId,
          sequence: 1,
          matchId,
          umpireName: SEED.umpire.name,
          competitionOrganisationId: 0, // replace with your value
          umpireType: "USERS",
          enableAffiliateAssignment: false,
        },
      ],
      officials: [],
    };

    await axios.post(`${LIVESCORES_BASE_URL}/matches/umpireRosters`, payload, {
      headers: {
        Authorization: `${token}`,
        SourceSystem: "WebAdmin",
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  }

  static async publishMatchOfficials(
    token: string,
    matchId: number,
  ): Promise<void> {
    console.log(`Publishing match officials for Match ID: ${matchId}`);
    const params = new URLSearchParams({
      timezone: "Asia/Karachi",
      yearRefId: String(SEED.yearRefId),
      competitionId: String(SEED.competitionId),
      organisationId: String(SEED.organisationId),
      matchId: String(matchId),
      divisionIds: "[]",
      roundIds: "[]",
      venueIds: "[]",
      startDate: "null",
      endDate: "null",
      whenPublish: "2",
      publishedAt: "null",
    });

    await axios.post(
      `${LIVESCORES_BASE_URL}/matchUmpire/publishUmpire?${params.toString()}`,
      null,
      {
        headers: {
          Authorization: `${token}`,
          SourceSystem: "WebAdmin",
          Accept: "application/json",
          // "Content-Type": "application/json",
        },
      },
    );
  }

  static async updateCompetitionSettings(
    token: string,
    options?: {
      scoringMode?: "MANAGERS" | "COURT";
      courtScorerUserId?: number | null;
      gameTimeTrackingEnabled?: boolean;
      lockAttendanceMinutes?: number;
      liveScoring?: boolean;
      allowHomeTeamManagerToVerifyOfficials?: boolean;
    },
  ): Promise<any> {
    // ===== Defaults =====
    const scoringMode = options?.scoringMode ?? "COURT";
    const courtScorerUserId = options?.courtScorerUserId ?? SEED.courtScorerUserId;
    const gameTimeTrackingEnabled = options?.gameTimeTrackingEnabled ?? true;
    const liveScoring = options?.liveScoring ?? true;
    const allowHomeTeamManagerToVerifyOfficials =
      options?.allowHomeTeamManagerToVerifyOfficials ?? false;

    assertAppConfigured(
      {
        competitionId: SEED.competitionId,
        competitionName: SEED.competitionName,
        organisationId: SEED.organisationId,
      },
      "updateCompetitionSettings()",
    );

    const form = new FormData();

    // ===== Basic Info =====
    form.append("id", String(SEED.competitionId));
    form.append("name", SEED.competitionName);
    form.append("longName", SEED.competitionName);
    form.append("organisationId", String(SEED.organisationId));
    form.append("yearRefId", String(SEED.yearRefId));

    // ===== Scoring Settings =====
    form.append("scoringType", liveScoring ? "SINGLE" : "NO_SCORING_CARD");
    form.append("whoScoring", scoringMode);
    form.append("acceptScoring", "SCORER");

    form.append(
      "courtScorerUserId",
      scoringMode === "COURT" ? String(courtScorerUserId ?? 0) : "null",
    );

    // ===== Other Settings =====
    form.append("timerType", "PER_MATCH_PER_PERIOD");
    form.append("attendanceRecordingType", "BOTH");
    form.append("attendanceRecordingPeriod", "MATCH");
    form.append("recordUmpireType", "USERS");

    form.append("timeoutDetails", "{}");
    form.append("officialOrganisationIds", "[]");
    form.append("linkedMembershipProductIds", "[]");
    form.append("linkedCompetitionIds", "[]");
    form.append("fieldClosureAdmins", "[]");

    form.append("incidentsEnabled", "true");
    form.append("isPublicStats", "true");
    form.append("enableMatchOfficialRecording", "true");

    form.append(
      "umpireSequenceSettings",
      JSON.stringify({
        CoachEnabled: true,
        ReserveEnabled: false,
        NumberOfUmpires: 3,
        officialSettings: {
          1: false,
          2: false,
          3: false,
          4: false,
          5: false,
          6: false,
          7: false,
          8: false,
          9: false,
          10: false,
        },
        AnyoneCanBeUmpire: false,
        NumberOfOfficials: 0,
        AllowHomeTeamManagerToVerifyOfficials:
          allowHomeTeamManagerToVerifyOfficials,
      }),
    );

    form.append(
      "pointScheme",
      JSON.stringify([
        { id: 1, value: [1] },
        { id: 10, value: [1] },
        { id: 11, value: [1] },
      ]),
    );

    form.append(
      "borrowingPlayersRestrictionSetting",
      JSON.stringify({
        isUseAllDivisions: false,
        rules: [],
      }),
    );

    form.append(
      "finalsEligibilitySetting",
      JSON.stringify({
        enabled: false,
        isUseAllDivisions: false,
        rules: [],
      }),
    );

    form.append(
      "forfeitSettings",
      JSON.stringify({
        affiliateForfeits: {
          checked: false,
          threshold: true,
          thresholdFrom: 0,
          thresholdTo: 0,
        },
        refereeForfeits: {
          checked: false,
          threshold: true,
          thresholdFrom: 0,
          thresholdTo: 0,
        },
        refereeAbandon: {
          checked: false,
          threshold: true,
          thresholdFrom: 0,
          thresholdTo: 0,
        },
        managerForfeits: {
          checked: false,
          thresholdFrom: 0,
          thresholdTo: 0,
        },
      }),
    );

    form.append(
      "teamOfficialRoleList",
      JSON.stringify(
        SEED.teamOfficialRoleList.map((role) => ({
          ...role,
          competitionId: SEED.competitionId,
        })),
      ),
    );

    form.append(
      "bestAndFairests",
      JSON.stringify([
        {
          id: SEED.bestAndFairestIds[0],
          enabled: false,
          preferenceSetByRefId: 1,
          awardWhichTeamRefId: 1,
          receivingBFPointsRefId: 2,
          bestAndFairestTypeRefId: 2,
        },
        {
          id: SEED.bestAndFairestIds[1],
          enabled: false,
          preferenceSetByRefId: 1,
          awardWhichTeamRefId: 1,
          receivingBFPointsRefId: 2,
          bestAndFairestTypeRefId: 1,
        },
      ]),
    );

    form.append(
      "foulsSettings",
      JSON.stringify({
        sendoffReport: [
          { type: "RC", value: "1" },
          { type: "R1", value: "1" },
          { type: "R2", value: "1" },
          { type: "R3", value: "1" },
          { type: "R4", value: "1" },
          { type: "R5", value: "1" },
          { type: "R6", value: "1" },
          { type: "R7", value: "1" },
          { type: "R8", value: "1" },
        ],
        recordOffenceCodes: true,
      }),
    );

    form.append("gameTimeTracking", gameTimeTrackingEnabled ? "1" : "0");
    form.append("attendanceSelectionTime", "14400");

    if (options?.lockAttendanceMinutes !== undefined) {
      form.append(
        "attendanceSelectionTimeEnd",
        String(options.lockAttendanceMinutes),
      );
    }

    form.append("allowAffiliatesEnterScore", "0");
    form.append("isInvitorsChanged", "false");

    const response = await axios.post(
      `${LIVESCORES_BASE_URL}/competitions?competitionId=${SEED.competitionId}` +
        `&venues=[${SEED.venueIds.join(",")}]`,
      form,
      {
        headers: {
          Authorization: token,
          SourceSystem: "WebAdmin",
          Accept: "application/json",
          ...form.getHeaders(),
        },
      },
    );

    return response.data;
  }

  static async createAndPublishMatch(
    minutesAhead: number = 3,
  ): Promise<number> {
    // Generate auth token
    const token = await MatchApiHelper.getToken(
      LoginData.email,
      LoginData.password,
    );

    // Create match
    const matchId = await this.createMatch(token, minutesAhead);
    await MatchApiHelper.assignReferee(token, matchId);

    await this.publishMatchOfficials(token, matchId);

    return matchId;
  }

  // ============================================================
  // CONSTANTS – adjust these to your environment
  // ============================================================

  // Per-app; defined in tests/config/apps/<app>.app.ts under `seed`.
  private static readonly OFFICIALS = {
    TEAM1_MANAGER: SEED.officials.team1ManagerUserId,
    TEAM1_COACH: SEED.officials.team1CoachUserId,
    TEAM2_MANAGER: SEED.officials.team2ManagerUserId,
    TEAM2_COACH: SEED.officials.team2CoachUserId,
  };

  private static readonly ROLE_IDS = {
    MANAGER: SEED.roleIds.manager,
    COACH: SEED.roleIds.coach,
  };

  private static readonly TEAM_OFFICIAL_ROLE_IDS = {
    MANAGER: SEED.teamOfficialRoleIds.manager,
    COACH: SEED.teamOfficialRoleIds.coach,
  };

  // ============================================================
  // UPDATE OFFICIALS METHOD
  // ============================================================

  /**
   * Update match officials (Managers and Coaches) for both teams.
   * Preserves all existing match data (date, time, scores, venue, etc.).
   *
   * @param token - Bearer token for authentication
   * @param matchId - The match ID (e.g., 84278)
   * @param team1Manager - true to keep/assign Manager, false to remove
   * @param team1Coach - true to keep/assign Coach, false to remove
   * @param team2Manager - true to keep/assign Manager, false to remove
   * @param team2Coach - true to keep/assign Coach, false to remove
   * @returns The updated match data
   */
  static async updateMatchOfficials(
    token: string,
    matchId: number,
    team1Manager: boolean,
    team1Coach: boolean,
    team2Manager: boolean,
    team2Coach: boolean,
  ): Promise<any> {
    // 1. Fetch current match data (preserve all fields)
    const currentMatch = await this.getMatch(token, matchId);

    // 2. Build new matchTeamOfficials array based on booleans
    const matchTeamOfficials: any[] = [];

    if (team1Manager) {
      matchTeamOfficials.push({
        competitionId: currentMatch.competitionId,
        matchId: matchId,
        teamId: currentMatch.team1Id,
        teamOfficialRoleId: this.TEAM_OFFICIAL_ROLE_IDS.MANAGER,
        userId: this.OFFICIALS.TEAM1_MANAGER,
        userName: App.names.homeTeamManagerName,
        roleId: this.ROLE_IDS.MANAGER,
        roleDescription: "Manager",
      });
    }

    if (team1Coach) {
      matchTeamOfficials.push({
        competitionId: currentMatch.competitionId,
        matchId: matchId,
        teamId: currentMatch.team1Id,
        teamOfficialRoleId: this.TEAM_OFFICIAL_ROLE_IDS.COACH,
        userId: this.OFFICIALS.TEAM1_COACH,
        userName: App.names.caochName,
        roleId: this.ROLE_IDS.COACH,
        roleDescription: "Coach",
      });
    }

    if (team2Manager) {
      matchTeamOfficials.push({
        competitionId: currentMatch.competitionId,
        matchId: matchId,
        teamId: currentMatch.team2Id,
        teamOfficialRoleId: this.TEAM_OFFICIAL_ROLE_IDS.MANAGER,
        userId: this.OFFICIALS.TEAM2_MANAGER,
        userName: App.names.awayTeamManagerName,
        roleId: this.ROLE_IDS.MANAGER,
        roleDescription: "Manager",
      });
    }

    if (team2Coach) {
      matchTeamOfficials.push({
        competitionId: currentMatch.competitionId,
        matchId: matchId,
        teamId: currentMatch.team2Id,
        teamOfficialRoleId: this.TEAM_OFFICIAL_ROLE_IDS.COACH,
        userId: this.OFFICIALS.TEAM2_COACH,
        userName: App.names.caochName,
        roleId: this.ROLE_IDS.COACH,
        roleDescription: "Coach",
      });
    }

    // 3. Create payload: copy all existing match data, replace matchTeamOfficials
    const payload: any = {
      ...currentMatch,
      matchTeamOfficials,
    };

    // Remove fields that are read‑only or cause validation errors
    delete payload.competition;
    delete payload.removedUnavailableOfficialUserIds;
    delete payload.removedUnavailableOfficials;

    // 4. Send the update
    const response = await axios.post(
      `${LIVESCORES_BASE_URL}/matches`,
      payload,
      {
        headers: {
          Authorization: token,
          SourceSystem: "WebAdmin",
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  }
}
