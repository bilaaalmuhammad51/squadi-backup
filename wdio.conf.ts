import dotenv from 'dotenv'
dotenv.config()
import { androidCaps } from './tests/config/android.capabilities'
import { iosCaps } from './tests/config/ios.capabilities'
import {browserstackAndroidCaps} from './tests/config/browserstack.android.capabilities'
import {browserstackIosCaps} from './tests/config/browserstack.ios.capabilities'
import Logger from "./tests/utils/logger";
import allureReporter from '@wdio/allure-reporter'
import {Timeout} from "./tests/utils/timers";
import BasePage from "./tests/pages/base.page";
const ENV = (process.env.ENV || 'local').toLowerCase()
const PLATFORM = (process.env.PLATFORM || 'android').toLowerCase()

function getCapabilities() {

    if (ENV === 'browserstack') {
        return getBrowserstackCaps();
    }

    return getLocalCaps();
}
function getServerConfig() {
    if (ENV === 'browserstack') {
        return {
            protocol: 'https',
            hostname: 'hub.browserstack.com',
            port: 443,
            path: '/wd/hub',
            user: process.env.BROWSERSTACK_USERNAME,
            key: process.env.BROWSERSTACK_ACCESS_KEY
        }
    }

    return {
        hostname: '127.0.0.1',
        port: 4723,
        path: '/'
    }
}
export const config: WebdriverIO.Config = {

    runner: 'local',
    framework: 'mocha',
    ...getServerConfig(),
    onPrepare: function () {
        Logger.info(`Running tests on ${PLATFORM} on ${ENV} environment`)
    },

    reporters: [
        'spec',
        ['allure', {
            outputDir: 'allure-results',
            disableWebdriverStepsReporting: true,
            disableWebdriverScreenshotsReporting: true
        }]
    ],

    specs: ['./tests/specs/**/*.ts'],
    maxInstances: 1,
    logLevel: 'error',

    mochaOpts: {
        ui: 'bdd',
        timeout: Timeout.TWO_MINUTES
    },

    capabilities: getCapabilities(),

    // beforeTest: async function (test) {
    //     const timestamp = new Date().toISOString()
    //     if (ENV === 'browserstack') {
    //         await browser.execute(
    //             'browserstack_executor: ' +
    //             JSON.stringify({
    //                 action: 'setSessionName',
    //                 arguments: {
    //                     name: `${PLATFORM === 'android' ? 'Android' : 'iOS'}: ${test.title} | ${timestamp}`
    //                 }
    //             })
    //         )
    //         return
    //     }
    //
    //     await browser.startRecordingScreen({
    //         forceRestart: true,
    //         timeLimit: '180'
    //     })
    // },
    beforeTest: async function (test) {
        const timestamp = new Date().toISOString();

        // ---------- BrowserStack session naming ----------
        if (ENV === 'browserstack') {
            await browser.execute(
                'browserstack_executor: ' +
                JSON.stringify({
                    action: 'setSessionName',
                    arguments: {
                        name: `${PLATFORM === 'android' ? 'Android' : 'iOS'}: ${test.title} | ${timestamp}`
                    }
                })
            );
        } else {
            // ---------- Start recording for local ----------
            await browser.startRecordingScreen({
                forceRestart: true,
                timeLimit: '180'
            });
        }

        // ---------- Handle iOS notification pre-prompt ----------
        if (driver.isIOS) {
            const basePage = new BasePage();
            await basePage.handleIOSNotificationPrePrompt();
        }
    },

    afterTest: async function (test, _context, result) {
        const screenshotBase64 = await browser.takeScreenshot()

        allureReporter.addAttachment(
            `Screenshot - ${test.title}`,
            Buffer.from(screenshotBase64, 'base64'),
            'image/png'
        )

        if (ENV === 'browserstack') {
            await browser.execute(
                'browserstack_executor: ' +
                JSON.stringify({
                    action: 'setSessionStatus',
                    arguments: {
                        status: result.passed ? 'passed' : 'failed',
                        reason: result.passed
                            ? `Passed: ${test.title}`
                            : `Failed: ${result.error?.message || test.title}`
                    }
                })
            )
            return
        }

        const videoBase64 = await browser.stopRecordingScreen()

        if (!result.passed && videoBase64) {
            allureReporter.addAttachment(
                `Video - ${test.title}`,
                Buffer.from(videoBase64, 'base64'),
                'video/mp4'
            )
        }
    }

}
function getBrowserstackCaps() {
    if (PLATFORM === 'ios') {
        return [browserstackIosCaps];
    }

    return [browserstackAndroidCaps];
}

function getLocalCaps() {
    if (PLATFORM === 'ios') {
        return [iosCaps];
    }

    return [androidCaps];
}