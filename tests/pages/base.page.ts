import { $, browser, expect } from "@wdio/globals";
import { getPlatform } from "../factories/selector.factory";
import type { DualSelector } from "../factories/page.factory";
import Logger from "../utils/logger";
import { Timeout } from "../utils/timers";

export default class BasePage {
  private readonly iosNotificationPopupText =
    '(//XCUIElementTypeStaticText[contains(@name,"Please allow notifications")])[1]';
  private readonly iosNotificationOkButton =
    '(//XCUIElementTypeStaticText[contains(@name, "notifications")])[2]';
  async resolve(selector: DualSelector) {
    const platform = await getPlatform();
    return $(platform === "android" ? selector.android : selector.ios);
  }

  async resolveSelectorObjToString(selectorObj: any): Promise<string> {
    if (!selectorObj) {
      throw new Error("Selector object is undefined");
    }

    if (driver.isAndroid) {
      if (!selectorObj.android) {
        throw new Error("Android selector missing");
      }
      return selectorObj.android;
    }

    if (driver.isIOS) {
      if (!selectorObj.ios) {
        throw new Error("iOS selector missing");
      }
      return selectorObj.ios;
    }

    throw new Error("Unknown platform");
  }

  async getElement(
    selector: DualSelector,
    options?: { wait?: boolean; timeout?: number },
  ) {
    const { wait = true, timeout = Timeout.ONE_SECOND } = options || {};

    Logger.info(`Getting element: ${selector.log}`);

    const element = await this.resolve(selector);

    if (wait) {
      await element.waitForExist({ timeout });
    }

    return element;
  }

  async assertElementDisplayed(selector: DualSelector): Promise<void> {
    Logger.info(`Checking visibility of element: ${selector.log}`);
    const element = await this.resolve(selector);
    const visible = await element.isDisplayed();
    expect(visible).toBe(true);
  }

  async assertElementNotDisplayed(selector: DualSelector): Promise<void> {
    Logger.info(`Checking visibility of element: ${selector.log}`);
    const element = await this.resolve(selector);
    const visible = await element.isDisplayed();
    expect(visible).not.toBe(true);
  }
  async waitUntilVisible(
    selector: DualSelector,
    timeout: number = Timeout.THREE_SECONDS,
  ) {
    try {
      Logger.info(`Waiting for element ${selector.log} to be visible`);

      const element = await this.resolve(selector);

      await element.waitForDisplayed({
        timeout: timeout,
      });

      Logger.info("Element visible");
      return element;
    } catch (error) {
      throw new Error(
        `Element not visible after waiting for ${timeout}ms: ${error}`,
      );
    }
  }

  async waitUntilVisibleWithRetry(
    selector: DualSelector,
    maxAttempts: number = 20,
    restTime: number = Timeout.THREE_SECONDS,
  ) {
    let attempt = 1;

    while (attempt <= maxAttempts) {
      try {
        Logger.info(
          `[Attempt ${attempt}] waiting for element ${selector.log} to be visible`,
        );

        const element = await this.resolve(selector);

        await element.waitForDisplayed({
          timeout: restTime,
        });

        Logger.info("Element visible");
        return element;
      } catch (error) {
        Logger.info(`Attempt ${attempt} failed. Element not visible yet`);

        await browser.pause(restTime);
        attempt++;
      }
    }

    throw new Error(`Element not visible after ${maxAttempts} attempts`);
  }

  async waitUntilInvisibleWithRetry(
    selector: DualSelector,
    maxAttempts: number = 10,
    restTime: number = Timeout.ONE_SECOND,
    minTotalWait: number = Timeout.SIX_SECONDS,
  ) {
    let attempt = 1;
    const startTime = Date.now();

    while (attempt <= maxAttempts) {
      try {
        Logger.info(`[Attempt ${attempt}] waiting for element to be invisible`);

        const element = await this.resolve(selector);

        await element.waitForDisplayed({
          reverse: true,
          timeout: restTime,
        });

        const totalElapsed = Date.now() - startTime;

        if (totalElapsed < minTotalWait) {
          const remaining = minTotalWait - totalElapsed;
          Logger.info(
            `Element disappeared early. Waiting extra ${remaining}ms`,
          );
          await browser.pause(remaining);
        }

        Logger.info("Element confirmed invisible");
        return true;
      } catch (error) {
        Logger.info(`Attempt ${attempt} failed. Element still visible`);
      }

      await browser.pause(restTime);
      attempt++;
    }

    throw new Error(`Element still visible after ${maxAttempts} attempts`);
  }

  async click(selector: DualSelector) {
    Logger.info(`Clicking element: ${selector.log}`);
    const element = await this.waitUntilVisibleWithRetry(selector);

    await element.click();
  }

