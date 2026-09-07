import { App } from "./apps";

const timestamp = new Date().toISOString().replace("T", " ").replace("Z", "");

export const browserstackIosCaps = {
  platformName: "iOS",
  "appium:deviceName": "iPhone 15 Plus",
  "appium:automationName": "XCUITest",
  "appium:app": App.binaries.browserstackIosAppId,
  "appium:xcodeSigningId": "iPhone Developer",
  "appium:useNewWDA": true,
  "appium:showXcodeLog": true,
  "appium:wdaStartupRetries": 3,
  "appium:autoGrantPermissions": true,
  "appium:autoAcceptAlerts": true,
  "appium:fullReset": true,
  "appium:noReset": false,
  "bstack:options": {
    projectName: `${App.displayName} Mobile App Automation`,
    buildName: `${App.displayName} Automation iOS TESTS ${timestamp}`,
    sessionName: `${App.displayName} iOS Test Session`,
    debug: true,
    networkLogs: true,
    video: true,
    appiumLogs: true,
    deviceLogs: true,
    local: false,
  },
};
