import allureReporter from "@wdio/allure-reporter";
import { step } from "../../utils/helpers";
import { LoginData } from "../../data/login.data";
import { LoginPage } from "../../pages/login.page";

describe("Authentication - Forgot Password Flow", () => {
  it("should allow a registered user to recover forgotten password and log in", async () => {
    allureReporter.addFeature("Authentication");
    allureReporter.addStory("Login");
    allureReporter.addSeverity("critical");

    const loginPage = new LoginPage();

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
