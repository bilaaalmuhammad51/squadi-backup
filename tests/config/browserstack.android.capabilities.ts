import { App } from "./apps";

const timestamp = new Date().toISOString().replace("T", " ").replace("Z", "");

export const browserstackAndroidCaps = {
  platformName: "Android",
  "appium:platformVersion": "14.0",
  "appium:deviceName": "Google Pixel 8 Pro",
  "appium:automationName": "UiAutomator2",
  "appium:app": App.binaries.browserstackAndroidAppId,
  "appium:autoGrantPermissions": true,
  "appium:autoAcceptAlerts": true,
  "appium:disableHiddenApiPolicyPrePApp": true,
  "appium:ignoreHiddenApiPolicyError": true,
  "appium:newCommandTimeout": 300,
  "appium:connectHardwareKeyboard": true,
  "bstack:options": {
    projectName: `${App.displayName} Mobile App Automation`,
    buildName: `${App.displayName} Automation Android TESTS ${timestamp}`,
    sessionName: `${App.displayName} Android Test Session`,
    debug: true,
    networkLogs: true,
    video: true,
    appiumLogs: true,
    deviceLogs: true,
    local: false,
  },
  "appium:fullReset": true,
  "appium:noReset": false,
};
