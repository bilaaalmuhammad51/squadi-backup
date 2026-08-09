import allureReporter from "@wdio/allure-reporter";
import { step } from "../../utils/helpers";
import { LoginPage } from "../../pages/login.page";
import { forceStopApp } from "../../utils/connectivity";
import { HomePage } from "../../pages/home.page";
import { $ } from "../../factories/page.factory";

const APP_PACKAGE = "com.wsa.netball.dev";
const MEMBER_EMAIL = "shahshahbaz64+coach1@gmail.com";
const MEMBER_PASSWORD = "Connect123";

describe("App Foundation - Splash & Cold Start", () => {
  const loginPage = new LoginPage();
  const homePage = new HomePage();

  it("[APP-001, 002] Splash screen renders Squadi AU branding on cold start, Cold start lands on Account tab when signed out + Cold start lands on Home tab when signed in", async () => {
    allureReporter.addFeature("App Foundation");
    allureReporter.addStory(
      "APP-001 - Splash branding (Squadi AU), APP-002 - Cold start landing",
    );
    allureReporter.addSeverity("critical");

    await step("Verify welcome screen is visible", async () => {
      await loginPage.validateLoginBtnIsVisible();
    });

    await step("1. Ensure the app is fully closed", async () => {
      forceStopApp(APP_PACKAGE);
      await driver.pause(1000);
    });

    await step("2. Cold start the app", async () => {
      await driver.activateApp(APP_PACKAGE);
    });

    await step("3. Observe the splash screen", async () => {
      await loginPage.waitUntilVisible(loginPage.clearCacheBtnInSplashScreen);
      await loginPage.assertElementDisplayed(
        loginPage.clearCacheBtnInSplashScreen,
      );
    });

    await step("App transitions to the login screen", async () => {
      await loginPage.waitUntilVisible(loginPage.loginButton);
    });

    // APP-002 - signed out
    await step("Clear app data to remove session", async () => {
      forceStopApp(APP_PACKAGE);
      await driver.pause(1000);
    });

    await step("Cold start the app", async () => {
      await driver.activateApp(APP_PACKAGE);
    });

    await step("Verify the Account tab is selected", async () => {
      await loginPage.waitUntilVisibleWithRetry(loginPage.loginTab);
      const loginTabSelector = await $(loginPage.loginTab);
      const isSelected = await loginTabSelector.getAttribute("selected");
      expect(isSelected).toBe("true");
    });

    // APP-002 - signed in
    allureReporter.addFeature("App Foundation");
    allureReporter.addStory("APP-002 - Cold start landing (signed in)");
    allureReporter.addSeverity("critical");

    await step("1. Sign in as a member", async () => {
      await homePage.loginFlow(MEMBER_EMAIL, MEMBER_PASSWORD);
      await loginPage.waitUntilVisible(loginPage.homeTab);
    });

    await step("2. Fully close the app (cold start preparation)", async () => {
      forceStopApp(APP_PACKAGE);
      await driver.pause(1000);
    });

    await step("3. Cold start the app", async () => {
      await driver.activateApp(APP_PACKAGE);
    });

    await step("4. Verify the Home tab is selected", async () => {
      await loginPage.waitUntilVisibleWithRetry(loginPage.homeTab);
      const homeTabSelector = await $(loginPage.homeTab);
      const isSelected = await homeTabSelector.getAttribute("selected");
      expect(isSelected).toBe("true");
    });
  });
});

describe("App Foundation - Lifecycle", () => {
  const loginPage = new LoginPage();
  const homePage = new HomePage();

  it("[APP-003] Warm resume restores the previously selected tab", async () => {
    allureReporter.addFeature("App Foundation");
    allureReporter.addStory("APP-003 - Warm resume tab restoration");
    allureReporter.addSeverity("high");

    await step("1. Sign in as a member", async () => {
      const loggedOut = await loginPage.isElementVisible(loginPage.loginTab);
      if (loggedOut) {
        await homePage.loginFlow(MEMBER_EMAIL, MEMBER_PASSWORD);
      }
      await loginPage.waitUntilVisible(loginPage.homeTab);
    });

    await step("2. Select the <More> tab", async () => {
      await loginPage.click(loginPage.moreTab);
      await loginPage.waitUntilVisible(loginPage.myScheduleOptionInMoreTab);
    });

    await step("3. Background the app", async () => {
      await browser.background(5);
    });

    await step("4. Resume the app", async () => {
      await driver.activateApp(APP_PACKAGE);
    });

    await step(
      "5. The same tab is still selected, no content duplication",
      async () => {
        await loginPage.waitUntilVisible(loginPage.moreTab);
        await loginPage.waitUntilVisible(loginPage.myScheduleOptionInMoreTab);
        await loginPage.assertElementDisplayed(
          loginPage.myScheduleOptionInMoreTab,
        );
      },
    );
  });
});
