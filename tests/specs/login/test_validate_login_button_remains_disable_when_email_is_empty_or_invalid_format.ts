import allureReporter from "@wdio/allure-reporter";
import { step} from "../../utils/helpers";
import {emailLoginTestData, LoginData} from "../../data/login.data";
import { LoginPage } from "../../pages/login.page";
import { HomePage } from "../../pages/home.page";

describe("Authentication - Email Validation", () => {
    it("should validate login button state for supported email formats and allow a registered user to log in successfully", async () => {

        const loginPage = new LoginPage();
        const homePage = new HomePage();
        let loginBtn: ChainablePromiseElement;

        allureReporter.addFeature("Authentication");
        allureReporter.addStory("Email Validation");
        allureReporter.addSeverity("critical");

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
        });

        await step("Get login button element", async () => {
            loginBtn = await loginPage.getElement(loginPage.login);
        });

        await step("Verify login button is disabled when fields are empty", async () => {
            await loginPage.expectElementState(loginBtn, "disabled");
        });

        await step("Verify login button remains disabled when email is empty", async () => {
            await loginPage.addUserName(emailLoginTestData.emptyEmail.email);
            await loginPage.expectElementState(loginBtn, "disabled");
        });

        await step("Verify login button remains disabled when only password is entered", async () => {
            await loginPage.addPassword(emailLoginTestData.emptyEmail.password);
            await loginPage.expectElementState(loginBtn, "disabled");
        });

        await step("Validate multiple invalid email formats", async () => {
            await loginPage.testMultipleInvalidEmails(loginBtn);
        });

        await step("Validate multiple valid email formats", async () => {
            await loginPage.testMultipleValidEmails(loginBtn);
        });

        await step("Submit login with valid credentials", async () => {
            await loginPage.loginUser(LoginData.email,LoginData.password);
        });

        await step("Verify user lands on Home screen", async () => {
            await homePage.verifyHomeScreenElements();
        });
    });
});