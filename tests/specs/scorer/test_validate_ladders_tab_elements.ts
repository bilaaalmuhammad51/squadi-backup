import allureReporter from "@wdio/allure-reporter";
import { step } from "../../utils/helpers";
import { LoginData } from "../../data/login.data";
import { HomePage } from "../../pages/home.page";
import { LaddersPage } from "../../pages/ladders.page";

describe("Validate ladders tab", () => {
    it("Should log in with valid credentials, open ladder tab and validte elements on screen", async () => {

        const laddersPage = new LaddersPage()
        const homePage = new HomePage();

        allureReporter.addFeature("ladders Validation");
        allureReporter.addStory("Login, ladders Tab, varify elements");
        allureReporter.addSeverity("critical");

        await step("Complete Login Flow", async () => {
            await homePage.loginFlow(LoginData.email, LoginData.password);
        });

        await step("Open Ladders Tab", async () => {
            await laddersPage.openLaddersTab();
            await laddersPage.waitUntilVisibleWithRetry(laddersPage.shortTab);
            await laddersPage.assertElementDisplayed(laddersPage.fullTab);
            await laddersPage.assertElementDisplayed(laddersPage.formTab);
        });

        await step("Open Short Ladders Tab And Validate The Elements", async () => {
            await laddersPage.openShortLaddersTab();
            await laddersPage.validateShortLaddersTabElements();
        });

        await step("Open Full Ladders Tab And Validate The Elements", async () => {
            await laddersPage.openFullLaddersTab();
            await laddersPage.validateFullLaddersTabElements();
        });

        await step("Open Form Ladders Tab And Validate The Elements", async () => {
            await laddersPage.openFormLaddersTab();
            await laddersPage.validateFormLaddersTabElements();
        });

    });
});