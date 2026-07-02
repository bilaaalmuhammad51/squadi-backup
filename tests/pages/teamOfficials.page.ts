import { selector } from "../factories/page.factory";
import BasePage from "./base.page";

export class TeamOfficialsPage extends BasePage {
  private teamOfficialsMenuOption = selector(
    "~Team Officials",
    "~Team Officials",
    "Team Officials menu option",
  );

  private managerHeading = selector(
    "~Manager",
    "~Manager",
    "Manager heading in Team Officials",
  );

  private searchManagerOptionEnabled = selector(
    'android=new UiSelector().className("android.widget.EditText").instance(0)',
    '-ios class chain:**/XCUIElementTypeTextField[`name == "Search for someone..."`][1]',
    "Search Manager enabled option under Manager heading in Team Officials",
  );

  private searchManagerOptionDisabled = selector(
    'android=new UiSelector().className("android.view.View").instance(17)',
    '-ios class chain:**/XCUIElementTypeOther[`name == "Search for someone..."`][1]',
    "Search Manager disabled option under Manager heading in Team Officials",
  );

  private coachHeading = selector(
    "~Coach",
    "~Coach",
    "Coach heading in Team Officials",
  );

  private searchCoachOptionEnabled = selector(
    'android=new UiSelector().className("android.widget.EditText").instance(1)',
    '-ios class chain:**/XCUIElementTypeTextField[`name == "Search for someone..."`]',
    "Search Coach option under Coach heading in Team Officials",
  );

  private searchCoachOptionDisabled = selector(
    'android=new UiSelector().className("android.view.View").instance(19)',
    '-ios class chain:**/XCUIElementTypeOther[`name == "Search for someone..."`][2]',
    "Search Coach disabled option under Coach heading in Team Officials",
  );

  private searchField = selector(
    "//android.widget.EditText",
    "~Search for someone...",
    "Search Field",
  );

  private searchResult = (name: string) =>
    selector(
      `//android.widget.Button[contains(@content-desc, "${name}")]`,
      `-ios predicate string:name CONTAINS "${name}"`,
      "Search result after typing in Search Field",
    );

  private confirmTeamOfficialsBtn = selector(
    "~Confirm Team Officials",
    "~Confirm Team Officials",
    "Confirm Team Officials Button",
  );

  private selectedRoleUser = (name: string) =>
    selector(
      `//android.widget.EditText[@text="${name}"]`,
      `-ios predicate string:value == "${name}"`,
      `Selected ${name}`,
    );

  private teamOfficialsNotAvailableForTeam = selector(
    "~Team officials data is not available yet",
    "~Team officials data is not available yet",
    "Team officials data is not available yet for the team",
  );

  async validateIfTeamOfficialsMenuAvailable(): Promise<boolean> {
    const isVisible = await this.isElementVisible(this.teamOfficialsMenuOption);
    return isVisible;
  }

  async openTeamOfficials() {
    await this.waitUntilVisibleWithRetry(this.teamOfficialsMenuOption);
    await this.click(this.teamOfficialsMenuOption);
  }

  async assertTeamOfficialsEnabledElements() {
    await this.waitUntilVisibleWithRetry(this.managerHeading);
    await this.assertElementDisplayed(this.managerHeading);
    await this.assertElementDisplayed(this.searchManagerOptionEnabled);
    await this.assertElementDisplayed(this.coachHeading);
    await this.assertElementDisplayed(this.searchCoachOptionEnabled);
  }

  async assertDisabledTeamOfficialsElements() {
    let searchManagerOptionDisabled: ChainablePromiseElement;
    let searchCoachOptionDisabled: ChainablePromiseElement;
    let confirmTeamOfficialsBtn: ChainablePromiseElement;
    searchManagerOptionDisabled = await this.getElement(
      this.searchManagerOptionDisabled,
    );
    searchCoachOptionDisabled = await this.getElement(
      this.searchCoachOptionDisabled,
    );
    confirmTeamOfficialsBtn = await this.getElement(
      this.confirmTeamOfficialsBtn,
    );
    await this.waitUntilVisibleWithRetry(this.managerHeading);
    await this.assertElementDisplayed(this.managerHeading);
    await this.assertElementNotDisplayed(this.searchManagerOptionEnabled);
    await this.expectElementState(searchManagerOptionDisabled, "disabled");
    await this.assertElementDisplayed(this.coachHeading);
    await this.assertElementNotDisplayed(this.searchCoachOptionEnabled);
    await this.expectElementState(searchCoachOptionDisabled, "disabled");
    await this.expectElementState(confirmTeamOfficialsBtn, "disabled");
  }

  async searchAndSelectManager(managerName: string) {
    await this.waitUntilVisibleWithRetry(this.searchManagerOptionEnabled);
    await this.click(this.searchManagerOptionEnabled);
    await this.waitUntilVisibleWithRetry(this.searchField);
    await this.click(this.searchField);
    await this.type(this.searchField, managerName);
    await this.waitUntilVisibleWithRetry(this.searchResult(managerName));
    await this.click(this.searchResult(managerName));
  }

  async searchAndSelectCoach(coachName: string) {
    await this.waitUntilVisibleWithRetry(this.searchCoachOptionEnabled);
    await this.click(this.searchCoachOptionEnabled);
    await this.waitUntilVisibleWithRetry(this.searchField);
    await this.click(this.searchField);
    await this.type(this.searchField, coachName);
    await this.waitUntilVisibleWithRetry(this.searchResult(coachName));
    await this.click(this.searchResult(coachName));
  }

  async clickConfirmTeamOfficials() {
    await this.waitUntilVisibleWithRetry(this.confirmTeamOfficialsBtn);
    await this.click(this.confirmTeamOfficialsBtn);
  }

  async validateSelectedRolesUsers(manager: string, coach: string) {
    await this.waitUntilVisibleWithRetry(this.managerHeading);
    await this.assertElementDisplayed(this.selectedRoleUser(manager));
    await this.assertElementDisplayed(this.selectedRoleUser(coach));
  }

  async teamSheetNotAvailableForTeam() {
    await this.waitUntilVisibleWithRetry(this.teamOfficialsNotAvailableForTeam);
    await this.assertElementDisplayed(this.teamOfficialsNotAvailableForTeam);
  }
}
