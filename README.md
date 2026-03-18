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

# 🏃 Running Tests
## Android Local

Run a specific test:
```bash
PLATFORM=android npx wdio run wdio.conf.ts --spec <path-to-spec>
```
Example:
```bash
PLATFORM=android npx wdio run wdio.conf.ts --spec ./tests/specs/test_validate_successful_login_flow.ts
```
## iOS Local
Run a specific test:
```bash
PLATFORM=ios npx wdio run wdio.conf.ts --spec <path-to-spec>
```
Example:
```bash
PLATFORM=ios npx wdio run wdio.conf.ts --spec ./tests/specs/test_validate_successful_login_flow.ts
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
allure serve reports/allure-results
```
# 🛡️ Best Practices

Keep test data separate from test logic

Use page objects for all interactions

Avoid hard waits, use proper wait utilities

Reuse helper functions for stability

Keep selectors centralized in factories


Happy Testing 🚀