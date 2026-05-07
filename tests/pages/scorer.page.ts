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
    'android=new UiSelector().descriptionMatches(".(STARTS IN|Half 1|Half 2|FT).")',
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
  public backBtn = selector("~Back", "~Back", "Back Button");

  public enterShirtNumberPopup = selector(
    "",
    '//XCUIElementTypeOther[@name="Enter a shirt number"]',
    "Done Button",
  );

  public enterShirtNubmerField = selector(
    "android.widget.EditText",
    "~Enter...",
    "Field to enter shirt number in team sheet",
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

  public settingIcon = selector(
    'android=new UiSelector().className("android.widget.ImageView").instance(0)',
    "//XCUIElementTypeOther[2]/XCUIElementTypeButton[2]",
    "Settings Icon",
  );

  public teamSheetOption = selector(
    "~Team Sheet",
    "~Team Sheet",
    "Team Sheet Option in Settings",
  );

  public substitutionOption = selector(
    "~Substitutions",
    "~Substitutions",
    "Substitution Option in Settings",
  );

  public startingFormationOption = selector(
    "~Starting Formation",
    "~Starting Formation",
    "Starting Formation Option in Settings",
  );

  public selectPlayerInTeamSheet = (player: string) =>
    selector(
      `(//*[contains(@content-desc, "${player}")]/*[contains(@class, "android")])[2]`,
      `//*[contains(@name, "${player}")]/following-sibling::*[2]`,
      "Select player in team sheet",
    );

  public editShirtNumberInTeamSheet = (player: string) =>
    selector(
      `android=new UiSelector().descriptionContains("${player}")`,
      `-ios predicate string:name CONTAINS[c] "${player}"`,
      "Edit shirt number of player in team sheet",
    );

  public okBtnToSaveShirtNumberInTeamSheet = () =>
    selector(
      `android=new UiSelector().description("Enter a shirt number").instance(2)`,
      `(//XCUIElementTypeStaticText[@name="Enter a shirt number"])[2]`,
      "OK button to save shirt number in team sheet",
    );

  public cancelBtnForShirtNumberInTeamSheet = () =>
    selector(
      `android=new UiSelector().description("Enter a shirt number").instance(1)`,
      `(//XCUIElementTypeStaticText[@name="Enter a shirt number"])[1]`,
      "Cancel button for shirt number in team sheet",
    );

  public selectPositionOfPlayerInTeamSheet = (position: string) =>
    selector(
      `android=new UiSelector().descriptionContains("${position}")`,
      `-ios predicate string: name == "${position}"`,
      "Select position of player in team sheet",
    );

  public playerIconToDragInStartingFormation = (player: string) =>
    selector(
      `android=new UiSelector().descriptionContains("${player}")`,
      `-ios predicate string: name CONTAINS "${player}"`,
      "Player icon to drag in Starting Formation",
    );

  public tickButtonInStartingFormation = selector(
    'android=new UiSelector().className("android.widget.Button").instance(2)',
    "//XCUIElementTypeButton[2]",
    "Tick button to save in Starting Formation",
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

  async validateHomeSubstitutionElements(homeTeam: string) {
    await this.waitUntilVisibleWithRetry(this.homeTeamSheetTab(homeTeam));
    await this.assertElementDisplayed(this.homeTeamSheetTab(homeTeam));
    await this.click(this.homeTeamSheetTab(homeTeam));
    await this.assertElementNotDisplayed(this.borrowPlayerBtn);
    await this.assertElementDisplayed(this.validatorName);
  }

  async validateAwayTeamSheetElements(awayTeam: string) {
    await this.waitUntilVisibleWithRetry(this.awayTeamSheetTab(awayTeam));
    await this.assertElementDisplayed(this.awayTeamSheetTab(awayTeam));
    await this.click(this.awayTeamSheetTab(awayTeam));
    await this.assertElementDisplayed(this.borrowPlayerBtn);
    await this.assertElementDisplayed(this.validatorName);
  }

  async validateAwaySubstitutionElements(awayTeam: string) {
    await this.waitUntilVisibleWithRetry(this.awayTeamSheetTab(awayTeam));
    await this.assertElementDisplayed(this.awayTeamSheetTab(awayTeam));
    await this.click(this.awayTeamSheetTab(awayTeam));
    await this.assertElementNotDisplayed(this.borrowPlayerBtn);
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
    await this.waitUntilVisibleWithRetry(this.doneBtn);
    await this.click(this.doneBtn);
  }

  async clickBackBtn() {
    await this.waitUntilVisibleWithRetry(this.backBtn);
    await this.click(this.backBtn);
  }

  async clickSettingsIcon() {
    await this.waitUntilVisibleWithRetry(this.settingIcon);
    await this.click(this.settingIcon);
  }

  async validateTeamSheetOption() {
    await this.waitUntilVisibleWithRetry(this.teamSheetOption);
    await this.assertElementDisplayed(this.teamSheetOption);
  }

  async validateSubstitutionOption() {
    await this.waitUntilVisibleWithRetry(this.substitutionOption);
    await this.assertElementDisplayed(this.substitutionOption);
  }

  async validateStartingFormationOption() {
    await this.waitUntilVisibleWithRetry(this.startingFormationOption);
    await this.assertElementDisplayed(this.startingFormationOption);
  }

  async openTeamSheetOption() {
    await this.waitUntilVisibleWithRetry(this.teamSheetOption);
    await this.click(this.teamSheetOption);
  }

  async openSubstitutionOption() {
    await this.waitUntilVisible(this.substitutionOption);
    await this.click(this.substitutionOption);
  }

  async selectPlayerAndPositionOfTeam(player: string, position: string) {
    await this.waitUntilVisibleWithRetry(this.selectPlayerInTeamSheet(player));
    await this.click(this.selectPlayerInTeamSheet(player));
    await this.waitUntilVisibleWithRetry(
      this.selectPositionOfPlayerInTeamSheet(position),
    );
    await this.click(this.selectPositionOfPlayerInTeamSheet(position));
    try {
      await driver.hideKeyboard();
    } catch {}
  }

  async selectOrUnselectPlayerInSubstitution(player: string) {
    await this.waitUntilVisibleWithRetry(this.selectPlayerInTeamSheet(player));
    await this.click(this.selectPlayerInTeamSheet(player));
  }

  async editShirtNumberOfPlayerInTeamSheet(
    player: string,
    shirtNumber?: number,
  ) {
    await this.waitUntilVisibleWithRetry(
      this.editShirtNumberInTeamSheet(player),
    );
    await this.click(this.editShirtNumberInTeamSheet(player));
    if (shirtNumber !== undefined) {
      await this.type(this.enterShirtNubmerField, shirtNumber.toString());
    }
    await this.waitUntilVisibleWithRetry(
      this.okBtnToSaveShirtNumberInTeamSheet(),
    );
    await this.click(this.okBtnToSaveShirtNumberInTeamSheet());
  }

  async openStartingFormationOption() {
    await this.waitUntilVisibleWithRetry(this.startingFormationOption);
    await this.click(this.startingFormationOption);
  }

  async getPlayerPosition(player: string) {
    const selectorObj = this.playerIconToDragInStartingFormation(player);
    const selector = await this.resolveSelectorObjToString(selectorObj);

    const element = await $(selector);

    const { x, y } = await element.getLocation();

    return { x, y };
  }

  async dragPlayer(
    player: string,
    offSetX: number = 80,
    offsetY: number = 120,
  ) {
    const selectorObj = this.playerIconToDragInStartingFormation(player);
    const selector = await this.resolveSelectorObjToString(selectorObj);

    const element = await $(selector);

    const { x, y } = await element.getLocation();
    const { width, height } = await element.getSize();

    const startX = x + width / 2;
    const startY = y + height / 2;

    const endX = startX + offSetX;
    const endY = startY + offsetY;

    await driver.performActions([
      {
        type: "pointer",
        id: "finger1",
        parameters: { pointerType: "touch" },
        actions: [
          { type: "pointerMove", duration: 0, x: startX, y: startY },
          { type: "pointerDown", button: 0 },
          { type: "pause", duration: 300 },
          { type: "pointerMove", duration: 600, x: endX, y: endY },
          { type: "pointerUp", button: 0 },
        ],
      },
    ]);

    await driver.releaseActions();
  }

  async saveStartingFormation() {
    await this.waitUntilVisibleWithRetry(this.tickButtonInStartingFormation);
    await this.click(this.tickButtonInStartingFormation);
  }
}
