import allureReporter from "@wdio/allure-reporter";
import { step } from "../../utils/helpers";
import { LoginData } from "../../data/login.data";
import { LoginPage } from "../../pages/login.page";
import { HomePage } from "../../pages/home.page";
import { MatchApiHelper} from "../../utils/matchApi.helper";

describe("Authentication - Login Flow", () => {
    it("should allow a registered user to log in and land on the home screen", async () => {
        allureReporter.addFeature("Authentication");
        allureReporter.addStory("Login");
        allureReporter.addSeverity("critical");

        const loginPage = new LoginPage();
        const homePage = new HomePage();

        let matchId: number;

        await step("Create match before launching app", async () => {
            const token = await MatchApiHelper.getToken(
                LoginData.email,
                LoginData.password,
            );

            matchId = await MatchApiHelper.createMatch(token, 3);

            console.log("Created Match ID:", matchId);

            allureReporter.addAttachment(
                "Created Match ID",
                String(matchId),
                "text/plain"
            );
        });

        await step("Verify welcome screen is visible", async () => {
            await loginPage.validateLoginBtnIsVisible();
        });

        await step("Verify welcome screen elements", async () => {
            await loginPage.assertElementDisplayed(loginPage.welcomeHeading);
            await loginPage.assertElementDisplayed(
                loginPage.createAccountOrRegisterProfile
            );
            await loginPage.assertElementDisplayed(
                loginPage.followTeamOrLeague
            );
            await loginPage.assertElementDisplayed(
                loginPage.loginButton
            );
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

        await step("Verify user lands on Home screen", async () => {
            await homePage.verifyHomeScreenElements();
        });

        // await step("Validate created match is visible in app", async () => {
        //     console.log(`Validate Match ID: ${matchId}`);
            // add your match search / match validation here
        // });
    });
});