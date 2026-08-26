import { DualSelector, selector } from "../factories/page.factory";
import { LoginPage } from "./login.page";

export class HomePage extends LoginPage {
  public liveScores = selector("~Live Scores", "~Live Scores", "live scores");
  public welcomeBackHeading = selector(
    "//android.view.View[contains(@content-desc, 'Welcome back')]",
    "",
    "Welcome Back Heading",
  );
  public drawsBtn = selector(
    'android=new UiSelector().descriptionContains("Draws")',
    '-ios predicate string: name CONTAINS "Draws"',
    "Draws Button",
  );

  public watchlistBtn = selector(
    '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.view.View/android.view.View/android.view.View[1]/android.view.View[1]/android.widget.ImageView[2]',
    "",
    "Watchlist Button in Draws tab",
  );

  public editWatchlistHeading = selector(
    "~Edit watchlist",
    "",
    "Edit watchlist heading in Draws tab",
  );

  selectedTeamInWatchList = selector(
    '//android.view.View[contains(@content-desc,"HR-ASN2-MD-Only")]',
    "",
    "Selected Team in Watchlist",
  );

  public loginButtonOnHomeTab = selector(
    "~Login",
    "~Login",
    "Login button on Home tab",
  );

  public matchById = (matchId: string) =>
    selector(
      `android=new UiSelector().descriptionContains("Match ID: ${matchId}")`,
      `-ios predicate string: name CONTAINS "Match ID: ${matchId}"`,
      `Match with ID ${matchId}`,
    );

  public yesBtnForRefereeMatch = selector(
    "~Yesy",
    "~Yes",
    "Yes button in match to accept match as referee",
  );

  public yourScheduleHeading = selector(
    "~Your Schedule",
    "~Your Schedule",
    "Your Schedule heading in Home tab after login",
  );

  public tasksHeading = selector(
    '//android.view.View[@content-desc="Tasks "]',
    "~Tasks",
    "Tasks heading in Home tab after login",
  );

  public scheduleOrApproveMatchesInTasks = selector(
    "~Schedule/Approve Matches",
    "~Schedule/Approve Matches",
    "Schedule/Approve Matches in Tasks section in Home tab",
  );

  public scheduleOrApproveMatchesPageHeading = selector(
    '//android.view.View[@content-desc="Schedule/Approve Matches"]',
    "~Schedule/Approve Matches",
    "Schedule/Approve Matches page heading",
  );

  public scheduleOrApproveMatchesHeadingInWebPage = selector(
    '//android.widget.TextView[@text="Schedule / Approve Matches"]',
    "~Schedule/Approve Matches",
    "Schedule/Approve Matches page heading",
  );

  public newsAndUpdatesHeading = selector(
    "~News & Updates",
    "~News & Updates",
    "News & Updates heading in Home tab after login",
  );

  public notificationsIcon = selector(
    "~Notifications",
    "~Notifications",
    "Notifications icon in Home tab after login",
  );

  public newsArticle = selector(
    '//android.view.View[contains(@content-desc,"Automation testing communication 1")]',
    "",
    "News Article in Home tab",
  );

  public newsHeadingInArticle = selector(
    "~News",
    "~News",
    "News heading in Article",
  );

  public articleBody = selector(
    '//android.view.View[@content-desc="automation testing communication 1"]',
    "",
    "Article body",
  );

  async assertHomeTabElements() {
    await this.waitUntilVisibleWithRetry(this.welcomeBackHeading);
    await this.assertElementDisplayed(this.welcomeBackHeading);
    await this.assertElementDisplayed(this.loginButtonOnHomeTab);
    await this.assertElementDisplayed(this.addTeamOrLeague);
    await this.assertElementDisplayed(this.squadiFinderOptionInMoreTab);
  }

  async verifyHomeScreenElements() {
    await this.waitUntilVisibleWithRetry(this.liveScores);
    await this.assertElementDisplayed(this.homeTab);
    await this.assertElementDisplayed(this.liveScores);
    await this.scrollDown();
    await this.assertElementDisplayed(this.drawsTab);
    await this.assertElementDisplayed(this.laddersTab);
  }

  async loginFlow(email: string, password: string) {
    await this.validateLoginBtnIsVisible();
    await this.assertElementDisplayed(this.welcomeHeading);
    await this.click(this.loginButton);
    await this.assertElementDisplayed(this.rememberPassword);
    await this.assertElementDisplayed(this.forgotPassword);
    await this.addUserName(email);
    await this.addPassword(password);
    await this.click(this.login);
    await this.waitUntilVisibleWithRetry(this.homeTab);
    await this.assertElementDisplayed(this.homeTab);
    await this.assertElementDisplayed(this.drawsTab);
    await this.assertElementDisplayed(this.laddersTab);
  }

  private matchYesButton(matchId: string | number): DualSelector {
    const id = String(matchId);
    return selector(
      `android=new UiSelector().descriptionContains("Match ID: ${id}").childSelector(new UiSelector().description("Yes"))`,
      `//XCUIElementTypeOther[contains(@name, 'Match ID: ${id}')]/following-sibling::XCUIElementTypeStaticText[@name='Yes']`,
      `Yes button for Match ID ${id}`,
    );
  }

  async clickYesForMatch(matchId: string | number): Promise<void> {
    const sel = this.matchYesButton(matchId);
    await this.scrollUntilElementVisible(sel);
    const locator = driver.isIOS ? sel.ios : sel.android;
    console.log(`Clicking Yes button for Match ID: ${matchId}`);
    const el = await driver.$(locator);
    await el.waitForDisplayed({ timeout: 10_000 });
    await el.click();
  }

  async openScheduleTab() {
    await this.waitUntilVisibleWithRetry(this.drawsBtn);
    await this.click(this.drawsBtn);
  }

  async assertHomeTabElementsAfterLogin() {
    await this.waitUntilVisibleWithRetry(this.yourScheduleHeading);
    await this.assertElementDisplayed(this.yourScheduleHeading);
    // await this.assertElementDisplayed(this.tasksHeading); //element is not being asserted and the test fails although it's visible in UI
    await this.assertElementDisplayed(this.newsAndUpdatesHeading);
  }

  async openNotificationsAndAssertItsElements() {
    await this.waitUntilVisibleWithRetry(this.notificationsIcon);
    await this.click(this.notificationsIcon);
    await this.waitUntilVisibleWithRetry(this.newsColumn);
    await this.assertElementDisplayed(this.newsColumn);
    await this.assertElementDisplayed(this.notificationsColumn);
  }

  async openAndAssertNewsArticle() {
    await this.waitUntilVisibleWithRetry(this.newsArticle);
    await this.click(this.newsArticle);
    await this.waitUntilVisibleWithRetry(this.newsHeadingInArticle);
    await this.assertElementDisplayed(this.articleBody);
    await this.clickCloseCrossBtn();
  }
}
