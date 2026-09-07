import allureReporter from "@wdio/allure-reporter";
import { step } from "../../utils/helpers";
import { LoginData } from "../../data/login.data";
import { HomePage } from "../../pages/home.page";
import { itIfFeature } from "../../utils/features";

describe("Member - Persona Checklist", () => {
  const homePage = new HomePage();

  itIfFeature(
    "fieldClosure",
    "[TEAM-009] Field Closer Opens Field Closure",
    async () => {
      allureReporter.addFeature("Member Persona Checklist");
      allureReporter.addStory(
        "Login, open Field Closure from More tab, validate elements",
      );
      allureReporter.addSeverity("critical");

      await step("Field Closer Opens Field Closure", async () => {
        await homePage.loginFlow(LoginData.email, LoginData.password);
        await homePage.gotoMoreTab();
        await homePage.scrollUntilElementVisible(
          homePage.fieldClosureOptionInMoreTab,
        );
        await homePage.click(homePage.fieldClosureOptionInMoreTab);
        await homePage.waitUntilVisibleWithRetry(
          homePage.fieldClosureOptionInMoreTab,
        );
        await homePage.click(homePage.fieldClosureOptionInMoreTab);
        await homePage.waitUntilVisibleWithRetry(homePage.acceptAllButton);
        await homePage.click(homePage.acceptAllButton);
        const locatoinPopupVisible = await homePage.ifClosePopupVisible();
        if (locatoinPopupVisible) {
          await homePage.clickClosePopup();
        } else {
          await homePage.clickTapOnScreenToClosePopup();
        }
        await homePage.waitUntilVisibleWithRetry(homePage.squadiLogo);
      });
    },
  );
});
