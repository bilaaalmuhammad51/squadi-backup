import allureReporter from "@wdio/allure-reporter";
import { step, generatePasswordByLength } from "../../utils/helpers";
import { LoginData } from "../../data/login.data";
import { LoginPage } from "../../pages/login.page";

const passwordTests = [
    { length: 5, expectedState: "disabled" },
    { length: 6, expectedState: "disabled" },
    { length: 7, expectedState: "disabled" },
    { length: 8, expectedState: "enabled" },
    { length: 9, expectedState: "enabled" },
];

describe("Authentication - Password Length Validation", () => {
    let loginPage: LoginPage;
    let loginBtn: ChainablePromiseElement;

    beforeEach(async () => {
        loginPage = new LoginPage();

        allureReporter.addFeature("Authentication");
        allureReporter.addStory("Password Length Validation");
        allureReporter.addSeverity("critical");

        await step("Handle iOS notification pre prompt", async () => {
            await loginPage.handleIOSNotificationPrePrompt();
        });

        await step("Verify welcome screen is visible", async () => {
            await loginPage.waitUntilVisibleWithRetry(loginPage.loginButton);
        });

        await step("Verify welcome screen elements", async () => {
            await loginPage.assertElementDisplayed(loginPage.loginButton);
        });

        await step("Navigate to login screen", async () => {
            await loginPage.click(loginPage.loginButton);
        });

        await step("Verify login screen elements", async () => {
            await loginPage.assertElementDisplayed(loginPage.backButton);
            await loginPage.assertElementDisplayed(loginPage.loginHeading);
        });

        await step("Enter valid email", async () => {
            await loginPage.addUserName(LoginData.email);
            allureReporter.addAttachment("Login Email", LoginData.email, "text/plain");
        });

        await step("Get login button element", async () => {
            loginBtn = await loginPage.getElement(loginPage.login);
        });
    });

    passwordTests.forEach(({ length, expectedState }) => {
        it(`should set login button ${expectedState} for password length ${length}`, async () => {
            const password = generatePasswordByLength(length);

            await step(`Enter password of length ${length}`, async () => {
                await loginPage.addPassword(password);
            });

            await step(`Verify login button is ${expectedState}`, async () => {
                await loginPage.expectElementState(loginBtn, expectedState);
            });
        });
    });
});