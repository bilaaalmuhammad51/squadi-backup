import allureReporter from "@wdio/allure-reporter";
import { step } from "../../utils/helpers";
import { LoginData } from "../../data/login.data";
import { IncidentPage } from "../../pages/incident";
import { MatchApiHelper } from "../../utils/matchApi.helper";
import { HomePage } from "../../pages/home.page";
import { ScorerPage } from "../../pages/scorer.page";

let matchId: number;

describe("Officiating tests", () => {
  const incidentPage = new IncidentPage();
  const homePage = new HomePage();
  const scorerPage = new ScorerPage();

  it("[OFFICIAL-001] Umpire submits a send-off report at the supported text limit", async () => {
    allureReporter.addFeature("Communication Tests");
    allureReporter.addStory("Login, open Messages tab, validate elements");
    allureReporter.addSeverity("critical");

    await step("Create match before launching app", async () => {
      matchId = await MatchApiHelper.createAndPublishMatch(10);

      allureReporter.addAttachment(
        "Created Match ID",
        String(matchId),
        "text/plain",
      );
    });

    after(async () => {
      const token = await MatchApiHelper.getToken(
        LoginData.email,
        LoginData.password,
      );
      try {
        if (token && matchId) {
          await MatchApiHelper.deleteMatch(token, matchId);
          console.log(`Deleted Match ID: ${matchId}`);
        }
      } catch (error) {
        console.error("Failed to delete match:", error);
      }
    });

    await step("[TC-M1] Member signs in and lands on Home", async () => {
      await homePage.loginFlow(LoginData.refereeEmail, LoginData.password);
    });

    await step("Open a match from the Home screen", async () => {
      const matchElement = homePage.matchById(matchId.toString());
      await homePage.scrollUntilElementVisible(matchElement);
      await homePage.assertElementDisplayed(matchElement);
      await homePage.click(matchElement);
      await homePage.clickYesForMatch(matchId);
      await homePage.click(matchElement);
      await scorerPage.handleErrorPopup();
    });

    await step(
      "Validate navigation to referee screen and it's options",
      async () => {
        await scorerPage.validateRefereeScreenElements(matchId.toString());
      },
    );

    await step("Submit Referee Report", async () => {
      await incidentPage.submitRefereeReport();
    });
  });
});
