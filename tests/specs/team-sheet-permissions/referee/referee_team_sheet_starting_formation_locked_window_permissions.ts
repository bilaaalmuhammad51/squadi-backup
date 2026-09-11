import allureReporter from "@wdio/allure-reporter";
import { step } from "../../../utils/helpers";
import { LoginData } from "../../../data/login.data";
import { LoginPage } from "../../../pages/login.page";
import { HomePage } from "../../../pages/home.page";
import { ScorerPage } from "../../../pages/scorer.page";
import BasePage from "../../../pages/base.page";
import {
  PlayerPositions,
  PlayerNamesInTeamSheet,
  TeamsInTeamSheet,
} from "../../../data/teamSheet.data";
import { MatchApiHelper } from "../../../utils/matchApi.helper";
import { hasFeature } from "../../../utils/features";

let matchId: number;

describe("Referee team sheet locked window permissions", () => {
  it("log in as Referee, confirm the Substitution row is never shown (S10), and submit the Team Sheet for both teams while the match is in the locked window", async () => {
    const loginPage = new LoginPage();
    const homePage = new HomePage();
    const scorerPage = new ScorerPage();
    const basePage = new BasePage();

    allureReporter.addFeature("Referee Flow");
    allureReporter.addStory("Login, Team Sheet, and Match Scoring Flow");
    allureReporter.addSeverity("critical");

    await step("Create match before launching app", async () => {
      matchId = await MatchApiHelper.createAndPublishMatch(-10);

      console.log("Created Match ID:", matchId);

      allureReporter.addAttachment(
        "Created Match ID",
        String(matchId),
        "text/plain",
      );
    });

    after(async () => {
      const token = await MatchApiHelper.getToken(
        LoginData.email,
        LoginData.password,
      );
      try {
        if (token && matchId) {
          await MatchApiHelper.deleteMatch(token, matchId);
          console.log(`Deleted Match ID: ${matchId}`);
        }
      } catch (error) {
        console.error("Failed to delete match:", error);
      }
    });

    await step(
      "Verify welcome screen and its elements are displayed",
      async () => {
        await loginPage.validateLoginBtnIsVisible();
        await loginPage.assertElementDisplayed(loginPage.welcomeHeading);
        await loginPage.assertElementDisplayed(
          loginPage.createAccountOrRegisterProfile,
        );
        await loginPage.assertElementDisplayed(loginPage.followTeamOrLeague);
        await loginPage.assertElementDisplayed(loginPage.loginButton);
      },
    );

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

    await step("Enter valid credentials and submit login", async () => {
      await loginPage.addUserName(LoginData.refereeEmail);
      await loginPage.addPassword(LoginData.password);
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
      await homePage.clickYesForMatch(matchId);
      await homePage.click(matchElement);
      await scorerPage.handleErrorPopup();
    });

    await step(
      "Validate navigation to Referee screen and confirm Starting Formation row is absent (Referee has no field_positions)",
      async () => {
        await scorerPage.validateRefereeScreenElements(matchId.toString());
      },
    );

    await step(
      "Validate Substitution row is never shown to Referee, even locked",
      async () => {
        await scorerPage.assertElementNotDisplayed(
          scorerPage.substitutionOption,
        );
      },
    );

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
      await scorerPage.clickConfirmBtnForSavingTeamSheet();
    });

    await step(
      "Select players and their positions for away team, then click Confirm to save (and Done to dismiss the Starting Formation prompt if enabled)",
      async () => {
        await scorerPage.click(
          scorerPage.awayTeamSheetTab(TeamsInTeamSheet.Awayteam),
        );
        await scorerPage.selectPlayerAndPositionOfTeam(
          PlayerNamesInTeamSheet.ClubPlayer2,
          PlayerPositions.Forward,
        );
        await scorerPage.clickConfirmBtnForSavingTeamSheet();
        if (hasFeature("startingFormation")) {
          await scorerPage.clickDoneBtn();
        }
      },
    );

    await step(
      "Open Game Referees option and validate its elements",
      async () => {
        await scorerPage.openGameRefereesOption();
        await scorerPage.validateRefereesElements();
        await scorerPage.clickBackBtn();
      },
    );

    await step("going back and validating Field option", async () => {
      await scorerPage.waitUntilVisibleWithRetry(scorerPage.fieldOrCourtOption);
      await scorerPage.clickBackBtn();
    });
  });
});
