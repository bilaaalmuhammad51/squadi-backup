import LoginPage from '../pages/login.page'
describe('Login flow1', () => {
    it('should open the app', async () => {
        // await driver.pause(3000)
        await LoginPage.waitUntilVisibleWithRetry(LoginPage.loginButton)
        // console.log("login button BECOME VISIBLE")
        await LoginPage.pause(5000)
        await expect(await LoginPage.isLoginButtonDisplayed()).toBe(true)
        await LoginPage.getElement(LoginPage.loginButton)

        await LoginPage.clickElement(LoginPage.loginButton)
    })
})