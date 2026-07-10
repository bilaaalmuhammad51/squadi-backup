import allureReporter from "@wdio/allure-reporter";
import { step } from "../../utils/helpers";
import { LoginPage } from "../../pages/login.page";
import { HomePage } from "../../pages/home.page";

describe("Guest - Persona Flow", () => {
  it("should allow a guest user to open different tabs and validate elements", async () => {
    allureReporter.addFeature("Guest Persona Flow");
    allureReporter.addStory("Open different tabs and validate elements");
    allureReporter.addSeverity("critical");

    const loginPage = new LoginPage();
    const homePage = new HomePage();

    await step("Verify welcome screen is visible", async () => {
      await loginPage.validateLoginBtnIsVisible();
    });

    await step("Verify Login tab welcome screen elements", async () => {
      await loginPage.assertElementDisplayed(loginPage.welcomeHeading);
      await loginPage.assertElementDisplayed(
        loginPage.createAccountOrRegisterProfile,
      );
      await loginPage.assertElementDisplayed(loginPage.followTeamOrLeague);
      await loginPage.assertElementDisplayed(loginPage.loginButton);
    });

    await step("Verify More tab screen elements", async () => {
      await loginPage.gotoMoreTab();
      await loginPage.assertMoreTabAvailableOptionsWhenLoggedOut();
      await loginPage.assertMoreTabUnavailableOptionsWhenLoggedOut();
    });

    await step("Verify Draws tab screen elements", async () => {
      await loginPage.gotoDrawsTab();
      await loginPage.assertDrawsTabElements();
    });

    await step("Verify Updates tab screen elements", async () => {
      await loginPage.gotoUpdatesTab();
      await loginPage.assertUpdatesTabElements();
    });

    await step("Verify Home tab screen elements", async () => {
      await homePage.gotoHomeTab();
      await homePage.assertHomeTabElements();
    });
  });
});
