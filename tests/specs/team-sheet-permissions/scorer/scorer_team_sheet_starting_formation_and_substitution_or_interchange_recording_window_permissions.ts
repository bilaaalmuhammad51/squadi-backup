import allureReporter from "@wdio/allure-reporter";
import { getRandomNumberInRange, step } from "../../../utils/helpers";
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

let matchId: number;
let token: string;

let homePlayer1InitialPosition: { x: number; y: number };
let awayPlayer1InitialPosition: { x: number; y: number };
let homePlayer1FinalPosition: { x: number; y: number };
let awayPlayer1FinalPosition: { x: number; y: number };

describe("Scorer team sheet recording window permissions", () => {
  it("should log in with valid credentials, open a match, update team sheets by adding players and editing shirt numbers, adjust starting formations by repositioning players for both teams, and verify that all changes are saved and persist correctly", async () => {
    const loginPage = new LoginPage();
    const homePage = new HomePage();
    const scorerPage = new ScorerPage();
    const basePage = new BasePage();

    allureReporter.addFeature("Scoring Flow");
    allureReporter.addStory("Login, Team Sheet, and Match Scoring Flow");
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
        PlayerNamesInTeamSheet.ClubPlayer1,
        PlayerPositions.Forward,
      );
    });

    await step("Edit shirt numbers for home team players", async () => {
      await scorerPage.editShirtNumberOfPlayerInTeamSheet(
        PlayerNamesInTeamSheet.ClubPlayer1,
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
        PlayerNamesInTeamSheet.ClubPlayer2,
        PlayerPositions.Midfielder,
      );
    });

    await step("Edit shirt numbers for away team players", async () => {
      await scorerPage.editShirtNumberOfPlayerInTeamSheet(
        PlayerNamesInTeamSheet.ClubPlayer2,
        getRandomNumberInRange(),
      );
    });

    await step("click Done button after managing team sheets", async () => {
      await scorerPage.clickDoneBtn();
    });

    await step("dragging home players in Starting Formation", async () => {
      await scorerPage.openStartingFormationOption();
      homePlayer1InitialPosition = await scorerPage.getPlayerPosition(
        PlayersInStartingFormation.ClubPlayer1,
      );

      await scorerPage.dragPlayer(PlayersInStartingFormation.ClubPlayer1);
      await scorerPage.saveStartingFormation();
    });

    await step("dragging away players in Starting Formation", async () => {
      await scorerPage.openStartingFormationOption();
      await scorerPage.click(
        scorerPage.awayTeamSheetTab(TeamsInTeamSheet.Awayteam),
      );
      awayPlayer1InitialPosition = await scorerPage.getPlayerPosition(
        PlayersInStartingFormation.ClubPlayer2,
      );
      await scorerPage.dragPlayer(PlayersInStartingFormation.ClubPlayer2);
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
          PlayersInStartingFormation.ClubPlayer1,
        );

        expect(homePlayer1InitialPosition).not.toEqual(
          homePlayer1FinalPosition,
        );
        await scorerPage.click(
          scorerPage.awayTeamSheetTab(TeamsInTeamSheet.Awayteam),
        );
        await scorerPage.waitUntilVisibleWithRetry(
          scorerPage.playerIconToDragInStartingFormation(
            PlayersInStartingFormation.ClubPlayer2,
          ),
        );
        awayPlayer1FinalPosition = await scorerPage.getPlayerPosition(
          PlayersInStartingFormation.ClubPlayer2,
        );

        expect(awayPlayer1InitialPosition).not.toEqual(
          awayPlayer1FinalPosition,
        );
        await scorerPage.saveStartingFormation();
        await scorerPage.waitUntilVisibleWithRetry(scorerPage.matchTimer);
        // await scorerPage.validateScorerScreenElements();
      },
    );
  });
});
