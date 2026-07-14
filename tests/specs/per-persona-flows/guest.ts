import allureReporter from "@wdio/allure-reporter";
import { step } from "../../utils/helpers";
import { LoginPage } from "../../pages/login.page";
import { HomePage } from "../../pages/home.page";
import { invalidLoginErrorData, LoginData } from "../../data/login.data";
import { LaddersPage } from "../../pages/ladders.page";

describe("Guest - Persona Flow", () => {
  const loginPage = new LoginPage();
  const homePage = new HomePage();

  it("[TC-G7] Wrong password shows error, stays on sign-in nav", async () => {
    allureReporter.addFeature("Guest Persona Flow");
    allureReporter.addStory(
      "TC-G7 - Wrong password shows error, stays on sign-in nav",
    );
    allureReporter.addSeverity("critical");

    await step("Verify welcome screen is visible", async () => {
      await loginPage.validateLoginBtnIsVisible();
    });

    await step("Open login screen", async () => {
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

    // ---------- Case 1 ----------
    await step(
      "Validate error for unregistered email with valid password",
      async () => {
        await loginPage.addUserName(invalidLoginErrorData.cases[0].email);
        await loginPage.addPassword(invalidLoginErrorData.cases[0].password);
        await loginPage.click(loginPage.login);

        await loginPage.waitUntilVisibleWithRetry(
          loginPage.invalidUsernameOrPass,
        );
        await loginPage.assertTextContains(
          loginPage.invalidUsernameOrPass,
          invalidLoginErrorData.invalidUsernameOrPassword,
        );
        await loginPage.click(loginPage.okButton);
      },
    );

    // ---------- Case 2 ----------
    await step(
      "Validate error for valid email with invalid password",
      async () => {
        await loginPage.addUserName(invalidLoginErrorData.cases[1].email);
        await loginPage.addPassword(invalidLoginErrorData.cases[1].password);
        await loginPage.click(loginPage.login);

        await loginPage.waitUntilVisibleWithRetry(
          loginPage.invalidUsernameOrPass,
        );
        await loginPage.assertTextContains(
          loginPage.invalidUsernameOrPass,
          invalidLoginErrorData.invalidUsernameOrPassword,
        );
        await loginPage.click(loginPage.okButton);
      },
    );

    // ---------- Case 3 ----------
    await step(
      "Validate error for invalid email with valid password",
      async () => {
        await loginPage.addUserName(invalidLoginErrorData.cases[2].email);
        await loginPage.addPassword(invalidLoginErrorData.cases[2].password);
        await loginPage.click(loginPage.login);

        await loginPage.waitUntilVisibleWithRetry(
          loginPage.invalidUsernameOrPass,
        );
        await loginPage.assertTextContains(
          loginPage.invalidUsernameOrPass,
          invalidLoginErrorData.invalidUsernameOrPassword,
        );
        await loginPage.click(loginPage.okButton);
      },
    );

    // ---------- Case 4 ----------
    await step(
      "Validate error for both email and password invalid",
      async () => {
        await loginPage.addUserName(invalidLoginErrorData.cases[3].email);
        await loginPage.addPassword(invalidLoginErrorData.cases[3].password);
        await loginPage.click(loginPage.login);

        await loginPage.waitUntilVisibleWithRetry(
          loginPage.invalidUsernameOrPass,
        );
        await loginPage.assertTextContains(
          loginPage.invalidUsernameOrPass,
          invalidLoginErrorData.invalidUsernameOrPassword,
        );
        await loginPage.click(loginPage.okButton);
      },
    );
  });

  it("[TC-G9] Guest signs in successfully", async () => {
    allureReporter.addFeature("Guest Persona Flow");
    allureReporter.addStory("TC-G9 - Guest signs in successfully");
    allureReporter.addSeverity("critical");

    await step("Verify welcome screen is visible", async () => {
      await loginPage.waitUntilVisibleWithRetry(loginPage.loginButton);
    });

    await step("Open login screen", async () => {
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

      allureReporter.addAttachment(
        "Login Email",
        LoginData.email,
        "text/plain",
      );
    });

    await step("Submit login", async () => {
      await loginPage.click(loginPage.login);
    });

    await step("Verify user lands on Home screen", async () => {
      await homePage.verifyHomeScreenElements();
    });

    await step("Logout user", async () => {
      await loginPage.logoutUser();
      await loginPage.gotoLoginTab();
    });
  });

  it("[TC-G14] Guest follows then unfollows a team", async () => {
    allureReporter.addFeature("Guest Persona Flow");
    allureReporter.addStory("TC-G14 - Guest follows then unfollows a team");
    allureReporter.addSeverity("critical");
    const laddersPage = new LaddersPage();

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
      }
    });
  });
});
