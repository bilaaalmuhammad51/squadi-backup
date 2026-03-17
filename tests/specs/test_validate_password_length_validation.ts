import { invalidLoginData, LoginData } from "../data/login.data";
import { LoginPage } from "../pages/login.page";

describe("Authentication - Password length Validation", () => {
    it("should validate login button state for password length boundaries", async () => {
        // Arrange, initialize page object
        const loginPage = new LoginPage();

        // Assert, verify welcome screen is loaded
        await loginPage.waitUntilVisibleWithRetry(loginPage.loginButton);
        await loginPage.isElementDisplayed(loginPage.welcomeHeading);
        await loginPage.isElementDisplayed(loginPage.createAccountOrRegisterProfile);
        await loginPage.isElementDisplayed(loginPage.followTeamOrLeague);
        await loginPage.isElementDisplayed(loginPage.loginButton);

        // Act, navigate to login screen
        await loginPage.click(loginPage.loginButton);

        // Assert, verify login screen elements
        await loginPage.isElementDisplayed(loginPage.backButton);
        await loginPage.isElementDisplayed(loginPage.loginHeading);

        const loginBtn = await loginPage.getElement(loginPage.login);

        // Assert, login button should be disabled on initial load
        await loginPage.expectElementState(loginBtn, "disabled");

        // Assert, login button should remain disabled after entering valid email only
        await loginPage.addUserName(LoginData.email);
        await loginPage.expectElementState(loginBtn, "disabled");

        // Assert, login button should remain disabled for password with 5 characters
        await loginPage.addPassword(invalidLoginData.shortPasswords[0]);
        await loginPage.expectElementState(loginBtn, "disabled");

        // Assert, login button should remain disabled for password with 6 characters
        await loginPage.addPassword(invalidLoginData.shortPasswords[1]);
        await loginPage.expectElementState(loginBtn, "disabled");

        // Assert, login button should remain disabled for password with 7 characters
        await loginPage.addPassword(invalidLoginData.shortPasswords[2]);
        await loginPage.expectElementState(loginBtn, "disabled");

        // Assert, login button should become enabled for password with 8 characters, meets minimum requirement
        await loginPage.addPassword(invalidLoginData.shortPasswords[3]);
        await loginPage.expectElementState(loginBtn, "enabled");
    });
});