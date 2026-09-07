# Squadi Mobile Automation Framework

Mobile UI automation framework for Android and iOS using WebdriverIO.

---
## Overview

Welcome to the **Squadi Mobile Automation Framework**. This project uses WebdriverIO and TypeScript to automate mobile UI testing for Android and iOS applications.

It supports local execution with emulators or simulators and cloud execution using BrowserStack.

## Project Structure

```text
squadi-mobile-automation/
├── tests/
│   ├── apps/                  # APK / IPA files
│   ├── config/                # Platform and environment capabilities
│   │   └── apps/              # Per-app profiles (Squadi, Basketball, ...)
│   ├── data/                  # Test data
│   ├── factories/             # Selector and page factories
│   ├── pages/                 # Page objects
│   ├── specs/                 # Test specs
│   └── utils/                 # Utility helpers
├── allure-results/            # Allure raw results
├── package.json
├── tsconfig.json
└── wdio.conf.ts
```
## Prerequisites

Before running tests locally, make sure you have:

Node.js installed

npm installed

Appium installed and running, if executing locally

Android Studio and emulator setup for Android testing

Xcode and simulator setup for iOS testing

BrowserStack account and access key, if executing on BrowserStack

Allure installed, if you want to generate Allure reports

## ⭐ Features

- Automated mobile UI testing for Android and iOS
- Scalable Page Object Model structure
- Reusable test data and factories
- Cross platform execution support
- BrowserStack integration for cloud testing
- Allure reporting support
- Clean and maintainable test architecture

## 📦 Installation

Clone the repository:

```bash
git clone <your-repo-url>
```

Navigate to the project directory:
```bash
cd squadi-mobile-automation
```

## Install dependencies:
```bash
npm install
```

# 🎛️ Multi-app support (Squadi / Basketball / next)

The suite drives more than one app. They overlap by roughly 80-90%, so there is
**one** set of specs and page objects; everything that differs lives in an *app
profile*.

```text
tests/config/apps/
├── app.profile.ts     # the AppProfile interface (what can differ)
├── squadi.app.ts      # Squadi values
├── basketball.app.ts  # Basketball values
└── index.ts           # picks the profile from APP, applies .env overrides
```

Select the app with the `APP` environment variable (default `Squadi`):

```bash
APP=Basketball PLATFORM=android npx wdio run wdio.conf.ts --spec tests/specs/login/test_validate_successful_login_flow.ts
```

The profile drives the APK/IPA, the BrowserStack app id, the API base URLs, the
match-seeding IDs, the test accounts, team-sheet data, sport terminology, and
the feature flags.

## The one rule

**Never branch on the app name inside a spec or page object.** Branch on a
capability or read a value from the profile. That way adding app #3 is one new
profile file and zero test edits.

### 1. Values -> read them from the profile

```ts
import { App } from "../config/apps";

App.seed.competitionId;      // per environment
App.terminology.scoreUnit;   // "Goal" vs "Point"
App.rules.fouls?.perPlayerLimit;
```

### 2. Screens one app does not have -> feature flags

Declare the capability in each profile's `features`, then gate the spec. Missing
features are **skipped**, not failed, so the report shows the gap honestly and
the run stays green:

```ts
import { itIfFeature, describeIfFeature } from "../../utils/features";

describe("Fouls", () => {
  itIfFeature("fouls", "records a personal foul", async () => { ... });
});
```

### 3. Same screen, different locator -> per-app selector override

Pass an override for the app that differs; every other app keeps the shared
default:

```ts
public homeTeamScore = selector(
  "~Home team score",            // default (Squadi and anything new)
  "~Home team score",
  "Home Team Score",
  { basketball: { android: "~HOME points", ios: "~HOME points" } },
);
```

## Running a specific app in CI

Both workflows expose an **App** dropdown on *Run workflow*:

