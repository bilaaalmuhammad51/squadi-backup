import allureReporter from "@wdio/allure-reporter";
import { getRandomNumberInRange, step } from "../../utils/helpers";
import { LoginData } from "../../data/login.data";
import { LoginPage } from "../../pages/login.page";
import { HomePage } from "../../pages/home.page";
import { ScorerPage } from "../../pages/scorer.page";
import BasePage from "../../pages/base.page";
import {
  PlayerPositions,
  PlayersInStartingFormation,
  PlayerNamesInTeamSheet,
  TeamsInTeamSheet,
} from "../../data/teamSheet.data";

let homePlayer1InitialPosition: { x: number; y: number };
let homePlayer2InitialPosition: { x: number; y: number };
let homePlayer3InitialPosition: { x: number; y: number };
let awayPlayer1InitialPosition: { x: number; y: number };
let awayPlayer2InitialPosition: { x: number; y: number };
let awayPlayer3InitialPosition: { x: number; y: number };
let homePlayer1FinalPosition: { x: number; y: number };
let homePlayer2FinalPosition: { x: number; y: number };
let homePlayer3FinalPosition: { x: number; y: number };
let awayPlayer1FinalPosition: { x: number; y: number };
let awayPlayer2FinalPosition: { x: number; y: number };
let awayPlayer3FinalPosition: { x: number; y: number };

