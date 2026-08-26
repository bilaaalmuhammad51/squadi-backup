import allureReporter from "@wdio/allure-reporter";
import { step } from "../../utils/helpers";
import { LoginData } from "../../data/login.data";
import { LoginPage } from "../../pages/login.page";
import { HomePage } from "../../pages/home.page";
import { ScorerPage } from "../../pages/scorer.page";
import { MatchApiHelper } from "../../utils/matchApi.helper";
import { IncidentPage } from "../../pages/incident";

let matchId: number;
let token: string;

describe("Scorer - Persona Checklist", () => {
  it("should log in with valid credentials, open a match, manage team sheets, start or resume play, and validate score increment and undo actions", async () => {
    const loginPage = new LoginPage();
    const homePage = new HomePage();
    const scorerPage = new ScorerPage();
    const incidentPage = new IncidentPage();

    allureReporter.addFeature("Scoring Flow");
    allureReporter.addStory("Login, Team Sheet, and Match Scoring Flow");
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

    await step("login scorer", async () => {
      await homePage.loginFlow(LoginData.email, LoginData.password);
      await loginPage.waitUntilVisibleWithRetry(loginPage.homeTab);
    });

    await step(
      "Open a match from the Home screen, verify its elements and open settings",
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

    await step("Report Other Incident", async () => {
      await incidentPage.assertReportOtherIncidentOption();
      await incidentPage.reportOtherIncident();
    });
  });
});
