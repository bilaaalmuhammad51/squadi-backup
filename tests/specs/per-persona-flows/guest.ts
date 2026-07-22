import allureReporter from "@wdio/allure-reporter";
import { step } from "../../utils/helpers";
import { LoginPage } from "../../pages/login.page";
import { HomePage } from "../../pages/home.page";
import { invalidLoginErrorData, LoginData } from "../../data/login.data";
import { LaddersPage } from "../../pages/ladders.page";
import { MatchApiHelper } from "../../utils/matchApi.helper";

describe("Guest - Persona Flow", () => {
  const loginPage = new LoginPage();
  const homePage = new HomePage();
  const laddersPage = new LaddersPage();

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
});
