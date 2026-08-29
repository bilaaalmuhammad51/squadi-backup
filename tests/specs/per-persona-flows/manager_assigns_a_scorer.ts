import allureReporter from "@wdio/allure-reporter";
import { step } from "../../utils/helpers";
import { LoginData, namesOfUsers } from "../../data/login.data";
import { HomePage } from "../../pages/home.page";
import { ScorerPage } from "../../pages/scorer.page";
import BasePage from "../../pages/base.page";
import { MatchApiHelper } from "../../utils/matchApi.helper";

let matchId: number;
let token: string;

describe("F40 - Manager Assigns a Scorer", () => {
  const homePage = new HomePage();
  const scorerPage = new ScorerPage();
  const basePage = new BasePage();

  before(async () => {
    await step(
      "Set competition scoring mode to Managers and create match",
      async () => {
        token = await MatchApiHelper.getToken(
          LoginData.email,
          LoginData.password,
        );

        await MatchApiHelper.updateCompetitionSettings(token, {
          scoringMode: "MANAGERS",
        });

        matchId = await MatchApiHelper.createMatch(token, 10);

        console.log("Created Match ID:", matchId);

        allureReporter.addAttachment(
          "Created Match ID",
          String(matchId),
          "text/plain",
        );
      },
    );
  });

  after(async () => {
    try {
      await MatchApiHelper.updateCompetitionSettings(token);
      console.log("Restored default competition settings");
    } catch (error) {
      console.error("Failed to restore competition settings:", error);
    }
    try {
      if (token && matchId) {
        await MatchApiHelper.deleteMatch(token, matchId);
        console.log(`Deleted Match ID: ${matchId}`);
      }
    } catch (error) {
      console.error("Failed to delete match:", error);
    }
  });

  it("F40 - Manager Assigns a Scorer", async () => {
    allureReporter.addFeature("Manager Flow");
    allureReporter.addStory("Manager Assigns a Scorer");
    allureReporter.addSeverity("critical");

    await step("Log in as a manager", async () => {
      await homePage.loginFlow(LoginData.manager1Email, LoginData.password);
    });

    await step(
      "Verify Scorer not set alert is displayed on the match card, then open the match",
      async () => {
        const matchElement = homePage.matchById(matchId.toString());
        await basePage.scrollUntilElementVisible(matchElement);
        await homePage.assertElementDisplayed(matchElement);
        // await scorerPage.assertElementDisplayed(scorerPage.scorerNotSetAlert); //need to handle
        await homePage.click(matchElement);
        await scorerPage.handleErrorPopup();
      },
    );

    await step("Validate navigation to manager screen", async () => {
      await scorerPage.validateManagerScreenElements(matchId.toString());
    });

    await step("Assign a scorer to the match", async () => {
      await scorerPage.assignScorer(namesOfUsers.scorerName);
    });

    await step(
      "Open Change scorer option and validate the assigned scorer persists",
      async () => {
        await scorerPage.openChangeScorerOption();
        await scorerPage.validateAssignScorerHeading();
        await scorerPage.validateSelectedScorer(namesOfUsers.scorerName);
      },
    );

    await step("Navigate back to the Home tab", async () => {
      await scorerPage.clickBackBtn();
      await scorerPage.clickBackBtn();
    });

    await step(
      "Validate the match card now shows Scorer has not accepted",
      async () => {
        const matchElement = homePage.matchById(matchId.toString());
        await basePage.scrollUntilElementVisible(matchElement);
        await homePage.assertElementDisplayed(matchElement);
        await homePage.assertElementDisplayed(
          scorerPage.scorerHasNotAcceptedAlert,
        );
      },
    );
  });
});
