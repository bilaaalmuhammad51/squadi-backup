import allureReporter from "@wdio/allure-reporter";
import { step } from "../../utils/helpers";
import { LoginData } from "../../data/login.data";
import { HomePage } from "../../pages/home.page";
import { ScorerPage } from "../../pages/scorer.page";
import { MatchApiHelper } from "../../utils/matchApi.helper";
import { UserRoles } from "../../data/teamSheet.data";

let matchId: number;
let token: string;

describe("Coach - Persona Checklist", () => {
  const homePage = new HomePage();
  const scorerPage = new ScorerPage();

  after(async () => {
    try {
      token = await MatchApiHelper.getToken(LoginData.email, LoginData.password);
      if (token && matchId) {
        await MatchApiHelper.deleteMatch(token, matchId);
        console.log(`Deleted Match ID: ${matchId}`);
      }
    } catch (error) {
      console.error("Failed to delete match:", error);
    }
  });

  it("[COACH-001] Coach sees coaching match card on Home", async () => {
    allureReporter.addFeature("Coach Role");
    allureReporter.addStory("Coach sees coaching match card on Home");
    allureReporter.addSeverity("critical");

    await step("Create an upcoming match for the Coach", async () => {
      token = await MatchApiHelper.getToken(
        LoginData.email,
        LoginData.password,
      );
      matchId = await MatchApiHelper.createMatch(token, 5);
      allureReporter.addAttachment(
        "Created Match ID",
        String(matchId),
        "text/plain",
      );
    });

    await step("Sign in as Coach and open Home", async () => {
      await homePage.loginFlow(LoginData.coachEmail, LoginData.password);
    });

    await step(
      "Match appears on Home as a Coaching card, distinct from Managing/Playing",
      async () => {
        const matchElement = homePage.matchById(matchId.toString());
        await scorerPage.scrollUntilElementVisible(matchElement);
        await homePage.assertElementDisplayed(matchElement);
        await homePage.assertElementDisplayed(
          scorerPage.gameCard(UserRoles.Coach, matchId.toString()),
        );
      },
    );
  });

  it("[COACH-002] Coach opens Your Team", async () => {
    allureReporter.addFeature("Coach Role");
    allureReporter.addStory("Coach opens Your Team");
    allureReporter.addSeverity("normal");

    await step(
      "Open More > My Team and confirm the coach's teams are listed",
      async () => {
        await homePage.assertCoachedTeamsListedInMyTeam();
      },
    );
  });

  it("[COACH-003] Coach opens Your Schedule", async () => {
    allureReporter.addFeature("Coach Role");
    allureReporter.addStory("Coach opens Your Schedule");
    allureReporter.addSeverity("normal");

    await step(
      "Open More > My Schedule and confirm the coach's schedule is available",
      async () => {
        await homePage.openMyScheduleAndCalendarSync();
      },
    );
  });
});
