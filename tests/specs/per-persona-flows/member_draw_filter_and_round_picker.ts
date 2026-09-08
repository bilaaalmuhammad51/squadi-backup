import allureReporter from "@wdio/allure-reporter";
import { step } from "../../utils/helpers";
import { LoginData } from "../../data/login.data";
import { HomePage } from "../../pages/home.page";
import { SchedulePage } from "../../pages/schedule.page";
import { MatchApiHelper } from "../../utils/matchApi.helper";

let round1MatchId: number;
let round2MatchId: number;
let token: string;

describe("Member - Draw tab filter and round picker", () => {
  const homePage = new HomePage();
  const schedulePage = new SchedulePage();

  it("[DRAW-003] Filter and round picker switch the draw view", async () => {
    allureReporter.addFeature("Competitions & Schedules");
    allureReporter.addStory("Filter and round picker switch the draw view");
    allureReporter.addSeverity("normal");

    await step(
      "Create matches under different rounds before launching app",
      async () => {
        token = await MatchApiHelper.getToken(
          LoginData.email,
          LoginData.password,
        );

        round1MatchId = await MatchApiHelper.createMatch(token, 3, 13215);
        round2MatchId = await MatchApiHelper.createMatch(token, 3, 15596);

        console.log("Created Round 1 Match ID:", round1MatchId);
        console.log("Created Round 2 Match ID:", round2MatchId);

        allureReporter.addAttachment(
          "Round 1 Match ID",
          String(round1MatchId),
          "text/plain",
        );
        allureReporter.addAttachment(
          "Round 2 Match ID",
          String(round2MatchId),
          "text/plain",
        );
      },
    );

    after(async () => {
      try {
        if (token && round1MatchId) {
          await MatchApiHelper.deleteMatch(token, round1MatchId);
          console.log(`Deleted Match ID: ${round1MatchId}`);
        }
        if (token && round2MatchId) {
          await MatchApiHelper.deleteMatch(token, round2MatchId);
          console.log(`Deleted Match ID: ${round2MatchId}`);
        }
      } catch (error) {
        console.error("Failed to delete matches:", error);
      }
    });

    await step("Sign in and open the Draw tab", async () => {
      await homePage.loginFlow(LoginData.email, LoginData.password);
      await homePage.gotoDrawsTab();
    });

    await step("Assert the filter control", async () => {
      await schedulePage.waitUntilVisibleWithRetry(
        schedulePage.drawFilterControl,
      );
      await schedulePage.assertElementDisplayed(
        schedulePage.drawFilterControl,
      );
    });

    await step("Assert the rounds", async () => {
      await schedulePage.waitUntilVisibleWithRetry(
        schedulePage.roundHeader(1),
      );
      await schedulePage.assertElementDisplayed(schedulePage.roundHeader(1));
      await schedulePage.assertElementDisplayed(schedulePage.roundHeader(2));
    });

    await step(
      "Observe the matches appear under their correct rounds",
      async () => {
        await schedulePage.assertElementDisplayed(
          schedulePage.matchCardById(String(round1MatchId)),
        );
        await schedulePage.assertElementDisplayed(
          schedulePage.matchCardById(String(round2MatchId)),
        );

        await schedulePage.assertMatchAppearsUnderRound(round1MatchId, 1);
        await schedulePage.assertMatchAppearsUnderRound(round2MatchId, 2);
      },
    );
  });
});
