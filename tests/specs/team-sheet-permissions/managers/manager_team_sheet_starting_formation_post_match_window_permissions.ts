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

const loginPage = new LoginPage();
const homePage = new HomePage();
const scorerPage = new ScorerPage();
const basePage = new BasePage();

before(async () => {
  await step("Create match before launching app", async () => {
    token = await MatchApiHelper.getToken(LoginData.email, LoginData.password);

    matchId = await MatchApiHelper.createMatch(token, 9);

    console.log("Created Match ID:", matchId);

    allureReporter.addAttachment(
      "Created Match ID",
      String(matchId),
      "text/plain",
    );
  });
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

describe("Manager team sheet post-match window permissions", () => {
  it("Set up both Team Sheets before kickoff, start the match, then verify Team 1 Manager sees a read-only Substitution row and cannot reposition players for either team once the match has started (post-match window)", async () => {
    allureReporter.addFeature("Manager Flow");
    allureReporter.addStory("Login, Team Sheet, and Match Scoring Flow");
    allureReporter.addSeverity("critical");

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

    await step("wait for recording time to start", async () => {
      if (hasFeature("startingFormation")) {
        await scorerPage.clickBackBtn();
        await scorerPage.clickBackBtn();
      }
      await scorerPage.clickCloseCrossBtn();
    });

    await step("Validate navigation to scorer screen", async () => {
      await scorerPage.startMatch();
      await scorerPage.clickBackBtn();
      await scorerPage.logoutUser();
    });

    await step("setup and start match by scorer user", async () => {});
    await step(
      "Verify welcome screen and its elements are displayed",
      async () => {
        await loginPage.gotoLoginTab();
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
      await loginPage.addUserName(LoginData.manager1Email);
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
    });

    await step("Validate navigation to manager screen", async () => {
      await scorerPage.validateManagerScreenElements(matchId.toString());
    });

    await step("validate manager page options", async () => {
      await scorerPage.validateSubstitutionOption();
      await scorerPage.validateStartingFormationOption();
    });

    await step("Open Substitution option", async () => {
      await scorerPage.openSubstitutionOption();
    });

    await step(
      "Validate home team Substitution elements are shown",
      async () => {
        await scorerPage.validateHomeSubstitutionElements(
          TeamsInTeamSheet.HomeTeam,
        );
      },
    );

    await step(
      "Toggle home team player selection in Substitution, then click Confirm to save",
      async () => {
        await scorerPage.selectOrUnselectPlayerInSubstitution(
          PlayerNamesInTeamSheet.ClubPlayer1,
        );
        await scorerPage.selectOrUnselectPlayerInSubstitution(
          PlayerNamesInTeamSheet.ClubPlayer1,
        );
        await scorerPage.clickConfirmBtnForSavingTeamSheet();
      },
    );

    await step(
      "Switch to away team tab and toggle player selection in Substitution (still editable in the post-match window), then click Confirm to save",
      async () => {
        await scorerPage.openSubstitutionOption();
        await scorerPage.click(
          scorerPage.awayTeamSheetTab(TeamsInTeamSheet.Awayteam),
        );
        await scorerPage.validateAwaySubstitutionElements(
          TeamsInTeamSheet.Awayteam,
        );
        await scorerPage.selectOrUnselectPlayerInSubstitution(
          PlayerNamesInTeamSheet.ClubPlayer2,
        );
        await scorerPage.clickConfirmBtnForSavingTeamSheet();
      },
    );

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

      await step(
        "go back from Starting Formation without saving (formation is read-only in the post-match window)",
        async () => {
          await scorerPage.clickBackBtn();
          await scorerPage.clickBackBtn();
        },
      );
    } else {
      await step("back to Home", async () => {
        await scorerPage.clickBackBtn();
        await scorerPage.clickBackBtn();
      });
    }

    await step("Logout and Log In again with Team2 Manager", async () => {
      await scorerPage.logoutUser();
    });
  });

  it("Team 2 Manager logs in once the match has started and sees a read-only Substitution row and cannot reposition players for either team (post-match window)", async () => {
    await step(
      "Verify welcome screen and its elements are displayed",
      async () => {
        await loginPage.gotoLoginTab();
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
      await loginPage.addUserName(LoginData.manager2Email);
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
    });

    await step("Validate navigation to manager screen", async () => {
      await scorerPage.validateManagerScreenElements(matchId.toString());
    });

    await step("validate manager page options", async () => {
      await scorerPage.validateSubstitutionOption();
      await scorerPage.validateStartingFormationOption();
    });

    await step("Open Substitution option", async () => {
      await scorerPage.openSubstitutionOption();
    });

    await step(
      "Validate away team Substitution elements are shown",
      async () => {
        await scorerPage.validateAwaySubstitutionElements(
          TeamsInTeamSheet.Awayteam,
        );
      },
    );

    await step(
      "Toggle away team (Team 2 Manager's own team) player selection in Substitution, then click Confirm to save",
      async () => {
        await scorerPage.selectOrUnselectPlayerInSubstitution(
          PlayerNamesInTeamSheet.ClubPlayer2,
        );
        await scorerPage.selectOrUnselectPlayerInSubstitution(
          PlayerNamesInTeamSheet.ClubPlayer2,
        );
        await scorerPage.clickConfirmBtnForSavingTeamSheet();
      },
    );

    await step(
      "Switch to home team tab and toggle player selection in Substitution (still editable in the post-match window), then click Confirm to save",
      async () => {
        await scorerPage.openSubstitutionOption();
        await scorerPage.click(
          scorerPage.homeTeamSheetTab(TeamsInTeamSheet.HomeTeam),
        );
        await scorerPage.validateHomeSubstitutionElements(
          TeamsInTeamSheet.HomeTeam,
        );
        await scorerPage.selectOrUnselectPlayerInSubstitution(
          PlayerNamesInTeamSheet.ClubPlayer1,
        );
        await scorerPage.clickConfirmBtnForSavingTeamSheet();
      },
    );

    if (hasFeature("startingFormation")) {
      await step("opening Starting Formation", async () => {
        await scorerPage.openStartingFormationOption();
      });

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

      await step(
        "validating uneditable home players behavior in Starting Formation",
        async () => {
          await scorerPage.click(
            scorerPage.homeTeamSheetTab(TeamsInTeamSheet.HomeTeam),
          );
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
    }
  });
});
