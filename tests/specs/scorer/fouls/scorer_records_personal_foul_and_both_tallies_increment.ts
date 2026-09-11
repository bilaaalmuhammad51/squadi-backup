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

// CM-29601-TC-001. Basketball only (Scoring - Foul Recording & Counting).
describeIfFeature(
  "fouls",
  "Scorer records a personal foul against a player and both tallies increment",
  () => {
    it("player's personal foul tally and the team foul column both increase by exactly one", async () => {
      const loginPage = new LoginPage();
      const homePage = new HomePage();
      const scorerPage = new ScorerPage();
      const teamOfficialsPage = new TeamOfficialsPage();

      allureReporter.addFeature("Scoring - Foul Recording & Counting");
      allureReporter.addStory(
        "Scorer records a personal foul against a player",
      );
      allureReporter.addSeverity("critical");

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
        "Update Team Officials for both teams (required before Start is usable)",
        async () => {
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
      let initialTeamFoulColumn: string;

      await step(
        "Capture the player's initial personal foul tally and the home team's foul column",
        async () => {
          initialPlayerTally = await scorerPage.getPlayerFoulTally(
            PlayerNamesInTeamSheet.ClubPlayer1,
          );
          initialTeamFoulColumn =
            await scorerPage.getTeamFoulColumnValue("home");
        },
      );

      await step(
        "Select Personal on the foul pad and record it against the home player",
        async () => {
          await scorerPage.recordFoulOnPlayer(
            PlayerNamesInTeamSheet.ClubPlayer1,
            "PERSONAL",
          );
        },
      );

      await step(
        "Validate the player's personal foul tally increased by exactly one",
        async () => {
          const tallyAfter = await scorerPage.getPlayerFoulTally(
            PlayerNamesInTeamSheet.ClubPlayer1,
          );
          expect(tallyAfter).toBe(initialPlayerTally + 1);
        },
      );

      await step(
        "Validate the team foul count for the current period increased by exactly one",
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
        "Validate a match event was written for the foul: leave and re-open the match and confirm the tally persisted",
        async () => {
          await scorerPage.clickBackBtn();
          await homePage.waitUntilVisibleWithRetry(homePage.homeTab);
          const matchElement = homePage.matchById(matchId.toString());
          await scorerPage.scrollUntilElementVisible(matchElement);
          await homePage.click(matchElement);
          await scorerPage.handleErrorPopup();
          await scorerPage.waitUntilVisibleWithRetry(scorerPage.matchTimer);
          const persistedTally = await scorerPage.getPlayerFoulTally(
            PlayerNamesInTeamSheet.ClubPlayer1,
          );
          expect(persistedTally).toBe(initialPlayerTally + 1);
        },
      );
    });
  },
);
