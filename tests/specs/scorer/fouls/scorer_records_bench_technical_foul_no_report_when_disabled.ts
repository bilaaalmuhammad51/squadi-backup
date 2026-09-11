import allureReporter from "@wdio/allure-reporter";
import { step } from "../../../utils/helpers";
import { LoginData } from "../../../data/login.data";
import { LoginPage } from "../../../pages/login.page";
import { HomePage } from "../../../pages/home.page";
import { ScorerPage } from "../../../pages/scorer.page";
import { TeamOfficialsPage } from "../../../pages/teamOfficials.page";
import { MatchApiHelper } from "../../../utils/matchApi.helper";
import {
  PlayerNamesInTeamSheet,
  PlayerPositions,
  TeamsInTeamSheet,
} from "../../../data/teamSheet.data";
import { describeIfFeature } from "../../../utils/features";

let matchId: number;
let token: string;

// CM-29601-TC-002. Basketball only (Scoring - Foul Recording & Counting).
//
// NOTE on scope: the ticket's precondition is "competition's bench-foul-report
// setting is DISABLED". This app/environment has no discovered API field for a
// basketball-specific "bench foul report" toggle (MatchApiHelper.updateCompetitionSettings
// only exposes Squadi-style send-off report codes, and basketball.app.ts has
// sendOffReports: false / no report screen wired to the foul pad at all). So
// this test asserts the ticket's *observable* behaviour directly against this
// environment's default state - recording a bench technical foul attributes it
// to the team/bench (never a player) and never surfaces a report screen -
// rather than toggling a setting that isn't exposed anywhere in the mapped API.
// If a real bench-foul-report toggle is later found, wire it in here via
// MatchApiHelper.updateCompetitionSettings() and assert both states.
describeIfFeature(
  "fouls",
  "Scorer records a bench technical foul against a coach; no report is generated",
  () => {
    it("the foul is attributed to the team/bench (not a player) and no report screen is shown", async () => {
      const loginPage = new LoginPage();
      const homePage = new HomePage();
      const scorerPage = new ScorerPage();
      const teamOfficialsPage = new TeamOfficialsPage();

      allureReporter.addFeature("Scoring - Foul Recording & Counting");
      allureReporter.addStory(
        "Scorer records a bench technical foul against a coach/team official",
      );
      allureReporter.addSeverity("high");

      await step("Create match before launching app", async () => {
        token = await MatchApiHelper.getToken(
          LoginData.email,
          LoginData.password,
        );
        matchId = await MatchApiHelper.createMatch(token, 10);
        console.log("Created Match ID:", matchId);
        allureReporter.addAttachment(
          "Created Match ID",
          String(matchId),
          "text/plain",
        );
      });

      after(async () => {
        try {
          if (token && matchId) {
            await MatchApiHelper.deleteMatch(token, matchId);
            console.log(`Deleted Match ID: ${matchId}`);
          }
        } catch (error) {
          console.error("Failed to delete match:", error);
        }
      });

      await step("Verify welcome screen is visible", async () => {
        await loginPage.validateLoginBtnIsVisible();
      });

      await step("Navigate to login screen", async () => {
        await loginPage.click(loginPage.loginButton);
      });

      await step("Log in as Scorer", async () => {
        await loginPage.addUserName(LoginData.email);
        await loginPage.addPassword(LoginData.password);
        await loginPage.click(loginPage.login);
      });

      await step(
        "Validate successful login by checking Home screen",
        async () => {
          await homePage.waitUntilVisibleWithRetry(homePage.homeTab);
          await homePage.assertElementDisplayed(homePage.homeTab);
        },
      );

      await step("Open the seeded match from Home", async () => {
        const matchElement = homePage.matchById(matchId.toString());
        await scorerPage.scrollUntilElementVisible(matchElement);
        await homePage.assertElementDisplayed(matchElement);
        await homePage.click(matchElement);
        await scorerPage.handleErrorPopup();
        await scorerPage.waitUntilVisibleWithRetry(scorerPage.matchTimer);
        await scorerPage.validateScorerScreenElements();
      });

      await step(
        "Select players in Team Selection for both teams (required before Start is usable)",
        async () => {
          await scorerPage.clickSettingsIcon();
          await scorerPage.openTeamSheetOption();
          await scorerPage.validateHomeTeamSheetElements(
            TeamsInTeamSheet.HomeTeam,
          );
          await scorerPage.selectPlayerAndPositionOfTeam(
            PlayerNamesInTeamSheet.ClubPlayer1,
            PlayerPositions.Forward,
          );
          await scorerPage.clickConfirmBtnForSavingTeamSheet();
          await scorerPage.validateAwayTeamSheetElements(
            TeamsInTeamSheet.Awayteam,
          );
          await scorerPage.selectPlayerAndPositionOfTeam(
            PlayerNamesInTeamSheet.ClubPlayer2,
            PlayerPositions.Forward,
          );
          await scorerPage.clickConfirmBtnForSavingTeamSheet();
        },
      );

      await step(
        "Update Team Officials for both teams (assigns the coach/team official this test targets)",
        async () => {
          await scorerPage.clickSettingsIcon();
          expect(
            await teamOfficialsPage.validateIfTeamOfficialsMenuAvailable(),
          ).toBeTruthy();
          await teamOfficialsPage.openTeamOfficials();
          await teamOfficialsPage.assertTeamOfficialsEnabledElements();
          await teamOfficialsPage.searchAndSelectManager("Syed");
          await teamOfficialsPage.searchAndSelectCoach("Syed");
          await teamOfficialsPage.clickConfirmTeamOfficials();
          await teamOfficialsPage.searchAndSelectManager("Syed");
          await teamOfficialsPage.searchAndSelectCoach("Syed");
          await teamOfficialsPage.clickConfirmTeamOfficials();
          await scorerPage.clickCloseCrossBtn();
        },
      );

      await step("Start the match", async () => {
        await scorerPage.handleStartOrResumeMatch();
      });

      let initialPlayerTally: number;
      let initialBenchTally: number;
      let initialTeamFoulColumn: string;

      await step(
        "Capture initial player tally, bench tally and the home team's foul column",
        async () => {
          initialPlayerTally = await scorerPage.getPlayerFoulTally(
            PlayerNamesInTeamSheet.ClubPlayer1,
          );
          initialBenchTally = await scorerPage.getBenchFoulTally("home");
          initialTeamFoulColumn =
            await scorerPage.getTeamFoulColumnValue("home");
        },
      );

      await step(
        "Select Technical on the foul pad and record it against the bench/team official (not a player)",
        async () => {
          await scorerPage.recordBenchFoul("home", "TECHNICAL");
        },
      );

      await step(
        "Validate the foul is attributed to the bench/team official, not any player",
        async () => {
          const benchTallyAfter = await scorerPage.getBenchFoulTally("home");
          expect(benchTallyAfter).toBe(initialBenchTally + 1);

          const playerTallyAfter = await scorerPage.getPlayerFoulTally(
            PlayerNamesInTeamSheet.ClubPlayer1,
          );
          expect(playerTallyAfter).toBe(initialPlayerTally);
        },
      );

      await step(
        "Validate the team foul tally reflects the bench foul",
        async () => {
          const columnBefore =
            initialTeamFoulColumn === "" ? 0 : Number(initialTeamFoulColumn);
          const columnAfterRaw =
            await scorerPage.getTeamFoulColumnValue("home");
          const columnAfter =
            columnAfterRaw === "" ? 0 : Number(columnAfterRaw);
          expect(columnAfter).toBe(columnBefore + 1);
        },
      );

      await step(
        "Validate no bench foul report screen was surfaced - the scoring screen is still showing",
        async () => {
          await scorerPage.assertElementDisplayed(scorerPage.matchTimer);
          await scorerPage.assertElementDisplayed(
            scorerPage.teamFoulColumn("home"),
          );
        },
      );
    });
  },
);
