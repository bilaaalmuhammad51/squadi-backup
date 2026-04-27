import path from "path";
export const androidCaps = {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    // 'appium:deviceName': 'Android Emulator',
    "appium:deviceName": "Pixle_9_Pro",
    "appium:app": path.resolve(__dirname, "../apps/squadi-dev.apk"),
    'appium:autoGrantPermissions': true,
    'appium:fullReset': true,
    'appium:noReset': false,
}