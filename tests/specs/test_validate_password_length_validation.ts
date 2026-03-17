import { LoginData } from "../data/login.data";
import { LoginPage } from "../pages/login.page";
import { generateInvalidPassword} from "../utils/helpers";

describe("Authentication - Password length Validation", () => {
    it("should validate login button state for password length boundaries", async () => {
        // Arrange, initialize page object
        const loginPage = new LoginPage();

        // Assert, verify welcome screen is loaded
        await loginPage.waitUntilVisibleWithRetry(loginPage.loginButton);
        await loginPage.assertElementDisplayed(loginPage.welcomeHeading);
        await loginPage.assertElementDisplayed(loginPage.createAccountOrRegisterProfile);
        await loginPage.assertElementDisplayed(loginPage.followTeamOrLeague);
        await loginPage.assertElementDisplayed(loginPage.loginButton);

        // Act, navigate to login screen
        await loginPage.click(loginPage.loginButton);

        // Assert, verify login screen elements
        await loginPage.assertElementDisplayed(loginPage.backButton);
        await loginPage.assertElementDisplayed(loginPage.loginHeading);

        const loginBtn = await loginPage.getElement(loginPage.login);

        // Assert, login button should be disabled on initial load
        await loginPage.expectElementState(loginBtn, "disabled");

        // Assert, login button should remain disabled after entering valid email only
        await loginPage.addUserName(LoginData.email);
        await loginPage.expectElementState(loginBtn, "disabled");

        // Test password lengths dynamically
        for (let len = 5; len <= 8; len++) {
            // Force exact length when testing valid password (len=8)
            const password = len < 8 ? generateInvalidPassword(len) : generateInvalidPassword(len, true);

            await loginPage.addPassword(password);

            if (len < 8) {
                await loginPage.expectElementState(loginBtn, "disabled");
            } else {
                await loginPage.expectElementState(loginBtn, "enabled");
            }
        }
    });
});