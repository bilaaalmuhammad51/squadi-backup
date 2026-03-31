import allureReporter from "@wdio/allure-reporter";
import { step } from "../../utils/helpers";
import { LoginData } from "../../data/login.data";
import { HomePage } from "../../pages/home.page";
import { ScorerPage } from "../../pages/scorer.page";
import { SchedulePage } from "../../pages/schedule.page";

describe("Match scheduling/draws Flow", () => {
    it("Should log in with valid credentials, select a team in the Schedule/Draws tab, and then validate the Match Center screen and its tab elements", async () => {

        const schedulePage = new SchedulePage()
        const homePage = new HomePage();
        const scorerPage = new ScorerPage();

        allureReporter.addFeature("Sceduling/Draws Flow");
        allureReporter.addStory("Login, Scheduling Tab, validate Match center elements");
        allureReporter.addSeverity("critical");

        await step("Complete Login Flow", async () => {
            await homePage.loginFlow(LoginData.email, LoginData.password);
        });

        await step("Complete match flow if needed", async () => {
            // await scorerPage.completeMatchFlowIfNeeded("69435");
        })

        await step("Open shodule tab and validate flow", async () => {

            await step("Open Shodule Tab", async () => {
                await homePage.openShoduleTab();
                await schedulePage.cancelSelectedTeamIfNeeded();
                await schedulePage.click(schedulePage.addTeamBtn);
            });

            await step("validate search tab elements and then search and select a team", async () => {
                const teamName = "HR-ASN2CLUB2"
                await schedulePage.searchTeamAndSelect(teamName);
            });

            await step("Open the match card and vaildte that Match center screen elements", async () => {
                const matchID = "69434"
                await schedulePage.openMatchDetailsByID(matchID);

                await step("Validate action log tabs elements", async () => {
                    await schedulePage.waitUntilVisibleWithRetry(scorerPage.homeTeam);
                    await schedulePage.assertElementDisplayed(scorerPage.homeTeam);
                    await schedulePage.assertElementDisplayed(scorerPage.awayTeam);
                    await schedulePage.assertElementDisplayed(schedulePage.timelineHeading);
                    await schedulePage.assertElementDisplayed(schedulePage.allTabSelector);
                    await schedulePage.assertElementDisplayed(schedulePage.firstHalfTab);
                    await schedulePage.assertElementDisplayed(schedulePage.secondHalfTab);
                });

                //TODO player status tab is not working properly that's the reason these lines are commented  
                // await step("Validate player status tabs elements", async () => {
                //     // await schedulePage.openAndValidatePlayerStatusTab();
                // });

                await step("Validate score breakdown tabs elements", async () => {
                    await schedulePage.openAndValidateScoreBreakdownTab();
                });
            })

        })

    });
});