import allureReporter from "@wdio/allure-reporter";
import { step } from "../../utils/helpers";
import { LoginData, namesOfUsers } from "../../data/login.data";
import { HomePage } from "../../pages/home.page";
import { ScorerPage } from "../../pages/scorer.page";
import BasePage from "../../pages/base.page";
import { MatchApiHelper } from "../../utils/matchApi.helper";

let matchId: number;
let token: string;

describe("Manager Assigns a Referee", () => {
  const homePage = new HomePage();
  const scorerPage = new ScorerPage();
  const basePage = new BasePage();

  before(async () => {
    await step(
      "Allow home team manager to verify officials and create match",
      async () => {
        token = await MatchApiHelper.getToken(
          LoginData.email,
          LoginData.password,
        );

        await MatchApiHelper.updateCompetitionSettings(token, {
          allowHomeTeamManagerToVerifyOfficials: true,
        });

        matchId = await MatchApiHelper.createMatch(token, 15);

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

  it("F41 - Manager Assigns a Referee", async () => {
    allureReporter.addFeature("Manager Flow");
    allureReporter.addStory("Manager Assigns a Referee");
    allureReporter.addSeverity("critical");

    await step("Log in as a manager", async () => {
      await homePage.loginFlow(LoginData.manager1Email, LoginData.password);
    });

    await step(
      "Verify Verify Match Officials alert is displayed on the match card, then open the match",
      async () => {
        const matchElement = homePage.matchById(matchId.toString());
        await basePage.scrollUntilElementVisible(matchElement);
        await homePage.assertElementDisplayed(matchElement);
        // await scorerPage.assertElementDisplayed( //need to handle
        //   scorerPage.verifyMatchOfficialsAlert,
        // );
        await homePage.click(matchElement);
        await scorerPage.handleErrorPopup();
      },
    );

    await step("Validate navigation to manager screen", async () => {
      await scorerPage.validateManagerScreenElements(matchId.toString());
    });

    await step("Assign a referee to the match", async () => {
      await scorerPage.assignReferee(namesOfUsers.refereeName);
    });

    await step(
      "Open Game Referees option and validate the assigned referee persists",
      async () => {
        await scorerPage.openGameRefereesOption();
        await scorerPage.assertElementDisplayed(scorerPage.refereeSlot1Heading);
        await scorerPage.validateSelectedReferee(namesOfUsers.refereeName);
      },
    );

    await step("Navigate back to the Home tab", async () => {
      await scorerPage.clickBackBtn();
      await scorerPage.clickBackBtn();
    });

    await step(
      "Validate the Verify Match Officials alert is still shown on the match card",
      async () => {
        const matchElement = homePage.matchById(matchId.toString());
        await basePage.scrollUntilElementVisible(matchElement);
        await homePage.assertElementDisplayed(matchElement);
        await homePage.assertElementDisplayed(
          scorerPage.verifyMatchOfficialsAlert,
        );
      },
    );
  });
});
