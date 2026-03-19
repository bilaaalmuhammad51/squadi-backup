import allureReporter from "@wdio/allure-reporter";
import { step} from "../../utils/helpers";
import { LoginData } from "../../data/login.data";
import { LoginPage } from "../../pages/login.page";

describe("Authentication - Password field masking and visibility toggle", () => {

    it("should verify password is masked by default and can be toggled to visible", async () => {

        const loginPage = new LoginPage();
        let loginBtn: ChainablePromiseElement;

        allureReporter.addFeature("Authentication");
        allureReporter.addStory("Password Visibility Toggle");
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

        await step("Enter valid email and verify login button is disabled", async () => {
            await loginPage.addUserName(LoginData.email);
            await loginPage.expectElementState(loginBtn, "disabled");
        });

        await step("Enter password and verify it is masked", async () => {
            await loginPage.addPassword(LoginData.password);

            const maskedText = await loginPage.getText(loginPage.password);
            allureReporter.addAttachment("Masked Password Value", maskedText, "text/plain");

            expect(maskedText.length).toBeGreaterThan(0);
            expect(maskedText).toMatch(/^.+$/);
        });

        await step("Toggle password visibility and verify it is visible", async () => {
            await loginPage.click(loginPage.viewPassword);

            const visibleText = await loginPage.getText(loginPage.password);
            allureReporter.addAttachment("Visible Password Value", visibleText, "text/plain");

            expect(visibleText).toContain(LoginData.password);
        });

        await step("Toggle password visibility again and verify it is masked", async () => {
            await loginPage.click(loginPage.viewPassword);

            const reMaskedText = await loginPage.getText(loginPage.password);
            allureReporter.addAttachment("Re-masked Password Value", reMaskedText, "text/plain");

            expect(reMaskedText.length).toBeGreaterThan(0);
            expect(reMaskedText).toMatch(/^.+$/);
        });

    });

});