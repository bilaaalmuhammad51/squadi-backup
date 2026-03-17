import { invalidLoginErrorData, LoginData } from "../data/login.data";
import { LoginPage } from "../pages/login.page";

describe("Authentication - Invalid Login Flow with invalid credentials", () => {

    it("should display an error message for invalid login credential combinations", async () => {

        // ---------- Initialize page objects ----------
        const loginPage = new LoginPage();

        // ---------- Verify welcome screen elements ----------
        await loginPage.waitUntilVisibleWithRetry(loginPage.loginButton);

        await loginPage.isElementDisplayed(loginPage.welcomeHeading);
        await loginPage.isElementDisplayed(loginPage.createAccountOrRegisterProfile);
        await loginPage.isElementDisplayed(loginPage.followTeamOrLeague);
        await loginPage.isElementDisplayed(loginPage.loginButton);


        // ---------- Navigate to login screen ----------
        await loginPage.click(loginPage.loginButton);


        // ---------- Verify login screen elements ----------
        await loginPage.isElementDisplayed(loginPage.backButton);
        await loginPage.isElementDisplayed(loginPage.loginHeading);
        await loginPage.assertTextContains(
            loginPage.loginHeading,
            LoginData.loginHeading
        );

        await loginPage.isElementDisplayed(loginPage.rememberPassword);
        await loginPage.isElementDisplayed(loginPage.forgotPassword);


        // ---------- Validate error for unregistered email with valid password ----------
        await loginPage.addUserName(invalidLoginErrorData.cases[0].email);
        await loginPage.addPassword(invalidLoginErrorData.cases[0].password);

        await loginPage.click(loginPage.login);

        await loginPage.waitUntilVisibleWithRetry(loginPage.invalidUsernameOrPass);
        await loginPage.assertTextContains(
            loginPage.invalidUsernameOrPass,
            invalidLoginErrorData.invalidUsernameOrPassword
        );
        await loginPage.click(loginPage.okButton);


        // ---------- Validate error for valid email with invalid password ----------
        await loginPage.addUserName(invalidLoginErrorData.cases[1].email);
        await loginPage.addPassword(invalidLoginErrorData.cases[1].password);

        await loginPage.click(loginPage.login);

        await loginPage.waitUntilVisibleWithRetry(loginPage.invalidUsernameOrPass);
        await loginPage.assertTextContains(
            loginPage.invalidUsernameOrPass,
            invalidLoginErrorData.invalidUsernameOrPassword
        );
        await loginPage.click(loginPage.okButton);


        // ---------- Validate error for invalid email with valid password ----------
        await loginPage.addUserName(invalidLoginErrorData.cases[2].email);
        await loginPage.addPassword(invalidLoginErrorData.cases[2].password);

        await loginPage.click(loginPage.login);

        await loginPage.waitUntilVisibleWithRetry(loginPage.invalidUsernameOrPass);
        await loginPage.assertTextContains(
            loginPage.invalidUsernameOrPass,
            invalidLoginErrorData.invalidUsernameOrPassword
        );
        await loginPage.click(loginPage.okButton);


        // ---------- Validate error for both email and password invalid ----------
        await loginPage.addUserName(invalidLoginErrorData.cases[3].email);
        await loginPage.addPassword(invalidLoginErrorData.cases[3].password);

        await loginPage.click(loginPage.login);

        await loginPage.waitUntilVisibleWithRetry(loginPage.invalidUsernameOrPass);
        await loginPage.assertTextContains(
            loginPage.invalidUsernameOrPass,
            invalidLoginErrorData.invalidUsernameOrPassword
        );
        await loginPage.click(loginPage.okButton);
    });

});