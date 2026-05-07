import allureReporter from "@wdio/allure-reporter";
import { step } from "../../utils/helpers";
import { LoginData } from "../../data/login.data";
import { LoginPage } from "../../pages/login.page";
import { HomePage } from "../../pages/home.page";
import { ScorerPage } from "../../pages/scorer.page";
import BasePage from "../../pages/base.page";
import {
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

describe("Scorer team sheet post match (after starting match) permissions", () => {
  it("log in with valid credentials, open a match, verify substitution behavior, open starting formation and verify non-editable behavior for both teams", async () => {
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
      const matchId = "69729";
      const matchElement = homePage.matchById(matchId);
      await basePage.scrollUntilElementVisible(matchElement);
      await homePage.assertElementDisplayed(matchElement);
      await homePage.click(matchElement);
      await scorerPage.handleErrorPopup();
      await scorerPage.waitUntilVisibleWithRetry(scorerPage.matchTimer);
    });

    await step("Validate navigation to scorer screen", async () => {
      await scorerPage.validateScorerScreenElements();
      await scorerPage.scrollDown();
      await scorerPage.assertElementDisplayed(scorerPage.pauseBtn);
    });

    await step("Open settings menu and validate options", async () => {
      await scorerPage.clickSettingsIcon();
      await scorerPage.assertElementNotDisplayed(scorerPage.teamSheetOption);
      await scorerPage.validateSubstitutionOption();
      await scorerPage.validateStartingFormationOption();
    });

    await step(
      "Open substitution option and validate team sheet elements",
      async () => {
        await scorerPage.openSubstitutionOption();
        await scorerPage.validateHomeSubstitutionElements(
          TeamsInTeamSheet.HomeTeam,
        );
      },
    );

    await step("Unselect and select players for home team", async () => {
      await scorerPage.selectOrUnselectPlayerInSubstitution(
        PlayerNamesInTeamSheet.HomePlayer1,
      );
      await scorerPage.selectOrUnselectPlayerInSubstitution(
        PlayerNamesInTeamSheet.HomePlayer2,
      );
      await scorerPage.selectOrUnselectPlayerInSubstitution(
        PlayerNamesInTeamSheet.HomePlayer3,
      );
      await scorerPage.selectOrUnselectPlayerInSubstitution(
        PlayerNamesInTeamSheet.HomePlayer1,
      );
      await scorerPage.selectOrUnselectPlayerInSubstitution(
        PlayerNamesInTeamSheet.HomePlayer2,
      );
      await scorerPage.selectOrUnselectPlayerInSubstitution(
        PlayerNamesInTeamSheet.HomePlayer3,
      );
    });

    await step("Unselect and select players for away team", async () => {
      await scorerPage.validateAwaySubstitutionElements(
        TeamsInTeamSheet.Awayteam,
      );
      await scorerPage.selectOrUnselectPlayerInSubstitution(
        PlayerNamesInTeamSheet.AwayPlayer1,
      );
      await scorerPage.selectOrUnselectPlayerInSubstitution(
        PlayerNamesInTeamSheet.AwayPlayer2,
      );
      await scorerPage.selectOrUnselectPlayerInSubstitution(
        PlayerNamesInTeamSheet.AwayPlayer3,
      );
      await scorerPage.selectOrUnselectPlayerInSubstitution(
        PlayerNamesInTeamSheet.AwayPlayer1,
      );
      await scorerPage.selectOrUnselectPlayerInSubstitution(
        PlayerNamesInTeamSheet.AwayPlayer2,
      );
      await scorerPage.selectOrUnselectPlayerInSubstitution(
        PlayerNamesInTeamSheet.AwayPlayer3,
      );
    });

    await step("click Done button after managing team sheets", async () => {
      await scorerPage.clickDoneBtn();
    });

    await step("opening Starting Formation", async () => {
      await scorerPage.openStartingFormationOption();
    });

    await step(
      "validating uneditable home players behavior in Starting Formation",
      async () => {
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
        await scorerPage.dragPlayer(PlayersInStartingFormation.HomePlayer2);
        homePlayer1FinalPosition = await scorerPage.getPlayerPosition(
          PlayersInStartingFormation.HomePlayer1,
        );
        homePlayer2FinalPosition = await scorerPage.getPlayerPosition(
          PlayersInStartingFormation.HomePlayer2,
        );
        homePlayer3FinalPosition = await scorerPage.getPlayerPosition(
          PlayersInStartingFormation.HomePlayer3,
        );
        expect(homePlayer1InitialPosition).toEqual(homePlayer1FinalPosition);
        expect(homePlayer2InitialPosition).toEqual(homePlayer2FinalPosition);
        expect(homePlayer3InitialPosition).toEqual(homePlayer3FinalPosition);
      },
    );

    await step(
      "validating uneditable away players behavior in Starting Formation",
      async () => {
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
        await scorerPage.dragPlayer(PlayersInStartingFormation.AwayPlayer3);
        awayPlayer1FinalPosition = await scorerPage.getPlayerPosition(
          PlayersInStartingFormation.AwayPlayer1,
        );
        awayPlayer2FinalPosition = await scorerPage.getPlayerPosition(
          PlayersInStartingFormation.AwayPlayer2,
        );
        awayPlayer3FinalPosition = await scorerPage.getPlayerPosition(
          PlayersInStartingFormation.AwayPlayer3,
        );
        expect(awayPlayer1InitialPosition).toEqual(awayPlayer1FinalPosition);
        expect(awayPlayer2InitialPosition).toEqual(awayPlayer2FinalPosition);
        expect(awayPlayer3InitialPosition).toEqual(awayPlayer3FinalPosition);
      },
    );

    await step("back to settings", async () => {
      await scorerPage.clickBackBtn();
    });
  });
});
