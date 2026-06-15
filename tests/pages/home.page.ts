import { DualSelector, selector } from "../factories/page.factory";
import { LoginPage } from "./login.page";

export class HomePage extends LoginPage {
  public homeTab = selector(
    "~Home\nTab 1 of 5",
    '//XCUIElementTypeButton[contains(@name, "Home")]',
    "Home Tab",
  );
  public drawsTab = selector(
    "~Draws\nTab 2 of 5",
    '//XCUIElementTypeButton[contains(@name, "Draws")]',
    "draws Tab",
  );
  public laddersTab = selector(
    "~Ladders\nTab 3 of 5",
    '//XCUIElementTypeButton[contains(@name, "Ladders")]',
    "Ladders Tab",
  );
  public liveScores = selector("~Live Scores", "~Live Scores", "live scores");
  public addTeamOrLeague = selector(
    "~Add a Team or League\nto your watchlist to get started\nAdd a Team or League",
    "~Add a Team or League\nto your watchlist to get started\nAdd a Team or League",
    "add team or league",
  );
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
}
