import BasePage from "./base.page";
import { selector } from "../factories/page.factory";
import {
  generateInvalidEmail,
  generateValidEmailSample,
} from "../utils/helpers";

export class LoginPage extends BasePage {
  public createAccountOrRegisterProfile = selector(
    "~Create Account or Register Profile",
    "~Create Account or Register Profile",
    "Create Account or Register Profile",
  );
  public followTeamOrLeague = selector(
    "~Follow a Team or League",
    "~Follow a Team or League",
    "follow team or league",
  );
  public welcomeHeading = selector("~Welcome!", "~Welcome!", "Welcome heading");

  protected username = selector(
    '-android uiautomator:new UiSelector().className("android.widget.EditText").instance(0)',
    "(//XCUIElementTypeTextField)[1]",
    "email",
  );

  public password = selector(
    '-android uiautomator:new UiSelector().className("android.widget.EditText").instance(1)',
    "//XCUIElementTypeTextField[2] | //XCUIElementTypeSecureTextField",
    "password",
  );
  public secureTextPasswordField = selector(
    '-android uiautomator:new UiSelector().className("android.widget.EditText").instance(1)',
    "(//XCUIElementTypeTextField)[2]",
    "password",
  );

  public loginButton = selector("~Log In", "~Log In", "first login button");
  public loginHeading = selector(
    '(//android.view.View[@content-desc="Log In"])[1]',
    '//XCUIElementTypeOther[@name="Log In"]',
    "login Heading",
  );
  public backButton = selector("~Back", "~Back", "back button");
  public rememberPassword = selector(
    "~Remember password",
    "~Remember password",
    "remember password",
  );
  public forgotPassword = selector(
    "~Forgot/ Reset Password?",
    "~Forgot/ Reset Password?",
    "forgot password",
  );
  public signUp = selector(
    "~Can’t login? Sign up for an account",
    "~Can’t login? Sign up for an account",
    "sign up",
  );
  public login = selector(
    '(//android.view.View[@content-desc="Log In"])[2]',
    '//XCUIElementTypeStaticText[@name="Log In"]',
    "Login user",
  );
  public invalidUsernameOrPass = selector(
    '(//android.view.View[@content-desc="Invalid username or password."])[1]',
    "",
    "invalid username or password text",
  );
  public okButton = selector(
    '(//android.view.View[@content-desc="Invalid username or password."])[2]',
    "",
    "invalid username or password ok button",
  );
  public viewPassword = selector(
    '-android uiautomator:new UiSelector().className("android.view.View").instance(13)',
    "",
    "view password",
  );

  async loginUser(user: string, pass: string) {
    await this.addUserName(user);
    await this.addPassword(pass);
    await this.click(this.loginButton);
  }
  async addUserName(user: string) {
    await this.click(this.username);
    await this.type(this.username, user);
  }
  async addPassword(password: string) {
    await this.click(this.password);
    await this.type(this.password, password);
    if (driver.isIOS) {
      await browser.pause(500);
      await this.scrollDown();
    }
  }
  async testMultipleInvalidEmails(element: any) {
    for (let i = 0; i < 10; i++) {
      const email = generateInvalidEmail(8);
      await this.addUserName(email);
      await this.addPassword("rwkzvo4cd");

      // Expect login button to stay disabled for invalid emails
      await this.expectElementState(element, "disabled");
    }
  }
  async testMultipleValidEmails(element: any) {
    for (let i = 0; i < 3; i++) {
      const sample = generateValidEmailSample();

      await this.addUserName(sample.email);
      await this.addPassword(sample.password);

      // For valid emails, button should be enabled
      await this.expectElementState(element, "enabled");
    }
  }

  async validateLoginBtnIsVisible() {
    await this.handleIOSNotificationPrePrompt();
    await this.scrollDown();
    await this.waitUntilVisibleWithRetry(this.loginButton);
  }
}
