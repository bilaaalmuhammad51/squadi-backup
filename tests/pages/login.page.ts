import BasePage from "./basePage";
import { selector } from '../factories/page.factory'

class LoginPage extends BasePage {

    private username = selector(
        '//*[@content-desc="username"]',
        '~username'
    )

    private password = selector(
        '//*[@content-desc="password"]',
        '~password'
    )

    public loginButton = selector(
        '~Log In',
        'Log In'
    )

    async login(user: string, pass: string) {
        await this.type(this.username, user)
        await this.type(this.password, pass)
        await this.tap(this.loginButton)
    }
    async isLoginButtonDisplayed(): Promise<boolean> {
        return this.isDisplayed(this.loginButton)
    }
    async waitForLoginButton() {
        return this.waitUntilVisibleWithRetry(this.loginButton)
    }


}

export default new LoginPage()