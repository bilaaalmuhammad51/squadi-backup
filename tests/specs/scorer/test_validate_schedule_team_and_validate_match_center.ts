import allureReporter from "@wdio/allure-reporter";
import { step } from "../../utils/helpers";
import { LoginData } from "../../data/login.data";
import { HomePage } from "../../pages/home.page";
import { SchedulePage } from "../../pages/schedule.page";
import { MatchApiHelper } from "../../utils/matchApi.helper";

let matchId: number;
let token: string;

describe("Match scheduling/draws Flow", () => {
  it("Should log in with valid credentials, select a team in the Schedule/Draws tab, and then validate the Match Center screen and its tab elements", async () => {
    const schedulePage = new SchedulePage();
    const homePage = new HomePage();

    allureReporter.addFeature("Sceduling/Draws Flow");
    allureReporter.addStory(
      "Login, Scheduling Tab, validate Match center elements",
    );
    allureReporter.addSeverity("critical");

    await step("Create match before launching app", async () => {
      token = await MatchApiHelper.getToken(
        LoginData.email,
        LoginData.password,
      );

      matchId = await MatchApiHelper.createMatch(token, 3);

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

    await step("Complete Login Flow", async () => {
      await homePage.loginFlow(LoginData.email, LoginData.password);
    });

    await step("Open shodule tab and validate flow", async () => {
      await step("Open Shodule Tab", async () => {
        await homePage.openScheduleTab();
        await schedulePage.cancelSelectedTeamIfNeeded();
        await schedulePage.click(schedulePage.addTeamBtn);
      });

      await step(
        "validate search tab elements and then search and select a team",
        async () => {
          const teamName = "HR-ASN2CLUB2";
          await schedulePage.searchTeamAndSelect(teamName);
        },
      );

      await step(
        "Open the match card and vaildte that Match center screen elements",
        async () => {
          await schedulePage.openMatchDetailsByID(matchId.toString());

          await step("Validate action log tabs elements", async () => {
            await schedulePage.openAndValidateActionLogTab();
          });

          await step("Validate action log tabs elements", async () => {
            await schedulePage.openAndValidateActionLogTab();
          });

          await step("Validate player status tabs elements", async () => {
            await schedulePage.openAndValidatePlayerStatusTab();
          });

          await step("Validate score breakdown tabs elements", async () => {
            await schedulePage.openAndValidateScoreBreakdownTab();
          });
        },
      );
    });
  });
});
