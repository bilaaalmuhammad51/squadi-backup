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

    await homePage.loginFlow(LoginData.coachEmail, LoginData.password);
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

  it("[TC-M9,M10] Member signs out then signs back in; Opens a match from the Home schedule", async () => {
    await step("Member signs out then signs back in", async () => {
      await homePage.gotoMoreTab();
      await homePage.logoutUser();
      await homePage.gotoLoginTab();
      await homePage.loginFlow(LoginData.coachEmail, LoginData.password);
    });

    await step("Opens a match from the Home schedule", async () => {
      const matchElement = homePage.matchById(matchId.toString());
      await scorerPage.scrollUntilElementVisible(matchElement);
      await homePage.assertElementDisplayed(matchElement);
      await homePage.click(matchElement);
      await scorerPage.validateCoachScreenElements(matchId.toString());
      await scorerPage.clickBackBtn();
    });
  });
});
