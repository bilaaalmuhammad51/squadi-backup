import allureReporter from "@wdio/allure-reporter";
import { step } from "../../utils/helpers";
import { LoginData } from "../../data/login.data";
import { HomePage } from "../../pages/home.page";
import { LaddersPage } from "../../pages/ladders.page";

describe("Member - Persona Checklist", () => {
  const laddersPage = new LaddersPage();
  const homePage = new HomePage();

  it("[TC-M1,M2,M3] Member signs in and lands on Home; Home shows schedule, tasks, news; Home bell opens Updates", async () => {
    allureReporter.addFeature("Member Persona Checklist");
    allureReporter.addStory("Login, open different tabs, validate elements");
    allureReporter.addSeverity("critical");

    await step("[TC-M1] Member signs in and lands on Home", async () => {
      await homePage.loginFlow(LoginData.coachEmail, LoginData.password);
    });

    await step("[TC-M2] Home shows schedule, tasks, news", async () => {
      await homePage.gotoHomeTab();
      await homePage.assertHomeTabElementsAfterLogin();
    });

    await step("[TC-M3] Home bell opens Updates", async () => {
      await homePage.openNotificationsAndAssertItsElements();
      await homePage.click(homePage.crossCloseBtn);
    });
  });

  it("[TC-M4] Ladders show the right columns per app", async () => {
    await step("Open Ladders Tab and add Team if neeeded", async () => {
      await laddersPage.openLaddersTab();
      const isTeamAdded = await laddersPage.isTeamAddedOrNot();
      if (!isTeamAdded) {
        await laddersPage.cancelSelectedTeamIfNeeded();
        await laddersPage.click(laddersPage.addTeamBtn);
        const teamName = "HR-ASN2CLUB2";
        await laddersPage.searchTeamAndSelect(teamName);
      }
    });

    await step("Start validating Ladders Tab elements", async () => {
      await laddersPage.waitUntilVisibleWithRetry(laddersPage.shortTab, 5);
      await laddersPage.assertElementDisplayed(laddersPage.fullTab);
      await laddersPage.assertElementDisplayed(laddersPage.formTab);
    });

    await step("Open Short Ladders Tab And Validate The Elements", async () => {
      await laddersPage.openShortLaddersTab();
      await laddersPage.validateShortLaddersTabElements();
    });

    await step("Open Full Ladders Tab And Validate The Elements", async () => {
      await laddersPage.openFullLaddersTab();
      await laddersPage.validateFullLaddersTabElements();
    });

    await step("Open Form Ladders Tab And Validate The Elements", async () => {
      await laddersPage.openFormLaddersTab();
      await laddersPage.validateFormLaddersTabElements();
    });
  });

  it("[TC-M6] Opens Shop & Registration webviews without re-login", async () => {
    await step(
      "Open Register option from More tab and assert its elements",
      async () => {
        await homePage.gotoMoreTab();
        await homePage.waitUntilVisibleWithRetry(
          homePage.registerOptionInMoreTab,
        );
        await homePage.click(homePage.registerOptionInMoreTab);
        await homePage.waitUntilVisibleWithRetry(homePage.crossCloseBtn);
        await homePage.waitUntilVisibleWithRetry(
          homePage.registerOptionInMoreTab,
        );
        await homePage.click(homePage.registerOptionInMoreTab);
        await homePage.waitUntilVisibleWithRetry(
          homePage.signUpToCompetitionHeading,
        );
        await homePage.assertElementDisplayed(
          homePage.signUpToCompetitionHeading,
        );
        await homePage.click(homePage.crossCloseBtn);
      },
    );

    await step(
      "Open Register option from More tab and assert its elements",
      async () => {
        await homePage.gotoMoreTab();
        await homePage.scrollUntilElementVisible(homePage.shopOptionInMoreTab);
        await homePage.click(homePage.shopOptionInMoreTab);
        await homePage.waitUntilVisibleWithRetry(homePage.crossCloseBtn);
        await homePage.waitUntilVisibleWithRetry(homePage.shopOptionInMoreTab);
        await homePage.click(homePage.shopOptionInMoreTab);
        await homePage.waitUntilVisibleWithRetry(
          homePage.merchandiseShopInShop,
        );
        await homePage.assertElementDisplayed(homePage.merchandiseShopInShop);
        await homePage.click(homePage.crossCloseBtn);
      },
    );
  });

  it("[TC-M7] Change password", async () => {
    await step("Change password and stay signed in", async () => {
      await homePage.gotoHomeTab();
      await homePage.gotoMoreTab();
      await homePage.waitUntilVisibleWithRetry(
        homePage.myProfileOptionInMoreTab,
      );
      await homePage.click(homePage.myProfileOptionInMoreTab);
      await homePage.waitUntilVisibleWithRetry(
        homePage.updatePasswordOptionInMyProfile,
      );
      await homePage.click(homePage.updatePasswordOptionInMyProfile);
      await homePage.waitUntilVisibleWithRetry(
        homePage.newPasswordHeadingInUpdatePassword,
      );
      await homePage.assertElementDisplayed(
        homePage.newPasswordHeadingInUpdatePassword,
      );
      await homePage.assertElementDisplayed(
        homePage.retypePasswordHeadingInUpdatePassword,
      );
      await homePage.clickBackBtn();
      await homePage.clickBackBtn();
    });
  });

  it("[F15] Member opens a news article", async () => {
    allureReporter.addFeature("Member Persona Flows");
    allureReporter.addStory("Open News Article");
    allureReporter.addSeverity("normal");

    await step(
      "[F15] Open a news item and validate the article body",
      async () => {
        await homePage.gotoHomeTab();
        await homePage.openAndAssertNewsArticle();
      },
    );
  });
});
