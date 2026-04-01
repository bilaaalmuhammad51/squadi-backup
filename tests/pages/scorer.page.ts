import { selector } from "../factories/page.factory";
import { Timeout } from "../utils/timers";
import { LoginPage } from "./login.page";

export class ScorerPage extends LoginPage {
  public teamSheetAlert = selector(
    "~Team Sheet not set",
    "~Team Sheet not set",
    "Team Sheet Alert",
  );

  public matchTimer = selector(
    'android=new UiSelector().descriptionContains("STARTS IN")',
    "(//XCUIElementTypeStaticText)[2]",
    "Match Timer",
  );

  public homeTeam = selector(
    "~HR-ASN2Club1-D1-T2",
    "~HR-ASN2Club1-D1-T2",
    "Home Team",
  );

  public awayTeam = selector(
    "~HR-ASN2Club2-D1-T3",
    "~HR-ASN2Club2-D1-T3",
    "Away Team",
  );

  public homeTeamSheetTab = (teamName: string) =>
    selector(
      `android=new UiSelector().descriptionContains("${teamName}")`,
      `-ios predicate string: name CONTAINS "${teamName}"`,
      "Home Team Sheet",
    );

  public awayTeamSheetTab = (teamName: string) =>
    selector(
      `android=new UiSelector().descriptionContains("${teamName}")`,
      `-ios predicate string: name CONTAINS "${teamName}"`,
      "Away Team Sheet",
    );

  public selectHomeTeamPlayer = (playerName: string) =>
    selector(
      '//android.widget.Button[contains(@content-desc, "HR-ASN2Club1")]//android.view.View[2]',
      `(//XCUIElementTypeOther[1]/XCUIElementTypeOther)[6]`,
      "Home Team Player",
    );

  public selectAwayTeamPlayer = (playerName: string) =>
    selector(
      '//android.widget.Button[contains(@content-desc, "HR-ASN2Club2")]//android.view.View[2]',
      `(//XCUIElementTypeOther[1]/XCUIElementTypeOther)[6]`,
      "Away Team Player",
    );

  public confirmBtn = selector("~Confirm", "~Confirm", "Confirm Button");

  public startBtn = selector("~Start", "~Start", "Start Button");

  public pauseBtn = selector("~Pause", "~Pause", "Pause Button");

  public resumeBtn = selector("~Resume", "~Resume", "Resume Button");

  public borrowPlayerBtn = selector(
    'android=new UiSelector().description("+ Borrow Player")',
    '-ios predicate string: name CONTAINS "Borrow Player"',
    "Borrow Player Button",
  );

  public validatorName = selector(
    'android=new UiSelector().text("syed shah")',
    '-ios predicate string: value == "syed shah"',
    "Validator Name",
  );

  public teamSheetSubmittedMsg = selector(
    'android=new UiSelector().descriptionContains("Teamsheet submitted")',
    '-ios predicate string: name CONTAINS[c] "Teamsheet submitted"',
    "Team Sheet Submitted Message",
  );

  public confirmStartBtn = selector(
    "~Confirm",
    "~Confirm",
    "Confirm Start Button",
  );

  public homeTeamScore = selector(
    'android=new UiSelector().className("android.view.View").index(6)',
    "(//XCUIElementTypeStaticText)[6]",
    "Home Team Score",
  );

  public awayTeamScore = selector(
    'android=new UiSelector().className("android.view.View").index(7)',
    "(//XCUIElementTypeStaticText)[7]",
    "Away Team Score",
  );

  public addHomeTeamScore = selector(
    'android=new UiSelector().className("android.widget.ImageView").instance(2)',
    "(//XCUIElementTypeButton)[3]",
    "Add Home Team Score",
  );

  public addAwayTeamScore = selector(
    'android=new UiSelector().className("android.widget.ImageView").instance(3)',
    "(//XCUIElementTypeButton)[4]",
    "Add Away Team Score",
  );

