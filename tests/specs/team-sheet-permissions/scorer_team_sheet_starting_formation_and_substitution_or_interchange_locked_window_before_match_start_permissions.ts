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
  PlayerPositions,
} from "../../data/teamSheet.data";
import { MatchApiHelper } from "../../utils/matchApi.helper";

let matchId: number;

let homePlayer1InitialPosition: { x: number; y: number };
let awayPlayer1InitialPosition: { x: number; y: number };
let homePlayer1FinalPosition: { x: number; y: number };
let awayPlayer1FinalPosition: { x: number; y: number };

describe("Scorer team sheet locked window (before match start) permissions", () => {
  it("log in with valid credentials, open a match, verify substitution and non-editable team sheet behavior, open starting formation and verify non-editable behavior for both teams", async () => {
    const loginPage = new LoginPage();
    const homePage = new HomePage();
    const scorerPage = new ScorerPage();
    const basePage = new BasePage();

    allureReporter.addFeature("Scoring Flow");
    allureReporter.addStory("Login, Team Sheet, and Match Scoring Flow");
    allureReporter.addSeverity("critical");

    await step("Create match before launching app", async () => {
      const token = await MatchApiHelper.getToken(
        LoginData.email,
        LoginData.password,
      );

      matchId = await MatchApiHelper.createMatch(token, 2);

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

    // Updating Team Sheet before Recording time
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
      await scorerPage.clickDoneBtn();
    });

    await step("Select players and their positions for away team", async () => {
      await scorerPage.validateAwayTeamSheetElements(TeamsInTeamSheet.Awayteam);
      await scorerPage.selectPlayerAndPositionOfTeam(
        PlayerNamesInTeamSheet.ClubPlayer2,
        PlayerPositions.Midfielder,
      );
      await scorerPage.clickDoneBtn();
    });

    await step("wait for recording time to start", async () => {
      await scorerPage.clickBackBtn();
      await scorerPage.clickBackBtn();
      await scorerPage.clickCloseBtnInSettings();
      await scorerPage.waitUntilTeamSheetBecomesSubstitution();
      await scorerPage.clickCloseBtnInSettings();
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
        PlayerNamesInTeamSheet.ClubPlayer1,
      );
      await scorerPage.selectOrUnselectPlayerInSubstitution(
        PlayerNamesInTeamSheet.ClubPlayer1,
      );
    });

    await step("Unselect and select players for away team", async () => {
      await scorerPage.validateAwaySubstitutionElements(
        TeamsInTeamSheet.Awayteam,
      );
      await scorerPage.selectOrUnselectPlayerInSubstitution(
        PlayerNamesInTeamSheet.ClubPlayer2,
      );

      await scorerPage.selectOrUnselectPlayerInSubstitution(
        PlayerNamesInTeamSheet.ClubPlayer2,
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
          PlayersInStartingFormation.ClubPlayer1,
        );

        await scorerPage.dragPlayer(PlayersInStartingFormation.ClubPlayer1);

        homePlayer1FinalPosition = await scorerPage.getPlayerPosition(
          PlayersInStartingFormation.ClubPlayer1,
        );
        expect(homePlayer1InitialPosition).toEqual(homePlayer1FinalPosition);
      },
    );

    await step(
      "validating uneditable away players behavior in Starting Formation",
      async () => {
        await scorerPage.click(
          scorerPage.awayTeamSheetTab(TeamsInTeamSheet.Awayteam),
        );
        awayPlayer1InitialPosition = await scorerPage.getPlayerPosition(
          PlayersInStartingFormation.ClubPlayer2,
        );

        await scorerPage.dragPlayer(PlayersInStartingFormation.ClubPlayer2);
        awayPlayer1FinalPosition = await scorerPage.getPlayerPosition(
          PlayersInStartingFormation.ClubPlayer2,
        );
        expect(awayPlayer1InitialPosition).toEqual(awayPlayer1FinalPosition);
      },
    );

    await step("back to settings", async () => {
      await scorerPage.clickBackBtn();
    });
  });
});
