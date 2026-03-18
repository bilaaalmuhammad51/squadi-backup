import { LoginData } from "../../data/login.data";
import { LoginPage } from "../../pages/login.page";
import { HomePage } from "../../pages/home.page";

describe("Authentication - Login Flow", () => {

    it("should allow a registered user to log in and land on the home screen", async () => {

        // ---------- Initialize page objects ----------
        const loginPage = new LoginPage();
        const homePage = new HomePage();


        // ---------- Verify welcome screen elements ----------
        await loginPage.waitUntilVisibleWithRetry(loginPage.loginButton);

        await loginPage.assertElementDisplayed(loginPage.welcomeHeading);
        await loginPage.assertElementDisplayed(loginPage.createAccountOrRegisterProfile);
        await loginPage.assertElementDisplayed(loginPage.followTeamOrLeague);
        await loginPage.assertElementDisplayed(loginPage.loginButton);


        // ---------- Navigate to login screen ----------
        await loginPage.click(loginPage.loginButton);


        // ---------- Verify login screen elements ----------
        await loginPage.assertElementDisplayed(loginPage.backButton);
        await loginPage.assertElementDisplayed(loginPage.loginHeading);
        await loginPage.assertTextContains(
            loginPage.loginHeading,
            LoginData.loginHeading
        );

        await loginPage.assertElementDisplayed(loginPage.rememberPassword);
        await loginPage.assertElementDisplayed(loginPage.forgotPassword);


        // ---------- Enter valid credentials ----------
        await loginPage.addUserName(LoginData.email);
        await loginPage.addPassword(LoginData.password);


        // ---------- Submit login ----------
        await loginPage.click(loginPage.login);


        // ---------- Validate successful login by checking Home screen ----------
        await homePage.waitUntilVisibleWithRetry(homePage.homeTab);

        await homePage.assertElementDisplayed(homePage.homeTab);
        await homePage.assertElementDisplayed(homePage.drawsTab);
        await homePage.assertElementDisplayed(homePage.laddersTab);
    });

});