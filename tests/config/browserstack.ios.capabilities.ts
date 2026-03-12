const timestamp = new Date().toISOString().replace('T',' ').replace('Z','')
export const browserstackIosCaps = {
    platformName: "iOS",
    "appium:deviceName": "iPhone 15",
    "appium:automationName": "XCUITest",
    "app": "bs://b9da227af713c08f9309c0507f06cead4c8570ac",
    "appium:xcodeSigningId": "iPhone Developer",
    // "appium:updatedWDABundleId": "",
    "appium:useNewWDA": true,
    "appium:showXcodeLog": true,
    "appium:wdaStartupRetries": 3,
    "appium:autoGrantPermissions": true,
    "autoAcceptAlerts": true,
    'appium:fullReset': true,
    'appium:noReset': false,
    "bstack:options": {
        "projectName": "SQUADI Mobile App Automation",
        "buildName": `SQUADI Automation Android TESTS ${timestamp}`,
        "sessionName": "iOS Test Session",
        "debug": true,
        "networkLogs": true,
        "video": true,
        "appiumLogs": true,
        "deviceLogs": true,
        "local": false
    },
}