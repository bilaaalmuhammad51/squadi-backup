import { DualSelector, selector } from "../factories/page.factory";
import { Timeout } from "../utils/timers";
import { LoginPage } from "./login.page";
import { HomePage } from "../pages/home.page";
import { UserRoles } from "../data/teamSheet.data";
import { namesOfUsers } from "../data/login.data";
import { App } from "../config/apps";
import { hasFeature } from "../utils/features";

export class ScorerPage extends LoginPage {
  public teamSheetAlert = selector(
    "~Team Sheet not set",
    "~Team Sheet not set",
    "Team Sheet Alert",
  );

  public matchTimer = selector(
    'android=new UiSelector().descriptionMatches(".*(STARTS IN|Half 1|Half 2|FT).*")',
    "(//XCUIElementTypeStaticText)[2]",
    "Match Timer",
  );

  public homeTeam = selector(
    "~HR-ASN2Club1-D1-T2",
    "~HR-ASN2Club1-D1-T2",
    "Home Team",
  );

  public homeTeamInPlayerStatsTab = selector(
    'android=new UiSelector().text("HHR-ASN2Club1-D1-T2")',
    "~HR-ASN2Club1-D1-T2",
    "Home Team",
  );

  public awayTeam = selector(
    "~HR-ASN2Club2-D1-T3",
    "~HR-ASN2Club2-D1-T3",
    "Away Team",
  );

