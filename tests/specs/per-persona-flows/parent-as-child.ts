import allureReporter from "@wdio/allure-reporter";
import { step } from "../../utils/helpers";
import { LoginPage } from "../../pages/login.page";
import { HomePage } from "../../pages/home.page";
import { LoginData, namesOfUsers } from "../../data/login.data";

describe("Parent-as-child - Persona Checklist", () => {
  const loginPage = new LoginPage();
  const homePage = new HomePage();

  it("TC-P5,P7 - Child View Displays Child's Team, Schedule & ID Card, Switch Back to Parent Profile", async () => {
    allureReporter.addFeature("Parent-as-childs Persona Checklist");
    allureReporter.addStory(
      "TC-P5,P7 - Child View Displays Child's Team, Schedule & ID Card, Switch Back to Parent Profile",
    );
    allureReporter.addSeverity("critical");

    await step("login parent user", async () => {
      await homePage.loginFlow(LoginData.parentEmail, LoginData.password);
    });

    await step("Switch to Child Profile and validate child banner", async () => {
      await loginPage.switchProfileToChild();
      await homePage.assertChildBannerDisplaysOnEachTab();
    });

    await step("Child View Displays Child's Team, Schedule & ID Card", async () => {
      await homePage.openIDCardFromMoreTab();
      await homePage.validateIDCardElements(namesOfUsers.childFullName);
      await homePage.clickBackBtn();
    });

    await step("Switch Back to Parent Profile", async () => {
      await loginPage.switchProfileToChild();
      await homePage.switchProfileToParent();
    });
  });
});
