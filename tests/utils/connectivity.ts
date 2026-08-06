import { execSync } from "child_process";

type NetworkState = "enable" | "disable";

/**
 * Toggle Wi‑Fi and mobile data on the connected Android device/emulator.
 * - `disable`: turns off both wifi and mobile data → the app should show offline banner
 * - `enable` : turns them back on → banner disappears
 */
export async function setConnectivity(state: NetworkState): Promise<void> {
  const action = state === "disable" ? "disable" : "enable";

  // Wi‑Fi
  execSync(`adb shell svc wifi ${action}`);
  // Mobile data
  execSync(`adb shell svc data ${action}`);
}
/**
 * Enable or disable airplane mode on the connected Android device/emulator.
 */
export async function setAirplaneMode(enable: boolean): Promise<void> {
  const mode = enable ? "enable" : "disable";
  execSync(`adb shell cmd connectivity airplane-mode ${mode}`);
  await driver.pause(2000); // let system broadcast the change
}

export async function forceStopApp(packageName: string): Promise<void> {
  execSync(`adb shell am force-stop ${packageName}`);
  await browser.pause(2000);
}

export function clearAppData(packageName: string): void {
  execSync(`adb shell pm clear ${packageName}`);
}

export function activateApp(packageName: string): void {
  execSync(
    `adb shell monkey -p ${packageName} -c android.intent.category.LAUNCHER 1`,
  );
  // Or use driver.activateApp if you prefer Appium’s method
}

// If you want to unify with Appium’s driver methods:
export async function coldStartApp(packageName: string): Promise<void> {
  forceStopApp(packageName);
  await driver.pause(1000);
  await driver.activateApp(packageName);
  await driver.pause(3000); // wait for splash/load
}
