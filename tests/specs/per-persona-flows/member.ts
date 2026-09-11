import allureReporter from "@wdio/allure-reporter";
import { step } from "../../utils/helpers";
import { LoginData } from "../../data/login.data";
import { HomePage } from "../../pages/home.page";
import { MatchApiHelper } from "../../utils/matchApi.helper";
import { ScorerPage } from "../../pages/scorer.page";

let matchId: number;
let token: string;

describe("Member - Persona Flow", () => {
  const homePage = new HomePage();
  const scorerPage = new ScorerPage();

  before(async () => {
    await step("Create match before launching app", async () => {
      token = await MatchApiHelper.getToken(
        LoginData.email,
        LoginData.password,
      );

      matchId = await MatchApiHelper.createMatch(token, 2);

      console.log("Created Match ID:", matchId);

      allureReporter.addAttachment(
        "Created Match ID",
        String(matchId),
        "text/plain",
      );
    });
  });

  after(async () => {
    token = await MatchApiHelper.getToken(LoginData.email, LoginData.password);
    try {
      if (token && matchId) {
        await MatchApiHelper.deleteMatch(token, matchId);
        console.log(`Deleted Match ID: ${matchId}`);
      }
    } catch (error) {
      console.error("Failed to delete match:", error);
    }
  });

  it("[TC-M7] Change password and stay signed in", async () => {
    allureReporter.addFeature("Member Persona Flow");
    allureReporter.addStory("Login, open different tabs, validate elements");
    allureReporter.addSeverity("critical");

    await homePage.loginFlow(LoginData.email, LoginData.password);
    await step("Change password and stay signed in", async () => {
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

  it("[TC-M9] Member signs out then signs back in", async () => {
    await step("Member signs out then signs back in", async () => {
      await homePage.gotoMoreTab();
      await homePage.logoutUser();
      await homePage.gotoLoginTab();
      await homePage.loginFlow(LoginData.coachEmail, LoginData.password);
    });
  });

  it("[TC-M10] Opens a match from the Home schedule", async () => {
    await step("Opens a match from the Home schedule", async () => {
      const matchElement = homePage.matchById(matchId.toString());
      await scorerPage.scrollUntilElementVisible(matchElement);
      await homePage.assertElementDisplayed(matchElement);
      await homePage.click(matchElement);
      await scorerPage.validateCoachScreenElements(matchId.toString());
      await scorerPage.clickBackBtn();
    });
  });

  it("[TC-M13] Opens profile & payment pages", async () => {
    await step(
      "Open My Profile, My Full Profile and validate the elements",
      async () => {
        await homePage.gotoMoreTab();
        await homePage.openMyProfileFromMoreTab();
        await homePage.openMyFullProfileFromMyProfileAndAssertItsElements();
        await homePage.clickCloseCrossBtn();
      },
    );

    await step(
      "Open My Payment Methods and validate the elements",
      async () => {
        await homePage.openMyPaymentMethodsFromMyProfileAndAssertItsElements();
        await homePage.clickCloseCrossBtn();
        await homePage.clickBackBtn();
      },
    );
  });

  it("[HOME-007] My Memberships is not available under My Profile on Squadi", async () => {
    allureReporter.addFeature("Home & Navigation");
    allureReporter.addStory(
      "My Memberships is not available under My Profile on Squadi",
    );
    allureReporter.addSeverity("normal");

    await step(
      "Open More > My Profile and confirm My Memberships is not offered on Squadi",
      async () => {
        await homePage.assertMyMembershipsNotAvailableInMyProfile();
      },
    );
  });

  it("[TC-M14] Opens My Events", async () => {
    await step("Open My Events and validate its elements", async () => {
      await homePage.openMyEventsFromMoreTabAndAssertItsElements();
      await homePage.clickBackBtn();
    });

    await step("Member signs out then signs back in", async () => {
      await homePage.gotoMoreTab();
      await homePage.logoutUser();
      await homePage.gotoLoginTab();
      await homePage.loginFlow(LoginData.email, LoginData.password);
      await homePage.gotoMoreTab();
    });
  });

  it("[TC-M15] App settings persist", async () => {
    await step("Open App Settings and validate available options", async () => {
      await homePage.openAppSettingsAndValidateItsOptions();
    });

    await step(
      "Open Home Screen Filters and and validate available options and their behavior in defferent scenarios",
      async () => {
        let applyButtonAtTheBottom: ChainablePromiseElement;
        await homePage.openHomeScreenFilterAndValidateItsOptions();
        applyButtonAtTheBottom = await homePage.getElement(
          homePage.applyButtonAtTheBottom,
        );
        await homePage.expectElementState(applyButtonAtTheBottom, "disabled");
        await homePage.assertUncheckedHomeScreenFilterOptions();
        await homePage.checkUncheckHomeScreenFilters(true);
        await homePage.waitUntilVisibleWithRetry(homePage.homeTab);
        await homePage.gotoMoreTab();
        await homePage.openAppSettingsAndValidateItsOptions();
        await homePage.openHomeScreenFilterAndValidateItsOptions();
        await homePage.assertCheckedHomeScreenFilterOptions();
        await homePage.checkUncheckHomeScreenFilters(false);
        await homePage.waitUntilVisibleWithRetry(homePage.homeTab);
        await homePage.gotoMoreTab();
        await homePage.openAppSettingsAndValidateItsOptions();
        await homePage.openHomeScreenFilterAndValidateItsOptions();
        await homePage.assertUncheckedHomeScreenFilterOptions();
        await homePage.checkUncheckHomeScreenFilters(true);
        await homePage.gotoMoreTab();
        await homePage.openAppSettingsAndValidateItsOptions();
        await homePage.openHomeScreenFilterAndValidateItsOptions();
        await homePage.assertCheckedHomeScreenFilterOptions();
        await homePage.clearHomeFilters();
        await homePage.clickBackBtn();
        await homePage.clickBackBtn();
      },
    );
  });

  it("[TC-M16] Signed-in member changes language & shares app", async () => {
    await step("Signed-in member changes language", async () => {
      await homePage.gotoMoreTab();
      await homePage.clickChooseLanguageOptionInMoreTab();
      await homePage.assertEnglishLanguageSelected();
      await homePage.selectSpanishLanguage();
      await homePage.clickChooseLanguageOptionInMoreTab();
      await homePage.assertSpanishLanguageSelected();
      await homePage.selectEnglishLanguage();
      await homePage.clickChooseLanguageOptionInMoreTab();
      await homePage.assertEnglishLanguageSelected();
      await homePage.clickBackBtn();
    });
  });

  it("[TC-M17] Opens User Videos", async () => {
    await step(
      "Open User Videos from More Tab and validate its elements",
      async () => {
        await homePage.gotoMoreTab();
        await homePage.openUserVideosOptionInMoreTabAndAssertElements();
      },
    );
  });
});
