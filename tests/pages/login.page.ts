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
public locationOptionPopupCloseBtn = selector(
    "~Close",
    "~Close",
    "location option popup close button",
  );
  public tapOnScreenForNextButton = selector(
    'android=new UiSelector().text("Football")',
    "",
    "tap on screen to make Next visible if hidden in DOM",
  )
  public nextButton = selector(
    'android=new UiSelector().text("Next")',
    '~Next',
    "Next button",
  )
  public usernameOrEmailField = selector(
    '-android uiautomator:new UiSelector().className("android.widget.EditText").instance(1)',
    '-ios predicate string: value == "Username/Email" AND type == "XCUIElementTypeTextField"',
    "username or email field for forgot password flow",
  )
  public submitUsernameOrEmailBtn = selector(
    '-android uiautomator:new UiSelector().text("Submit")',
    '~Submit',
    "Submit button for forgot password flow",
  )
  public tapOnScreenForTextAfterSubmittingUsernameOrEmail = selector(
    'android=new UiSelector().className("android.webkit.WebView")',
    "",
    "tap on screen to make text visible after submitting username or email in forgot password flow"
  )
  public textAfterSubmittingUsernameOrEmail = selector(
    'android=new UiSelector().text("If you are registered with us, a password link was sent to your email.")',
    '~If you are registered with us, a password link was sent to your email.',
    "text displayed after submitting username or email in forgot password flow"
  )
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
    '(//XCUIElementTypeStaticText[@name="Invalid username or password."])[1]',
    "invalid username or password text",
  );
  public okButton = selector(
    '(//android.view.View[@content-desc="Invalid username or password."])[2]',
    '(//XCUIElementTypeStaticText[@name="Invalid username or password."])[2]',
    "invalid username or password ok button",
  );
  public viewPassword = selector(
    '-android uiautomator:new UiSelector().className("android.view.View").instance(13)',
    "//XCUIElementTypeWindow/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther[2]/XCUIElementTypeOther[2]/XCUIElementTypeOther[2]/XCUIElementTypeOther[3]/XCUIElementTypeOther/XCUIElementTypeOther[2]/XCUIElementTypeOther",
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
  async clickForgotPassword() {
    await this.waitUntilVisibleWithRetry(this.forgotPassword);
    await this.click(this.forgotPassword);
  }

  async closePopupIfVisible() {
    const isPopupVisible = await this.getElement(this.locationOptionPopupCloseBtn, { wait: true, timeout: 50000 }).then(() => true).catch(() => false);
    if (isPopupVisible) {
      await this.click(this.locationOptionPopupCloseBtn);
    }
  }

  async clickNextButton() {
    const isNextBtnVisible = await this.getElement(this.nextButton, { wait: true, timeout: 10000 }).then(() => true).catch(() => false);
    if (isNextBtnVisible) {
      await this.click(this.nextButton);
    } else {
      await this.click(this.tapOnScreenForNextButton);
      await this.waitUntilVisibleWithRetry(this.nextButton, undefined, 30000);
      await this.click(this.nextButton);
    }
  }

  async addUsernameOrEmailForForgotPasswordFlow(usernameOrEmail: string) {
    await this.waitUntilVisibleWithRetry(this.usernameOrEmailField);
    await this.click(this.usernameOrEmailField);
    await this.type(this.usernameOrEmailField, usernameOrEmail);
  }

  async clickSubmitBtnForForgotPasswordFlow() {
    await this.waitUntilVisibleWithRetry(this.submitUsernameOrEmailBtn);
    await this.click(this.submitUsernameOrEmailBtn);
  }

  async verifyTextAfterSubmittingUsernameOrEmail() {
    try {
      const isTextVisible = await this.getElement(this.textAfterSubmittingUsernameOrEmail, { wait: true, timeout: 10000 }).then(() => true).catch(() => false);

      if (isTextVisible) {
        console.log("Text is visible without tapping on screen");
        await this.assertElementDisplayed(this.textAfterSubmittingUsernameOrEmail);
      } else {
        console.log("Text is not visible, tapping on screen to make it visible");
        await this.click(this.tapOnScreenForTextAfterSubmittingUsernameOrEmail);

        await this.waitUntilVisible(this.textAfterSubmittingUsernameOrEmail, 10000); // Wait for the element to become visible
        await this.assertElementDisplayed(this.textAfterSubmittingUsernameOrEmail);
      }
    } catch (error) {
      console.error("Error while verifying text visibility:", error);
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
