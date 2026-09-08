import allureReporter from "@wdio/allure-reporter";
import { step } from "../../utils/helpers";
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

describe("Match Scoring Flow", () => {
    it("should log in with valid credentials, open a match, manage team sheets, start or resume play, and validate score increment and undo actions", async () => {
        const loginPage = new LoginPage();
        const homePage = new HomePage();
        const scorerPage = new ScorerPage();
        const teamOfficialsPage = new TeamOfficialsPage();

        allureReporter.addFeature("Scoring Flow");
        allureReporter.addStory("Login, Team Sheet, and Match Scoring Flow");
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
        let homeTeamScoreAfter: string;
        let awayTeamScoreAfter: string;
        let homeTeamScoreAfterUndo: string;
        let awayTeamScoreAfterUndo: string;

        await step("Capture initial team scores", async () => {
            initialHomeTeamScore = await scorerPage.getTeamScores(
                scorerPage.homeTeamScore,
            );
            initialAwayTeamScore = await scorerPage.getTeamScores(
                scorerPage.awayTeamScore,
            );
        });

        await step(
            "Add score for home team and validate score update",
            async () => {
                await scorerPage.addTeamScore(scorerPage.addHomeTeamScore);
                homeTeamScoreAfter = await scorerPage.getTeamScores(
                    scorerPage.homeTeamScore,
                );
                expect(homeTeamScoreAfter).not.toEqual(initialHomeTeamScore);
            },
        );

        await step(
            "Add score for away team and validate score update",
            async () => {
                await scorerPage.addTeamScore(scorerPage.addAwayTeamScore);
                awayTeamScoreAfter = await scorerPage.getTeamScores(
                    scorerPage.awayTeamScore,
                );
                expect(awayTeamScoreAfter).not.toEqual(initialAwayTeamScore);
            },
        );

        await step("Undo home team score and validate score reset", async () => {
            await scorerPage.undoTeamScore(scorerPage.undoHomeTeamScoreBtn);
            homeTeamScoreAfterUndo = await scorerPage.getTeamScores(
                scorerPage.homeTeamScore,
            );
            expect(homeTeamScoreAfterUndo).toEqual(initialHomeTeamScore);
        });

        await step("Undo away team score and validate score reset", async () => {
            await scorerPage.undoTeamScore(scorerPage.undoAwayTeamScoreBtn);
            awayTeamScoreAfterUndo = await scorerPage.getTeamScores(
                scorerPage.awayTeamScore,
            );
            expect(awayTeamScoreAfterUndo).toEqual(initialAwayTeamScore);
        });
    });
});
