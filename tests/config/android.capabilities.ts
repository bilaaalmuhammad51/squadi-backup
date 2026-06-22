import path from "path";
export const androidCaps = {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': 'Android Emulator',
    "appium:app": path.resolve(__dirname, "../apps/squadi-dev.apk"),
    'appium:autoGrantPermissions': true,
    'appium:fullReset': true,
    'appium:noReset': false,
}