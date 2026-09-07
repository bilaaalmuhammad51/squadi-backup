import { App, strictRecord } from "../config/apps";

// Role labels are the same across apps.
export const UserRoles = {
  Scorer: "Scoring",
  Manager: "Managing",
  Referee: "Refereeing",
  Coach: "Coaching",
};

export const TeamsInTeamSheet = {
  HomeTeam: App.teamSheet.teams.homeTeam,
  Awayteam: App.teamSheet.teams.awayTeam,
};

export const PlayerNamesInTeamSheet = strictRecord(
  App.teamSheet.players,
  "PlayerNamesInTeamSheet",
);

/**
 * Positions are sport-specific (Goalkeeper/Midfielder vs Guard/Centre), so
 * they come from the profile. Specs that name a position that this sport does
 * not have should be gated with the `startingFormation` feature flag.
 */
export const PlayerPositions = strictRecord(
  App.teamSheet.positions,
  "PlayerPositions",
);

export const PlayersInStartingFormation = strictRecord(
  App.teamSheet.playersInStartingFormation,
  "PlayersInStartingFormation",
);
