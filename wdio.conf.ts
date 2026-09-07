import dotenv from "dotenv";
dotenv.config();
import { androidCaps } from "./tests/config/android.capabilities";
import { iosCaps } from "./tests/config/ios.capabilities";
import { browserstackAndroidCaps } from "./tests/config/browserstack.android.capabilities";
import { browserstackIosCaps } from "./tests/config/browserstack.ios.capabilities";
import Logger from "./tests/utils/logger";
import allureReporter from "@wdio/allure-reporter";
import { Timeout } from "./tests/utils/timers";
import BasePage from "./tests/pages/base.page";
import { App } from "./tests/config/apps";
const ENV = (process.env.ENV || "local").toLowerCase();
const PLATFORM = (process.env.PLATFORM || "android").toLowerCase();

function getCapabilities() {
  if (ENV === "browserstack") {
    return getBrowserstackCaps();
  }

  return getLocalCaps();
}
function getServerConfig() {
  if (ENV === "browserstack") {
    return {
      protocol: "https",
      hostname: "hub.browserstack.com",
      port: 443,
      path: "/wd/hub",
      user: process.env.BROWSERSTACK_USERNAME,
      key: process.env.BROWSERSTACK_ACCESS_KEY,
    };
  }

  return {
    hostname: "127.0.0.1",
    port: 4723,
    path: "/",
  };
}
export const config: WebdriverIO.Config = {
  runner: "local",
  framework: "mocha",
  ...getServerConfig(),
  onPrepare: function () {
    Logger.info(
      `Running ${App.displayName} tests on ${PLATFORM} on ${ENV} environment`,
    );
  },

  reporters: [
    "spec",
    [
      "allure",
      {
        outputDir: "allure-results",
        disableWebdriverStepsReporting: true,
        disableWebdriverScreenshotsReporting: true,
      },
    ],
  ],

  specs: ["./tests/specs/**/*.ts"],
  maxInstances: 1,
  // Session creation includes a full uninstall/reinstall (fullReset), and the
  // app binaries are large enough (basketball-qa.apk is ~147MB) that the
  // WebdriverIO default of 120s expires mid-install on a cold emulator.
  connectionRetryTimeout: 300000,
  logLevel: "error",

  // Retry a failed spec once - safety net for intermittent CI-emulator
  // flakiness (e.g. a transient system ANR). A fresh retry re-creates state.
  specFileRetries: 0,
  specFileRetriesDelay: 0,

  mochaOpts: {
    ui: "bdd",
    timeout: Timeout.SIX_MINUTES,
  },

  capabilities: getCapabilities(),

  beforeTest: async function (test) {
    const timestamp = new Date().toISOString();

    // ---------- BrowserStack session naming ----------
    if (ENV === "browserstack") {
      await browser.execute(
        "browserstack_executor: " +
          JSON.stringify({
            action: "setSessionName",
            arguments: {
              name: `${App.displayName} ${PLATFORM === "android" ? "Android" : "iOS"}: ${test.title} | ${timestamp}`,
            },
          }),
      );
    } else {
      // ---------- Start recording for local ----------
      // timeLimit must cover the mocha timeout, otherwise recording stops
      // partway and the tests that most need a video (the slow ones that time
      // out) are exactly the ones that end up with a truncated or empty clip.
      await browser.startRecordingScreen({
        forceRestart: true,
        timeLimit: String(Timeout.SIX_MINUTES / 1000 + 60),
      });
    }

    const basePage = new BasePage();
    await basePage.handleStartupScreens();
  },

  afterTest: async function (test, _context, result) {
    // Each capture is isolated. These run after a test has already failed, so
    // the session can be in a bad state (especially after a mocha timeout,
    // where the test's last command may still be in flight). Previously an
    // unguarded takeScreenshot() threw straight out of afterTest and cost us
    // BOTH the screenshot and the video on precisely the failures worth
    // looking at.
    try {
      const screenshotBase64 = await browser.takeScreenshot();

      allureReporter.addAttachment(
        `Screenshot - ${test.title}`,
        Buffer.from(screenshotBase64, "base64"),
        "image/png",
      );
    } catch (error) {
      Logger.info(`Could not capture screenshot for "${test.title}": ${error}`);
    }

    if (ENV === "browserstack") {
      await browser.execute(
        "browserstack_executor: " +
          JSON.stringify({
            action: "setSessionStatus",
            arguments: {
              status: result.passed ? "passed" : "failed",
              reason: result.passed
                ? `Passed: ${test.title}`
                : `Failed: ${result.error?.message || test.title}`,
            },
          }),
      );
      return;
    }

    try {
      const videoBase64 = await browser.stopRecordingScreen();

      if (!result.passed && videoBase64) {
        allureReporter.addAttachment(
          `Video - ${test.title}`,
          Buffer.from(videoBase64, "base64"),
          "video/mp4",
        );
      }
    } catch (error) {
      Logger.info(`Could not capture video for "${test.title}": ${error}`);
    }
  },
};
function getBrowserstackCaps() {
  if (PLATFORM === "ios") {
    return [browserstackIosCaps];
  }

  return [browserstackAndroidCaps];
}

function getLocalCaps() {
  if (PLATFORM === "ios") {
    return [iosCaps];
  }

  return [androidCaps];
}
