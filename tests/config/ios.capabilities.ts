import path from "path";
export const iosCaps = {
    platformName: 'iOS',
    'appium:automationName': 'XCUITest',
    'appium:deviceName': 'iPhone SE',
    'appium:platformVersion': '18.3',
    "appium:udid": "00008110-001109290E11A01E",
    "appium:app": path.resolve(__dirname, "../apps/squadi-dev.ipa"),
    'appium:autoAcceptAlerts': true,
    'appium:fullReset': true,
    'appium:noReset': false,
}