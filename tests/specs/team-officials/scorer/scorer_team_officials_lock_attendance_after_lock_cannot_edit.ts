import allureReporter from "@wdio/allure-reporter";
import { step } from "../../../utils/helpers";
import { LoginData } from "../../../data/login.data";
import { LoginPage } from "../../../pages/login.page";
import { HomePage } from "../../../pages/home.page";
import { ScorerPage } from "../../../pages/scorer.page";
import BasePage from "../../../pages/base.page";
import { TeamsInTeamSheet } from "../../../data/teamSheet.data";
import { MatchApiHelper } from "../../../utils/matchApi.helper";
import { TeamOfficialsPage } from "../../../pages/teamOfficials.page";

let matchId: number;
let token: string;

describe("Scorer team officials - Lock Attendance ON, after lock - editing blocked for both teams", () => {
  it("log in as Scorer, open a match after lock time, verify team officials are not editable for either team", async () => {
    const loginPage = new LoginPage();
    const homePage = new HomePage();
    const scorerPage = new ScorerPage();
    const basePage = new BasePage();
    const teamOfficialsPage = new TeamOfficialsPage();

    allureReporter.addFeature("Scorer Flow");
    allureReporter.addStory("Lock Attendance, Team Officials Permissions Flow");
    allureReporter.addSeverity("critical");

    await step("Enable Lock Attendance and create match after lock time", async () => {
      token = await MatchApiHelper.getToken(LoginData.email, LoginData.password);

      await MatchApiHelper.updateCompetitionScoring(token, "COURT", 160547, {
        lockAttendanceMinutes: 10,
      });

      matchId = await MatchApiHelper.createMatch(token, 0);

      console.log("Created Match ID:", matchId);

      allureReporter.addAttachment("Created Match ID", String(matchId), "text/plain");
    });

    after(async () => {
      try {
        await MatchApiHelper.updateCompetitionScoring(token);
        console.log("Lock Attendance disabled");
      } catch (error) {
        console.error("Failed to disable Lock Attendance:", error);
      }
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
      await loginPage.assertElementDisplayed(loginPage.createAccountOrRegisterProfile);
      await loginPage.assertElementDisplayed(loginPage.followTeamOrLeague);
      await loginPage.assertElementDisplayed(loginPage.loginButton);
    });

    await step("Navigate to login screen", async () => {
      await loginPage.click(loginPage.loginButton);
    });

    await step("Verify login screen elements", async () => {
      await loginPage.assertElementDisplayed(loginPage.backButton);
      await loginPage.assertElementDisplayed(loginPage.loginHeading);
      await loginPage.assertTextContains(loginPage.loginHeading, LoginData.loginHeading);
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

    await step("Validate successful login by checking Home screen", async () => {
      await homePage.waitUntilVisibleWithRetry(homePage.homeTab);
      await homePage.assertElementDisplayed(homePage.homeTab);
      await homePage.assertElementDisplayed(homePage.drawsTab);
      await homePage.assertElementDisplayed(homePage.laddersTab);
    });

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
      await scorerPage.validateSubstitutionOption();
      await scorerPage.validateStartingFormationOption();
    });

    await step("Validate and Open Team Officials", async () => {
      expect(await teamOfficialsPage.validateIfTeamOfficialsMenuAvailable()).toBeTruthy();
      await teamOfficialsPage.openTeamOfficials();
    });

    await step("Validate disabled Home Team elements", async () => {
      await teamOfficialsPage.assertDisabledTeamOfficialsElements();
    });

    await step("Validate disabled Away Team elements", async () => {
      await teamOfficialsPage.click(scorerPage.awayTeamSheetTab(TeamsInTeamSheet.Awayteam));
      await teamOfficialsPage.assertDisabledTeamOfficialsElements();
    });
  });
});
