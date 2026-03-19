import allureReporter from "@wdio/allure-reporter";
import { step} from "../../utils/helpers";
import { LoginData } from "../../data/login.data";
import { LoginPage } from "../../pages/login.page";
import { HomePage } from "../../pages/home.page";

describe("Authentication - Login Flow", () => {

    it("should allow a registered user to log in and land on the home screen", async () => {

        allureReporter.addFeature("Authentication");
        allureReporter.addStory("Login");
        allureReporter.addSeverity("critical");

        const loginPage = new LoginPage();
        const homePage = new HomePage();

        await step("Verify welcome screen is visible", async () => {
            await loginPage.waitUntilVisibleWithRetry(loginPage.loginButton);
        });

        await step("Verify welcome screen elements", async () => {
            await loginPage.assertElementDisplayed(loginPage.welcomeHeading);
            await loginPage.assertElementDisplayed(loginPage.createAccountOrRegisterProfile);
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
                LoginData.loginHeading
            );
            await loginPage.assertElementDisplayed(loginPage.rememberPassword);
            await loginPage.assertElementDisplayed(loginPage.forgotPassword);
        });

        await step("Enter valid credentials", async () => {
            await loginPage.addUserName(LoginData.email);
            await loginPage.addPassword(LoginData.password);

            allureReporter.addAttachment("Login Email", LoginData.email, "text/plain");
        });

        await step("Submit login", async () => {
            await loginPage.click(loginPage.login);
        });

        await step("Verify user lands on Home screen", async () => {
            await homePage.verifyHomeScreenElements();
        });

    });

});