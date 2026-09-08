import allureReporter from "@wdio/allure-reporter";
import { step } from "../../utils/helpers";
import { LoginData } from "../../data/login.data";
import { HomePage } from "../../pages/home.page";

describe("Umpire - Persona Flow", () => {
  const homePage = new HomePage();

  it("[F44] Umpire views Referee Activity", async () => {
    allureReporter.addFeature("Persona Flows");
    allureReporter.addStory("Umpire views Referee Activity");
    allureReporter.addSeverity("normal");

    await step("Umpire signs in", async () => {
      await homePage.loginFlow(LoginData.refereeEmail, LoginData.password);
    });

    await step(
      "Open Referee Activity from More tab and validate a past match is listed",
      async () => {
        await homePage.openRefereeActivityAndValidatePastMatchListed();
      },
    );
  });
});
