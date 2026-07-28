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
  it("log in with valid credentials, open a match, update team sheets by adding players, adjust starting formations by repositioning players for respective team", async () => {
    allureReporter.addFeature("Manager Flow");
    allureReporter.addStory("Login, Team Sheet, and Match Scoring Flow");
    allureReporter.addSeverity("critical");

    await step("Verify welcome screen is visible", async () => {
      await loginPage.validateLoginBtnIsVisible();
    });

    await step("Verify welcome screen elements", async () => {
      await loginPage.assertElementDisplayed(loginPage.welcomeHeading);
      await loginPage.assertElementDisplayed(
        loginPage.createAccountOrRegisterProfile,
      );
      await loginPage.assertElementDisplayed(loginPage.followTeamOrLeague);
      await loginPage.assertElementDisplayed(loginPage.loginButton);
    });

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
      await scorerPage.clickDoneBtn();
    });

    await step("Select players and their positions for away team", async () => {
      await scorerPage.validateAwayTeamSheetElements(TeamsInTeamSheet.Awayteam);
      await scorerPage.selectPlayerAndPositionOfTeam(
        PlayerNamesInTeamSheet.ClubPlayer2,
        PlayerPositions.Midfielder,
      );
      await scorerPage.clickDoneBtn();
    });

    await step("wait for recording time to start", async () => {
      await scorerPage.clickBackBtn();
      await scorerPage.clickBackBtn();
      await scorerPage.clickCloseCrossBtn();
    });

    await step("Validate navigation to scorer screen", async () => {
      await scorerPage.startMatch();
      await scorerPage.clickBackBtn();
      await scorerPage.logoutUser();
      await scorerPage.gotoLoginTab();
    });

    await step("setup and start match by scorer user", async () => {});
    await step("Verify welcome screen is visible", async () => {
      await loginPage.gotoLoginTab();
      await loginPage.validateLoginBtnIsVisible();
    });

    await step("Verify welcome screen elements", async () => {
      await loginPage.assertElementDisplayed(loginPage.welcomeHeading);
      await loginPage.assertElementDisplayed(
        loginPage.createAccountOrRegisterProfile,
      );
      await loginPage.assertElementDisplayed(loginPage.followTeamOrLeague);
      await loginPage.assertElementDisplayed(loginPage.loginButton);
    });

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

    await step("Enter valid credentials", async () => {
      await loginPage.addUserName(LoginData.manager1Email);
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

    await step(
      "Open substitutions option and validate substitution elements",
      async () => {
        await scorerPage.openSubstitutionOption();
        await scorerPage.validateHomeSubstitutionElements(
          TeamsInTeamSheet.HomeTeam,
        );
      },
    );

    await step("Unselect and select player for home team", async () => {
      await scorerPage.selectOrUnselectPlayerInSubstitution(
        PlayerNamesInTeamSheet.ClubPlayer1,
      );
      await scorerPage.selectOrUnselectPlayerInSubstitution(
        PlayerNamesInTeamSheet.ClubPlayer1,
      );
      await scorerPage.clickDoneBtn();
    });

    await step(
      "validate player selection and shirt number not editable for away team in substitution",
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
      },
    );

    await step("click Done button after managing team sheets", async () => {
      await scorerPage.clickDoneBtn();
    });

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

    await step("save Starting Formation", async () => {
      await scorerPage.clickBackBtn();
      await scorerPage.clickBackBtn();
    });

    await step("Logout and Log In again with Team2 Manager", async () => {
      await scorerPage.logoutUser();
    });
  });

  it("log in with valid credentials, open a match, update team sheets by adding players, adjust starting formations by repositioning players for respective team", async () => {
    await step("Verify welcome screen is visible", async () => {
      await loginPage.gotoLoginTab();
      await loginPage.validateLoginBtnIsVisible();
    });

    await step("Verify welcome screen elements", async () => {
      await loginPage.assertElementDisplayed(loginPage.welcomeHeading);
      await loginPage.assertElementDisplayed(
        loginPage.createAccountOrRegisterProfile,
      );
      await loginPage.assertElementDisplayed(loginPage.followTeamOrLeague);
      await loginPage.assertElementDisplayed(loginPage.loginButton);
    });

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

    await step("Enter valid credentials", async () => {
      await loginPage.addUserName(LoginData.manager2Email);
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

    await step(
      "Open substitutions option and validate substitution elements",
      async () => {
        await scorerPage.openSubstitutionOption();
        await scorerPage.validateAwaySubstitutionElements(
          TeamsInTeamSheet.Awayteam,
        );
      },
    );

    await step("Unselect and select player for home team", async () => {
      await scorerPage.selectOrUnselectPlayerInSubstitution(
        PlayerNamesInTeamSheet.ClubPlayer2,
      );
      await scorerPage.selectOrUnselectPlayerInSubstitution(
        PlayerNamesInTeamSheet.ClubPlayer2,
      );
      await scorerPage.clickDoneBtn();
    });

    await step(
      "validate player selection and shirt number not editable for away team in substitution",
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
      },
    );

    await step("click Done button after managing team sheets", async () => {
      await scorerPage.clickDoneBtn();
    });

    await step("opening Starting Formation", async () => {
      await scorerPage.openStartingFormationOption();
    });

    await step(
      "validating uneditable home players behavior in Starting Formation",
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
      "validating uneditable away players behavior in Starting Formation",
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
  });
});
