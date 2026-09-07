import path from "path";
import { App } from "./apps";

export const iosCaps = {
  platformName: "iOS",
  "appium:automationName": "XCUITest",
  "appium:deviceName": process.env.IOS_DEVICE_NAME || "iPhone SE",
  "appium:platformVersion": process.env.IOS_PLATFORM_VERSION || "18.3",
  "appium:udid": process.env.IOS_UDID || "00008110-001109290E11A01E",
  "appium:app": path.resolve(__dirname, "../apps", App.binaries.ipa),
  "appium:autoAcceptAlerts": true,
  "appium:fullReset": true,
  "appium:noReset": false,
};
