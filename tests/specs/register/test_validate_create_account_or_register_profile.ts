import allureReporter from "@wdio/allure-reporter";
import { step} from "../../utils/helpers";
import { LoginPage } from '../../pages/login.page';
import { HomePage } from '../../pages/home.page';
import { RegisterProfilePage } from '../../pages/register.profile.page';
import { RegisterData } from '../../data/register.data';
import { generateUniqueEmail } from '../../utils/helpers';

describe('Authentication, Registration Flow', () => {
    it('should allow a user to register and land on the home screen', async () => {

        const loginPage = new LoginPage();
        const registerProfilePage = new RegisterProfilePage();
        const homePage = new HomePage();

        const uniqueEmail = generateUniqueEmail();
        let nextButton: ChainablePromiseElement;

        allureReporter.addFeature("Authentication");
        allureReporter.addStory("User Registration");
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

        await step("Navigate to registration screen", async () => {
            await loginPage.click(loginPage.createAccountOrRegisterProfile);
        });

        await step("Verify registration screen elements", async () => {
            await registerProfilePage.assertElementDisplayed(registerProfilePage.backButton);
            await registerProfilePage.assertElementDisplayed(registerProfilePage.createAccountOrRegisterProfile);
            await registerProfilePage.assertTextContains(
                registerProfilePage.createAccountOrRegisterProfile,
                RegisterData.registerHeading
            );
        });

        await step("Fill registration form", async () => {
            await registerProfilePage.addUserName(uniqueEmail);
            allureReporter.addAttachment("Registered Email", uniqueEmail, "text/plain");

            await registerProfilePage.fillPasswordFields(RegisterData.password);
            await registerProfilePage.fillFirstAndLastNameWithGenerated();
            await registerProfilePage.scrollDown();
            await registerProfilePage.verifyAndSelectGender(RegisterData.allGenderOptions[0]);
            await registerProfilePage.selectOrganisation(RegisterData.organisation);
            await registerProfilePage.scrollDown();
            await registerProfilePage.addPhoneNumber(RegisterData.phoneNumber);
        });

        await step("Get Next button element", async () => {
            nextButton = await registerProfilePage.getElement(registerProfilePage.nextButton);
        });

        await step("Verify Next button is disabled before accepting terms", async () => {
            await registerProfilePage.expectElementState(nextButton, 'disabled');
        });

        await step("Accept terms and verify Next button is enabled", async () => {
            await registerProfilePage.verifyAndAcceptTerms();
            await registerProfilePage.expectElementState(nextButton, 'enabled');
        });

        await step("Proceed with registration", async () => {
            await registerProfilePage.click(registerProfilePage.nextButton);
            await registerProfilePage.verifyAndSelectRegisterProfile(RegisterData.noOption);
        });

        await step("Verify user lands on Home screen", async () => {
            await homePage.verifyHomeScreenElements();
        });

    });
});