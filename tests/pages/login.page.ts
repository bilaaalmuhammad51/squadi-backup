import BasePage from "./base.page";
import { selector } from "../factories/page.factory";
import {
  generateInvalidEmail,
  generateValidEmailSample,
} from "../utils/helpers";
import { Timeout } from "../utils/timers";
import Logger from "../utils/logger";

export class LoginPage extends BasePage {
  public offlineBanner = selector(
    '//android.view.View[contains(@content-desc,"You are offline")]',
    "",
    "Offline banner",
  );

  public clearCacheBtnInSplashScreen = selector(
    "~Clear cache now",
    "~Clear cache now",
    "Clear cache now button in splash screen",
  );

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
    '//android.view.View[@text="Select Language"]',
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

  public drawsTab = selector(
    'android=new UiSelector().className("android.widget.ImageView").descriptionContains("Draws").clickable(true)',
    '//XCUIElementTypeButton[contains(@name, "Draws")]',
    "draws Tab",
  );

  public homeTab = selector(
    "~Home\nTab 1 of 5",
    '//XCUIElementTypeButton[contains(@name, "Home")]',
    "Home Tab",
  );

  public laddersTab = selector(
    "~Ladders\nTab 3 of 5",
    '//XCUIElementTypeButton[contains(@name, "Ladders")]',
    "Ladders Tab",
  );

  public messagesTab = selector("~Messages\nTab 4 of 5", "", "Messages Tab");

  public addTeamOrLeague = selector(
    "~Add a Team or League",
    "~Add a Team or League",
    "add team or league",
  );

  public updatesTab = selector(
    'android=new UiSelector().className("android.widget.ImageView").descriptionContains("Updates").clickable(true)',
    "",
    "Updates Tab",
  );

  public newsColumn = selector(
    'android=new UiSelector().descriptionContains("News")',
    "",
    "News Column in Updates tab",
  );

  public notificationsColumn = selector(
    'android=new UiSelector().descriptionContains("Notifications")',
    "",
    "Notifications Column in Updates tab",
  );

  public moreTab = selector(
    'android=new UiSelector().descriptionContains("More")',
    '-ios predicate string:name CONTAINS "More"',
    "More tab in bottom navigation",
  );

  public laddersOptionInMoreTab = selector(
    "~Ladders",
    "~Ladders",
    "Ladders option in More tab",
  );

  public squadiFinderOptionInMoreTab = selector(
    "~squadi Finder",
    "~squadi Finder",
    "squadi Finder option in More tab",
  );

  public createAccountOrRegisterProfileOptionInMoreTab = selector(
    "~Create Account or Register Profile",
    "~Create Account or Register Profile",
    "Create Account or Register Profile option in More tab",
  );

  public chooseLanguageOptionInMoreTab = selector(
    "~Choose Language",
    "~Choose Language",
    "Choose Language option in More tab",
  );

  public englishLanguage = selector(
    "~English",
    "~English",
    "English language option in Choose Language screen",
  );

  public englishUSALanguage = selector(
    "~English (U.S.A)",
    "~English (U.S.A)",
    "English (U.S.A) language option in Choose Language screen",
  );

  public applyButtonAtTheBottom = selector(
    "~Apply",
    "~Apply",
    "Apply button at the bottom",
  );

  public switchProfileOptionInMoreTab = selector(
    '//android.widget.ImageView[contains(@content-desc,"Switch Profile")]',
    "",
    "Switch Profile option in More tab for parent-child",
  );

  public unselectedParentAccountInSwitchProfile = selector(
    '//android.widget.Button[contains(@content-desc,"Test Parent User1")]',
    "",
    "unselected Child Account switch In Switch Profile",
  );

  public switchProfileHeading = selector(
    "~Switch Profile",
    "",
    "Switch Profile heading in switch profile popup",
  );

  public selectedParentAccountInSwitchProfile = selector(
    '//android.widget.ImageView[contains(@content-desc,"Test Parent User1")]',
    "",
    "unselected Child Account switch In Switch Profile",
  );

  public unselectedChildAccountInSwitchProfile = selector(
    '//android.widget.Button[contains(@content-desc,"Test child User")]',
    "",
    "unselected Child Account switch In Switch Profile",
  );

