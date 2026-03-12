import LoginPage from '../pages/login.page'
describe('Login flow', () => {
    it('should open the app', async () => {
        await LoginPage.waitUntilVisibleWithRetry(LoginPage.loginButton)
        await LoginPage.pause(5000)
        await expect(await LoginPage.isLoginButtonDisplayed()).toBe(true)
        await LoginPage.getElement(LoginPage.loginButton)

        await LoginPage.clickElement(LoginPage.loginButton)
    })
})