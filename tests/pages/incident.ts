import { App } from "../config/apps";
import { TeamsInTeamSheet } from "../data/teamSheet.data";
import { selector } from "../factories/page.factory";
import BasePage from "./base.page";

export class IncidentPage extends BasePage {
  private reportIncidentOption = selector(
    "~Report Incident",
    "~Report Incident",
    "Report Incident option in Match",
  );

  // private reportOtherIncidentOption = selector(
  //   "~Report Other Incident",
  //   "~Report Other Incident",
  //   "Report Other Incident in Match Game Settings",
  // );
  private reportOtherIncidentOption = selector(
    `~${App.reportIncidentTitle.title}`,
    `~${App.reportIncidentTitle.title}`,
    `${App.reportIncidentTitle.title} in Match Game Settings`,
  );

  private incidentTypHeading = selector(
    "~Incident Type",
    "~Incident Type",
    "Incident Type heading after opening Report Incident",
  );

  private otherOption = selector(
    "~Other",
    "~Other",
    "Other option in Incident Type",
  );

  private refereeReport = selector(
    "~Referee Report",
    "~Referee Report",
    "Referee Report option in Incident Type",
  );

  private teamInIncidentType = (teamName: string) =>
    selector(
      `//android.widget.Button[@content-desc="${teamName}"]`,
      "",
      "Team Name in Incident Type",
    );

  private NextBtn = selector("~Next", "~Next", "Next button in Incident Type");

  private selectATeamHeading = selector(
    "~Select a Team",
    "~Select a Team",
    "Select a Team heading in Incident Type after selecting Other",
  );

  private incidentHeadingAfterTeamSelection = selector(
    "~Incident",
    "~Incident",
    "Incident heading after selecting team and clicking Next",
  );

  private descriptionField = selector(
    'android=new UiSelector().className("android.widget.EditText")',
    "",
    "Description field in Incident",
  );

  private sendIncidentReportBtn = selector(
    "~Send Incident Report",
    "~Send Incident Report",
    "Send Incident Report button",
  );

  private selectRole = selector(
    '//android.widget.TextView[@text="Other"]',
    "",
    "Roles container in Referee Report",
  );

  private fullNameField = selector(
    '(//android.widget.TextView[@text="Full Name"])[3]',
    "",
    "Full Name field in Referee Report",
  );

  private redCard = selector(
    '//android.widget.TextView[@text="RC - Red card"]',
    "",
    "Red Card option in Send Off Charge in Referee Report",
  );

  async assertReportOtherIncidentOption() {
    await this.waitUntilVisibleWithRetry(this.reportOtherIncidentOption);
    await this.assertElementDisplayed(this.reportOtherIncidentOption);
  }

  async reportOtherIncident() {
    await this.waitUntilVisibleWithRetry(this.reportOtherIncidentOption);
    await this.click(this.reportOtherIncidentOption);
    await this.waitUntilVisibleWithRetry(this.incidentTypHeading);
    await this.waitUntilVisibleWithRetry(this.otherOption);
    await this.click(this.otherOption);
    await this.scrollUntilElementVisible(
      this.teamInIncidentType(TeamsInTeamSheet.Awayteam),
    );
    await this.click(this.teamInIncidentType(TeamsInTeamSheet.Awayteam));
    await this.click(this.NextBtn);
    await this.waitUntilVisibleWithRetry(this.sendIncidentReportBtn);
    await this.click(this.sendIncidentReportBtn);
    await this.waitUntilVisibleWithRetry(this.reportOtherIncidentOption);
  }

  async submitOtherIncidentReportWithDescription(description: string) {
    await this.waitUntilVisibleWithRetry(this.reportOtherIncidentOption);
    await this.click(this.reportOtherIncidentOption);
    await this.waitUntilVisibleWithRetry(this.incidentTypHeading);
    await this.assertElementDisplayed(this.incidentTypHeading);
    await this.waitUntilVisibleWithRetry(this.otherOption);
    await this.click(this.otherOption);
    await this.scrollUntilElementVisible(this.selectATeamHeading);
    await this.assertElementDisplayed(this.selectATeamHeading);
    await this.click(this.teamInIncidentType(TeamsInTeamSheet.Awayteam));
    await this.click(this.NextBtn);
    await this.waitUntilVisibleWithRetry(
      this.incidentHeadingAfterTeamSelection,
    );
    await this.assertElementDisplayed(this.incidentHeadingAfterTeamSelection);
    await this.click(this.descriptionField);
    await this.type(this.descriptionField, description);
    await this.click(this.sendIncidentReportBtn);
    await this.waitUntilVisibleWithRetry(this.reportOtherIncidentOption);
    await this.assertElementDisplayed(this.reportOtherIncidentOption);
  }

  async submitRefereeReport() {
    await this.waitUntilVisibleWithRetry(this.reportIncidentOption);
    await this.click(this.reportIncidentOption);
    await this.waitUntilVisibleWithRetry(this.incidentTypHeading);
    await this.waitUntilVisibleWithRetry(this.refereeReport);
    await this.click(this.refereeReport);
    await this.scrollUntilElementVisible(
      this.teamInIncidentType(TeamsInTeamSheet.Awayteam),
    );
    await this.click(this.teamInIncidentType(TeamsInTeamSheet.Awayteam));
    await this.click(this.NextBtn);
    await this.waitUntilVisibleWithRetry(this.refereeReport);
    await this.click(this.refereeReport);
    await this.scrollUntilElementVisible(this.selectRole);
  }
}
