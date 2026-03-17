import BasePage from "./base.page";
import { selector } from '../factories/page.factory'

export class LoginPage extends BasePage {
    public createAccountOrRegisterProfile = selector(
        '~Create Account or Register Profile',
        '',
        'Create Account or Register Profile',
    )
    public followTeamOrLeague = selector(
        '~Follow a Team or League',
        '',
        'follow team or league'
    )
    public welcomeHeading = selector(
        '~Welcome!',
        '~password',
        'Welcome'
    )

    private username = selector(
        '-android uiautomator:new UiSelector().className("android.widget.EditText").instance(0)',
        '',
        'email'
    )

    public password = selector(
        '-android uiautomator:new UiSelector().className("android.widget.EditText").instance(1)',
        '',
        'password'
    )

    public loginButton = selector(
        '~Log In',
        '~Log In',
        'first login button',
    )
    public loginHeading = selector(
        '(//android.view.View[@content-desc="Log In"])[1]',
        '',
        'login Heading',
    )
    public backButton = selector(
        '~Back',
        '',
        'back'
    )
    public rememberPassword = selector(
        '~Remember password',
        '',
        'remember password'
    )
    public forgotPassword = selector(
        '~Forgot/ Reset Password?',
        '',
        'forgot password'
    )
    public signUp = selector(
        '~Can’t login? Sign up for an account',
        '',
        'sign up'
    )
    public login = selector(
        '(//android.view.View[@content-desc="Log In"])[2]',
        '',
        'Login user'
    )
    public invalidUsernameOrPass = selector(
        '(//android.view.View[@content-desc="Invalid username or password."])[1]',
        '',
        'invalid username or password text'
    )
    public okButton = selector(
        '(//android.view.View[@content-desc="Invalid username or password."])[2]',
        '',
        'invalid username or password ok button'
    )
    public viewPassword = selector(
        '-android uiautomator:new UiSelector().className("android.view.View").instance(13)',
        '',
        'view password'
    )


    async loginUser(user: string, pass: string) {
        await this.addUserName(user)
        await this.addPassword(pass)
        await this.click(this.loginButton)
    }
    async addUserName(user: string) {
        await this.click(this.username)
        await this.type(this.username, user)
    }
    async addPassword(password: string) {
        await this.click(this.password)
        await this.type(this.password, password)
    }


}