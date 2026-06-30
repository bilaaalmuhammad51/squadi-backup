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

describe("Home team Manager team officials before lock permissions - only home team editable", () => {
  it("log in with valid credentials, open a match, update team officials by adding respective roles", async () => {
    const loginPage = new LoginPage();
    const homePage = new HomePage();
    const scorerPage = new ScorerPage();
    const basePage = new BasePage();
    const teamOfficialsPage = new TeamOfficialsPage();

    allureReporter.addFeature("Referee Flow");
    allureReporter.addStory("Login, Team Sheet, and Match Scoring Flow");
    allureReporter.addSeverity("critical");

    await step("Create match before launching app", async () => {
      matchId = await MatchApiHelper.createAndPublishMatch(420);

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

    // await step("Open a match from the Home screen", async () => {
    //   const matchElement = homePage.matchById(matchId.toString());
    //   await basePage.scrollUntilElementVisible(matchElement);
    //   await homePage.assertElementDisplayed(matchElement);
    //   await homePage.click(matchElement);
    //   await homePage.clickYesForMatch(matchId);
    //   await homePage.click(matchElement);
    //   await scorerPage.handleErrorPopup();
    // });

    // await step(
    //   "Validate navigation to referee screen and it's options",
    //   async () => {
    //     await scorerPage.validateRefereeScreenElements(matchId.toString());
    //   },
    // );
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

    await step("Open Team Officials and validate it's elements", async () => {
      expect(
        await teamOfficialsPage.validateIfTeamOfficialsMenuAvailable(),
      ).toBeTruthy();
      await teamOfficialsPage.openTeamOfficials();
      await teamOfficialsPage.assertTeamOfficialsScreenElements();
    });
    await step("Select Manger and Coach for Team1", async () => {
      await teamOfficialsPage.searchAndSelectManager("Syed");
      await teamOfficialsPage.searchAndSelectCoach("Syed");
      await teamOfficialsPage.clickConfirmTeamOfficials();
    });
    await step("Select Manger and Coach for Team2", async () => {
      await teamOfficialsPage.teamSheetNotAvailableForTeam();
      await teamOfficialsPage.clickBackBtn();
      //   await teamOfficialsPage.searchAndSelectManager("Syed");
      //   await teamOfficialsPage.searchAndSelectCoach("Syed");
      //   await teamOfficialsPage.clickConfirmTeamOfficials();
    });
    await step(
      "Open Team Officials and verify selected Coaches and Managers",
      async () => {
        await teamOfficialsPage.openTeamOfficials();
        await teamOfficialsPage.validateSelectedRolesUsers(
          "Syed Manager1",
          "Syed Coach1",
        );
        await teamOfficialsPage.click(
          scorerPage.awayTeamSheetTab(TeamsInTeamSheet.Awayteam),
        );
        await teamOfficialsPage.teamSheetNotAvailableForTeam();
      },
    );
  });
});
