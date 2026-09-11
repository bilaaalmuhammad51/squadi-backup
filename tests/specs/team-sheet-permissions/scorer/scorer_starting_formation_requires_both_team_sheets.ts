import allureReporter from "@wdio/allure-reporter";
import { step } from "../../../utils/helpers";
import { LoginData } from "../../../data/login.data";
import { LoginPage } from "../../../pages/login.page";
import { HomePage } from "../../../pages/home.page";
import { ScorerPage } from "../../../pages/scorer.page";
import BasePage from "../../../pages/base.page";
import {
  PlayerPositions,
  PlayersInStartingFormation,
  PlayerNamesInTeamSheet,
  TeamsInTeamSheet,
} from "../../../data/teamSheet.data";
import { MatchApiHelper } from "../../../utils/matchApi.helper";
import { describeIfFeature, hasFeature } from "../../../utils/features";

let matchId: number;
let token: string;

describeIfFeature(
  "startingFormation",
  "Starting Formation requires both team sheets before it becomes usable (S4)",
  () => {
    it("should show a team's players in Starting Formation only once that team's own Team Sheet has been submitted", async () => {
      const loginPage = new LoginPage();
      const homePage = new HomePage();
      const scorerPage = new ScorerPage();
      const basePage = new BasePage();

      allureReporter.addFeature("Scoring Flow");
      allureReporter.addStory(
        "Starting Formation auto-push / availability requires both team sheets",
      );
      allureReporter.addSeverity("critical");

      await step("Create match before launching app", async () => {
        token = await MatchApiHelper.getToken(
          LoginData.email,
          LoginData.password,
        );
        matchId = await MatchApiHelper.createMatch(token, 15);
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

      await step("Enter valid credentials and submit login", async () => {
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

      await step("Open a match from the Home screen", async () => {
        const matchElement = homePage.matchById(matchId.toString());
        await basePage.scrollUntilElementVisible(matchElement);
        await homePage.assertElementDisplayed(matchElement);
        await homePage.click(matchElement);
        await scorerPage.handleErrorPopup();
        await scorerPage.waitUntilVisibleWithRetry(scorerPage.matchTimer);
      });

      await step("Validate navigation to scorer screen", async () => {
        await scorerPage.validateScorerScreenElements();
      });

      await step("Open settings menu and validate options", async () => {
        await scorerPage.clickSettingsIcon();
        await scorerPage.validateTeamSheetOption();
        if (hasFeature("startingFormation")) {
          await scorerPage.validateStartingFormationOption();
        }
      });

      await step("Submit only the home team's Team Sheet", async () => {
        await scorerPage.openTeamSheetOption();
        await scorerPage.validateHomeTeamSheetElements(
          TeamsInTeamSheet.HomeTeam,
        );
        await scorerPage.selectPlayerAndPositionOfTeam(
          PlayerNamesInTeamSheet.ClubPlayer1,
          PlayerPositions.Forward,
        );
        // FR-18: saving the home team auto-switches the tab bar to the away
        // team rather than pushing into Starting Formation directly.
        await scorerPage.clickConfirmBtnForSavingTeamSheet();
        await scorerPage.clickBackBtn();
      });

      if (hasFeature("startingFormation")) {
        await step(
          "Home player is available in Starting Formation, away player is not (away sheet not yet submitted)",
          async () => {
            await scorerPage.openStartingFormationOption();

            expect(
              await scorerPage.isPlayerAvailableInFormation(
                PlayersInStartingFormation.ClubPlayer1,
              ),
            ).toBeTruthy();

            await scorerPage.click(
              scorerPage.awayTeamSheetTab(TeamsInTeamSheet.Awayteam),
            );

            expect(
              await scorerPage.isPlayerAvailableInFormation(
                PlayersInStartingFormation.ClubPlayer2,
              ),
            ).toBeFalsy();

            await scorerPage.clickBackBtn();
          },
        );

        await step("Submit the away team's Team Sheet as well", async () => {
          await scorerPage.openTeamSheetOption();
          await scorerPage.click(
            scorerPage.awayTeamSheetTab(TeamsInTeamSheet.Awayteam),
          );
          await scorerPage.selectPlayerAndPositionOfTeam(
            PlayerNamesInTeamSheet.ClubPlayer2,
            PlayerPositions.Forward,
          );
          await scorerPage.clickConfirmBtnForSavingTeamSheet();
        });

        await step(
          "Away player now becomes available in Starting Formation once both team sheets are set",
          async () => {
            await scorerPage.openStartingFormationOption();
            await scorerPage.click(
              scorerPage.awayTeamSheetTab(TeamsInTeamSheet.Awayteam),
            );

            expect(
              await scorerPage.isPlayerAvailableInFormation(
                PlayersInStartingFormation.ClubPlayer2,
              ),
            ).toBeTruthy();

            await scorerPage.dragPlayer(PlayersInStartingFormation.ClubPlayer2);
            await scorerPage.saveStartingFormation();
          },
        );
      }
    });
  },
);