  public undoHomeTeamScoreBtn = selector(
    'android=new UiSelector().description("Undo").instance(0)',
    '(//XCUIElementTypeButton[@name="Undo"])[1]',
    "Undo Home Team Score",
  );

  public undoAwayTeamScoreBtn = selector(
    'android=new UiSelector().description("Undo").instance(1)',
    '(//XCUIElementTypeButton[@name="Undo"])[2]',
    "Undo Away Team Score",
  );

  public errorPopup = selector(
    'android=new UiSelector().descriptionContains("Sorry").instance(1)',
    "(//XCUIElementTypeStaticText)[2]",
    "Error Popup",
  );

  public doneBtn = selector("~Done", "~Done", "Done Button");

  public enterShirtNumberPopup = selector(
    "",
    '//XCUIElementTypeOther[@name="Enter a shirt number"]',
    "Done Button",
  );

  public enterShirtNubmerField = selector(
    "~Enter...",
    "~Enter...",
    "Done Button",
  );

  public selectShirtNumberOkBtn = selector(
    "",
    "(//XCUIElementTypeStaticText)[2]",
    "Done Button",
  );

  public matchById = (matchId: string) =>
    selector(
      `android=new UiSelector().descriptionContains("Match ID: ${matchId}")`,
      "",
      `Match with ID ${matchId}`,
    );

  async validateScorerScreenElements() {
    await this.waitUntilVisibleWithRetry(this.matchTimer);
    await this.assertElementDisplayed(this.matchTimer);
    await this.assertElementDisplayed(this.homeTeam);
    await this.assertElementDisplayed(this.awayTeam);
  }

  async selectShirtNumberIfNot() {
    try {
      await this.waitUntilInvisibleWithRetry(this.enterShirtNumberPopup);
      await this.type(this.enterShirtNubmerField, "1");
      await this.waitUntilInvisibleWithRetry(this.selectShirtNumberOkBtn);
      await this.click(this.selectShirtNumberOkBtn);
    } catch {}
  }

  async validateHomeTeamSheetElements(homeTeam: string) {
    await this.waitUntilVisibleWithRetry(this.homeTeamSheetTab(homeTeam));
    await this.assertElementDisplayed(this.homeTeamSheetTab(homeTeam));
    await this.click(this.homeTeamSheetTab(homeTeam));
    await this.assertElementDisplayed(this.borrowPlayerBtn);
    await this.assertElementDisplayed(this.validatorName);
  }

  async validateAwayTeamSheetElements(awayTeam: string) {
    await this.waitUntilVisibleWithRetry(this.awayTeamSheetTab(awayTeam));
    await this.assertElementDisplayed(this.awayTeamSheetTab(awayTeam));
    await this.click(this.awayTeamSheetTab(awayTeam));
    await this.assertElementDisplayed(this.borrowPlayerBtn);
    await this.assertElementDisplayed(this.validatorName);
  }

  async submitHomeTeamPlayersIfNotSubmitted(playerName: string) {
    const isSubmitted = await this.isElementPresent(
      this.teamSheetSubmittedMsg,
      Timeout.TWO_SECONDS,
    );

    if (!isSubmitted) {
      await this.waitUntilVisibleWithRetry(
        this.selectHomeTeamPlayer(playerName),
      );
      await this.assertElementDisplayed(this.selectHomeTeamPlayer(playerName));
      await this.click(this.selectHomeTeamPlayer(playerName));
      await this.selectShirtNumberIfNot();
      await this.scrollDown();
      await this.click(this.confirmBtn);
    }
  }

  async submitAwayTeamPlayersIfNotSubmitted(playerName: string) {
    const isSubmitted = await this.isElementPresent(
      this.teamSheetSubmittedMsg,
      Timeout.TWO_SECONDS,
    );

    if (!isSubmitted) {
      await this.waitUntilVisibleWithRetry(
        this.selectAwayTeamPlayer(playerName),
      );
      await this.assertElementDisplayed(this.selectAwayTeamPlayer(playerName));
      await this.click(this.selectAwayTeamPlayer(playerName));
      await this.selectShirtNumberIfNot();
      await this.scrollDown();
      await this.click(this.confirmBtn);
    }
  }

