import allureReporter from "@wdio/allure-reporter";
import { step } from "../../utils/helpers";
import { LoginData } from "../../data/login.data";
import { LoginPage } from "../../pages/login.page";
import { HomePage } from "../../pages/home.page";
import { ScorerPage } from "../../pages/scorer.page";
import BasePage from "../../pages/base.page";
import { Timeout } from "../../utils/timers";

describe("Match Scoring Flow", () => {
  it.skip("should log in with valid credentials, open a match, manage team sheets, start or resume play, and validate score increment and undo actions", async () => {
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
      const matchId = "69468";
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

    await step("Handle team sheet flow if alert is displayed", async () => {
      const isVisible = await scorerPage.isElementPresent(scorerPage.teamSheetAlert, Timeout.TWO_SECONDS);
      
      if (isVisible) {
        await scorerPage.click(scorerPage.teamSheetAlert);

        await step("Validate and submit home team players", async () => {
          await scorerPage.validateHomeTeamSheetElements("HR-ASN2Club1-D1-T2");
          await scorerPage.submitHomeTeamPlayersIfNotSubmitted("Test17");
        });

        await step("Validate and submit away team players", async () => {
          await scorerPage.validateAwayTeamSheetElements("HR-ASN2Club2-D1-T3");
          await scorerPage.submitAwayTeamPlayersIfNotSubmitted("Test18");
        });

        await scorerPage.clickDoneBtn();
      }
    });

    await step("Start or resume the match", async () => {
      await scorerPage.handleStartOrResumeMatch();
    });

    let initialHomeTeamScore: string;
    let initialAwayTeamScore: string;
    let homeTeamScoreAfter: string;
    let awayTeamScoreAfter: string;
    let homeTeamScoreAfterUndo: string;
    let awayTeamScoreAfterUndo: string;

    await step("Capture initial team scores", async () => {
      initialHomeTeamScore = await scorerPage.getTeamScores(
        scorerPage.homeTeamScore,
      );
      initialAwayTeamScore = await scorerPage.getTeamScores(
        scorerPage.awayTeamScore,
      );
    });

    await step(
      "Add score for home team and validate score update",
      async () => {
        await scorerPage.addTeamScore(scorerPage.addHomeTeamScore);
        homeTeamScoreAfter = await scorerPage.getTeamScores(
          scorerPage.homeTeamScore,
        );
        expect(homeTeamScoreAfter).not.toEqual(initialHomeTeamScore);
      },
    );

    await step(
      "Add score for away team and validate score update",
      async () => {
        await scorerPage.addTeamScore(scorerPage.addAwayTeamScore);
        awayTeamScoreAfter = await scorerPage.getTeamScores(
          scorerPage.awayTeamScore,
        );
        expect(awayTeamScoreAfter).not.toEqual(initialAwayTeamScore);
      },
    );

    await step("Undo home team score and validate score reset", async () => {
      await scorerPage.undoTeamScore(scorerPage.undoHomeTeamScoreBtn);
      homeTeamScoreAfterUndo = await scorerPage.getTeamScores(
        scorerPage.homeTeamScore,
      );
      expect(homeTeamScoreAfterUndo).toEqual(initialHomeTeamScore);
    });

    await step("Undo away team score and validate score reset", async () => {
      await scorerPage.undoTeamScore(scorerPage.undoAwayTeamScoreBtn);
      awayTeamScoreAfterUndo = await scorerPage.getTeamScores(
        scorerPage.awayTeamScore,
      );
      expect(awayTeamScoreAfterUndo).toEqual(initialAwayTeamScore);
    });
  });
});
