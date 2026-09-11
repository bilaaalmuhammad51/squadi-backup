import allureReporter from "@wdio/allure-reporter";
import { step } from "../../utils/helpers";
import { LoginData } from "../../data/login.data";
import { LoginPage } from "../../pages/login.page";
import { HomePage } from "../../pages/home.page";

describe("Shop Admin and Payment Terminal - Persona Checklist", () => {
  it("[S27,S28] Tap to Pay Android only for shop admin, Canteen Android only for payment terminal", async () => {
    const loginPage = new LoginPage();
    const homePage = new HomePage();

    allureReporter.addFeature(
      "Shop Admin and Payment Terminal Persona Checklist",
    );
    allureReporter.addStory(
      "Tap to Pay Android only for shop admin, Canteen Android only for payment terminal",
    );
    allureReporter.addSeverity("high");

    await step("Coach signs in with valid credentials", async () => {
      await homePage.loginFlow(LoginData.coachEmail, LoginData.password);
    });

    await step(
      "Open the More menu and validate Tap to Pay is visible on Android and hidden on iOS",
      async () => {
        await loginPage.validateTapToPayVisibilityInMoreTab();
      },
    );

    await step(
      "Open the More menu and validate Canteen is visible on Android (opening Canteen Categories) and hidden on iOS",
      async () => {
        await loginPage.validateCanteenVisibilityAndOpensCanteenCategories();
      },
    );
  });
});
