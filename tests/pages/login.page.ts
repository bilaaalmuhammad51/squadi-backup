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

  public loginTab = selector(
    'android=new UiSelector().descriptionContains("Login")',
    '-ios predicate string: name CONTAINS "Login"',
    "Login tab on Welcome screen",
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
  public tapOnScreenToClosePopup = selector(
    'android=new UiSelector().text("Select Language")',
    "",
    "tap on screen to make close button visible if hidden in DOM",
  );
  public tapOnScreenForNextButton = selector(
    'android=new UiSelector().text("Football")',
    "",
    "tap on screen to make Next visible if hidden in DOM",
  );

  public nextButton = selector(
    'android=new UiSelector().text("Next")',
    "~Next",
    "Next button",
  );
  public acceptAllButton = selector(
    'android=new UiSelector().text("Accept all")',
    "~Accept all",
    "Accept all button in cookie consent popup",
  );
  public usernameOrEmailField = selector(
    '-android uiautomator:new UiSelector().className("android.widget.EditText").instance(1)',
    '-ios predicate string: value == "Username/Email" AND type == "XCUIElementTypeTextField"',
    "username or email field for forgot password flow",
  );
  public submitUsernameOrEmailBtn = selector(
    '-android uiautomator:new UiSelector().text("Submit")',
    "~Submit",
    "Submit button for forgot password flow",
  );
  public tapOnScreenForTextAfterSubmittingUsernameOrEmail = selector(
    'android=new UiSelector().className("android.webkit.WebView")',
    "",
    "tap on screen to make text visible after submitting username or email in forgot password flow",
  );
  public textAfterSubmittingUsernameOrEmail = selector(
    'android=new UiSelector().text("If you are registered with us, a password link was sent to your email.")',
    "~If you are registered with us, a password link was sent to your email.",
    "text displayed after submitting username or email in forgot password flow",
  );
  public signUp = selector(
    "~Can’t login? Sign up for an account",
    "~Can’t login? Sign up for an account",
    "sign up",
  );
  public login = selector(
    'android=new UiSelector().description("Log In").instance(1)',
    '-ios predicate string:name == "Log In" AND label == "Log In" AND type == "XCUIElementTypeButton"',
    "Login user",
  );
  public invalidUsernameOrPass = selector(
    "~Login Unsuccessful. Incorrect Username or Password. Please note your password is case sensitive.",
    "~Login Unsuccessful. Incorrect Username or Password. Please note your password is case sensitive.",
    "invalid username or password text",
  );
  public okButton = selector(
    "~Ok",
    '-ios predicate string:name == "Ok"',
    "invalid username or password ok button",
  );
  public viewPassword = selector(
    '-android uiautomator:new UiSelector().className("android.view.View").instance(12)',
    "//XCUIElementTypeWindow/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther[2]/XCUIElementTypeOther[2]/XCUIElementTypeOther[2]/XCUIElementTypeOther[3]/XCUIElementTypeOther/XCUIElementTypeOther[2]/XCUIElementTypeOther",
    "view password",
  );
  public moreTab = selector(
    'android=new UiSelector().descriptionContains("More")',
    '-ios predicate string:name CONTAINS "More"',
    "More tab in bottom navigation",
  );
  public logoutButton = selector(
    'android=new UiSelector().description("Log Out")',
    "~Log Out",
    "Logout button in More tab",
  );
  public confirmLogoutButton = selector(
    "~Yes, log out",
    "~Yes, log out",
    "Confirm logout button in logout popup",
  );

  async loginUser(user: string, pass: string) {
    await this.addUserName(user);
    await this.addPassword(pass);
    await this.waitUntilVisibleWithRetry(this.login);
    await this.click(this.login);
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

  async ifClosePopupVisible(): Promise<boolean> {
    const isVisible = await this.isElementVisible(
      this.locationOptionPopupCloseBtn,
      12000,
    );
    return isVisible;
  }

  async isAcceptAllButtonVisible(): Promise<boolean> {
    const isVisible = await this.isElementVisible(this.acceptAllButton, 5000);
    return isVisible;
  }

  async clickClosePopup() {
    await this.waitUntilVisibleWithRetry(
      this.locationOptionPopupCloseBtn,
      undefined,
      30000,
    );
    await this.click(this.locationOptionPopupCloseBtn);
    await this.waitUntilInvisibleWithRetry(
      this.locationOptionPopupCloseBtn,
      undefined,
      30000,
    );
  }

  async clickTapOnScreenToClosePopup() {
    await this.waitUntilVisibleWithRetry(
      this.tapOnScreenToClosePopup,
      undefined,
      30000,
    );
    await this.click(this.tapOnScreenToClosePopup);
    await this.waitUntilInvisibleWithRetry(
      this.locationOptionPopupCloseBtn,
      undefined,
      30000,
    );
  }

  async clickAcceptAllButton() {
    await this.waitUntilVisibleWithRetry(
      this.acceptAllButton,
      undefined,
      30000,
    );
    await this.click(this.acceptAllButton);
    await this.waitUntilInvisibleWithRetry(
      this.acceptAllButton,
      undefined,
      30000,
    );
  }

  async clickNextButton() {
    const isNextBtnVisible = await this.isElementVisible(
      this.acceptAllButton,
      9000,
    );
    if (isNextBtnVisible) {
      await this.click(this.nextButton);
      await this.waitUntilInvisibleWithRetry(this.nextButton, undefined, 30000);
    } else {
      console.log("Next button not available to click");
      if (driver.isAndroid) {
        await this.click(this.tapOnScreenForNextButton);
      } else if (driver.isIOS) {
        await this.click(this.nextButton);
      }
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
      const isTextVisible = await this.getElement(
        this.textAfterSubmittingUsernameOrEmail,
        { wait: true, timeout: 10000 },
      )
        .then(() => true)
        .catch(() => false);

      if (isTextVisible) {
        console.log("Text is visible without tapping on screen");
        await this.assertElementDisplayed(
          this.textAfterSubmittingUsernameOrEmail,
        );
      } else {
        console.log(
          "Text is not visible, tapping on screen to make it visible",
        );
        await this.click(this.tapOnScreenForTextAfterSubmittingUsernameOrEmail);

        await this.waitUntilVisible(
          this.textAfterSubmittingUsernameOrEmail,
          10000,
        ); // Wait for the element to become visible
        await this.assertElementDisplayed(
          this.textAfterSubmittingUsernameOrEmail,
        );
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

  async gotoLoginTab() {
    await this.waitUntilVisibleWithRetry(this.loginTab);
    await this.click(this.loginTab);
  }

  async validateLoginBtnIsVisible() {
    await this.handleStartupScreens();
    await this.scrollDown();
    await this.waitUntilVisibleWithRetry(this.loginButton, 5);
  }

  async logoutUser() {
    await this.click(this.moreTab);
    await this.scrollUntilElementVisible(this.logoutButton);
    await this.waitUntilVisibleWithRetry(this.logoutButton);
    await this.click(this.logoutButton);
    await this.waitUntilVisibleWithRetry(this.confirmLogoutButton);
    await this.click(this.confirmLogoutButton);
  }
}
