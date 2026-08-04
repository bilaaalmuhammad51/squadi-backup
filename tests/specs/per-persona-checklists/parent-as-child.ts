import allureReporter from "@wdio/allure-reporter";
import { step } from "../../utils/helpers";
import { LoginPage } from "../../pages/login.page";
import { HomePage } from "../../pages/home.page";
import { LoginData } from "../../data/login.data";

describe("Parent-as-child - Persona Checklist", () => {
  const loginPage = new LoginPage();
  const homePage = new HomePage();

  it("TC-P1,P2,P3 - Start viewing as child & banner on key screens, Register shows an alert instead of the page, Hides Password / Tap-to-Pay / Canteen", async () => {
    allureReporter.addFeature("Parent-as-childs Persona Checklist");
    allureReporter.addStory(
      "TC-P1,P2,P3 - Start viewing as child & banner on key screens, Register shows an alert instead of the page, Hides Password / Tap-to-Pay / Canteen",
    );
    allureReporter.addSeverity("critical");

    await step("login parent user", async () => {
      await homePage.loginFlow(LoginData.parentEmail, LoginData.password);
    });

    await step("Start viewing as child & banner on key screens", async () => {
      await loginPage.switchProfileToChild();
      await homePage.assertChildBannerDisplaysOnEachTab();
    });

    await step("Register shows an alert instead of the page", async () => {
      await loginPage.validateRegisterAlertForChild();
    });

    await step("Hides Password / Tap-to-Pay / Canteen", async () => {
      await loginPage.validateHiddenOptionsForChild();
    });
  });
});
