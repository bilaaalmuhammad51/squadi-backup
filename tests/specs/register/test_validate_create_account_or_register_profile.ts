import { LoginPage } from '../../pages/login.page'
import { HomePage } from '../../pages/home.page'
import { RegisterProfilePage } from '../../pages/register.profile.page'
import { RegisterData } from '../../data/register.data'
import { generateUniqueEmail } from '../../utils/helpers'

describe('Authentication, Registration Flow', () => {
    it('should allow a user to register and land on the home screen', async () => {
        const loginPage = new LoginPage()
        const registerProfilePage = new RegisterProfilePage()
        const homePage = new HomePage()

        const uniqueEmail = generateUniqueEmail()

        // Verify welcome screen
        await loginPage.waitUntilVisibleWithRetry(loginPage.loginButton)
        await loginPage.assertElementDisplayed(loginPage.welcomeHeading)
        await loginPage.assertElementDisplayed(loginPage.createAccountOrRegisterProfile)
        await loginPage.assertElementDisplayed(loginPage.followTeamOrLeague)
        await loginPage.assertElementDisplayed(loginPage.loginButton)

        // Open registration screen
        await loginPage.click(loginPage.createAccountOrRegisterProfile)

        // Verify registration screen
        await registerProfilePage.assertElementDisplayed(registerProfilePage.backButton)
        await registerProfilePage.assertElementDisplayed(registerProfilePage.createAccountOrRegisterProfile)
        await registerProfilePage.assertTextContains(
            registerProfilePage.createAccountOrRegisterProfile,
            RegisterData.registerHeading
        )

        // Fill registration form
        await registerProfilePage.addUserName(uniqueEmail)
        await registerProfilePage.fillPasswordFields(RegisterData.password)
        await registerProfilePage.fillFirstAndLastNameWithGenerated()
        await registerProfilePage.verifyAndSelectGender(RegisterData.allGenderOptions[0])
        await registerProfilePage.selectOrganisation(RegisterData.organisation)
        await registerProfilePage.scrollDown()
        await registerProfilePage.addPhoneNumber(RegisterData.phoneNumber)

        const nextButton = await registerProfilePage.getElement(registerProfilePage.nextButton)

        // Verify button state before and after accepting terms
        await registerProfilePage.expectElementState(nextButton, 'disabled')
        await registerProfilePage.verifyAndAcceptTerms()
        await registerProfilePage.expectElementState(nextButton, 'enabled')

        // Continue registration
        await registerProfilePage.click(registerProfilePage.nextButton)
        await registerProfilePage.verifyAndSelectRegisterProfile(RegisterData.noOption)

        // Verify home screen
        await homePage.assertElementDisplayed(homePage.homeTab)
        await homePage.assertElementDisplayed(homePage.liveScores)
        await homePage.assertElementDisplayed(homePage.addTeamOrLeague)
        await homePage.assertElementDisplayed(homePage.drawsTab)
        await homePage.assertElementDisplayed(homePage.laddersTab)
    })
})