  async type(selector: DualSelector, value: string) {
    Logger.info(`Typing text into element: ${selector.log}`);
    const element = await this.getElement(selector);
    await element.setValue(value);
  }
  async assertTextContains(selector: DualSelector, expected: string) {
    const element = await this.resolve(selector);
    const text = driver.isAndroid
      ? await element.getAttribute("content-desc")
      : await element.getText();
    Logger.info(`Element text/content-desc: "${text}"`);
    expect(text).toContain(expected);
  }
  async expectElementState(element: any, state: any) {
    await browser.waitUntil(
      async () => {
        if (driver.isIOS) {
          const enabled = await element.getAttribute("enabled");

          if (state === "enabled") {
            return enabled === "true";
          }

          return enabled === "false";
        }
        const clickable = await element.getAttribute("clickable");
        const enabled = await element.getAttribute("enabled");

        if (state === "enabled") {
          return clickable === "true" && enabled === "true";
        }

        return clickable === "false";
      },
      {
        timeout: Timeout.FIVE_SECONDS,
        timeoutMsg: `Element did not become ${state}`,
      },
    );
  }
  async getText(selector: DualSelector): Promise<string> {
    const element = await this.resolve(selector);
    const text = await element.getText();
    Logger.info(`Element text/content-desc: "${text}"`);
    return text;
  }

  async pause(ms: number) {
    await browser.pause(ms);
  }

  async getElementText(selector: DualSelector): Promise<any> {
    const element = await this.resolve(selector);
    const text = driver.isAndroid
      ? await element.getAttribute("content-desc")
      : await element.getText();
    Logger.info(`Element text/content-desc: "${text}"`);
    return text;
  }

    async scrollDown(
        startXPercent: number = 0.5,
        startYPercent: number = 0.5,
        endYPercent: number = 0.1,
        duration: number = 500
    ): Promise<void> {
        const { height, width } = await driver.getWindowRect();

        const startX = Math.floor(width * startXPercent);
        const startY = Math.floor(height * startYPercent);
        const endY = Math.floor(height * endYPercent);

        await driver.execute("mobile: swipeGesture", {
            left: startX - 5,
            top: endY,
            width: 10,
            height: startY - endY,
            direction: "up",
            percent: 1.0,
            speed: duration * 5,
        });
    }
  async scrollUntilElementVisible(selector: DualSelector) {
    const platform = await getPlatform();
    let element;

    if (platform === "android") {
      // Remove "android=" from your selector before using in UiScrollable
      const uiSelector = selector.android.replace(/^android=/, "");

      element = await $(
        `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(${uiSelector})`,
      );
    } else {
      // iOS scroll
      element = await this.resolve(selector);
      let attempts = 0;
      while (!(await element.isDisplayed()) && attempts < 5) {
        await driver.execute("mobile: scroll", { direction: "down" });
        attempts++;
      }
    }
  }
  async handleIOSNotificationPrePrompt() {
    if (!driver.isIOS) return;
    Logger.info("Handling IOS Notification PrePrompt");
    const isVisible = await $(this.iosNotificationPopupText)
      .waitForDisplayed({ timeout: 10000 })
      .catch(() => false);

    if (isVisible) {
      await $(this.iosNotificationOkButton).click();
      await this.pause(Timeout.THREE_SECONDS);
      await this.scrollDown();
    }
  }

  async scrollToElementHorizontal(
    container: DualSelector,
    direction: "left" | "right" = "right",
  ) {
    const selectorStr = driver.isAndroid ? container.android : container.ios;
    const element = await $(selectorStr);

    // Get the exact location and size of your scrollable container
    const { x, y } = await element.getLocation();
    const size = await element.getSize();

    // Define 20% horizontal padding to avoid the screen edges
    const paddingX = size.width * 0.2;
    const centerY = y + size.height / 2;

    let startX, endX;

    if (direction === "right") {
      // To see content on the right, swipe from right-to-left
      startX = x + size.width - paddingX; // 80% mark
      endX = x + paddingX; // 20% mark
    } else {
      // To see content on the left, swipe from left-to-right
      startX = x + paddingX; // 20% mark
      endX = x + size.width - paddingX; // 80% mark
    }

    // Execute the manual swipe via W3C Actions
    await driver.performActions([
      {
        type: "pointer",
        id: "finger1",
        parameters: { pointerType: "touch" },
        actions: [
          {
            type: "pointerMove",
            duration: 0,
            x: Math.floor(startX),
            y: Math.floor(centerY),
          },
          { type: "pointerDown", button: 0 },
          {
            type: "pointerMove",
            duration: 1000,
            x: Math.floor(endX),
            y: Math.floor(centerY),
          },
          { type: "pointerUp", button: 0 },
        ],
      },
    ]);

    await driver.pause(500); // Allow UI to settle
  }

  async isElementPresent(
    selector: DualSelector,
    timeout: number = 1000,
  ): Promise<boolean> {
    try {
      Logger.info(`Checking if element is present: ${selector.log}`);
      const element = await this.resolve(selector);
      await element.waitForExist({ timeout });
      Logger.info(`Element found: ${selector.log}`);
      return true;
    } catch (error) {
      Logger.info(`Element not found: ${selector.log}`);
      return false;
    }
  }
}
