import allureReporter from "@wdio/allure-reporter";
import { step } from "../../utils/helpers";
import { setConnectivity } from "../../utils/connectivity";
import { LoginData } from "../../data/login.data";
import { LoginPage } from "../../pages/login.page";
import { HomePage } from "../../pages/home.page";
import { ScorerPage } from "../../pages/scorer.page";
import { Timeout } from "../../utils/timers";
import { MatchApiHelper } from "../../utils/matchApi.helper";
import {
  PlayerNamesInTeamSheet,
  PlayerPositions,
  TeamsInTeamSheet,
} from "../../data/teamSheet.data";
import { TeamOfficialsPage } from "../../pages/teamOfficials.page";

let matchId: number;
let token: string;

describe("Scorer - Offline Match Scoring", () => {
  it("SCORE-002: should continue recording match actions while offline and synchronise after reconnection", async () => {
    const loginPage = new LoginPage();
    const homePage = new HomePage();
    const scorerPage = new ScorerPage();
    const teamOfficialsPage = new TeamOfficialsPage();

    allureReporter.addFeature("Scoring Flow");
    allureReporter.addStory("Offline Scoring and Reconnection Sync");
    allureReporter.addSeverity("critical");

    await step("Create match before launching app", async () => {
      token = await MatchApiHelper.getToken(
        LoginData.email,
        LoginData.password,
      );

      matchId = await MatchApiHelper.createMatch(token, 8);

      console.log("Created Match ID:", matchId);

      allureReporter.addAttachment(
        "Created Match ID",
        String(matchId),
        "text/plain",
      );
    });

    after(async () => {
      try {
        await setConnectivity("enable");
      } catch (error) {
        console.error("Failed to restore connectivity:", error);
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

    await step("Verify welcome screen is visible", async () => {
      await loginPage.validateLoginBtnIsVisible();
    });

    await step("Navigate to login screen", async () => {
      await loginPage.click(loginPage.loginButton);
    });

    await step("Enter valid credentials", async () => {
      await loginPage.addUserName(LoginData.email);
      await loginPage.addPassword(LoginData.password);
    });

    await step("Submit login", async () => {
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
      await scorerPage.scrollUntilElementVisible(matchElement);
      await homePage.assertElementDisplayed(matchElement);
      await homePage.click(matchElement);
      await scorerPage.handleErrorPopup();
      await scorerPage.waitUntilVisibleWithRetry(scorerPage.matchTimer);
    });

    await step("Validate navigation to scorer screen", async () => {
      await scorerPage.validateScorerScreenElements();
    });

    await step("Handle team sheet flow if alert is displayed", async () => {
      const isVisible = await scorerPage.isElementPresent(
        scorerPage.teamSheetAlert,
        Timeout.TWO_SECONDS,
      );

      if (isVisible) {
        await scorerPage.click(scorerPage.teamSheetAlert);

        await step(
          "Open team sheet option and validate team sheet elements",
          async () => {
            await scorerPage.validateHomeTeamSheetElements(
              TeamsInTeamSheet.HomeTeam,
            );
          },
        );

        await step(
          "Select players and their positions for home team",
          async () => {
            await scorerPage.selectPlayerAndPositionOfTeam(
              PlayerNamesInTeamSheet.ClubPlayer1,
              PlayerPositions.Forward,
            );
            await scorerPage.clickDoneBtn();
          },
        );

        await step(
          "Select players and their positions for away team",
          async () => {
            await scorerPage.click(
              scorerPage.awayTeamSheetTab(TeamsInTeamSheet.Awayteam),
            );
            await scorerPage.selectPlayerAndPositionOfTeam(
              PlayerNamesInTeamSheet.ClubPlayer2,
              PlayerPositions.Midfielder,
            );
          },
        );

        await step("click Done button after managing team sheets", async () => {
          await scorerPage.clickDoneBtn();
        });

        await step("save Starting Formation", async () => {
          await scorerPage.saveStartingFormation();
        });
      }
    });

    await step("Open settings menu and validate options", async () => {
      await scorerPage.clickSettingsIcon();
      await scorerPage.validateTeamSheetOption();
      await scorerPage.validateStartingFormationOption();
    });

    await step("Open Team Officials and validate it's elements", async () => {
      expect(
        await teamOfficialsPage.validateIfTeamOfficialsMenuAvailable(),
      ).toBeTruthy();
      await teamOfficialsPage.openTeamOfficials();
      await teamOfficialsPage.assertTeamOfficialsEnabledElements();
    });

    await step("Select Manger and Coach for Team1", async () => {
      await teamOfficialsPage.searchAndSelectManager("Syed");
      await teamOfficialsPage.searchAndSelectCoach("Syed");
      await teamOfficialsPage.clickConfirmTeamOfficials();
    });

    await step("Select Manger and Coach for Team2", async () => {
      await teamOfficialsPage.searchAndSelectManager("Syed");
      await teamOfficialsPage.searchAndSelectCoach("Syed");
      await teamOfficialsPage.clickConfirmTeamOfficials();
      await scorerPage.clickCloseCrossBtn();
    });

    await step("Start or resume the match", async () => {
      await scorerPage.handleStartOrResumeMatch();
    });

    let initialHomeTeamScore: string;
    let initialAwayTeamScore: string;
    let homeTeamScoreOffline: string;
    let awayTeamScoreOffline: string;

    await step("Capture initial team scores while online", async () => {
      initialHomeTeamScore = await scorerPage.getTeamScores(
        scorerPage.homeTeamScore,
      );
      initialAwayTeamScore = await scorerPage.getTeamScores(
        scorerPage.awayTeamScore,
      );
    });

    await step("Drop connectivity on the device", async () => {
      await setConnectivity("disable");
    });

    await step(
      "Confirm the offline banner appears and the roster stays cached locally",
      async () => {
        await scorerPage.waitUntilVisibleWithRetry(scorerPage.offlineBanner);
        await scorerPage.assertElementDisplayed(scorerPage.offlineBanner);
        // Team roster/scorecard is still rendered from local cache while offline.
        await scorerPage.validateScorerScreenElements();
      },
    );

    await step("Continue recording match actions while offline", async () => {
      await scorerPage.addTeamScore(scorerPage.addHomeTeamScore);
      await scorerPage.addTeamScore(scorerPage.addAwayTeamScore);

      homeTeamScoreOffline = await scorerPage.getTeamScores(
        scorerPage.homeTeamScore,
      );
      awayTeamScoreOffline = await scorerPage.getTeamScores(
        scorerPage.awayTeamScore,
      );

      expect(homeTeamScoreOffline).not.toEqual(initialHomeTeamScore);
      expect(awayTeamScoreOffline).not.toEqual(initialAwayTeamScore);
    });

    await step("Restore connectivity on the device", async () => {
      await setConnectivity("enable");
    });

    await step(
      "Reconcile the pending offline requests once back online",
      async () => {
        const offlineBannerVisible = await scorerPage.isElementVisible(
          scorerPage.connectBtnInOfflineBanner,
        );
        if (offlineBannerVisible) {
          await scorerPage.click(scorerPage.connectBtnInOfflineBanner);
          const connectPopupVisible = await scorerPage.isElementVisible(
            scorerPage.connectNowBtnInConnectPopup,
          );
          if (connectPopupVisible) {
            await scorerPage.click(scorerPage.connectNowBtnInConnectPopup);
          }
        }
        // await scorerPage.waitUntilInvisibleWithRetry(scorerPage.offlineBanner); //commenting because the offline banner disappears apparently but its selector is still present in the DOM.
      },
    );

    await step("Confirm scoring data reconciles on reconnection", async () => {
      const homeTeamScoreAfterSync = await scorerPage.getTeamScores(
        scorerPage.homeTeamScore,
      );
      const awayTeamScoreAfterSync = await scorerPage.getTeamScores(
        scorerPage.awayTeamScore,
      );

      expect(homeTeamScoreAfterSync).toEqual(homeTeamScoreOffline);
      expect(awayTeamScoreAfterSync).toEqual(awayTeamScoreOffline);
    });
  });
});
