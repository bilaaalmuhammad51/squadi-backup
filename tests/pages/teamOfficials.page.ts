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

  private searchManagerOption = selector(
    'android=new UiSelector().className("android.widget.EditText").instance(0)',
    '-ios class chain:**/XCUIElementTypeTextField[`name == "Search for someone..."`][1]',
    "Search Manager option under Manager heading in Team Officials",
  );

  private coachHeading = selector(
    "~Coach",
    "~Coach",
    "Coach heading in Team Officials",
  );

  private searchCoachOption = selector(
    'android=new UiSelector().className("android.widget.EditText").instance(1)',
    '-ios class chain:**/XCUIElementTypeTextField[`name == "Search for someone..."`]',
    "Search Coach option under Coach heading in Team Officials",
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

  async assertTeamOfficialsScreenElements() {
    await this.waitUntilVisibleWithRetry(this.managerHeading);
    await this.assertElementDisplayed(this.managerHeading);
    await this.assertElementDisplayed(this.searchManagerOption);
    await this.assertElementDisplayed(this.coachHeading);
    await this.assertElementDisplayed(this.searchCoachOption);
  }

  async searchAndSelectManager(managerName: string) {
    await this.waitUntilVisibleWithRetry(this.searchManagerOption);
    await this.click(this.searchManagerOption);
    await this.waitUntilVisibleWithRetry(this.searchField);
    await this.click(this.searchField);
    await this.type(this.searchField, managerName);
    await this.waitUntilVisibleWithRetry(this.searchResult(managerName));
    await this.click(this.searchResult(managerName));
  }

  async searchAndSelectCoach(coachName: string) {
    await this.waitUntilVisibleWithRetry(this.searchCoachOption);
    await this.click(this.searchCoachOption);
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
