import { AssertionError } from "node:assert";
import { $, browser, expect } from "@wdio/globals";
import { getPlatform } from "../factories/selector.factory";
import { selector, type DualSelector } from "../factories/page.factory";
import Logger from "../utils/logger";
import { Timeout } from "../utils/timers";

export default class BasePage {
  private readonly iosNotificationPopupText =
    '(//XCUIElementTypeStaticText[contains(@name,"Please allow notifications")])[1]';
  private readonly iosNotificationOkButton =
    '(//XCUIElementTypeStaticText[contains(@name, "notifications")])[2]';

  private readonly skipBtnInFirstStartupPage = selector(
    "~Skip",
    "~Skip",
    "Skip button in first startup page",
  );
  private readonly GotitBtnInSecondStartupPage = selector(
    "~Got it",
    "~Got it",
    "Got it button in second startup page",
  );
  private readonly noThanksBtnInThirdStartupPage = selector(
    "~No thanks",
    "~No thanks",
    "No thanks button in third startup page",
  );

  public doneBtn = selector("~Done", "~Done", "Done Button");

  public backBtn = selector("~Back", "~Back", "Back Button");

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

    // Throw an AssertionError whose message contains "expect" - the Allure
    // reporter classifies a test as "failed" (vs "broken") only when the error
    // message starts with "assertionerror" or includes "expect"; the error
    // type alone is not enough.
    throw new AssertionError({
      message: `Expected element ${selector.log} to be visible, but it was not after ${maxAttempts} attempts`,
    });
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

