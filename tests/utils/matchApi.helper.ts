import axios from "axios";

const USERS_BASE_URL = "https://api-dev1.squadi.com/users";
const LIVESCORES_BASE_URL = "https://api-dev1.squadi.com/livescores";

export class MatchApiHelper {
    private static Buffer: any;
    static async getToken(username: string, password: string): Promise<string> {
        const encoded = this.Buffer.from(`${username}:${password}`).toString("base64");

        const response = await axios.get(`${USERS_BASE_URL}/users/loginWithTfa`, {
            headers: {
                Authorization: `BWSA ${encoded}`,
                SourceSystem: "WebAdmin",
                Accept: "application/json",
            },
        });

        const token = response.data?.authToken;

        if (!token) {
            throw new Error(`Auth token not found: ${JSON.stringify(response.data)}`);
        }

        return token;
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
    ): Promise<number> {
        const startTime = this.getPakistanFutureTimeUtc(minutesAhead);

        const payload = {
            id: 0,
            startTime,

            divisionId: 541,
            type: "TWO_HALVES",
            competitionId: 239,

            team1Id: 2269,
            team2Id: 2270,

            venueCourtId: 42,
            roundId: 13215,

            matchDuration: 4,
            mainBreakDuration: 2,
            breakDuration: 2,

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

            rosters: [
                {
                    roleId: 21,
                    userId: 8364,
                    teamId: null,
                    sequence: 1,
                },
                {
                    roleId: 4,
                    userId: 160547,
                    teamId: 2269,
                    sequence: 1,
                },
            ],

            isFinals: false,
            isLocked: false,

            extraTimeType: null,
            extraTimeDuration: null,
            extraTimeMainBreak: null,
            extraTimeBreak: null,
            extraTimeWinByGoals: null,
            extraTimeFor: null,

            subCourt: "H",

            competitionOrganisationId: null,

            matchScoresData: [],
            matchTeamOfficials: [],
            officials: [],

            canRegenLadderPoints: false,
            isEndingMatch: false,
        };

        const response = await axios.post(`${LIVESCORES_BASE_URL}/matches`, payload, {
            headers: {
                Authorization: `${token}`,
                SourceSystem: "WebAdmin",
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });

        const matchId = response.data?.id;

        if (!matchId) {
            throw new Error(`Match ID not found: ${JSON.stringify(response.data)}`);
        }

        return matchId;
    }
}