import {$, browser, expect} from '@wdio/globals'
import { getPlatform } from '../factories/selector.factory'
import type { DualSelector } from '../factories/page.factory'
import Logger from '../utils/logger'
import {Timeout} from "../utils/timers";
export default class BasePage {
    private readonly iosNotificationPopupText = '(//XCUIElementTypeStaticText[contains(@name,"Please allow notifications")])[1]';
    private readonly iosNotificationOkButton = '(//XCUIElementTypeStaticText[contains(@name,"Please allow notifications")])[2]';
    async resolve(selector: DualSelector) {
        const platform = await getPlatform()
        return $(platform === 'android' ? selector.android : selector.ios)
    }
    async getElement(selector: DualSelector) {
        Logger.info(`Getting element: ${selector.log}`)

        const element = await this.resolve(selector)

        await element.waitForExist({ timeout: Timeout.ONE_SECOND })

        return element
    }

    async assertElementDisplayed(selector: DualSelector): Promise<void> {
        Logger.info(`Checking visibility of element: ${selector.log}`);
        const element = await this.resolve(selector);
        const visible = await element.isDisplayed();
        expect(visible).toBe(true);
    }

    async waitUntilVisibleWithRetry(
        selector: DualSelector,
        maxAttempts: number = 20,
        restTime: number = Timeout.THREE_SECONDS
    ) {
        let attempt = 1

        while (attempt <= maxAttempts) {
            try {
                Logger.info(`[Attempt ${attempt}] waiting for element ${selector.log} to be visible`)

                const element = await this.resolve(selector)

                await element.waitForDisplayed({
                    timeout: restTime
                })

                Logger.info('Element visible')
                return element

            } catch (error) {

                Logger.info(`Attempt ${attempt} failed. Element not visible yet`)

                await browser.pause(restTime)
                attempt++
            }
        }

        throw new Error(`Element not visible after ${maxAttempts} attempts`)
    }

    async waitUntilInvisibleWithRetry(
        selector: DualSelector,
        maxAttempts: number = 10,
        restTime: number = Timeout.ONE_SECOND,
        minTotalWait: number = Timeout.SIX_SECONDS
    ) {
        let attempt = 1
        const startTime = Date.now()

        while (attempt <= maxAttempts) {
            try {
                Logger.info(`[Attempt ${attempt}] waiting for element to be invisible`)

                const element = await this.resolve(selector)

                await element.waitForDisplayed({
                    reverse: true,
                    timeout: restTime
                })

                const totalElapsed = Date.now() - startTime

                if (totalElapsed < minTotalWait) {
                    const remaining = minTotalWait - totalElapsed
                    Logger.info(`Element disappeared early. Waiting extra ${remaining}ms`)
                    await browser.pause(remaining)
                }

                Logger.info('Element confirmed invisible')
                return true

            } catch (error) {
                Logger.info(`Attempt ${attempt} failed. Element still visible`)
            }

            await browser.pause(restTime)
            attempt++
        }

        throw new Error(`Element still visible after ${maxAttempts} attempts`)

    }

    async click(selector: DualSelector) {
        Logger.info(`Clicking element: ${selector.log}`)
        const element = await this.waitUntilVisibleWithRetry(selector)

        await element.click()
    }

    async type(selector: DualSelector, value: string) {
        Logger.info(`Typing text into element: ${selector.log}`)
        const element = await this.getElement(selector)
        await element.setValue(value)
    }
    async assertTextContains(selector: DualSelector, expected: string) {
        const element = await this.resolve(selector);
        const text = driver.isAndroid
            ? await element.getAttribute('content-desc')
            : await element.getText();
        Logger.info(`Element text/content-desc: "${text}"`);
        expect(text).toContain(expected);
    }
    async expectElementState(
        element: any,
        state: any
    ) {
        await browser.waitUntil(async () => {

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

        }, {
            timeout: Timeout.FIVE_SECONDS,
            timeoutMsg: `Element did not become ${state}`
        });
    }
    async getText(selector: DualSelector):Promise<string> {
        const element = await this.resolve(selector);
        const text = await element.getText();
        Logger.info(`Element text/content-desc: "${text}"`);
        return text
    }

    async pause(ms: number) {
        await browser.pause(ms)
    }
    async scrollDown(): Promise<void> {
        const { height, width } = await driver.getWindowRect()

        const startX = Math.floor(width / 2)
        const startY = Math.floor(height * 0.5)
        const endY = Math.floor(height * 0.1)

        await driver.performActions([
            {
                type: 'pointer',
                id: 'finger1',
                parameters: { pointerType: 'touch' },
                actions: [
                    { type: 'pointerMove', duration: 0, x: startX, y: startY },
                    { type: 'pointerDown', button: 0 },
                    { type: 'pause', duration: 200 },
                    { type: 'pointerMove', duration: 500, x: startX, y: endY },
                    { type: 'pointerUp', button: 0 }
                ]
            }
        ])

        await driver.releaseActions()
    }
    async handleIOSNotificationPrePrompt() {
        if (!driver.isIOS) return;
        Logger.info("Handling IOS Notification PrePrompt")
        const isVisible = await $(this.iosNotificationPopupText)
            .waitForDisplayed({ timeout: 10000 })
            .catch(() => false);

        if (isVisible) {
            await $(this.iosNotificationOkButton).click();
            await this.pause(Timeout.THREE_SECONDS);
            await this.scrollDown();
        }
    }
}