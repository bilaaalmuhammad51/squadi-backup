import { emailLoginTestData } from "../data/login.data";
import { LoginPage } from "../pages/login.page";
import { HomePage } from "../pages/home.page";

describe("Authentication - Email Validation", () => {
    it("should validate login button state for supported email formats and allow a registered user to log in successfully", async () => {
        // Arrange, initialize page objects
        const loginPage = new LoginPage();
        const homePage = new HomePage();

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

        // Assert, login button should be disabled when both fields are empty
        await loginPage.expectElementState(loginBtn, "disabled");

        // Assert, login button should remain disabled when email is empty
        await loginPage.addUserName(emailLoginTestData.emptyEmail.email);
        await loginPage.expectElementState(loginBtn, "disabled");

        // Assert, login button should remain disabled when only password is entered
        await loginPage.addPassword(emailLoginTestData.emptyEmail.password);
        await loginPage.expectElementState(loginBtn, "disabled");

        // Assert, login button should remain disabled for email without @ symbol
        await loginPage.addUserName(emailLoginTestData.invalidEmails[0].email);
        await loginPage.addPassword(emailLoginTestData.invalidEmails[0].password);
        await loginPage.expectElementState(loginBtn, "disabled");

        // Assert, login button should remain disabled for email with incomplete domain
        await loginPage.addUserName(emailLoginTestData.invalidEmails[1].email);
        await loginPage.addPassword(emailLoginTestData.invalidEmails[1].password);
        await loginPage.expectElementState(loginBtn, "disabled");

        // Assert, login button should remain disabled for email missing @ structure
        await loginPage.addUserName(emailLoginTestData.invalidEmails[2].email);
        await loginPage.addPassword(emailLoginTestData.invalidEmails[2].password);
        await loginPage.expectElementState(loginBtn, "disabled");

        // Assert, login button should remain disabled for email missing local part
        await loginPage.addUserName(emailLoginTestData.invalidEmails[3].email);
        await loginPage.addPassword(emailLoginTestData.invalidEmails[3].password);
        await loginPage.expectElementState(loginBtn, "disabled");

        // Assert, login button should become enabled when leading spaces are trimmed by the app
        await loginPage.addUserName(emailLoginTestData.invalidEmails[4].email);
        await loginPage.addPassword(emailLoginTestData.invalidEmails[4].password);
        await loginPage.expectElementState(loginBtn, "enabled");

        // Assert, login button should become enabled when trailing spaces are trimmed by the app
        await loginPage.addUserName(emailLoginTestData.invalidEmails[5].email);
        await loginPage.addPassword(emailLoginTestData.invalidEmails[5].password);
        await loginPage.expectElementState(loginBtn, "enabled");

        // Assert, login button should remain disabled for email containing internal spaces
        await loginPage.addUserName(emailLoginTestData.invalidEmails[6].email);
        await loginPage.addPassword(emailLoginTestData.invalidEmails[6].password);
        await loginPage.expectElementState(loginBtn, "disabled");

        // Assert, login button should remain disabled for email containing multiple @ symbols
        await loginPage.addUserName(emailLoginTestData.invalidEmails[7].email);
        await loginPage.addPassword(emailLoginTestData.invalidEmails[7].password);
        await loginPage.expectElementState(loginBtn, "disabled");

        // Assert, login button should remain disabled for email missing domain extension
        await loginPage.addUserName(emailLoginTestData.invalidEmails[8].email);
        await loginPage.addPassword(emailLoginTestData.invalidEmails[8].password);
        await loginPage.expectElementState(loginBtn, "disabled");

        // Assert, login button should remain disabled for email containing invalid special characters
        await loginPage.addUserName(emailLoginTestData.invalidEmails[9].email);
        await loginPage.addPassword(emailLoginTestData.invalidEmails[9].password);
        await loginPage.expectElementState(loginBtn, "disabled");

        // Assert, login button should remain disabled for malformed email format
        await loginPage.addUserName(emailLoginTestData.invalidEmails[10].email);
        await loginPage.addPassword(emailLoginTestData.invalidEmails[10].password);
        await loginPage.expectElementState(loginBtn, "disabled");

        // Assert, login button should remain disabled for excessively long email input
        await loginPage.addUserName(emailLoginTestData.invalidEmails[11].email);
        await loginPage.addPassword(emailLoginTestData.invalidEmails[11].password);
        await loginPage.expectElementState(loginBtn, "disabled");

        // Assert, login button should become enabled for standard valid email
        await loginPage.addUserName(emailLoginTestData.validEmailSamples[0].email);
        await loginPage.addPassword(emailLoginTestData.validEmailSamples[0].password);
        await loginPage.expectElementState(loginBtn, "enabled");

        // Assert, login button should become enabled for valid uppercase email with plus alias
        await loginPage.addUserName(emailLoginTestData.validEmailSamples[1].email);
        await loginPage.addPassword(emailLoginTestData.validEmailSamples[1].password);
        await loginPage.expectElementState(loginBtn, "enabled");

        // Assert, login button should become enabled for valid lowercase email with plus alias
        await loginPage.addUserName(emailLoginTestData.validEmailSamples[2].email);
        await loginPage.addPassword(emailLoginTestData.validEmailSamples[2].password);
        await loginPage.expectElementState(loginBtn, "enabled");

        // Act, submit login with valid credentials
        await loginPage.click(loginPage.login);

        // Assert, verify user lands on home screen after successful login
        await homePage.waitUntilVisibleWithRetry(homePage.homeTab);
        await homePage.isElementDisplayed(homePage.homeTab);
        await homePage.isElementDisplayed(homePage.drawsTab);
        await homePage.isElementDisplayed(homePage.laddersTab);
    });
});