  public selectedChildAccountInSwitchProfile = selector(
    '//android.widget.ImageView[contains(@content-desc,"Test child User")]',
    "",
    "unselected Child Account switch In Switch Profile",
  );

  public childBanner = selector(
    '//android.view.View[contains(@content-desc,"You are viewing as Test child User")]',
    "",
    "Child Banner while switched to child profile",
  );

  public registerAlertForChild = selector(
    "~Please switch to your own account prior to registering.",
    "",
    "Registering alert for child after clicking Register row in More tab",
  );

  public privacyPreferencesOptionInMoreTab = selector(
    "~Privacy Preferences",
    "~Privacy Preferences",
    "Privacy Preferences option in More tab",
  );

  public aboutUsOptionInMoreTab = selector(
    "~About Us",
    "~About Us",
    "About Us option in More tab",
  );

  public registerOptionInMoreTab = selector(
    "~Register",
    "~Register",
    "Register option in More tab",
  );

  public signUpToCompetitionHeading = selector(
    '//android.view.View[@text="Sign up to Competition"]',
    "",
    "Sign up to Competition heading in Register option from More tab",
  );

  public myScheduleOptionInMoreTab = selector(
    "~My Schedule",
    "~My Schedule",
    "My Schedule option in More tab",
  );

  public myEventsOptionInMoreTab = selector(
    "~My Events",
    "~My Events",
    "My Events option in More tab",
  );

  public createNewEventHeadingInMyEvents = selector(
    "~Create New Event",
    "~Create New Event",
    "Create New Event heading in My Events",
  );

  public eventTypeInMyEvents = selector(
    "~Event Type",
    "~Event Type",
    "Event Type field Heading in My Events",
  );

  public appSettingsOptionInMoreTab = selector(
    '//android.widget.ImageView[@content-desc="App Settings "]',
    "~App Settings",
    "App Settings option in More tab",
  );

  public homeScreenFilterOptionInAppSettings = selector(
    "~Home Screen Filter",
    "~Home Screen Filter",
    "Home Screen Filter in App Settings",
  );

  public filterByCourtHeadingInHomeScreenFilter = selector(
    "~Filter by Court",
    "~Filter by Court",
    "Filter by Court in Home Screen Filter",
  );

  public uncheckedSydney1CheckboxInHomeScreenFilter = selector(
    "//android.widget.Button[contains(@content-desc, 'Sydney - 1')]",
    "",
    "unchecked [HR | vo: | gd:1234567 | | Sydney - 1] in Home Screen Filter",
  );

  public checkedSydney1CheckboxInHomeScreenFilter = selector(
    "//android.widget.ImageView[contains(@content-desc, 'Sydney - 1')]",
    "",
    "checked [HR | vo: | gd:1234567 | | Sydney - 1] in Home Screen Filter",
  );

  public uncheckedSydney3CheckboxInHomeScreenFilter = selector(
    "//android.widget.Button[contains(@content-desc, 'Sydney - 3')]",
    "",
    "unchecked [HR | vo: | gd:1234567 | | Sydney - 3] in Home Screen Filter",
  );

  public checkedSydney3CheckboxInHomeScreenFilter = selector(
    "//android.widget.ImageView[contains(@content-desc, 'Sydney - 3')]",
    "",
    "checked [HR | vo: | gd:1234567 | | Sydney - 3] in Home Screen Filter",
  );

  public clearBtnInTopRight = selector(
    "~Clear",
    "~Clear",
    "Clear button in top right Corner In Home Screen Filter",
  );

  public offlineSupportOptionInAppSettings = selector(
    "~Offline Support",
    "~Offline Support",
    "Offline Support in App Settings",
  );

  public showDownloadIndicatorsHeading = selector(
    "~Show Download indicators on Home",
    "~Show Download indicators on Home",
    "Show Download indicators on Home heading in Offline Support in App Settings",
  );

  public showDownloadIndicatorsSwitch = selector(
    "//android.widget.Switch",
    "",
    "Show Download indicators on Home switch in Offline Support in App Settings",
  );

  public myProfileOptionInMoreTab = selector(
    "~My Profile",
    "~My Profile",
    "My Profile option in More tab",
  );

  public myFullProfileOptionInMyProfile = selector(
    "~My Full Profile",
    "~My Full Profile",
    "My Full Profile option in My Profile",
  );

