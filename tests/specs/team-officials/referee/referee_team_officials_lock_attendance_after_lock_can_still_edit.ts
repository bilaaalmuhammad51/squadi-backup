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

describe("Referee team officials - Lock Attendance ON, after lock - both teams still editable", () => {
  it("log in as Referee, open a match after lock time, edit and save officials for both teams", async () => {
    const loginPage = new LoginPage();
    const homePage = new HomePage();
    const scorerPage = new ScorerPage();
    const basePage = new BasePage();
    const teamOfficialsPage = new TeamOfficialsPage();

    allureReporter.addFeature("Referee Flow");
    allureReporter.addStory("Lock Attendance, Team Officials Permissions Flow");
    allureReporter.addSeverity("critical");

    await step(
      "Enable Lock Attendance and create+publish match after lock time",
      async () => {
        const token = await MatchApiHelper.getToken(
          LoginData.email,
          LoginData.password,
        );

        await MatchApiHelper.updateCompetitionSettings(token, {
          lockAttendanceMinutes: 10,
        });

        matchId = await MatchApiHelper.createAndPublishMatch(0);

        allureReporter.addAttachment(
          "Created Match ID",
          String(matchId),
          "text/plain",
        );
      },
    );

    after(async () => {
      const token = await MatchApiHelper.getToken(
        LoginData.email,
        LoginData.password,
      );
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
      await loginPage.addUserName(LoginData.refereeEmail);
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
      await homePage.clickYesForMatch(matchId);
      await homePage.click(matchElement);
      await scorerPage.handleErrorPopup();
    });

    await step(
      "Validate navigation to referee screen and it's options",
      async () => {
        await scorerPage.validateRefereeScreenElements(matchId.toString());
      },
    );

    await step(
      "Open Team Officials and validate it's elements are still enabled after lock",
      async () => {
        expect(
          await teamOfficialsPage.validateIfTeamOfficialsMenuAvailable(),
        ).toBeTruthy();
        await teamOfficialsPage.openTeamOfficials();
        await teamOfficialsPage.assertTeamOfficialsEnabledElements();
      },
    );

    await step("Select Manager and Coach for Home team", async () => {
      await teamOfficialsPage.searchAndSelectManager("Syed");
      await teamOfficialsPage.searchAndSelectCoach("Syed");
      await teamOfficialsPage.clickConfirmTeamOfficials();
    });

    await step("Select Manager and Coach for Away team", async () => {
      await teamOfficialsPage.searchAndSelectManager("Syed");
      await teamOfficialsPage.searchAndSelectCoach("Syed");
      await teamOfficialsPage.clickConfirmTeamOfficials();
    });

    await step(
      "Open Team Officials and verify both teams saved and persisted after lock",
      async () => {
        await teamOfficialsPage.openTeamOfficials();
        await teamOfficialsPage.validateSelectedRolesUsers(
          "Syed Manager1",
          "Syed Coach1",
        );
        await teamOfficialsPage.click(
          scorerPage.awayTeamSheetTab(TeamsInTeamSheet.Awayteam),
        );
        await teamOfficialsPage.validateSelectedRolesUsers(
          "Syed Manager2",
          "Syed Coach1",
        );
      },
    );
  });
});