  async isElementVisible(
    selector: DualSelector,
    timeout = 5000,
  ): Promise<boolean> {
    try {
      const element = await this.resolve(selector);

      await element.waitForDisplayed({
        timeout,
      });

      return true;
    } catch {
      return false;
    }
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

  async assertSwitchState(selector: DualSelector, checked: boolean) {
    Logger.info(
      `Asserting ${selector.log} is ${checked ? "checked" : "unchecked"}`,
    );

    const element = await this.resolve(selector);

    const actual = (await element.getAttribute("checked")) === "true";

    expect(actual).toBe(checked);
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

  async waitUntilElementEnabledState(
    selector: DualSelector,
    enabled: boolean,
    timeout: number = Timeout.FIVE_SECONDS,
  ) {
    Logger.info(
      `Waiting for element ${selector.log} to become ${enabled ? "enabled" : "disabled"}`,
    );

    const element = await this.resolve(selector);

    await browser.waitUntil(
      async () => {
        const isEnabled = await element.isEnabled();
        return isEnabled === enabled;
      },
      {
        timeout,
        timeoutMsg: `Element ${selector.log} did not become ${
          enabled ? "enabled" : "disabled"
        } within ${timeout}ms`,
      },
    );

    Logger.info(
      `Element ${selector.log} is now ${enabled ? "enabled" : "disabled"}`,
    );

    return element;
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
    duration: number = 500,
  ): Promise<void> {
    const { height, width } = await driver.getWindowRect();

    const startX = Math.floor(width * startXPercent);
    const endY = Math.floor(height * endYPercent);
    let startY = Math.floor(height * startYPercent);

    if (driver.isIOS) {
      // If keyboard is open, clamp startY to above it
      // This prevents the scroll gesture from starting inside the keyboard
      const keyboardTopY = await this.getKeyboardTopY();
      if (keyboardTopY !== null) {
        startY = Math.min(startY, keyboardTopY - 50);
      }

      // Use performActions directly — does NOT call DELETE /actions (unlike driver.action().perform())
      // so it works on BrowserStack iOS without the "resource not found" error
      await driver.performActions([
        {
          type: "pointer",
          id: "finger1",
          parameters: { pointerType: "touch" },
          actions: [
            { type: "pointerMove", duration: 0, x: startX, y: startY },
            { type: "pointerDown", button: 0 },
            { type: "pause", duration: 200 },
            { type: "pointerMove", duration: duration, x: startX, y: endY },
            { type: "pointerUp", button: 0 },
          ],
        },
      ]);
      // deliberately NOT calling driver.releaseActions() — it triggers
      // DELETE /actions which BrowserStack iOS does not support
    } else {
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
  }

  private async getKeyboardTopY(): Promise<number | null> {
    try {
      const kbd = await driver.$(
        '-ios predicate string:type == "XCUIElementTypeKeyboard"',
      );
      if (await kbd.isExisting()) {
        return (await kbd.getLocation()).y;
      }
    } catch {}
    return null;
  }

  async scrollUntilElementVisible(
    selector: DualSelector,
    options: {
      maxScrolls?: number;
      direction?: "down" | "up";
      scrollableSelector?: string; // optional anchor for the scroll container
    } = {},
  ) {
    const { maxScrolls = 15, direction = "down", scrollableSelector } = options;
    const platform = await getPlatform();

    // Helper: check if element exists AND is displayed, without throwing
    const isElementVisible = async (): Promise<boolean> => {
      try {
        const el = await this.resolve(selector);
        if (!el || !(await el.isExisting())) return false;
        return await el.isDisplayed();
      } catch {
        return false;
      }
    };

    // Quick exit if already visible
    if (await isElementVisible()) {
      return await this.resolve(selector);
    }

    if (platform === "android") {
      let uiSelector: string;

      if (selector.android.startsWith("android=")) {
        uiSelector = selector.android.replace(/^android=/, "");
      } else if (selector.android.startsWith("~")) {
        const desc = selector.android.substring(1);
        uiSelector = `new UiSelector().description("${desc}")`;
      } else {
        // Can't build a UiSelector from this locator
        return await this.manualScroll(
          selector,
          maxScrolls,
          direction,
          isElementVisible,
        );
      }

      // Try each scrollable container until one works
      const scrollableContainers = [
        "new UiSelector().scrollable(true).instance(0)",
        "new UiSelector().scrollable(true).instance(1)",
        'new UiSelector().className("androidx.recyclerview.widget.RecyclerView")',
        'new UiSelector().className("android.widget.ScrollView")',
      ];

      for (const container of scrollableContainers) {
        try {
          const element = await $(
            `android=new UiScrollable(${container})` +
              `.setMaxSearchSwipes(${maxScrolls})` +
              `.scrollIntoView(${uiSelector})`,
          );
          if (await element.isExisting()) {
            // Confirm it's actually on screen
            if (await element.isDisplayed()) return element;
          }
        } catch {
          // try next container
        }
      }

      // Fallback: manual swipe loop
      return await this.manualScroll(
        selector,
        maxScrolls,
        direction,
        isElementVisible,
      );
    } else {
      // iOS: prefer mobile: scroll with element anchor when we know the container,
      // otherwise use a manual swipe loop with bounds checking.
      let attempts = 0;
      let lastPageSource = "";

      while (attempts < maxScrolls) {
        if (await isElementVisible()) {
          return await this.resolve(selector);
        }

        // Detect "stuck" — if page source didn't change, we hit the end
        const currentSource = await driver.getPageSource();
        if (currentSource === lastPageSource && attempts > 0) {
          // Try the opposite direction once before giving up
          if (direction === "down") {
            await this.iosSwipe("up");
            if (await isElementVisible()) return await this.resolve(selector);
          }
          break;
        }
        lastPageSource = currentSource;

        await this.iosSwipe(direction);
        attempts++;
      }

      throw new Error(
        `Element not visible after ${attempts} scrolls: ${JSON.stringify(selector)}`,
      );
    }
  }

  // Helper: manual swipe-based scroll (works on both platforms but used as Android fallback)
  private async manualScroll(
    selector: DualSelector,
    maxScrolls: number,
    direction: "down" | "up",
    isElementVisible: () => Promise<boolean>,
  ) {
    let attempts = 0;
    while (attempts < maxScrolls) {
      if (await isElementVisible()) return await this.resolve(selector);
      await this.iosSwipe(direction); // works on Android too via W3C actions
      attempts++;
    }
    throw new Error(
      `Element ${selector.name} not visible after ${maxScrolls} manual scrolls`,
    );
  }

  // Reliable swipe using W3C actions — works on both platforms, no overshoot
  private async iosSwipe(direction: "up" | "down") {
    const { width, height } = await driver.getWindowRect();
    const startX = Math.floor(width / 2);
    // Use 70% / 30% (not 90% / 10%) to avoid system gesture areas and overshooting
    const startY =
      direction === "down"
        ? Math.floor(height * 0.7)
        : Math.floor(height * 0.3);
    const endY =
      direction === "down"
        ? Math.floor(height * 0.3)
        : Math.floor(height * 0.7);

    await driver.performActions([
      {
        type: "pointer",
        id: "finger1",
        parameters: { pointerType: "touch" },
        actions: [
          { type: "pointerMove", duration: 0, x: startX, y: startY },
          { type: "pointerDown", button: 0 },
          { type: "pause", duration: 100 },
          { type: "pointerMove", duration: 600, x: startX, y: endY }, // slower = more reliable
          { type: "pointerUp", button: 0 },
        ],
      },
    ]);
    await driver.releaseActions();
    await driver.pause(400); // let momentum settle before next check
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

  async handleStartupScreens() {
    // The onboarding screen can be slow to render on CI runners. Try the
    // accessibility-id Skip first; if it isn't found, fall back to a text
    // locator. Click the element we actually found (instead of re-resolving via
    // click(), which would re-run the long waitUntilVisibleWithRetry loop and
    // waste up to ~60s when the screen is briefly slow).
    let skip = await this.resolve(this.skipBtnInFirstStartupPage);
    let isVisible = await skip
      .waitForDisplayed({ timeout: 15000 })
      .then(() => true)
      .catch(() => false);

    if (!isVisible && driver.isAndroid) {
      const byText = await $('//*[@text="Skip"]');
      if (await byText.isDisplayed().catch(() => false)) {
        skip = byText;
        isVisible = true;
      }
    }

    if (isVisible) {
      await skip.click();
      await this.waitUntilVisible(this.GotitBtnInSecondStartupPage);
      await this.click(this.GotitBtnInSecondStartupPage);
      await this.waitUntilVisible(this.noThanksBtnInThirdStartupPage);
      await this.click(this.noThanksBtnInThirdStartupPage);
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

  async hideKeyboardSafely() {
    if (driver.isAndroid) {
      await driver.hideKeyboard();
    } else {
      await driver.performActions([
        {
          type: "pointer",
          id: "finger1",
          parameters: { pointerType: "touch" },
          actions: [
            {
              type: "pointerMove",
              duration: 0,
              x: 10,
              y: 10,
            },
            {
              type: "pointerDown",
              button: 0,
            },
            {
              type: "pointerUp",
              button: 0,
            },
          ],
        },
      ]);

      await driver.releaseActions();
    }
  }

  async clickDoneBtn() {
    await this.waitUntilVisibleWithRetry(this.doneBtn);
    await this.click(this.doneBtn);
  }

  async clickBackBtn() {
    await this.waitUntilVisibleWithRetry(this.backBtn);
    await this.click(this.backBtn);
  }
}