describe("Scorer team sheet recording window permissions", () => {
  it("should log in with valid credentials, open a match, update team sheets by adding players and editing shirt numbers, adjust starting formations by repositioning players for both teams, and verify that all changes are saved and persist correctly", async () => {
    const loginPage = new LoginPage();
    const homePage = new HomePage();
    const scorerPage = new ScorerPage();
    const basePage = new BasePage();

    allureReporter.addFeature("Scoring Flow");
    allureReporter.addStory("Login, Team Sheet, and Match Scoring Flow");
    allureReporter.addSeverity("critical");

    await step("Verify welcome screen is visible", async () => {
      await loginPage.validateLoginBtnIsVisible();
    });

    await step("Verify welcome screen elements", async () => {
      await loginPage.assertElementDisplayed(loginPage.welcomeHeading);
      await loginPage.assertElementDisplayed(
        loginPage.createAccountOrRegisterProfile,
      );
      await loginPage.assertElementDisplayed(loginPage.followTeamOrLeague);
      await loginPage.assertElementDisplayed(loginPage.loginButton);
    });

    await step("Navigate to login screen", async () => {
      await loginPage.click(loginPage.loginButton);
    });

    await step("Verify login screen elements", async () => {
      await loginPage.assertElementDisplayed(loginPage.backButton);
      await loginPage.assertElementDisplayed(loginPage.loginHeading);
      await loginPage.assertTextContains(
        loginPage.loginHeading,
        LoginData.loginHeading,
      );
      await loginPage.assertElementDisplayed(loginPage.rememberPassword);
      await loginPage.assertElementDisplayed(loginPage.forgotPassword);
    });

    await step("Enter valid credentials", async () => {
      await loginPage.addUserName(LoginData.email);
      await loginPage.addPassword(LoginData.password);
    });

    await step("Submit login", async () => {
      await loginPage.click(loginPage.login);
    });

    await step(
      "Validate successful login by checking Home screen",
      async () => {
        await homePage.waitUntilVisibleWithRetry(homePage.homeTab);
        await homePage.assertElementDisplayed(homePage.homeTab);
        await homePage.assertElementDisplayed(homePage.drawsTab);
        await homePage.assertElementDisplayed(homePage.laddersTab);
      },
    );

    await step("Open a match from the Home screen", async () => {
      const matchId = "69717";
      const matchElement = homePage.matchById(matchId);
      await basePage.scrollUntilElementVisible(matchElement);
      await homePage.assertElementDisplayed(matchElement);
      await homePage.click(matchElement);
      await scorerPage.handleErrorPopup();
      await scorerPage.waitUntilVisibleWithRetry(scorerPage.matchTimer);
    });

    await step("Validate navigation to scorer screen", async () => {
      await scorerPage.validateScorerScreenElements();
    });

    await step("Validate Start button is visible", async () => {
      await scorerPage.scrollDown();
      await scorerPage.assertElementDisplayed(scorerPage.startBtn);
    });

    await step("Open settings menu and validate options", async () => {
      await scorerPage.clickSettingsIcon();
      await scorerPage.validateTeamSheetOption();
      await scorerPage.validateStartingFormationOption();
    });

    await step(
      "Open team sheet option and validate team sheet elements",
      async () => {
        await scorerPage.openTeamSheetOption();
        await scorerPage.validateHomeTeamSheetElements(
          TeamsInTeamSheet.HomeTeam,
        );
      },
    );

    await step("Select players and their positions for home team", async () => {
      await scorerPage.selectPlayerAndPositionOfTeam(
        PlayerNamesInTeamSheet.HomePlayer1,
        PlayerPositions.Forward,
      );
      await scorerPage.selectPlayerAndPositionOfTeam(
        PlayerNamesInTeamSheet.HomePlayer2,
        PlayerPositions.Defender,
      );
      await scorerPage.click(
        scorerPage.homeTeamSheetTab(TeamsInTeamSheet.HomeTeam),
      );
      await scorerPage.selectPlayerAndPositionOfTeam(
        PlayerNamesInTeamSheet.HomePlayer3,
        PlayerPositions.Midfielder,
      );
    });

    await step("Edit shirt numbers for home team players", async () => {
      await scorerPage.editShirtNumberOfPlayerInTeamSheet(
        PlayerNamesInTeamSheet.HomePlayer1,
        getRandomNumberInRange(),
      );
      await scorerPage.editShirtNumberOfPlayerInTeamSheet(
        PlayerNamesInTeamSheet.HomePlayer2,
        getRandomNumberInRange(),
      );
      await scorerPage.editShirtNumberOfPlayerInTeamSheet(
        PlayerNamesInTeamSheet.HomePlayer3,
        getRandomNumberInRange(),
      );
    });

    await step(
      "validate auto tab switch to away team sheet and its elements",
      async () => {
        await scorerPage.clickDoneBtn();
      },
    );

    await step("Select players and their positions for away team", async () => {
      await scorerPage.selectPlayerAndPositionOfTeam(
        PlayerNamesInTeamSheet.AwayPlayer1,
        PlayerPositions.Midfielder,
      );
      await scorerPage.selectPlayerAndPositionOfTeam(
        PlayerNamesInTeamSheet.AwayPlayer2,
        PlayerPositions.Forward,
      );
      await scorerPage.selectPlayerAndPositionOfTeam(
        PlayerNamesInTeamSheet.AwayPlayer3,
        PlayerPositions.Goalkeeper,
      );
    });

    await step("Edit shirt numbers for away team players", async () => {
      await scorerPage.editShirtNumberOfPlayerInTeamSheet(
        PlayerNamesInTeamSheet.AwayPlayer1,
        getRandomNumberInRange(),
      );
      await scorerPage.editShirtNumberOfPlayerInTeamSheet(
        PlayerNamesInTeamSheet.AwayPlayer2,
        getRandomNumberInRange(),
      );
      await scorerPage.editShirtNumberOfPlayerInTeamSheet(
        PlayerNamesInTeamSheet.AwayPlayer3,
        getRandomNumberInRange(),
      );
    });

    await step("click Done button after managing team sheets", async () => {
      await scorerPage.clickDoneBtn();
    });

    await step("dragging home players in Starting Formation", async () => {
      await scorerPage.openStartingFormationOption();
      homePlayer1InitialPosition = await scorerPage.getPlayerPosition(
        PlayersInStartingFormation.HomePlayer1,
      );
      homePlayer2InitialPosition = await scorerPage.getPlayerPosition(
        PlayersInStartingFormation.HomePlayer2,
      );
      homePlayer3InitialPosition = await scorerPage.getPlayerPosition(
        PlayersInStartingFormation.HomePlayer3,
      );

      await scorerPage.dragPlayer(PlayersInStartingFormation.HomePlayer1);
      await scorerPage.dragPlayer(PlayersInStartingFormation.HomePlayer2);
      await scorerPage.saveStartingFormation();
    });

    await step("dragging away players in Starting Formation", async () => {
      await scorerPage.openStartingFormationOption();
      await scorerPage.click(
        scorerPage.awayTeamSheetTab(TeamsInTeamSheet.Awayteam),
      );
      awayPlayer1InitialPosition = await scorerPage.getPlayerPosition(
        PlayersInStartingFormation.AwayPlayer1,
      );
      awayPlayer2InitialPosition = await scorerPage.getPlayerPosition(
        PlayersInStartingFormation.AwayPlayer2,
      );
      awayPlayer3InitialPosition = await scorerPage.getPlayerPosition(
        PlayersInStartingFormation.AwayPlayer3,
      );
      await scorerPage.dragPlayer(PlayersInStartingFormation.AwayPlayer1);
      await scorerPage.dragPlayer(PlayersInStartingFormation.AwayPlayer2);
      await scorerPage.saveStartingFormation();
    });

    await step(
      "Verify if the changes persisted in Starting Formation",
      async () => {
        await scorerPage.clickSettingsIcon();
        await scorerPage.validateTeamSheetOption();
        await scorerPage.validateStartingFormationOption();
        await scorerPage.openStartingFormationOption();

        homePlayer1FinalPosition = await scorerPage.getPlayerPosition(
          PlayersInStartingFormation.HomePlayer1,
        );
        homePlayer2FinalPosition = await scorerPage.getPlayerPosition(
          PlayersInStartingFormation.HomePlayer2,
        );
        homePlayer3FinalPosition = await scorerPage.getPlayerPosition(
          PlayersInStartingFormation.HomePlayer3,
        );

        expect(homePlayer1InitialPosition).not.toEqual(
          homePlayer1FinalPosition,
        );
        expect(homePlayer2InitialPosition).not.toEqual(
          homePlayer2FinalPosition,
        );
        expect(homePlayer3InitialPosition).toEqual(homePlayer3FinalPosition);
        await scorerPage.click(
          scorerPage.awayTeamSheetTab(TeamsInTeamSheet.Awayteam),
        );
        await scorerPage.waitUntilVisibleWithRetry(
          scorerPage.playerIconToDragInStartingFormation(
            PlayersInStartingFormation.AwayPlayer1,
          ),
        );
        awayPlayer1FinalPosition = await scorerPage.getPlayerPosition(
          PlayersInStartingFormation.AwayPlayer1,
        );
        awayPlayer2FinalPosition = await scorerPage.getPlayerPosition(
          PlayersInStartingFormation.AwayPlayer2,
        );
        awayPlayer3FinalPosition = await scorerPage.getPlayerPosition(
          PlayersInStartingFormation.AwayPlayer3,
        );

        expect(awayPlayer1InitialPosition).not.toEqual(
          awayPlayer1FinalPosition,
        );
        expect(awayPlayer2InitialPosition).not.toEqual(
          awayPlayer2FinalPosition,
        );
        expect(awayPlayer3InitialPosition).toEqual(awayPlayer3FinalPosition);
        await scorerPage.saveStartingFormation();
        await scorerPage.waitUntilVisibleWithRetry(scorerPage.matchTimer);
        await scorerPage.validateScorerScreenElements();
      },
    );
  });
});
