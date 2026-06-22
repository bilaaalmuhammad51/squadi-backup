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

let matchId: number;
let token: string;

describe("Manager team sheet pre-recording window permissions", () => {
  it("log in with valid credentials, open a match, update team sheets by adding players, adjust starting formations by repositioning players for respective team", async () => {
    const loginPage = new LoginPage();
    const homePage = new HomePage();
    const scorerPage = new ScorerPage();
    const basePage = new BasePage();

    allureReporter.addFeature("Manager Flow");
    allureReporter.addStory("Login, Team Sheet, and Match Scoring Flow");
    allureReporter.addSeverity("critical");

    await step("Create match before launching app", async () => {
      token = await MatchApiHelper.getToken(
        LoginData.email,
        LoginData.password,
      );

      matchId = await MatchApiHelper.createMatch(token, 9);

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
      await loginPage.addUserName(LoginData.manager1Email);
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
    });

    await step("Validate navigation to manager screen", async () => {
      await scorerPage.validateManagerScreenElements(matchId.toString());
    });

    await step("validate manager page options", async () => {
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

    await step("validate Team Sheet not available for away team", async () => {
      await scorerPage.waitUntilVisibleWithRetry(
        scorerPage.awayTeamSheetTab(TeamsInTeamSheet.Awayteam),
      );
      await scorerPage.assertElementDisplayed(
        scorerPage.awayTeamSheetTab(TeamsInTeamSheet.Awayteam),
      );
      await scorerPage.click(
        scorerPage.awayTeamSheetTab(TeamsInTeamSheet.Awayteam),
      );
      await scorerPage.validateTeamSheetNotAvailable();
    });

    await step("click Done button after managing team sheets", async () => {
      await scorerPage.click(
        scorerPage.homeTeamSheetTab(TeamsInTeamSheet.HomeTeam),
      );
      await scorerPage.clickDoneBtn();
    });

    await step("dragging home players in Starting Formation", async () => {
      await scorerPage.dragPlayer(PlayersInStartingFormation.ClubPlayer1);
    });

    await step("away players in Starting Formation", async () => {
      await scorerPage.click(
        scorerPage.homeTeamSheetTab(TeamsInTeamSheet.Awayteam),
      );
    });

    await step("save Starting Formation", async () => {
      await scorerPage.saveStartingFormation();
      await scorerPage.waitUntilVisibleWithRetry(scorerPage.fieldOption);
      await scorerPage.clickBackBtn();
    });

    await step("Logout and Log In again with Team2 Manager", async () => {
      await scorerPage.logoutUser();
    });
    await step("Verify welcome screen is visible", async () => {
      await loginPage.gotoLoginTab();
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
      await loginPage.addUserName(LoginData.manager2Email);
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
    });

    await step("Validate navigation to manager screen", async () => {
      await scorerPage.validateManagerScreenElements(matchId.toString());
    });

    await step("validate manager page options", async () => {
      await scorerPage.validateTeamSheetOption();
      await scorerPage.validateStartingFormationOption();
    });

    await step(
      "Open team sheet option and validate Team Sheet not available for home team",
      async () => {
        await scorerPage.openTeamSheetOption();
        await scorerPage.waitUntilVisibleWithRetry(
          scorerPage.awayTeamSheetTab(TeamsInTeamSheet.HomeTeam),
        );
        await scorerPage.assertElementDisplayed(
          scorerPage.awayTeamSheetTab(TeamsInTeamSheet.HomeTeam),
        );
        await scorerPage.click(
          scorerPage.awayTeamSheetTab(TeamsInTeamSheet.HomeTeam),
        );
        await scorerPage.validateTeamSheetNotAvailable();
      },
    );

    await step("Select players and their positions for away team", async () => {
      await scorerPage.validateAwayTeamSheetElements(TeamsInTeamSheet.Awayteam);
      await scorerPage.selectPlayerAndPositionOfTeam(
        PlayerNamesInTeamSheet.ClubPlayer2,
        PlayerPositions.Midfielder,
      );
    });

    await step("click Done button after managing team sheets", async () => {
      await scorerPage.clickDoneBtn();
    });

    await step(
      "validate home players not available in Starting Formation",
      async () => {
        expect(
          await scorerPage.isPlayerAvailableInFormation(
            PlayersInStartingFormation.ClubPlayer1,
          ),
        ).toBeFalsy();
      },
    );

    await step("dragging away players in Starting Formation", async () => {
      await scorerPage.click(
        scorerPage.awayTeamSheetTab(TeamsInTeamSheet.Awayteam),
      );
      await scorerPage.dragPlayer(PlayersInStartingFormation.ClubPlayer2);
    });

    await step("save Starting Formation", async () => {
      await scorerPage.saveStartingFormation();
      await scorerPage.waitUntilVisibleWithRetry(scorerPage.fieldOption);
      await scorerPage.clickBackBtn();
    });
  });
});
