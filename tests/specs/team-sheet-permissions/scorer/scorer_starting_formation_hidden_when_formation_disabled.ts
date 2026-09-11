import allureReporter from "@wdio/allure-reporter";
import { step } from "../../../utils/helpers";
import { LoginData } from "../../../data/login.data";
import { LoginPage } from "../../../pages/login.page";
import { HomePage } from "../../../pages/home.page";
import { ScorerPage } from "../../../pages/scorer.page";
import BasePage from "../../../pages/base.page";
import { MatchApiHelper } from "../../../utils/matchApi.helper";
import { describeIfFeature } from "../../../utils/features";

let matchId: number;
let token: string;

describeIfFeature(
  "startingFormation",
  "Starting Formation row is hidden for Field Scorer when the formation flag is disabled (S6)",
  () => {
    before(async () => {
      await step(
        "Create match, then disable gameTimeTracking on the competition",
        async () => {
          token = await MatchApiHelper.getToken(
            LoginData.email,
            LoginData.password,
          );
          matchId = await MatchApiHelper.createMatch(token, 15);
          console.log("Created Match ID:", matchId);

          await MatchApiHelper.updateCompetitionSettings(token, {
            gameTimeTrackingEnabled: false,
          });
        },
      );
    });

    after(async () => {
      await step(
        "Restore gameTimeTracking so other specs are unaffected",
        async () => {
          await MatchApiHelper.updateCompetitionSettings(token, {
            gameTimeTrackingEnabled: true,
          });
        },
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

    it("should not show the Starting Formation row in Game Settings even though Field Scorer normally has field_positions", async () => {
      const loginPage = new LoginPage();
      const homePage = new HomePage();
      const scorerPage = new ScorerPage();
      const basePage = new BasePage();

      allureReporter.addFeature("Scoring Flow");
      allureReporter.addStory(
        "Starting Formation hidden when formation flag disabled",
      );
      allureReporter.addSeverity("normal");

      await step("Verify welcome screen is visible", async () => {
        await loginPage.validateLoginBtnIsVisible();
      });

      await step("Navigate to login screen", async () => {
        await loginPage.click(loginPage.loginButton);
      });

      await step("Enter valid credentials and submit login", async () => {
        await loginPage.addUserName(LoginData.email);
        await loginPage.addPassword(LoginData.password);
        await loginPage.click(loginPage.login);
      });

      await step(
        "Validate successful login by checking Home screen",
        async () => {
          await homePage.waitUntilVisibleWithRetry(homePage.homeTab);
          await homePage.assertElementDisplayed(homePage.homeTab);
        },
      );

      await step("Open a match from the Home screen", async () => {
        const matchElement = homePage.matchById(matchId.toString());
        await basePage.scrollUntilElementVisible(matchElement);
        await homePage.assertElementDisplayed(matchElement);
        await homePage.click(matchElement);
        await scorerPage.handleErrorPopup();
        await scorerPage.waitUntilVisibleWithRetry(scorerPage.matchTimer);
      });

      await step(
        "Open settings menu and validate Team Sheet is present but Starting Formation is not",
        async () => {
          await scorerPage.clickSettingsIcon();
          await scorerPage.validateTeamSheetOption();
          await scorerPage.assertElementNotDisplayed(
            scorerPage.startingFormationOption,
          );
        },
      );
    });
  },
);
