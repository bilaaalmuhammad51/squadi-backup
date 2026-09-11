import allureReporter from "@wdio/allure-reporter";
import { step } from "../../../utils/helpers";
import { LoginData } from "../../../data/login.data";
import { LoginPage } from "../../../pages/login.page";
import { HomePage } from "../../../pages/home.page";
import { ScorerPage } from "../../../pages/scorer.page";
import BasePage from "../../../pages/base.page";
import {
  PlayersInStartingFormation,
  PlayerNamesInTeamSheet,
  TeamsInTeamSheet,
  PlayerPositions,
} from "../../../data/teamSheet.data";
import { MatchApiHelper } from "../../../utils/matchApi.helper";
import { hasFeature } from "../../../utils/features";

let matchId: number;
let token: string;

let homePlayer1InitialPosition: { x: number; y: number };
let awayPlayer1InitialPosition: { x: number; y: number };
let homePlayer1FinalPosition: { x: number; y: number };
let awayPlayer1FinalPosition: { x: number; y: number };

describe("Scorer team sheet post-match window permissions", () => {
  it("Field Scorer confirms Substitution stays editable but Starting Formation becomes read-only for both teams once the match has started (post-match window)", async () => {
    const loginPage = new LoginPage();
    const homePage = new HomePage();
    const scorerPage = new ScorerPage();
    const basePage = new BasePage();

    allureReporter.addFeature("Scoring Flow");
    allureReporter.addStory("Login, Team Sheet, and Match Scoring Flow");
    allureReporter.addSeverity("critical");

    await step("Create match before launching app", async () => {
      token = await MatchApiHelper.getToken(
        LoginData.email,
        LoginData.password,
      );

      matchId = await MatchApiHelper.createMatch(token, 9);

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

    await step(
      "Verify welcome screen and its elements are displayed",
      async () => {
        await loginPage.validateLoginBtnIsVisible();
        await loginPage.assertElementDisplayed(loginPage.welcomeHeading);
        await loginPage.assertElementDisplayed(
          loginPage.createAccountOrRegisterProfile,
        );
        await loginPage.assertElementDisplayed(loginPage.followTeamOrLeague);
        await loginPage.assertElementDisplayed(loginPage.loginButton);
      },
    );

    await step("Navigate to login screen", async () => {
      await loginPage.click(loginPage.loginButton);
    });

    await step("Verify login screen elements", async () => {
      await loginPage.assertElementDisplayed(loginPage.backButton);
      await loginPage.assertElementDisplayed(loginPage.loginHeading);
      await loginPage.assertTextContains(
        loginPage.loginHeading,
        LoginData.loginHeading,
      );
      await loginPage.assertElementDisplayed(loginPage.rememberPassword);
      await loginPage.assertElementDisplayed(loginPage.forgotPassword);
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
        await homePage.assertElementDisplayed(homePage.drawsTab);
        await homePage.assertElementDisplayed(homePage.laddersTab);
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

    await step("Validate Start button is visible", async () => {
      await scorerPage.scrollDown();
      await scorerPage.assertElementDisplayed(scorerPage.startBtn);
    });

    // Updating Team Sheet before Recording time
    await step("Open settings menu and validate options", async () => {
      await scorerPage.clickSettingsIcon();
      await scorerPage.validateTeamSheetOption();
      await scorerPage.validateStartingFormationOption();
    });

    await step(
      "Open team sheet option and validate team sheet elements",
      async () => {
        await scorerPage.openTeamSheetOption();
        await scorerPage.validateHomeTeamSheetElements(
          TeamsInTeamSheet.HomeTeam,
        );
      },
    );

    await step("Select players and their positions for home team", async () => {
      await scorerPage.selectPlayerAndPositionOfTeam(
        PlayerNamesInTeamSheet.ClubPlayer1,
        PlayerPositions.Forward,
      );
      await scorerPage.clickConfirmBtnForSavingTeamSheet();
    });

    await step("Select players and their positions for away team", async () => {
      await scorerPage.validateAwayTeamSheetElements(TeamsInTeamSheet.Awayteam);
      await scorerPage.selectPlayerAndPositionOfTeam(
        PlayerNamesInTeamSheet.ClubPlayer2,
        PlayerPositions.Forward,
      );
      await scorerPage.clickConfirmBtnForSavingTeamSheet();
    });

    await step(
      "Close Team Sheet and return to the scoring screen",
      async () => {
        if (hasFeature("startingFormation")) {
          await scorerPage.clickBackBtn();
          await scorerPage.clickBackBtn();
        }
        await scorerPage.clickCloseCrossBtn();
      },
    );

    await step("Validate navigation to scorer screen", async () => {
      await scorerPage.startMatch();
    });

    await step("Open settings menu and validate options", async () => {
      await scorerPage.clickSettingsIcon();
      if (hasFeature("startingFormation")) {
        await scorerPage.assertElementNotDisplayed(scorerPage.teamSheetOption);
        await scorerPage.validateSubstitutionOption();
        await scorerPage.validateStartingFormationOption();
      }
    });

    await step("Open Substitution/Team Sheet option", async () => {
      if (hasFeature("substitutions")) {
        await scorerPage.openSubstitutionOption();
      } else {
        await scorerPage.openTeamSheetOption();
      }
    });

    await step(
      "Validate home team Substitution elements are shown",
      async () => {
        await scorerPage.validateHomeSubstitutionElements(
          TeamsInTeamSheet.HomeTeam,
        );
      },
    );

    await step("Unselect and select players for home team", async () => {
      await scorerPage.selectOrUnselectPlayerInSubstitution(
        PlayerNamesInTeamSheet.ClubPlayer1,
      );
      await scorerPage.selectOrUnselectPlayerInSubstitution(
        PlayerNamesInTeamSheet.ClubPlayer1,
      );
    });

    await step("Unselect and select players for away team", async () => {
      await scorerPage.validateAwaySubstitutionElements(
        TeamsInTeamSheet.Awayteam,
      );
      await scorerPage.selectOrUnselectPlayerInSubstitution(
        PlayerNamesInTeamSheet.ClubPlayer2,
      );
      await scorerPage.selectOrUnselectPlayerInSubstitution(
        PlayerNamesInTeamSheet.ClubPlayer2,
      );
    });

    await step("click Confirm button after managing team sheets", async () => {
      await scorerPage.clickConfirmBtnForSavingTeamSheet();
    });

    if (hasFeature("startingFormation")) {
      await step("opening Starting Formation", async () => {
        await scorerPage.openStartingFormationOption();
      });

      await step(
        "validating uneditable home players behavior in Starting Formation",
        async () => {
          homePlayer1InitialPosition = await scorerPage.getPlayerPosition(
            PlayersInStartingFormation.ClubPlayer1,
          );
          await scorerPage.dragPlayer(PlayersInStartingFormation.ClubPlayer1);
          homePlayer1FinalPosition = await scorerPage.getPlayerPosition(
            PlayersInStartingFormation.ClubPlayer1,
          );
          expect(homePlayer1InitialPosition).toEqual(homePlayer1FinalPosition);
        },
      );

      await step(
        "validating uneditable away players behavior in Starting Formation",
        async () => {
          await scorerPage.click(
            scorerPage.awayTeamSheetTab(TeamsInTeamSheet.Awayteam),
          );
          awayPlayer1InitialPosition = await scorerPage.getPlayerPosition(
            PlayersInStartingFormation.ClubPlayer2,
          );
          await scorerPage.dragPlayer(PlayersInStartingFormation.ClubPlayer2);
          awayPlayer1FinalPosition = await scorerPage.getPlayerPosition(
            PlayersInStartingFormation.ClubPlayer2,
          );
          expect(awayPlayer1InitialPosition).toEqual(awayPlayer1FinalPosition);
        },
      );

      await step("back to settings", async () => {
        await scorerPage.clickBackBtn();
      });
    }
  });
});
