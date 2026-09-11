import allureReporter from "@wdio/allure-reporter";
import { step } from "../../utils/helpers";
import { LoginData } from "../../data/login.data";
import { HomePage } from "../../pages/home.page";
import { NotificationsPage } from "../../pages/notifications.page";
import { MatchApiHelper } from "../../utils/matchApi.helper";

let matchId: number;
let token: string;

describe("Communication - Notifications", () => {
  const homePage = new HomePage();
  const notificationsPage = new NotificationsPage();

  it("[NOTIF-002] Empty notification list shows the 'All clear' card", async () => {
    allureReporter.addFeature("Communication");
    allureReporter.addStory(
      "Empty notification list shows the 'All clear' card",
    );
    allureReporter.addSeverity("normal");

    await step("Sign in as a member with no notifications", async () => {
      await homePage.loginFlow(LoginData.email, LoginData.password);
      await homePage.gotoNotificationsTab();
      await notificationsPage.clearAllNotificationsIfPresent();
    });

    await step("Observe the empty state", async () => {
      await notificationsPage.assertEmptyNotificationsState();
    });
  });

  it("[NOTIF-003] Member dismisses a notification via X and clears all notifications", async () => {
    allureReporter.addFeature("Communication");
    allureReporter.addStory(
      "Member dismisses a notification via X and clears all notifications",
    );
    allureReporter.addSeverity("normal");

    await step(
      "Create a match and edit its time twice to generate notifications",
      async () => {
        token = await MatchApiHelper.getToken(
          LoginData.email,
          LoginData.password,
        );

        matchId = await MatchApiHelper.createMatch(token, 30);
        await homePage.click(homePage.updatesOptionInMoreTab);
        await MatchApiHelper.updateMatchStartTime(token, matchId, 35);
        await homePage.click(homePage.updatesOptionInMoreTab);
        await MatchApiHelper.updateMatchStartTime(token, matchId, 40);

        console.log("Created Match ID for notifications:", matchId);
        allureReporter.addAttachment("Match ID", String(matchId), "text/plain");
      },
    );

    after(async () => {
      try {
        if (token && matchId) {
          await MatchApiHelper.deleteMatch(token, matchId);
          console.log(`Deleted Match ID: ${matchId}`);
        }
      } catch (error) {
        console.error("Failed to delete match:", error);
      }
    });

    await step(
      "Sign in as a member and open Updates > Notifications",
      async () => {
        await homePage.clickCloseCrossBtn();
        await homePage.gotoNotificationsTab();
      },
    );

    await step("Wait for at least 2 notifications to appear", async () => {
      await notificationsPage.waitUntilVisibleWithRetry(
        notificationsPage.notificationCard(0),
      );
      await notificationsPage.waitUntilVisibleWithRetry(
        notificationsPage.notificationCard(1),
      );
    });

    await step("Tap the X on a single notification", async () => {
      const countBefore = await notificationsPage.getElementsCount(
        notificationsPage.allNotificationCards,
      );

      await notificationsPage.click(
        notificationsPage.clearNotificationButton(0),
      );

      await browser.waitUntil(
        async () =>
          (await notificationsPage.getElementsCount(
            notificationsPage.allNotificationCards,
          )) ===
          countBefore - 1,
        { timeout: 10000, timeoutMsg: "Notification was not removed" },
      );
    });

    await step(
      "Observe the list: that notification is removed, the others remain",
      async () => {
        await notificationsPage.assertElementDisplayed(
          notificationsPage.notificationCard(0),
        );
      },
    );

    await step("Tap Clear All and confirm in the dialog", async () => {
      await notificationsPage.clearAllNotifications();
    });

    await step(
      "Observe the list: all notifications removed, empty state shown",
      async () => {
        await notificationsPage.assertEmptyNotificationsState();
      },
    );
  });
});
