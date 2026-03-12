import { $, browser } from '@wdio/globals'
import { getPlatform } from '../factories/selector.factory'
import type { DualSelector } from '../factories/page.factory'
import Logger from '../utils/logger'

export default class BasePage {
    async resolve(selector: DualSelector) {
        const platform = await getPlatform()
        return $(platform === 'android' ? selector.android : selector.ios)
    }
    async getElement(selector: DualSelector) {
        Logger.info(`Getting element: ${JSON.stringify(selector)}`)

        const element = await this.resolve(selector)

        await element.waitForExist({ timeout: 10000 })

        return element
    }

    async clickElement(selector: DualSelector) {
        Logger.info(`Clicking element: ${JSON.stringify(selector)}`)

        const element = await this.getElement(selector)

        await element.click()
    }

    async typeText(selector: DualSelector, value: string) {
        Logger.info(`Typing text into element: ${JSON.stringify(selector)} value: ${value}`)

        const element = await this.getElement(selector)

        await element.setValue(value)
    }

    async isDisplayed(selector: DualSelector) {
        Logger.info(`Checking visibility of element: ${JSON.stringify(selector)}`)

        const element = await this.resolve(selector)

        return element.isDisplayed()
    }

    async waitUntilVisibleWithRetry(
        selector: DualSelector,
        maxAttempts: number = 50,
        restTime: number = 3000
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
        restTime: number = 1000,
        minTotalWait: number = 6000
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

    async tap(selector: DualSelector) {
        const element = await this.waitUntilVisibleWithRetry(selector)
        await element.click()
    }

    async type(selector: DualSelector, value: string) {
        const element = await this.waitUntilVisibleWithRetry(selector)
        await element.setValue(value)
    }


    async pause(ms: number) {
        await browser.pause(ms)
    }
}