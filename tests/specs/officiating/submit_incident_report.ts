import allureReporter from "@wdio/allure-reporter";
import { step } from "../../utils/helpers";
import { LoginData } from "../../data/login.data";
import { IncidentData } from "../../data/incident.data";
import { HomePage } from "../../pages/home.page";
import { ScorerPage } from "../../pages/scorer.page";
import { IncidentPage } from "../../pages/incident";
import { MatchApiHelper } from "../../utils/matchApi.helper";

let matchId: number;
let token: string;

describe("Officiating tests", () => {
  const homePage = new HomePage();
  const scorerPage = new ScorerPage();
  const incidentPage = new IncidentPage();

  it("[INC-001] Submit incident report", async () => {
    allureReporter.addFeature("Incident / Discipline / Waiver");
    allureReporter.addStory("Submit incident report");
    allureReporter.addSeverity("critical");

    await step("Create match before launching app", async () => {
      token = await MatchApiHelper.getToken(
        LoginData.email,
        LoginData.password,
      );

      matchId = await MatchApiHelper.createMatch(token, 10);

      console.log("Created Match ID:", matchId);

      allureReporter.addAttachment(
        "Created Match ID",
        String(matchId),
        "text/plain",
      );
    });

    after(async () => {
      try {
        if (token && matchId) {
          await MatchApiHelper.deleteMatch(token, matchId);
          console.log(`Deleted Match ID: ${matchId}`);
        }
      } catch (error) {
        console.error("Failed to delete match:", error);
      }
    });

    await step("Team user signs in", async () => {
      await homePage.loginFlow(LoginData.email, LoginData.password);
    });

    await step(
      "Open a match from the Home screen and open settings",
      async () => {
        const matchElement = homePage.matchById(matchId.toString());
        await homePage.scrollUntilElementVisible(matchElement);
        await homePage.assertElementDisplayed(matchElement);
        await homePage.click(matchElement);
        await scorerPage.handleErrorPopup();
        await scorerPage.waitUntilVisibleWithRetry(scorerPage.matchTimer);
        await scorerPage.validateScorerScreenElements();
        await scorerPage.clickSettingsIcon();
      },
    );

    await step(
      "Open incident form, fill it in and submit the report",
      async () => {
        await incidentPage.assertReportOtherIncidentOption();
        await incidentPage.submitOtherIncidentReportWithDescription(
          IncidentData.otherIncidentDescription,
        );
      },
    );
  });
});
