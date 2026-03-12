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

        // Assert, login button should be disabled when both fields are empty
        await loginPage.expectElementState(loginBtn, "disabled");

        // Assert, login button should remain disabled when email is empty
        await loginPage.addUserName(emailLoginTestData.emptyEmail.email);
        await loginPage.expectElementState(loginBtn, "disabled");

        // Assert, login button should remain disabled when only password is entered
        await loginPage.addPassword(emailLoginTestData.emptyEmail.password);
        await loginPage.expectElementState(loginBtn, "disabled");

        // Test multiple invalid emails
        await loginPage.testMultipleInvalidEmails(loginBtn);

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
        await homePage.assertElementDisplayed(homePage.homeTab);
        await homePage.assertElementDisplayed(homePage.drawsTab);
        await homePage.assertElementDisplayed(homePage.laddersTab);
    });
});