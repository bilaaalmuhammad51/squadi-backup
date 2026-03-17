const timestamp = new Date().toISOString().replace('T',' ').replace('Z','')
export const browserstackAndroidCaps = {
    platformName: "Android",
    "appium:platformVersion": "12.0",
    "appium:deviceName": "Google Pixel 6",
    "appium:automationName": "UiAutomator2",
    "appium:app": "bs://c04896fb1a234d80c5b9957202a37ded02067413",
    "appium:autoGrantPermissions": true,
    "appium:autoAcceptAlerts": true,
    "appium:disableHiddenApiPolicyPrePApp": true,
    "appium:ignoreHiddenApiPolicyError": true,
    "appium:newCommandTimeout": 300,
    "appium:connectHardwareKeyboard": true,
    "bstack:options": {
        "projectName": "SQUADI Mobile App Automation",
        "buildName": `SQUADI Automation Android TESTS ${timestamp}`,
        "sessionName": "Android Test Session",
        "debug": true,
        "networkLogs": true,
        "video": true,
        "appiumLogs": true,
        "deviceLogs": true,
        "local": false
    },
    'appium:fullReset': true,
    'appium:noReset': false,
}