  async handleStartOrResumeMatch() {
    const startBtn = await this.isElementPresent(
      this.startBtn,
      Timeout.TWO_SECONDS,
    );

    if (startBtn) {
      await this.waitUntilVisibleWithRetry(this.startBtn);
      await this.scrollDown();
      await this.click(this.startBtn);
      await this.waitUntilVisibleWithRetry(this.confirmStartBtn);
      await this.click(this.confirmStartBtn);
    } else {
      await this.waitUntilVisibleWithRetry(this.resumeBtn);
      await this.scrollDown();
      await this.click(this.resumeBtn);
    }
  }

  async getTeamScores(teamName: any) {
    await this.waitUntilVisibleWithRetry(teamName);
    const scores = await this.getElementText(teamName);
    return scores;
  }

  async addTeamScore(scoreButton: any) {
    await this.waitUntilVisibleWithRetry(scoreButton);
    await this.click(scoreButton);
  }

  async undoTeamScore(undoButton: any) {
    await this.waitUntilVisibleWithRetry(undoButton);
    await this.click(undoButton);
  }

  async handleErrorPopup() {
    try {
      await (await this.getElement(this.errorPopup)).isDisplayed();
      await this.click(this.errorPopup);
    } catch {}
  }

  async clickDoneBtn() {
    try {
      await this.waitUntilVisibleWithRetry(this.doneBtn);
      await this.click(this.doneBtn);
    } catch {}
  }

  // async completeMatchFlowIfNeeded(matchId: string) {
  //     const matchSelector = this.matchById(matchId);
  //     const matchCard = await this.getElement(matchSelector, { wait: false });
  //     const isMatchPending = await matchCard.isExisting();
  //     if (!isMatchPending) return;
  //     // Open match
  //     await this.scrollUntilElementVisible(matchSelector);
  //     await this.assertElementDisplayed(matchSelector);
  //     await this.click(matchSelector);
  //     await this.handleErrorPopup();
  //     // Validate scorer screen
  //     await this.validateScorerScreenElements();
  //     // Handle team sheet
  //     const alertEl = await this.getElement(this.teamSheetAlert, { wait: false });
  //     const isVisible = await alertEl.isExisting();
  //     if (isVisible) {
  //         await this.click(this.teamSheetAlert);
  //         await this.validateHomeTeamSheetElements();
  //         await this.submitHomeTeamPlayersIfNotSubmitted();
  //         await this.validateAwayTeamSheetElements();
  //         await this.submitAwayTeamPlayersIfNotSubmitted();
  //         await this.clickDoneBtn();
  //     }
  //     // Start / Resume match
  //     await this.handleStartOrResumeMatch();
  //     // Scores handling
  //     const initialHomeScore = await this.getTeamScores(this.homeTeamScore);
  //     const initialAwayScore = await this.getTeamScores(this.awayTeamScore);
  //     await this.addTeamScore(this.addHomeTeamScore);
  //     const homeScoreAfter = await this.getTeamScores(this.homeTeamScore);
  //     await this.addTeamScore(this.addAwayTeamScore);
  //     const awayScoreAfter = await this.getTeamScores(this.awayTeamScore);
  //     expect(homeScoreAfter).not.toEqual(initialHomeScore);
  //     expect(awayScoreAfter).not.toEqual(initialAwayScore);
  //     await this.undoTeamScore(this.undoHomeTeamScoreBtn);
  //     const homeScoreAfterUndo = await this.getTeamScores(this.homeTeamScore);
  //     await this.undoTeamScore(this.undoAwayTeamScoreBtn);
  //     const awayScoreAfterUndo = await this.getTeamScores(this.awayTeamScore);
  //     expect(homeScoreAfterUndo).toEqual(initialHomeScore);
  //     expect(awayScoreAfterUndo).toEqual(initialAwayScore);
  // }
}