- **Daily Android Emulator Tests** - picks the app, then resolves the APK file
  name from that app's profile (`scripts/app-value.ts`) and downloads that asset
  from the APK release. Upload each app's build to the release under the file
  name its profile declares (`squadi-dev.apk`, `basketball-qa.apk`).
  `tests/apps/` is gitignored, so the release is the only source in CI - the
  step falls back to a file already sitting in `tests/apps/` only for
  self-hosted or local runs.
  The scheduled nightly run uses the repo variable `DEFAULT_APP` (default
  `Squadi`), so the nightly app can be changed without editing the workflow.
- **Mobile Tests Browserstack** - picks the app and uses that profile's
  BrowserStack app id (override per run with the `BROWSERSTACK_APP_ID` /
  `BROWSERSTACK_IOS_APP_ID` variables).

The app name flows into the Slack message and the BrowserStack build/session
names, so reports from different apps are easy to tell apart.

## Adding a new app

1. Drop the build into `tests/apps/` and upload it to the APK release
   (the same file name the profile declares).
2. Copy `squadi.app.ts` to `<newapp>.app.ts` and fill in the values.
3. Register it in `tests/config/apps/index.ts` (`registry` + `aliases`) and add
   the `AppKey` union member in `app.profile.ts`.
4. Add it to the `app` dropdown in both workflows.
5. Run the suite and triage failures into: selector override, feature flag, or a
   real bug in the app.

Values you have not filled in yet stay as `TBD_NUMBER` / `TBD_STRING`. Any test
that reaches for one fails immediately with a message naming the missing field,
rather than seeding into the wrong competition with a stale ID.

Anything in a profile can also be overridden from `.env` while you are still
pinning an environment down - see `.env.example`.

# 🏃 Running Tests
## Android Local

Run a specific test (`APP` defaults to `Squadi`):
```bash
APP=<Squadi|Basketball> PLATFORM=android npx wdio run wdio.conf.ts --spec <path-to-spec>
```
Example:
```bash
APP=Basketball PLATFORM=android npx wdio run wdio.conf.ts --spec tests/specs/login/test_validate_successful_login_flow.ts
```
## iOS Local
Run a specific test:
```bash
PLATFORM=ios npx wdio run wdio.conf.ts --spec <path-to-spec>
```
Example:
```bash
PLATFORM=ios npx wdio run wdio.conf.ts --spec tests/specs/login/test_validate_successful_login_flow.ts
```
## Android BrowserStack
```bash
PLATFORM=android ENV=browserstack npx wdio run wdio.conf.ts --spec <path-to-spec>
```
## iOS BrowserStack
```bash
PLATFORM=ios ENV=browserstack npx wdio run wdio.conf.ts --spec <path-to-spec>
```
# 📊 Test Reports

Reports are generated after execution.

HTML Report

The report is saved in the reports directory.
```bash
open reports/test_report.html
```
Screenshots and Videos

Artifacts are stored here:

reports/screenshots
reports/videos

Video is available only for failed tests in local execution.

## Environment setup

Copy the example file:
```bash
cp .env.example .env
````
1. Open .env and add your real values:

2. BROWSERSTACK_USERNAME

3. BROWSERSTACK_ACCESS_KEY

4. BROWSERSTACK_APP_ID

#### Save the file and run the project.

### Note:

.env.example contains placeholders only.

.env contains your real credentials.

# Allure Report

Ensure Allure is installed and results are generated.

Generate report:
```bash
allure generate reports/allure-results -o reports/allure-report --clean
```

Open report:
```bash
allure serve reports/allure-results
```
Ensure You’re Generating Allure Results, and allure is installed on your system
```bash
allure generate reports/allure-results -o reports/allure-report --clean
```

Or if you want to open it directly:

```bash
allure serve allure-results
```
# 🛡️ Best Practices

Keep test data separate from test logic

Use page objects for all interactions

Avoid hard waits, use proper wait utilities

Reuse helper functions for stability

Keep selectors centralized in factories


Happy Testing 🚀