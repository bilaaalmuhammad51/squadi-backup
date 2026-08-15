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

describe("Home Manager team officials - after lock, can VIEW (not edit) opposite team", () => {
  it("officials already assigned for both teams remain visible and read-only after lock", async () => {
    const loginPage = new LoginPage();
    const homePage = new HomePage();
    const scorerPage = new ScorerPage();
    const basePage = new BasePage();
    const teamOfficialsPage = new TeamOfficialsPage();

    allureReporter.addFeature("Home Manager Flow");
    allureReporter.addStory("Lock Attendance, Team Officials Permissions Flow");
    allureReporter.addSeverity("critical");

    await step(
      "Enable Lock Attendance, create match after lock time, and pre-assign officials for both teams via API",
      async () => {
        token = await MatchApiHelper.getToken(LoginData.email, LoginData.password);

        await MatchApiHelper.updateCompetitionSettings(token, "COURT", 160547, {
          lockAttendanceMinutes: 10,
        });

        matchId = await MatchApiHelper.createMatch(token, 0);

        await MatchApiHelper.updateMatchOfficials(token, matchId, true, true, true, true);

        console.log("Created Match ID:", matchId);

        allureReporter.addAttachment("Created Match ID", String(matchId), "text/plain");
      },
    );

    after(async () => {
      try {
        await MatchApiHelper.updateCompetitionSettings(token);
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

    await step("Enter valid credentials for Home Manager", async () => {
      await loginPage.addUserName(LoginData.manager1Email);
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
    });

    await step("Validate navigation to manager screen", async () => {
      await scorerPage.validateManagerScreenElements(matchId.toString());
    });

    await step("Open Team Officials", async () => {
      expect(await teamOfficialsPage.validateIfTeamOfficialsMenuAvailable()).toBeTruthy();
      await teamOfficialsPage.openTeamOfficials();
    });

    await step("Verify own (Home) team officials are visible and read-only after lock", async () => {
      await teamOfficialsPage.assertReadOnlySelectedRolesUsers("Syed Manager1", "Syed Coach1");
    });

    await step(
      "Switch to Away team and verify opposite team officials are visible (not hidden) and read-only",
      async () => {
        await teamOfficialsPage.click(scorerPage.awayTeamSheetTab(TeamsInTeamSheet.Awayteam));
        await teamOfficialsPage.assertReadOnlySelectedRolesUsers("Syed Manager2", "Syed Coach1");
      },
    );
  });
});
