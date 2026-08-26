import { MessagesData } from "../data/messages";
import { selector } from "../factories/page.factory";
import { HomePage } from "../pages/home.page";

export class MessagesPage extends HomePage {
  private chatInMessagesTab = (chatName: string) =>
    selector(
      `//android.view.View[contains(@content-desc,"${chatName}")]`,
      "",
      "Chat In Messages",
    );

  private imageSentInChat = selector(
    '//android.widget.ImageView[contains(@content-desc,"Picture")]/android.widget.ImageView',
    "",
    "Image sent in chat in automation group 1",
  );

  private saveBtn = selector(
    "~Save",
    "~Save",
    "Save button for downloading Image",
  );

  private loadingIcon = selector(
    '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[2]',
    "",
    "Loading icon in center of the page",
  );

  private emptyChatString = selector(
    '//android.view.View[@content-desc="You don’t have any messages yet"]',
    "",
    "Empty Chat string",
  );

  private messageField = selector(
    "//android.widget.EditText",
    "",
    "Message text field",
  );

  private sendMessageBtn = selector(
    '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[4]',
    "",
    "Send message button",
  );

  async verifyMessagesTabChats(chats: number = 1) {
    if (chats == 1) {
      await this.waitUntilVisibleWithRetry(
        this.chatInMessagesTab(MessagesData.emptyChat),
      );
      await this.assertElementDisplayed(
        this.chatInMessagesTab(MessagesData.emptyChat),
      );
    }
    if (chats == 2) {
      await this.waitUntilVisibleWithRetry(
        this.chatInMessagesTab(MessagesData.chatWithImage),
      );
      await this.assertElementDisplayed(
        this.chatInMessagesTab(MessagesData.emptyChat),
      );
      await this.assertElementDisplayed(
        this.chatInMessagesTab(MessagesData.chatWithImage),
      );
    }
  }

  async assertEmptyChat() {
    await this.waitUntilVisibleWithRetry(
      this.chatInMessagesTab(MessagesData.emptyChat),
    );
    await this.click(this.chatInMessagesTab(MessagesData.emptyChat));
    await this.waitUntilVisibleWithRetry(this.messageField);
    await this.assertElementDisplayed(this.emptyChatString);
    await this.clickBackBtn();
  }

  async sendMessage() {
    await this.waitUntilVisibleWithRetry(
      this.chatInMessagesTab(MessagesData.chatToSendMessage),
    );
    await this.click(this.chatInMessagesTab(MessagesData.chatToSendMessage));
    await this.waitUntilVisibleWithRetry(this.messageField);
    await this.click(this.messageField);
    await this.type(this.messageField, MessagesData.messageBody);
    await this.waitUntilVisibleWithRetry(this.sendMessageBtn);
    await this.click(this.sendMessageBtn);
    await this.waitUntilInvisibleWithRetry(this.sendMessageBtn);
    await this.clickBackBtn();
  }

  async downloadImageSentFromChat() {
    await this.waitUntilVisibleWithRetry(
      this.chatInMessagesTab(MessagesData.chatWithImage),
    );
    await this.click(this.chatInMessagesTab(MessagesData.chatWithImage));
    await this.waitUntilVisibleWithRetry(this.imageSentInChat);
    await this.click(this.imageSentInChat);
    const isImageOpened = await this.isElementVisible(this.saveBtn, 15000);
    if (isImageOpened) {
      console.log("image is opened");
      await this.waitUntilVisibleWithRetry(this.saveBtn);
      await this.click(this.saveBtn);
      await this.waitUntilVisibleWithRetry(this.loadingIcon);
      await this.waitUntilInvisibleWithRetry(this.loadingIcon);
      await this.clickBackBtn();
      await this.clickBackBtn();
    } else {
      console.log("image is NOT  opened");
      await this.click(this.imageSentInChat);
      await this.waitUntilVisibleWithRetry(this.saveBtn);
      await this.click(this.saveBtn);
      await this.waitUntilVisibleWithRetry(this.loadingIcon);
      await this.waitUntilInvisibleWithRetry(this.loadingIcon);
      await this.clickBackBtn();
      await this.clickBackBtn();
    }
  }
}