  public awayTeamInPlayerStatsTab = selector(
    'android=new UiSelector().text("HHR-ASN2Club2-D1-T3")',
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

  public gameCard = (keyword: string, matchId: string) =>
    selector(
      `android=new UiSelector().descriptionContains("${keyword}").descriptionContains("Match ID: ${matchId}")`,
      `-ios predicate string: name CONTAINS "${keyword}" AND name CONTAINS "Match ID: ${matchId}"`,
      "Game Card",
    );

  public scorerNotSetAlert = selector(
    "~Scorer not set",
    "~Scorer not set",
    "Scorer not set alert in match in Home tab",
  );

  public assignAScorerOption = selector(
    "~Assign a Scorer",
    "~Assign a Scorer",
    "Assign a Scorer option in Game Details page",
  );

  public changeScorerOption = selector(
    "~Change scorer",
    "~Change scorer",
    "Change scorer option in Game Details page",
  );

  public assignScorerHeading = selector(
    "~Assign Scorer",
    "~Assign Scorer",
    "Assign Scorer page heading",
  );

  public searchForScorer = selector(
    "~Or search for someone...",
    "~Or search for someone...",
    "Or search for someone...",
  );

  public searchField = selector(
    "//android.widget.EditText",
    "//android.widget.EditText",
    "Search Field for searching",
  );

  public scorerToSelect = (scorer: string = namesOfUsers.scorerName) =>
    selector(
      `//android.widget.Button[contains(@content-desc,"${scorer}")]`,
      "",
      "Scorer to select after search",
    );

  public selectedScorer = (scorer: string = namesOfUsers.scorerName) =>
    selector(
      `//android.widget.ImageView[contains(@content-desc,"${scorer}")]`,
      "",
      "selected Scorer persisting",
    );

  public confirmScorerBtn = selector(
    "~Confirm Scorer",
    "~Confirm Scorer",
    "Confirm Scorer button in Assign Scorer page",
  );

  public scorerHasNotAcceptedAlert = selector(
    '//android.view.View[contains(@content-desc,"Scorer has not accepted")]',
    "",
    "Scorer has not accepted alert in match card",
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

  public confirmBtnForTeamSheetOrSelection = selector(
    `~${App.confirmBtnForSavingTeamSheetOrSelection?.confirmTeam}`,
    `~${App.confirmBtnForSavingTeamSheetOrSelection?.confirmTeam}`,
    "Confirm Button for Team Sheet or Selection",
  );

  public startBtn = selector("~Start", "~Start", "Start Button");

  public pauseOrStopBtn = selector(
    `~${App.pauseOrStopButton.label}`,
    `~${App.pauseOrStopButton.label}`,
    "Pause or Stop Button",
  );

  public resumeOrStartBtn = selector(
    `~${App.resumeOrStartButton.label}`,
    `~${App.resumeOrStartButton.label}`,
    "Resume or Start Button",
  );

  public borrowPlayerBtn = selector(
    'android=new UiSelector().description("+ Borrow Player")',
    '-ios predicate string: name CONTAINS "Borrow Player"',
    "Borrow Player Button",
  );

  public searchPlayerField = selector(
    'android=new UiSelector().className("android.widget.EditText")',
    "",
    "Search Field for player",
  );

  public selectPlayerFromSearchResult = (playerName: string) => {
    return selector(
      `//android.widget.Button[contains(@content-desc,"${playerName}")]`,
      "",
      "Select Player from Search Results",
    );
  };

  public validatorName = selector(
    'android=new UiSelector().textMatches("(?i).*syed.*")',
    '-ios predicate string: value CONTAINS[c] "syed"',
    "Validator Name",
  );

  public teamSheetSubmittedMsg = selector(
    'android=new UiSelector().descriptionContains("Teamsheet submitted")',
    '-ios predicate string: name CONTAINS[c] "Teamsheet submitted"',
    "Team Sheet Submitted Message",
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

  // Foul pad (basketball only, gated by hasFeature("fouls")). Confirmed from a
  // real device page-source capture (2026-09-11): the "Undo" buttons above are
  // shared between team score AND fouls (there is only one Undo per team on
  // screen, and it enables the moment either a score or a foul is recorded for
  // that team), so undoHomeTeamScoreBtn / undoAwayTeamScoreBtn double as the
  // foul-undo controls - no separate selector needed.
  public personalFoulTypeBtn = selector(
    "~PERSONAL",
    "~PERSONAL",
    "Personal Foul Type Button",
  );

  public technicalFoulTypeBtn = selector(
    "~TECHNICAL",
    "~TECHNICAL",
    "Technical Foul Type Button",
  );

  public unsportsmanlikeFoulTypeBtn = selector(
    "~UNSPORTSMANLIKE",
    "~UNSPORTSMANLIKE",
    "Unsportsmanlike Foul Type Button",
  );

  public disqualifyingFoulTypeBtn = selector(
    "~DISQUALIFYING",
    "~DISQUALIFYING",
    "Disqualifying Foul Type Button",
  );

  /**
   * Team foul column ("FOULS" content-desc, e.g. "FOULS\n2"; renders as
   * "FOULS\n " with no visible number at zero fouls for the period). Home
   * renders before away in both screen position and document order.
   */
  public teamFoulColumn = (team: "home" | "away") =>
    selector(
      `android=new UiSelector().descriptionContains("FOULS").instance(${team === "home" ? 0 : 1})`,
      `-ios predicate string: name CONTAINS "FOULS"`,
      `Team Foul Column (${team})`,
    );

  /**
   * A player's own roster button doubles as the foul target once a foul type
   * is selected - content-desc is "<#>\n<Player Name>\n<personal foul tally>".
   */
  public foulTargetPlayer = (player: string) =>
    selector(
      `android=new UiSelector().descriptionContains("${player}")`,
      `-ios predicate string: name CONTAINS "${player}"`,
      `Foul target - player ${player}`,
    );

  /**
   * The "B / Bench / <tally>" element is disabled while PERSONAL is selected
   * and becomes the tap target for a bench/team-official foul once TECHNICAL
   * is selected (confirmed on a real device 2026-09-11: tapping it after
   * TECHNICAL increments its own tally and the team FOULS column, without
   * attributing the foul to any player). Home renders before away.
   */
  public benchFoulTarget = (team: "home" | "away") =>
    selector(
      `android=new UiSelector().descriptionContains("Bench").instance(${team === "home" ? 0 : 1})`,
      `-ios predicate string: name CONTAINS "Bench"`,
      `Foul target - bench/team official (${team})`,
    );

  public errorPopup = selector(
    'android=new UiSelector().descriptionContains("Sorry").instance(1)',
    "(//XCUIElementTypeStaticText)[2]",
    "Error Popup",
  );

  public ResponsesHeading = selector(
    "~Responses",
    "~Responses",
    "Responses heading in the bottom after opening field in manager view",
  );

  public teamSheetNotAvailableMsg = selector(
    `~${App.teamSheetNotAvailableMsg.message}`,
    `~${App.teamSheetNotAvailableMsg.message}`,
    "Team Sheet not available message",
  );

  public teamSheetNotCompletedMsg = selector(
    "~The Team sheet was not completed before the start time. The referee or your club admin will now need to complete it.",
    "~The Team sheet was not completed before the start time. The referee or your club admin will now need to complete it.",
    "Team Sheet not completed message",
  );

  public enterShirtNumberPopup = selector(
    "",
    '//XCUIElementTypeOther[@name="Enter a shirt number"]',
    "Done Button",
  );

  public selectShirtNumber = selector(
    '//android.widget.Button[@content-desc="Select shirt number"]/android.view.View[3]',
    "",
    "Select Shirt Number if not selected (Checkbox same as for selecting player)",
  );

  public enterShirtNubmerField = selector(
    "android.widget.EditText",
    "-ios class chain:**/XCUIElementTypeTextField",
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

  public matchTimeUpdatePopup = (matchId: string) =>
    selector(
      `android=new UiSelector().descriptionContains("Match ${matchId} has been changed by the competition organiser").instance(1)`,
      "",
      "",
    );

  public teamSheetOption = selector(
    `~${App.teamAttendance.name}`,
    `~${App.teamAttendance.name}`,
    "Team Sheet Option in Match",
  );

  public substitutionOption = selector(
    "~Substitutions",
    "~Substitutions",
    "Substitution Option in Match",
  );

  public startingFormationOption = selector(
    "~Starting Formation",
    "~Starting Formation",
    "Starting Formation Option in Match",
  );

  public verifyMatchOfficialsAlert = selector(
    "~Verify Match Officials",
    "~Verify Match Officials",
    "Verify Match Officials alert in match in Home tab",
  );

  public gameRefereesOption = selector(
    "~Game Referees",
    "~Game Referees",
    "Game Referees Option in Match",
  );

  public assignRefereePageHeading = selector(
    "~Assign Referees",
    "~Assign Referees",
    "Assign Referees page heading in Game Referees",
  );

  public refereeSlot1Heading = selector(
    App.refereeSlots.slot1.android,
    App.refereeSlots.slot1.ios,
    "Referee slot 1 heading in Game Referees",
  );

  public searchForMatchReferee = selector(
    "//android.widget.EditText[1]",
    "",
    "Match referee selection in Assign Referees page in Game Referees",
  );

  public refereeSlot2Heading = selector(
    App.refereeSlots.slot2.android,
    App.refereeSlots.slot2.ios,
    "Referee slot 2 heading in Game Referees",
  );

  public refereeSlot3Heading = selector(
    App.refereeSlots.slot3.android,
    App.refereeSlots.slot3.ios,
    "Referee slot 3 heading in Game Referees",
  );

  public refereeToSelect = (referee: string = namesOfUsers.refereeName) =>
    selector(
      `//android.widget.Button[contains(@content-desc,"${referee}")][2]`,
      "",
      "Referee to select after search",
    );

  public confirmRefereesBtn = selector(
    "~Confirm Referees",
    "~Confirm Referees",
    "Confirm Referees button in Assign Referees",
  );

  public allRefereesNotSelectedPopup = selector(
    "~You have not selected referees for all roles. Are you sure you want to proceed?",
    "~You have not selected referees for all roles. Are you sure you want to proceed?",
    "All Referees not selected popup",
  );

  public continueBtnInPopup = selector(
    "~Continue",
    "~Continue",
    "Continue button in popup",
  );

  public selectedReferee = (referee: string = namesOfUsers.refereeName) =>
    selector(
      `//android.widget.EditText[@text="${referee}"]`,
      "",
      "selected Referee persisting",
    );

  public fieldOrCourtOption = selector(
    `android=new UiSelector().descriptionContains("${App.fieldOption.label}")`,
    `-ios predicate string:name CONTAINS "${App.fieldOption.label}"`,
    "Field or Court option in Game Details after opening match",
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
    selector(`~Ok`, `~Ok`, "OK button to save shirt number in team sheet");

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

  async validateManagerScreenElements(matchId: string) {
    const homePage = new HomePage();
    if (hasFeature("startingFormation")) {
      await this.waitUntilVisibleWithRetry(this.startingFormationOption);
      await this.assertElementDisplayed(this.startingFormationOption);
    }
    const matchElement = homePage.matchById(matchId);
    await this.scrollUntilElementVisible(matchElement);
    await homePage.assertElementDisplayed(matchElement);
    await homePage.assertElementDisplayed(
      this.gameCard(UserRoles.Manager, matchId),
    );
    await this.assertElementDisplayed(this.fieldOrCourtOption);
    await this.assertElementDisplayed(this.ResponsesHeading);
  }
  async validateRefereeScreenElements(matchId: string) {
    await this.waitUntilVisibleWithRetry(this.teamSheetOption);
    await this.assertElementNotDisplayed(this.startingFormationOption);
    await this.assertElementDisplayed(
      this.gameCard(UserRoles.Referee, matchId),
    );
    await this.validateGameRefereesOption();
    await this.assertElementDisplayed(this.fieldOrCourtOption);
  }

  async validateCoachScreenElements(matchId: string) {
    const homePage = new HomePage();
    if (hasFeature("startingFormation")) {
      await this.waitUntilVisibleWithRetry(this.startingFormationOption);
      await this.assertElementDisplayed(this.startingFormationOption);
    }
    const matchElement = homePage.matchById(matchId);
    await this.scrollUntilElementVisible(matchElement);
    await homePage.assertElementDisplayed(matchElement);
    await homePage.assertElementDisplayed(
      this.gameCard(UserRoles.Coach, matchId),
    );
    await this.assertElementDisplayed(this.fieldOrCourtOption);

    await this.assertElementDisplayed(this.ResponsesHeading);
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
    // await this.assertElementDisplayed(this.borrowPlayerBtn);
    // await this.assertElementDisplayed(this.validatorName);
  }

  async validateHomeSubstitutionElements(homeTeam: string) {
    await this.waitUntilVisibleWithRetry(this.homeTeamSheetTab(homeTeam));
    await this.assertElementDisplayed(this.homeTeamSheetTab(homeTeam));
    await this.click(this.homeTeamSheetTab(homeTeam));
    // await this.assertElementNotDisplayed(this.borrowPlayerBtn);
    // await this.assertElementDisplayed(this.validatorName);
  }

  async validateAwayTeamSheetElements(awayTeam: string) {
    await this.waitUntilVisibleWithRetry(this.awayTeamSheetTab(awayTeam));
    await this.assertElementDisplayed(this.awayTeamSheetTab(awayTeam));
    await this.click(this.awayTeamSheetTab(awayTeam));
    // await this.assertElementDisplayed(this.borrowPlayerBtn);
    // await this.assertElementDisplayed(this.validatorName);
  }

  async validateAwaySubstitutionElements(awayTeam: string) {
    await this.waitUntilVisibleWithRetry(this.awayTeamSheetTab(awayTeam));
    await this.assertElementDisplayed(this.awayTeamSheetTab(awayTeam));
    await this.click(this.awayTeamSheetTab(awayTeam));
    // await this.assertElementNotDisplayed(this.borrowPlayerBtn);
    // await this.assertElementDisplayed(this.validatorName);
  }

  async validateTeamSheetNotAvailable() {
    await this.waitUntilVisibleWithRetry(this.teamSheetNotAvailableMsg);
    await this.assertElementDisplayed(this.teamSheetNotAvailableMsg);
  }

  async validateTeamSheetNotCompleted() {
    await this.waitUntilVisibleWithRetry(this.teamSheetNotCompletedMsg);
    await this.assertElementDisplayed(this.teamSheetNotCompletedMsg);
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

  async clickConfirmBtnForSavingTeamSheet() {
    await this.waitUntilVisibleWithRetry(
      this.confirmBtnForTeamSheetOrSelection,
    );
    await this.click(this.confirmBtnForTeamSheetOrSelection);
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
      if (hasFeature("matchStartConfirmation")) {
        await this.waitUntilVisibleWithRetry(this.confirmBtn);
        await this.click(this.confirmBtn);
      }
    } else {
      await this.waitUntilVisibleWithRetry(this.resumeOrStartBtn);
      await this.scrollDown();
      await this.click(this.resumeOrStartBtn);
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

  private foulTypeBtn(
    foulType: "PERSONAL" | "TECHNICAL" | "UNSPORTSMANLIKE" | "DISQUALIFYING",
  ) {
    return {
      PERSONAL: this.personalFoulTypeBtn,
      TECHNICAL: this.technicalFoulTypeBtn,
      UNSPORTSMANLIKE: this.unsportsmanlikeFoulTypeBtn,
      DISQUALIFYING: this.disqualifyingFoulTypeBtn,
    }[foulType];
  }

  async selectFoulType(
    foulType: "PERSONAL" | "TECHNICAL" | "UNSPORTSMANLIKE" | "DISQUALIFYING",
  ) {
    const btn = this.foulTypeBtn(foulType);
    await this.waitUntilVisibleWithRetry(btn);
    await this.click(btn);
  }

  /** Selects the foul type, then taps the player's roster button to attribute it. */
  async recordFoulOnPlayer(
    player: string,
    foulType: "PERSONAL" | "TECHNICAL" | "UNSPORTSMANLIKE" | "DISQUALIFYING",
  ) {
    await this.selectFoulType(foulType);
    await this.click(this.foulTargetPlayer(player));
  }

  /** Selects the foul type, then taps the team's Bench element (bench/team-official foul). */
  async recordBenchFoul(
    team: "home" | "away",
    foulType: "PERSONAL" | "TECHNICAL" | "UNSPORTSMANLIKE" | "DISQUALIFYING",
  ) {
    await this.selectFoulType(foulType);
    await this.click(this.benchFoulTarget(team));
  }

  /**
   * Parses the trailing number off a foul-pad content-desc such as
   * "1\nPlayer1 T1\n2" or "B\nBench\n1". Returns 0 when the trailing segment
   * is blank (the pad renders no visible "0").
   */
  private parseTrailingFoulCount(contentDesc: string): number {
    const parts = contentDesc.split("\n");
    const last = parts[parts.length - 1].trim();
    return last === "" ? 0 : Number(last);
  }

  async getPlayerFoulTally(player: string): Promise<number> {
    const text = await this.getElementText(this.foulTargetPlayer(player));
    return this.parseTrailingFoulCount(text);
  }

  async getBenchFoulTally(team: "home" | "away"): Promise<number> {
    const text = await this.getElementText(this.benchFoulTarget(team));
    return this.parseTrailingFoulCount(text);
  }

  /** Raw trailing value of the team FOULS column - "" when blank, else the numeric string. */
  async getTeamFoulColumnValue(team: "home" | "away"): Promise<string> {
    const text = await this.getElementText(this.teamFoulColumn(team));
    const parts = text.split("\n");
    return parts[parts.length - 1].trim();
  }

  async handleErrorPopup() {
    try {
      await (await this.getElement(this.errorPopup)).isDisplayed();
      await this.click(this.errorPopup);
    } catch {}
  }

  async clickSettingsIcon() {
    await this.waitUntilVisibleWithRetry(this.settingIcon);
    await this.click(this.settingIcon);
  }

  async isElementDisplayed(selector: DualSelector): Promise<boolean> {
    try {
      const element = await this.resolve(selector);
      return await element.isDisplayed();
    } catch (error) {
      return false;
    }
  }

  async handleMatchTimeUpdatePopup(matchId: string) {
    const isVisible = await this.isElementVisible(
      this.locationOptionPopupCloseBtn,
      5000,
    );
    if (isVisible) {
      await this.waitUntilInvisibleWithRetry(
        this.matchTimeUpdatePopup(matchId),
      );
    }
  }

  async waitUntilTeamSheetBecomesSubstitution(
    matchElement: any,
    maxAttempts: number = 20,
    waitBetweenAttempts: number = 5000,
  ) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      console.log(
        `[Attempt ${attempt}] Checking if Team Sheet became Substitution`,
      );

      await this.scrollUntilElementVisible(matchElement);
      await this.click(matchElement);

      await browser.pause(3000); // Wait for the match details to load

      const substitutionVisible = await this.isElementDisplayed(
        this.substitutionOption,
      );

      if (substitutionVisible) {
        console.log("Substitution option is now visible");
        return;
      }

      console.log("Still showing Team Sheet. Retrying...");

      await this.clickBackBtn();

      await driver.pause(waitBetweenAttempts);
    }

    throw new Error(
      `Substitution option did not appear after ${maxAttempts} attempts`,
    );
  }

  async waitUntilTeamSheetBecomesSubstitutionForScorer(
    maxAttempts: number = 20,
    waitBetweenAttempts: number = 5000,
  ) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      console.log(
        `[Attempt ${attempt}] Checking if Team Sheet became Substitution`,
      );

      // Open settings
      await this.clickSettingsIcon();

      const offlineBannerVisible = await this.isElementVisible(
        this.connectBtnInOfflineBanner,
      );
      if (offlineBannerVisible) {
        await this.click(this.connectBtnInOfflineBanner);
        const connectPopupVisible = await this.isElementVisible(
          this.connectNowBtnInConnectPopup,
        );
        if (connectPopupVisible) {
          await this.click(this.connectNowBtnInConnectPopup);
          await this.waitUntilInvisibleWithRetry(
            this.connectNowBtnInConnectPopup,
          );
        }
      }
      // Check if Substitution option is visible
      const substitutionVisible = await this.isElementDisplayed(
        this.substitutionOption,
      );

      if (substitutionVisible) {
        console.log("Substitution option is now visible");
        return;
      }

      console.log("Still showing Team Sheet. Retrying...");

      // Go back
      await this.clickCloseCrossBtn();

      // Wait before retry
      await driver.pause(waitBetweenAttempts);
    }

    throw new Error(
      `Substitution option did not appear after ${maxAttempts} attempts`,
    );
  }

  async validateTeamSheetOption() {
    await this.waitUntilVisibleWithRetry(this.teamSheetOption);
    await this.assertElementDisplayed(this.teamSheetOption);
  }

  async validateSubstitutionOption() {
    if (hasFeature("substitutions")) {
      await this.waitUntilVisibleWithRetry(this.substitutionOption);
      await this.assertElementDisplayed(this.substitutionOption);
    }
  }

  async validateStartingFormationOption() {
    if (hasFeature("startingFormation")) {
      await this.waitUntilVisibleWithRetry(this.startingFormationOption);
      await this.assertElementDisplayed(this.startingFormationOption);
    }
  }

  async validateGameRefereesOption() {
    await this.waitUntilVisibleWithRetry(this.gameRefereesOption);
    await this.assertElementDisplayed(this.gameRefereesOption);
  }

  async openTeamSheetOption() {
    await this.waitUntilVisibleWithRetry(this.teamSheetOption);
    await this.click(this.teamSheetOption);
  }

  async openSubstitutionOption() {
    if (hasFeature("substitutions")) {
      await this.waitUntilVisible(this.substitutionOption);
      await this.click(this.substitutionOption);
    } else {
      await this.openTeamSheetOption();
    }
  }

  async openAssignAScorerOption() {
    await this.waitUntilVisibleWithRetry(this.assignAScorerOption);
    await this.assertElementDisplayed(this.assignAScorerOption);
    await this.click(this.assignAScorerOption);
  }

  async openChangeScorerOption() {
    await this.waitUntilVisibleWithRetry(this.changeScorerOption);
    await this.assertElementDisplayed(this.changeScorerOption);
    await this.click(this.changeScorerOption);
  }

  async validateAssignScorerHeading() {
    await this.waitUntilVisibleWithRetry(this.assignScorerHeading);
    await this.assertElementDisplayed(this.assignScorerHeading);
  }

  async searchAndSelectScorer(scorer: string = namesOfUsers.scorerName) {
    await this.click(this.searchForScorer);
    await this.click(this.searchField);
    await this.type(this.searchField, scorer);
    await this.waitUntilVisibleWithRetry(this.scorerToSelect(scorer));
    await this.click(this.scorerToSelect(scorer));
  }

  async confirmScorer() {
    await this.waitUntilVisibleWithRetry(this.confirmScorerBtn);
    await this.click(this.confirmScorerBtn);
  }

  async validateSelectedScorer(scorer: string = namesOfUsers.scorerName) {
    await this.waitUntilVisibleWithRetry(this.selectedScorer(scorer));
    await this.assertElementDisplayed(this.selectedScorer(scorer));
  }

  async assignScorer(scorer: string = namesOfUsers.scorerName) {
    await this.openAssignAScorerOption();
    await this.validateAssignScorerHeading();
    await this.searchAndSelectScorer(scorer);
    await this.confirmScorer();
  }

  async selectPlayerAndPositionOfTeam(player: string, position: string) {
    await this.waitUntilVisibleWithRetry(this.selectPlayerInTeamSheet(player));
    await this.click(this.selectPlayerInTeamSheet(player));
    if (hasFeature("startingFormation")) {
      await this.waitUntilVisibleWithRetry(
        this.selectPositionOfPlayerInTeamSheet(position),
      );
      await this.click(this.selectPositionOfPlayerInTeamSheet(position));
    }
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

  async selectShirtNumberOfNewPlayerInTeamSheet(shirtNumber: number) {
    const shirtNumberNotSelected = await this.isElementDisplayed(
      this.selectShirtNumber,
    );
    if (shirtNumberNotSelected) {
      await this.click(this.selectShirtNumber);
      if (shirtNumber !== undefined) {
        await this.type(this.enterShirtNubmerField, shirtNumber.toString());
      }
      await this.waitUntilVisibleWithRetry(
        this.okBtnToSaveShirtNumberInTeamSheet(),
      );
      await this.click(this.okBtnToSaveShirtNumberInTeamSheet());
    }
  }

  async borrowPlayerInTeamSheet(player: string) {
    await this.waitUntilVisibleWithRetry(this.borrowPlayerBtn);
    await this.click(this.borrowPlayerBtn);
    await this.waitUntilVisibleWithRetry(this.searchPlayerField);
    await this.click(this.searchPlayerField);
    await this.type(this.searchPlayerField, player);
    await this.waitUntilVisibleWithRetry(
      this.selectPlayerFromSearchResult(player),
    );
    await this.click(this.selectPlayerFromSearchResult(player));
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

  async isPlayerAvailableInFormation(player: string): Promise<boolean> {
    return this.isElementVisible(
      this.playerIconToDragInStartingFormation(player),
    );
  }

  async dragPlayer(
    player: string,
    offsetX: number = 80,
    offsetY: number = 120,
  ): Promise<void> {
    const selectorObj = this.playerIconToDragInStartingFormation(player);
    const selector = await this.resolveSelectorObjToString(selectorObj);
    const element = await $(selector);

    const { x, y } = await element.getLocation();
    const { width, height } = await element.getSize();

    const startX = x + width / 2;
    const startY = y + height / 2;
    const endX = startX + offsetX;
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
  }

  async saveStartingFormation() {
    if (hasFeature("startingFormation")) {
      await this.waitUntilVisibleWithRetry(this.tickButtonInStartingFormation);
      await this.click(this.tickButtonInStartingFormation);
    }
  }

  async openGameRefereesOption() {
    await this.waitUntilVisibleWithRetry(this.gameRefereesOption);
    await this.assertElementDisplayed(this.gameRefereesOption);
    await this.click(this.gameRefereesOption);
  }

  async validateRefereesElements() {
    await this.waitUntilVisibleWithRetry(this.refereeSlot1Heading);
    await this.assertElementDisplayed(this.refereeSlot1Heading);
    await this.assertElementDisplayed(this.refereeSlot2Heading);
    await this.assertElementDisplayed(this.refereeSlot3Heading);
  }

  async validateAssignRefereesHeading() {
    await this.waitUntilVisibleWithRetry(this.assignRefereePageHeading);
    await this.assertElementDisplayed(this.assignRefereePageHeading);
    await this.assertElementDisplayed(this.refereeSlot1Heading);
  }

  async searchAndSelectReferee(referee: string = namesOfUsers.refereeName) {
    await this.waitUntilVisibleWithRetry(this.searchForMatchReferee);
    await this.click(this.searchForMatchReferee);
    await this.click(this.searchField);
    await this.type(this.searchField, referee);
    await this.waitUntilVisibleWithRetry(this.refereeToSelect(referee));
    await this.click(this.refereeToSelect(referee));
  }

  async confirmRefereesAndDismissPopup() {
    await this.waitUntilVisibleWithRetry(this.confirmRefereesBtn);
    await this.click(this.confirmRefereesBtn);
    await this.waitUntilVisibleWithRetry(this.allRefereesNotSelectedPopup);
    await this.assertElementDisplayed(this.allRefereesNotSelectedPopup);
    await this.assertElementDisplayed(this.continueBtnInPopup);
    await this.click(this.continueBtnInPopup);
  }

  async validateSelectedReferee(referee: string = namesOfUsers.refereeName) {
    await this.waitUntilVisibleWithRetry(this.selectedReferee(referee));
    await this.assertElementDisplayed(this.selectedReferee(referee));
  }

  async assignReferee(referee: string = namesOfUsers.refereeName) {
    await this.openGameRefereesOption();
    await this.validateAssignRefereesHeading();
    await this.searchAndSelectReferee(referee);
    await this.confirmRefereesAndDismissPopup();
  }

  async startMatch() {
    await this.scrollDown();
    await this.waitUntilVisibleWithRetry(this.startBtn);
    await this.click(this.startBtn);
    if (hasFeature("matchStartConfirmation")) {
      await this.waitUntilVisibleWithRetry(this.confirmBtn);
      await this.click(this.confirmBtn);
    }
    await this.waitUntilVisibleWithRetry(this.pauseOrStopBtn);
  }
}
