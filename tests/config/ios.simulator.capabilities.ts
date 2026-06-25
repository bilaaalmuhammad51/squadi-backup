import path from "path";

// Capabilities for running on an iOS Simulator (Xcode Simulator on a macOS
// GitHub runner). Differs from the real-device caps (ios.capabilities.ts):
//   - no "appium:udid" - Appium boots the named simulator itself
//   - the app is a SIMULATOR build (.app), not a real-device .ipa
// Values are driven by env vars so the CI workflow can set the device, OS
// version, and app path. Falls back to sensible defaults for local use.
export const iosSimulatorCaps = {
  platformName: "iOS",
  "appium:automationName": "XCUITest",
  "appium:deviceName": process.env.IOS_DEVICE_NAME || "iPhone 15",
  // Only pin the OS version if provided; otherwise let Appium pick an
  // available simulator runtime (handy since CI images vary).
  ...(process.env.IOS_PLATFORM_VERSION
    ? { "appium:platformVersion": process.env.IOS_PLATFORM_VERSION }
    : {}),
  "appium:app":
    process.env.IOS_APP_PATH || path.resolve(__dirname, "../apps/Runner.app"),
  "appium:autoAcceptAlerts": true,
  // Simulators are disposable on CI; a full reset isn't needed and noReset
  // keeps the run faster/more stable.
  "appium:fullReset": false,
  "appium:noReset": true,
};