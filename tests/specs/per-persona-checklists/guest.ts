import allureReporter from "@wdio/allure-reporter";
import { step } from "../../utils/helpers";
import { LoginPage } from "../../pages/login.page";
import { HomePage } from "../../pages/home.page";

describe("Guest - Persona Checklist", () => {
  const loginPage = new LoginPage();
  const homePage = new HomePage();

  before(async () => {
    // Ensure app is opened in guest state
    await step("Verify welcome screen is visible", async () => {
      await loginPage.validateLoginBtnIsVisible();
    });
  });

  it("TC-G1 - Guest sees the sign-in bottom navigation & TC-G2 - Account tab shows Register, Follow, Log in", async () => {
    allureReporter.addFeature("Guest Persona Checklist");
    allureReporter.addStory(
      "TC-G1 - Guest sees the sign-in bottom navigation & TC-G2 - Account tab shows Register, Follow, Log in",
    );
    allureReporter.addSeverity("critical");

    await step("Verify bottom navigation", async () => {
      await loginPage.assertElementDisplayed(homePage.homeTab);
      await loginPage.assertElementDisplayed(loginPage.updatesTab);
      await loginPage.assertElementDisplayed(loginPage.drawsTab);
      await loginPage.assertElementDisplayed(loginPage.moreTab);
      await loginPage.assertElementDisplayed(loginPage.loginTab);
    });

    await step("Verify Account tab content", async () => {
      await loginPage.assertElementDisplayed(loginPage.welcomeHeading);
      await loginPage.assertElementDisplayed(
        loginPage.createAccountOrRegisterProfile,
      );
      await loginPage.assertElementDisplayed(loginPage.followTeamOrLeague);
      await loginPage.assertElementDisplayed(loginPage.loginButton);
    });
  });

  it("TC-G3 - More menu hides member-only items & TC-G4 - Updates tab shows News and Notifications only & TC-G5 - Choose Language matches app version", async () => {
    allureReporter.addFeature("Guest Persona Checklist");
    allureReporter.addStory(
      "TC-G3 - More menu hides member-only items & TC-G4 - Updates tab shows News and Notifications only & TC-G5 - Choose Language matches app version",
    );
    allureReporter.addSeverity("critical");

    await step("Open More tab", async () => {
      await loginPage.gotoMoreTab();
    });

    await step("Verify public options are visible", async () => {
      await loginPage.assertMoreTabAvailableOptionsWhenLoggedOut();
    });

    await step("Verify member-only options are hidden", async () => {
      await loginPage.assertMoreTabUnavailableOptionsWhenLoggedOut();
    });

    await step("Open Updates tab", async () => {
      await loginPage.gotoUpdatesTab();
    });

    await step("Verify News and Notifications tabs", async () => {
      await loginPage.assertUpdatesTabElements();
    });

    await step("Open Choose Language", async () => {
      await loginPage.gotoMoreTab();
      await loginPage.clickChooseLanguageOptionInMoreTab();
    });

    await step("Select Español", async () => {
      await loginPage.selectSpanishLanguage();
    });

    await step("Restore default language", async () => {
      await loginPage.clickChooseLanguageOptionInSpanishInMoreTab();
      await loginPage.selectEnglishLanguageFromSpanish();
    });
  });
});
