import {$, browser, expect} from '@wdio/globals'
import { getPlatform } from '../factories/selector.factory'
import type { DualSelector } from '../factories/page.factory'
import Logger from '../utils/logger'
import {Timeout} from "../utils/timers";
export default class BasePage {
    async resolve(selector: DualSelector) {
        const platform = await getPlatform()
        return $(platform === 'android' ? selector.android : selector.ios)
    }
    async getElement(selector: DualSelector) {
        Logger.info(`Getting element: ${selector.name || JSON.stringify(selector)}`)

        const element = await this.resolve(selector)

        await element.waitForExist({ timeout: 10000 })

        return element
    }

    async isElementDisplayed(selector: DualSelector): Promise<void> {
        Logger.info(`Checking visibility of element: ${selector.name || 'element'}`);
        const element = await this.resolve(selector);
        const visible = await element.isDisplayed();
        expect(visible).toBe(true);
    }

    async waitUntilVisibleWithRetry(
        selector: DualSelector,
        maxAttempts: number = 50,
        restTime: number = Timeout.THREE_SECONDS
    ) {
        let attempt = 1

        while (attempt <= maxAttempts) {
            try {
                Logger.info(`[Attempt ${attempt}] waiting for element to be visible`)

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
        Logger.info(`Clicking element: ${selector.name || JSON.stringify(selector)}`)
        const element = await this.waitUntilVisibleWithRetry(selector)

        await element.click()
    }

    async type(selector: DualSelector, value: string) {
        Logger.info(`Typing text into element: ${JSON.stringify(selector)} value: ${value}`)
        const element = await this.waitUntilVisibleWithRetry(selector)
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
        state: "enabled" | "disabled"
    ) {
        await browser.waitUntil(async () => {
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
}