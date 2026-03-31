import allureReporter from "@wdio/allure-reporter";
import { step } from "../../utils/helpers";
import { invalidLoginErrorData, LoginData } from "../../data/login.data";
import { LoginPage } from "../../pages/login.page";

describe("Authentication - Invalid Login Flow with invalid credentials", () => {
  it("should display an error message for invalid login credential combinations", async () => {
    const loginPage = new LoginPage();

    allureReporter.addFeature("Authentication");
    allureReporter.addStory("Invalid Login Validation");
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
});
