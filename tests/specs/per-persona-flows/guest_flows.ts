import allureReporter from "@wdio/allure-reporter";
import { step } from "../../utils/helpers";
import { LoginPage } from "../../pages/login.page";
import { HomePage } from "../../pages/home.page";
import { LoginData } from "../../data/login.data";
import { LaddersPage } from "../../pages/ladders.page";
import { MatchApiHelper } from "../../utils/matchApi.helper";

describe("Guest - Persona Flows", () => {
  const loginPage = new LoginPage();
  const homePage = new HomePage();
  const laddersPage = new LaddersPage();

it("[TC-G14] Guest follows then unfollows a team", async () => {
    allureReporter.addFeature("Guest Persona Flow");
    allureReporter.addStory("TC-G14 - Guest follows then unfollows a team");
    allureReporter.addSeverity("critical");

    await step("Verify welcome screen is visible", async () => {
      await loginPage.waitUntilVisibleWithRetry(loginPage.loginButton);
    });

    await step("Follow a team", async () => {
      await loginPage.click(loginPage.followTeamOrLeague);
    });
    await step("Open Ladders Tab and add Team if neeeded", async () => {
      const teamName = "HR-ASN2CLUB2";
      await laddersPage.searchTeamAndSelect(teamName);
    });

    await step("Unfollow the team", async () => {
      await loginPage.click(loginPage.followTeamOrLeague);
      await laddersPage.waitUntilVisibleWithRetry(
        laddersPage.cancelBtnForSelectedTeam,
      );
      await laddersPage.assertElementDisplayed(
        laddersPage.cancelBtnForSelectedTeam,
      );
      await laddersPage.click(laddersPage.cancelBtnForSelectedTeam);
      await laddersPage.click(laddersPage.doneBtn);
    });
  });

  it("[TC-G16] Guest browses public Ladders / Draws / News", async () => {
    allureReporter.addFeature("Guest Persona Flow");
    allureReporter.addStory(
      "TC-G16 - Guest browses public Ladders / Draws / News",
    );
    allureReporter.addSeverity("critical");
    const laddersPage = new LaddersPage();

    await step("Verify welcome screen is visible", async () => {
      await loginPage.waitUntilVisibleWithRetry(loginPage.loginButton);
    });

    await step("go to More -> Ladders and verify it's elements", async () => {
      await loginPage.gotoMoreTab();
      await loginPage.click(loginPage.laddersOptionInMoreTab);
      await laddersPage.waitUntilVisibleWithRetry(laddersPage.addTeamOrLeague);
      await laddersPage.clickBackBtn();
    });

    await step("Open Draws Tab and then Updates tab", async () => {
      await loginPage.gotoDrawsTab();
      await laddersPage.waitUntilVisibleWithRetry(laddersPage.addTeamOrLeague);
      await loginPage.gotoUpdatesTab();
      await loginPage.assertUpdatesTabElements();
      await loginPage.gotoLoginTab();
    });
  });

  it("[TC-G12] Guest resets a forgotten password", async () => {
    allureReporter.addFeature("Authentication");
    allureReporter.addStory("Login");
    allureReporter.addSeverity("critical");

    const loginPage = new LoginPage();

    await step("Verify welcome screen is visible", async () => {
      await loginPage.waitUntilVisibleWithRetry(loginPage.loginButton);
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

    await step("Forgot password flow", async () => {
      await loginPage.clickForgotPassword();
      const isPopupVisible = await loginPage.ifClosePopupVisible();
      const isAcceptAllVisible = await loginPage.isAcceptAllButtonVisible();

      if (isPopupVisible) {
        if (driver.isAndroid) {
          await loginPage.clickClosePopup();
          await loginPage.clickNextButton();
          await loginPage.addUsernameOrEmailForForgotPasswordFlow(
            LoginData.email,
          );
          await loginPage.clickAcceptAllButton();
          await loginPage.scrollDown();
          await loginPage.clickSubmitBtnForForgotPasswordFlow();
          await loginPage.verifyTextAfterSubmittingUsernameOrEmail();
        }
        if (driver.isIOS) {
          await loginPage.clickClosePopup();
          await loginPage.clickAcceptAllButton();
          await loginPage.clickNextButton();
          await loginPage.addUsernameOrEmailForForgotPasswordFlow(
            LoginData.email,
          );
          await loginPage.scrollDown();
          await loginPage.clickSubmitBtnForForgotPasswordFlow();
          await loginPage.verifyTextAfterSubmittingUsernameOrEmail();
        }
      } else if (isAcceptAllVisible) {
        await loginPage.clickAcceptAllButton();
        await loginPage.clickTapOnScreenToClosePopup();
        await loginPage.clickNextButton();
        await loginPage.addUsernameOrEmailForForgotPasswordFlow(
          LoginData.email,
        );
        await loginPage.scrollDown();
        await loginPage.clickSubmitBtnForForgotPasswordFlow();
        await loginPage.verifyTextAfterSubmittingUsernameOrEmail();
        await loginPage.clickCloseCrossBtn();
        await loginPage.clickBackBtn();
      }
    });
  });

  it("[TC-G17] Guest opens a public live match page", async () => {
    allureReporter.addFeature("Guest Persona Flow");
    allureReporter.addStory("TC-G17 Guest opens a public live match page");
    allureReporter.addSeverity("critical");

    const loginPage = new LoginPage();
    let matchId: number;
    let token: string;

    await step("Verify welcome screen is visible", async () => {
      await loginPage.waitUntilVisibleWithRetry(loginPage.loginButton);
    });

    await step("Verify welcome screen elements", async () => {
      await loginPage.assertElementDisplayed(loginPage.welcomeHeading);
      await loginPage.assertElementDisplayed(
        loginPage.createAccountOrRegisterProfile,
      );
      await loginPage.assertElementDisplayed(loginPage.followTeamOrLeague);
      await loginPage.assertElementDisplayed(loginPage.loginButton);
    });

    await step("Create a match", async () => {
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

    after(async () => {
      token = await MatchApiHelper.getToken(
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

    await step("go to Draws tab and open a live match", async () => {
      await loginPage.gotoDrawsTab();
      await loginPage.click(loginPage.addTeamOrLeague);
      const teamName = "HR-ASN2CLUB2";
      await laddersPage.searchTeamAndSelect(teamName);
      const matchElement = homePage.matchById(matchId.toString());
      await homePage.scrollUntilElementVisible(matchElement);
      await homePage.assertElementDisplayed(matchElement);
      await homePage.click(matchElement);
    });
  });
});