  public userHeadingInMyFullProfile = selector(
    "~User",
    "~User",
    "User top heading in My Full Profile",
  );

  public userProfileHeadingInMyFullProfile = selector(
    'android=new UiSelector().text("User Profile")',
    "~User Profile",
    "User Profile heading in My Full Profile",
  );

  public myPaymentMethodsOptionInMyProfile = selector(
    "~My Payment Methods",
    "~My Payment Methods",
    "My Payment Methods option in My Profile",
  );

  public myPaymentMethodsHeading = selector(
    "~My Payment Methods",
    "~My Payment Methods",
    "My Payment Methods heading in My Payment Methods option",
  );

  public refereeOfficialPaymentsHeading = selector(
    'android=new UiSelector().text("Referee/Official Payments")',
    "",
    "Referee/Official Payments heading in My Payment Methods",
  );

  public uploadBankAccountBtn = selector(
    'android=new UiSelector().text("Upload Bank Account")',
    "",
    "Upload Bank Account Btn in My Payment Methods",
  );

  public updatePasswordOptionInMyProfile = selector(
    "~Update Password",
    "~Update Password",
    "Update Password option in My Profile from More tab",
  );

  public newPasswordHeadingInUpdatePassword = selector(
    "~New Password",
    "~New Password",
    "New Password heading in Update Password section",
  );

  public retypePasswordHeadingInUpdatePassword = selector(
    "~Re-type Password",
    "~Re-type Password",
    "Re-type Password heading in Update Password section",
  );

  public IDCardOptionInMoreTab = selector(
    "~ID Card",
    "~ID Card",
    "ID Card option in More tab",
  );

  public nameInID = (nameOfUser: string) =>
    selector(
      `~${nameOfUser}`,
      `~${nameOfUser}`,
      `Name of User ~${nameOfUser} in ID Card`,
    );

  public dateOfBirthHeadingInIDCard = selector(
    "~Date of birth",
    "~Date of birth",
    "~Date of birth heading in ID Card",
  );

  public canteenOptionInMoreTab = selector(
    "~Canteen",
    "~Canteen",
    "Canteen option in More tab",
  );

  public tapToPayOptionInMoreTab = selector(
    "~Tap to pay",
    "~Tap to pay",
    "Tap to pay option in More tab",
  );

  public fieldClosureOptionInMoreTab = selector(
    "~Field Closure",
    "~Field Closure",
    "Field Closure option in More tab",
  );

  public updatesOptionInMoreTab = selector(
    "~Updates",
    "~Updates",
    "Updates option in More tab",
  );

  public shopOptionInMoreTab = selector(
    "~Shop",
    "~Shop",
    "Shop option in More tab",
  );

  public merchandiseShopInShop = selector(
    '//android.widget.TextView[@text="Merchandise Shop"]',
    "",
    "Merchandise Shop heading in Shop from More tab",
  );

  public buzzerOptionInMoreTab = selector(
    "~Buzzer",
    "~Buzzer",
    "Buzzer option in More tab",
  );

  public userVideosOptionInMoreTab = selector(
    "~User Videos",
    "~User Videos",
    "User Videos option in More tab",
  );

  public videosHeadingInUserVideos = selector(
    "~Videos",
    "~Videos",
    "Videos heading in User Videos",
  );

  public allowAllBtnInVideos = selector(
    '//android.widget.Button[@resource-id="CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll"]',
    "",
    "Allow All button for cookies in User Videos",
  );

  public addingAndEditingWatchlistHeading = selector(
    '//android.view.View[@text="Adding and Editing Watchlist"]',
    "",
    "Adding and Editing Watchlist heading in User Videos",
  );

  public addingAndEditingWatchlistVideo = selector(
    '(//android.view.View[@resource-id="player-control-overlay"])[1]',
    "",
    "Adding and Editing Watchlist YouTube Video in User Videos",
  );

  public drawsLaddersAndStatisticsHeading = selector(
    '//android.view.View[@text="Draws, Ladders and Statistics"]',
    "",
    "Draws, Ladders and Statistics heading in User Videos",
  );

  public drawsLaddersAndStatisticsVideo = selector(
    '(//android.view.View[@resource-id="player-control-overlay"])[2]',
    "",
    "Draws, Ladders and Statistics YouTube Video in User Videos",
  );

