import allureReporter from "@wdio/allure-reporter";
import { step } from "../../utils/helpers";
import { LoginData } from "../../data/login.data";
import { LoginPage } from "../../pages/login.page";
import { HomePage } from "../../pages/home.page";

describe("Manager - Persona Checklist", () => {
  it("[S24,S32] Manager opens Calendar Sync and Borrowed Players", async () => {
    const loginPage = new LoginPage();
    const homePage = new HomePage();

    allureReporter.addFeature("Manager Persona Checklist");
    allureReporter.addStory("Calendar Sync and Borrowed Players");
    allureReporter.addSeverity("normal");

    await step(
      "Manager signs in with valid credentials and opens manager options",
      async () => {
        await homePage.loginFlow(LoginData.manager1Email, LoginData.password);
        await loginPage.openMyScheduleAndCalendarSync();
        await loginPage.openMyTeamAndBorrowedPlayersList();
      },
    );
  });
});
