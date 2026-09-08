import { LoginPage } from "./login.page";
import { selector } from "../factories/page.factory";

export class NotificationsPage extends LoginPage {
  public emptyNotificationsMessage = selector(
    'android=new UiSelector().description("You don\'t have any notifications.")',
    '-ios predicate string: name == "You don\'t have any notifications."',
    "Empty notifications state message",
  );

  public tryAgainButton = selector(
    "~Try again",
    "~Try again",
    "Try again button in empty notifications state",
  );

  public clearAllButton = selector(
    "~Clear All",
    "~Clear All",
    "Clear All button on Notifications tab",
  );

  public confirmClearAllButton = selector(
    "~Yes",
    "~Yes",
    "Yes button in Clear All Notifications confirmation dialog",
  );

  public allNotificationCards = selector(
    'android=new UiSelector().descriptionContains("has been changed by the competition organiser")',
    '-ios predicate string: name CONTAINS "has been changed by the competition organiser"',
    "All notification cards",
  );

  public notificationCard = (index: number = 0) =>
    selector(
      `android=new UiSelector().descriptionContains("has been changed by the competition organiser").instance(${index})`,
      `(//XCUIElementTypeOther[contains(@name, "has been changed by the competition organiser")])[${index + 1}]`,
      `Notification card at index ${index}`,
    );

  public clearNotificationButton = (index: number = 0) =>
    selector(
      `android=new UiSelector().description("Clear").instance(${index})`,
      `(//XCUIElementTypeButton[@name="Clear"])[${index + 1}]`,
      `Clear button for notification at index ${index}`,
    );

  async assertEmptyNotificationsState() {
    await this.waitUntilVisibleWithRetry(this.emptyNotificationsMessage);
    await this.assertElementDisplayed(this.emptyNotificationsMessage);
    await this.assertElementDisplayed(this.tryAgainButton);
  }

  async clearAllNotifications() {
    await this.click(this.clearAllButton);
    await this.waitUntilVisibleWithRetry(this.confirmClearAllButton);
    await this.click(this.confirmClearAllButton);
  }

  async clearAllNotificationsIfPresent() {
    const hasClearAll = await this.isElementVisible(this.clearAllButton, 5000);
    if (hasClearAll) {
      await this.clearAllNotifications();
    }
  }
}
