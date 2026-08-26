import allureReporter from "@wdio/allure-reporter";
import { step } from "../../utils/helpers";
import { LoginData } from "../../data/login.data";
import { MessagesPage } from "../../pages/messages";

describe("Communication tests", () => {
  const messagesPage = new MessagesPage();

  it("Conversation List Loads on Messages Tab", async () => {
    allureReporter.addFeature("Communication Tests");
    allureReporter.addStory("Login, open Messages tab, validate elements");
    allureReporter.addSeverity("critical");

    await step("[TC-M1] Member signs in and lands on Home", async () => {
      await messagesPage.loginFlow(LoginData.manager1Email, LoginData.password);
      await messagesPage.gotoMessagesTab();
      await messagesPage.verifyMessagesTabChats(2);
    });
  });

  it("Empty message thread, Send Message, Member opens or downloads a message attachment in each app flavour", async () => {
    allureReporter.addFeature("Communication Tests");
    allureReporter.addStory("send a messgae");
    allureReporter.addSeverity("critical");

    await step("send a message in chat", async () => {
      await messagesPage.assertEmptyChat();
      await messagesPage.sendMessage();
      await messagesPage.downloadImageSentFromChat();
    });
  });
});