  public managingYourTeamHeading = selector(
    '//android.view.View[@text="Managing Your Team"]',
    "",
    "Managing Your Team heading in User Videos",
  );

  public managingYourTeamVideo = selector(
    '(//android.view.View[@resource-id="player-control-overlay"])[3]',
    "",
    "Managing Your Team YouTube Video in User Videos",
  );

  public shareAppOptionInMoreTab = selector(
    "~Share App",
    "~Share App",
    "Share App option in More tab",
  );

  public logoutOptionInMoreTab = selector(
    "~Log Out",
    "~Log Out",
    "Logout option in More tab",
  );

  public confirmLogoutButton = selector(
    "~Yes, log out",
    "~Yes, log out",
    "Confirm logout button in logout popup",
  );

  public crossCloseBtn = selector(
    'android=new UiSelector().className("android.widget.Button")',
    '-ios predicate string: type == "XCUIElementTypeButton"',
    "Cross/Close Button in Settings",
  );

  async clickCloseCrossBtn() {
    await this.waitUntilVisibleWithRetry(this.crossCloseBtn);
    await this.click(this.crossCloseBtn);
  }

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
      2000,
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
    const isNextBtnVisible = await this.isElementVisible(this.nextButton, 9000);
    if (isNextBtnVisible) {
      await this.click(this.nextButton);
      await this.waitUntilInvisibleWithRetry(this.nextButton, undefined, 30000);
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

  async gotoHomeTab() {
    await this.waitUntilVisibleWithRetry(this.homeTab);
    await this.click(this.homeTab);
  }

  async gotoLaddersTab() {
    await this.waitUntilVisibleWithRetry(this.laddersTab);
    await this.click(this.laddersTab);
  }

  async gotoMessagesTab() {
    await this.waitUntilVisibleWithRetry(this.messagesTab);
    await this.click(this.messagesTab);
  }

  async gotoMoreTab() {
    await this.waitUntilVisibleWithRetry(this.moreTab);
    await this.click(this.moreTab);
  }

  async assertMoreTabAvailableOptionsWhenLoggedOut() {
    await this.waitUntilVisibleWithRetry(this.laddersOptionInMoreTab);
    await this.assertElementDisplayed(this.laddersOptionInMoreTab);
    await this.assertElementDisplayed(this.squadiFinderOptionInMoreTab);
    await this.assertElementDisplayed(
      this.createAccountOrRegisterProfileOptionInMoreTab,
    );
    await this.assertElementDisplayed(this.chooseLanguageOptionInMoreTab);
    await this.assertElementDisplayed(this.privacyPreferencesOptionInMoreTab);
    await this.assertElementDisplayed(this.aboutUsOptionInMoreTab);
  }

  async assertMoreTabUnavailableOptionsWhenLoggedOut() {
    await this.waitUntilVisibleWithRetry(this.chooseLanguageOptionInMoreTab);
    await this.assertElementNotDisplayed(this.myScheduleOptionInMoreTab);
    await this.assertElementNotDisplayed(this.myEventsOptionInMoreTab);
    await this.assertElementNotDisplayed(this.appSettingsOptionInMoreTab);
    await this.assertElementNotDisplayed(this.myProfileOptionInMoreTab);
    await this.assertElementNotDisplayed(this.IDCardOptionInMoreTab);
    await this.assertElementNotDisplayed(this.fieldClosureOptionInMoreTab);
    await this.assertElementNotDisplayed(this.updatesOptionInMoreTab);
    await this.assertElementNotDisplayed(this.shopOptionInMoreTab);
    await this.assertElementNotDisplayed(this.buzzerOptionInMoreTab);
    await this.assertElementNotDisplayed(this.userVideosOptionInMoreTab);
    await this.assertElementNotDisplayed(this.shareAppOptionInMoreTab);
    await this.assertElementNotDisplayed(this.logoutOptionInMoreTab);
  }

  async switchProfileToChild() {
    await this.gotoMoreTab();
    await this.waitUntilVisibleWithRetry(this.switchProfileOptionInMoreTab);
    const parentProfileSelected = await this.isElementVisible(
      this.selectedParentAccountInSwitchProfile,
    );
    if (parentProfileSelected) {
      await this.click(this.switchProfileOptionInMoreTab);
      await this.waitUntilVisibleWithRetry(this.switchProfileHeading);
      await this.waitUntilVisibleWithRetry(
        this.unselectedChildAccountInSwitchProfile,
      );
      await this.click(this.unselectedChildAccountInSwitchProfile);
      await this.waitUntilVisibleWithRetry(this.switchProfileOptionInMoreTab);
      await this.assertElementDisplayed(
        this.selectedChildAccountInSwitchProfile,
      );
    }
  }

  async switchProfileToParent() {
    await this.gotoMoreTab();
    await this.waitUntilVisibleWithRetry(this.switchProfileOptionInMoreTab);
    const childProfileSelected = await this.isElementVisible(
      this.selectedChildAccountInSwitchProfile,
    );
    if (childProfileSelected) {
      await this.click(this.switchProfileOptionInMoreTab);
      await this.waitUntilVisibleWithRetry(this.switchProfileHeading);
      await this.waitUntilVisibleWithRetry(
        this.unselectedParentAccountInSwitchProfile,
      );
      await this.click(this.unselectedParentAccountInSwitchProfile);
      await this.waitUntilVisibleWithRetry(this.switchProfileOptionInMoreTab);
      await this.assertElementDisplayed(
        this.selectedParentAccountInSwitchProfile,
      );
    }
  }

  async assertChildBannerDisplays() {
    await this.waitUntilVisibleWithRetry(this.childBanner);
    await this.assertElementDisplayed(this.childBanner);
  }

  async assertChildBannerDisplaysOnEachTab() {
    await this.gotoHomeTab();
    await this.assertChildBannerDisplays();
    await this.gotoDrawsTab();
    await this.assertChildBannerDisplays();
    await this.gotoLaddersTab();
    await this.assertChildBannerDisplays();
    await this.gotoMessagesTab();
    await this.assertChildBannerDisplays();
    await this.gotoMoreTab();
    await this.assertChildBannerDisplays();
  }

  async validateRegisterAlertForChild() {
    await this.waitUntilVisibleWithRetry(this.registerOptionInMoreTab);
    await this.click(this.registerOptionInMoreTab);
    await this.waitUntilVisibleWithRetry(this.registerAlertForChild);
    await this.assertElementDisplayed(this.registerAlertForChild);
    await this.click(this.okButton);
    await this.waitUntilVisibleWithRetry(this.registerOptionInMoreTab);
  }

  async validateHiddenOptionsForChild() {
    if (driver.isAndroid) {
      await this.scrollUntilElementVisible(this.myProfileOptionInMoreTab);
      await this.click(this.myProfileOptionInMoreTab);
      await this.assertElementNotDisplayed(
        this.updatePasswordOptionInMyProfile,
      );
      await this.clickBackBtn();
      await this.assertElementNotDisplayed(this.canteenOptionInMoreTab);
      await this.assertElementNotDisplayed(this.tapToPayOptionInMoreTab);
    }
  }

  async openIDCardFromMoreTab() {
    await this.waitUntilVisibleWithRetry(this.IDCardOptionInMoreTab);
    await this.click(this.IDCardOptionInMoreTab);
    await this.waitUntilVisibleWithRetry(this.dateOfBirthHeadingInIDCard);
  }

  async validateIDCardElements(nameOfUser: string) {
    await this.waitUntilVisibleWithRetry(this.dateOfBirthHeadingInIDCard);
    await this.assertElementDisplayed(this.dateOfBirthHeadingInIDCard);
    await this.waitUntilVisibleWithRetry(this.nameInID(nameOfUser));
    await this.assertElementDisplayed(this.nameInID(nameOfUser));
  }

  async openMyProfileFromMoreTab() {
    await this.waitUntilVisibleWithRetry(this.myProfileOptionInMoreTab);
    await this.click(this.myProfileOptionInMoreTab);
    await this.waitUntilVisibleWithRetry(this.myFullProfileOptionInMyProfile);
  }

  async openMyFullProfileFromMyProfileAndAssertItsElements() {
    await this.waitUntilVisibleWithRetry(this.myFullProfileOptionInMyProfile);
    await this.click(this.myFullProfileOptionInMyProfile);
    await this.waitUntilVisibleWithRetry(this.userHeadingInMyFullProfile);
    await this.click(this.userHeadingInMyFullProfile);
    await this.waitUntilVisibleWithRetry(
      this.userProfileHeadingInMyFullProfile,
    );
    await this.assertElementDisplayed(this.userProfileHeadingInMyFullProfile);
  }

  async openMyPaymentMethodsFromMyProfileAndAssertItsElements() {
    await this.waitUntilVisibleWithRetry(
      this.myPaymentMethodsOptionInMyProfile,
    );
    await this.click(this.myPaymentMethodsOptionInMyProfile);
    await this.waitUntilVisibleWithRetry(this.myPaymentMethodsHeading);
    await this.click(this.myPaymentMethodsHeading);
    await this.waitUntilVisibleWithRetry(this.refereeOfficialPaymentsHeading);
    await this.assertElementDisplayed(this.refereeOfficialPaymentsHeading);
    await this.assertElementDisplayed(this.uploadBankAccountBtn);
  }

  async openMyEventsFromMoreTabAndAssertItsElements() {
    await this.waitUntilVisibleWithRetry(this.myEventsOptionInMoreTab);
    await this.click(this.myEventsOptionInMoreTab);
    await this.waitUntilVisibleWithRetry(this.createNewEventHeadingInMyEvents);
    await this.waitUntilVisibleWithRetry(this.eventTypeInMyEvents);
    await this.assertElementDisplayed(this.eventTypeInMyEvents);
  }

  async openAppSettingsAndValidateItsOptions() {
    await this.waitUntilVisibleWithRetry(this.appSettingsOptionInMoreTab);
    await this.click(this.appSettingsOptionInMoreTab);
    await this.waitUntilVisibleWithRetry(
      this.homeScreenFilterOptionInAppSettings,
    );
    await this.assertElementDisplayed(this.homeScreenFilterOptionInAppSettings);
    await this.assertElementDisplayed(this.offlineSupportOptionInAppSettings);
  }

  async openHomeScreenFilterAndValidateItsOptions() {
    await this.waitUntilVisibleWithRetry(
      this.homeScreenFilterOptionInAppSettings,
    );
    await this.click(this.homeScreenFilterOptionInAppSettings);
    await this.waitUntilVisibleWithRetry(
      this.filterByCourtHeadingInHomeScreenFilter,
    );
    await this.assertElementDisplayed(
      this.filterByCourtHeadingInHomeScreenFilter,
    );
    await this.assertElementDisplayed(this.applyButtonAtTheBottom);
  }

  async assertUncheckedHomeScreenFilterOptions() {
    await this.waitUntilVisibleWithRetry(
      this.uncheckedSydney1CheckboxInHomeScreenFilter,
    );
    await this.assertElementDisplayed(
      this.uncheckedSydney1CheckboxInHomeScreenFilter,
    );
    console.log("asserting unchecked sydney 3");
    await this.assertElementDisplayed(
      this.uncheckedSydney3CheckboxInHomeScreenFilter,
    );
  }

  async assertCheckedHomeScreenFilterOptions() {
    await this.waitUntilVisibleWithRetry(
      this.checkedSydney1CheckboxInHomeScreenFilter,
    );
    await this.assertElementDisplayed(
      this.checkedSydney1CheckboxInHomeScreenFilter,
    );
    await this.assertElementDisplayed(
      this.checkedSydney1CheckboxInHomeScreenFilter,
    );
  }

  async checkUncheckHomeScreenFilters(check: boolean) {
    if (check) {
      const isSydney1Unchecked = await this.isElementVisible(
        this.uncheckedSydney1CheckboxInHomeScreenFilter,
      );
      const isSydney3Unchecked = await this.isElementVisible(
        this.uncheckedSydney3CheckboxInHomeScreenFilter,
      );

      if (isSydney1Unchecked) {
        await this.click(this.uncheckedSydney1CheckboxInHomeScreenFilter);
        await this.waitUntilVisibleWithRetry(
          this.checkedSydney1CheckboxInHomeScreenFilter,
        );
      }

      if (isSydney3Unchecked) {
        await this.click(this.uncheckedSydney3CheckboxInHomeScreenFilter);
        await this.waitUntilVisibleWithRetry(
          this.checkedSydney3CheckboxInHomeScreenFilter,
        );
      }
    } else {
      const isSydney1Checked = await this.isElementVisible(
        this.checkedSydney1CheckboxInHomeScreenFilter,
      );
      const isSydney3Checked = await this.isElementVisible(
        this.checkedSydney3CheckboxInHomeScreenFilter,
      );

      if (isSydney1Checked) {
        await this.click(this.checkedSydney1CheckboxInHomeScreenFilter);
        await this.waitUntilVisibleWithRetry(
          this.uncheckedSydney1CheckboxInHomeScreenFilter,
        );
      }

      if (isSydney3Checked) {
        await this.click(this.checkedSydney3CheckboxInHomeScreenFilter);
        await this.waitUntilVisibleWithRetry(
          this.uncheckedSydney3CheckboxInHomeScreenFilter,
        );
      }
    }

    await this.click(this.applyButtonAtTheBottom);
  }

  async clearHomeFilters() {
    await this.waitUntilVisibleWithRetry(this.clearBtnInTopRight);
    await this.click(this.clearBtnInTopRight);
    await this.waitUntilElementEnabledState(this.applyButtonAtTheBottom, false);
    let applyButtonAtTheBottom: ChainablePromiseElement;
    applyButtonAtTheBottom = await this.getElement(this.applyButtonAtTheBottom);
    await this.expectElementState(applyButtonAtTheBottom, "disabled");
  }

  async openOfflineSupportAndValidateElements() {
    await this.waitUntilVisibleWithRetry(
      this.offlineSupportOptionInAppSettings,
    );
    await this.click(this.offlineSupportOptionInAppSettings);
    await this.waitUntilVisibleWithRetry(this.showDownloadIndicatorsHeading);
    await this.assertElementDisplayed(this.showDownloadIndicatorsHeading);
  }

  async asserShowDownloadIndicatorsSwitchState(checked: boolean) {
    if (checked) {
      await this.assertSwitchState(this.showDownloadIndicatorsSwitch, true);
    } else {
      await this.assertSwitchState(this.showDownloadIndicatorsSwitch, false);
    }
  }

  async checkUncheckShowDownloadIndicators(check: boolean) {
    let showDownloadIndicatorOnHomeSwitchInOfflineSupport: ChainablePromiseElement;
    showDownloadIndicatorOnHomeSwitchInOfflineSupport = await this.getElement(
      this.showDownloadIndicatorsSwitch,
    );
    const isChecked =
      (await showDownloadIndicatorOnHomeSwitchInOfflineSupport.getAttribute(
        "checked",
      )) === "true";

    if (isChecked !== check) {
      await showDownloadIndicatorOnHomeSwitchInOfflineSupport.click();

      await browser.waitUntil(
        async () => {
          const checked =
            await showDownloadIndicatorOnHomeSwitchInOfflineSupport.getAttribute(
              "checked",
            );
          return checked === String(check);
        },
        {
          timeout: Timeout.FIVE_SECONDS,
          timeoutMsg: `Show Download Indicators switch did not become ${
            check ? "checked" : "unchecked"
          }`,
        },
      );
    }
  }

  async openUserVideosOptionInMoreTabAndAssertElements() {
    await this.scrollUntilElementVisible(this.userVideosOptionInMoreTab);
    await this.click(this.userVideosOptionInMoreTab);
    await this.waitUntilVisibleWithRetry(this.videosHeadingInUserVideos);
    await this.click(this.videosHeadingInUserVideos);
    await this.scrollUntilElementVisible(this.allowAllBtnInVideos);
    await this.click(this.allowAllBtnInVideos);
    await this.scrollUntilElementVisible(
      this.addingAndEditingWatchlistHeading,
      { maxScrolls: undefined, direction: "up" },
    );
    await this.assertElementDisplayed(this.addingAndEditingWatchlistHeading);
    await this.assertElementDisplayed(this.addingAndEditingWatchlistVideo);
    await this.scrollUntilElementVisible(this.drawsLaddersAndStatisticsHeading);
    await this.assertElementDisplayed(this.drawsLaddersAndStatisticsHeading);
    await this.assertElementDisplayed(this.drawsLaddersAndStatisticsVideo);
    await this.scrollUntilElementVisible(this.managingYourTeamHeading);
    await this.assertElementDisplayed(this.managingYourTeamHeading);
    await this.assertElementDisplayed(this.managingYourTeamVideo);
  }

  async clickChooseLanguageOptionInMoreTab() {
    await this.scrollUntilElementVisible(this.chooseLanguageOptionInMoreTab);
    await this.waitUntilVisibleWithRetry(this.chooseLanguageOptionInMoreTab);
    await this.click(this.chooseLanguageOptionInMoreTab);
  }

  async selectEnglishLanguage() {
    const element = await this.waitUntilVisibleWithRetry(this.englishLanguage);

    const className = await element.getAttribute("class");

    if (className === "android.widget.Button") {
      await element.click();

      await browser.waitUntil(
        async () => {
          const cls = await (
            await this.resolve(this.englishLanguage)
          ).getAttribute("class");
          return cls === "android.widget.ImageView";
        },
        {
          timeout: Timeout.FIVE_SECONDS,
          timeoutMsg: "English language was not selected",
        },
      );
    }

    await this.click(this.applyButtonAtTheBottom);
  }

  async assertEnglishLanguageSelected() {
    const englishClass = await (
      await this.resolve(this.englishLanguage)
    ).getAttribute("class");

    const englishUsClass = await (
      await this.resolve(this.englishUSALanguage)
    ).getAttribute("class");

    expect(englishClass).toBe("android.widget.ImageView");
    expect(englishUsClass).toBe("android.widget.Button");

    Logger.info("Verified English language is selected");
  }

  async selectEnglishUSALanguage() {
    const element = await this.waitUntilVisibleWithRetry(
      this.englishUSALanguage,
    );

    const className = await element.getAttribute("class");

    if (className === "android.widget.Button") {
      await element.click();

      await browser.waitUntil(
        async () => {
          const cls = await (
            await this.resolve(this.englishUSALanguage)
          ).getAttribute("class");
          return cls === "android.widget.ImageView";
        },
        {
          timeout: Timeout.FIVE_SECONDS,
          timeoutMsg: "English (U.S.A) language was not selected",
        },
      );
    }

    await this.click(this.applyButtonAtTheBottom);
  }

  async assertEnglishUSALanguageSelected() {
    const englishClass = await (
      await this.resolve(this.englishLanguage)
    ).getAttribute("class");

    const englishUsClass = await (
      await this.resolve(this.englishUSALanguage)
    ).getAttribute("class");

    expect(englishUsClass).toBe("android.widget.ImageView");
    expect(englishClass).toBe("android.widget.Button");

    Logger.info("Verified English (U.S.A) language is selected");
  }

  async clickApplyButtonToApplyLanguageChange() {
    await this.waitUntilVisibleWithRetry(this.applyButtonAtTheBottom);
    await this.click(this.applyButtonAtTheBottom);
    await this.waitUntilVisibleWithRetry(this.chooseLanguageOptionInMoreTab);
  }

  async gotoDrawsTab() {
    await this.waitUntilVisibleWithRetry(this.drawsTab);
    await this.click(this.drawsTab);
  }

  async assertDrawsTabElements() {
    await this.waitUntilVisibleWithRetry(this.addTeamOrLeague);
    await this.assertElementDisplayed(this.addTeamOrLeague);
  }

  async gotoUpdatesTab() {
    await this.waitUntilVisibleWithRetry(this.updatesTab);
    await this.click(this.updatesTab);
  }

  async assertUpdatesTabElements() {
    await this.waitUntilVisibleWithRetry(this.newsColumn);
    await this.assertElementDisplayed(this.newsColumn);
    await this.assertElementDisplayed(this.notificationsColumn);
  }

  async validateLoginBtnIsVisible() {
    await this.handleStartupScreens();
    await this.scrollDown();
    await this.waitUntilVisibleWithRetry(this.loginButton, 5);
  }

  async logoutUser() {
    await this.click(this.moreTab);
    await this.scrollUntilElementVisible(this.logoutOptionInMoreTab);
    await this.waitUntilVisibleWithRetry(this.logoutOptionInMoreTab);
    await this.click(this.logoutOptionInMoreTab);
    await this.waitUntilVisibleWithRetry(this.confirmLogoutButton);
    await this.click(this.confirmLogoutButton);
  }
}
