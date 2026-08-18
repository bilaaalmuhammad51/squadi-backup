import allureReporter from "@wdio/allure-reporter";
import { generateUniqueEmail, step } from "../../utils/helpers";
import { LoginPage } from "../../pages/login.page";
import { HomePage } from "../../pages/home.page";
import { LoginData } from "../../data/login.data";
import { RegisterData } from "../../data/register.data";
import { RegisterProfilePage } from "../../pages/register.profile.page";

describe("Guest - Persona Flow", () => {
  const loginPage = new LoginPage();
  const homePage = new HomePage();
  const registerProfilePage = new RegisterProfilePage();
  let uniqueEmail: string;
  let nextButton: ChainablePromiseElement;

  it("[TC-G11] Registration shows errors for invalid input,", async () => {
    allureReporter.addFeature("Guest Persona Flow");
    allureReporter.addStory(
      "TC-G11 - Registration shows errors for invalid input",
    );
    allureReporter.addSeverity("critical");

    await step("Verify welcome screen is visible", async () => {
      await loginPage.validateLoginBtnIsVisible();
    });

    await step("Open registration screen", async () => {
      await loginPage.click(loginPage.createAccountOrRegisterProfile);
    });

    await step("Verify registration screen elements", async () => {
      await registerProfilePage.assertElementDisplayed(
        registerProfilePage.backButton,
      );

      await registerProfilePage.assertElementDisplayed(
        registerProfilePage.createAccountOrRegisterProfile,
      );

      await registerProfilePage.assertTextContains(
        registerProfilePage.createAccountOrRegisterProfile,
        RegisterData.registerHeading,
      );
    });

    await step("Get Next button element", async () => {
      await registerProfilePage.scrollUntilElementVisible(
        registerProfilePage.nextButton,
      );
      nextButton = await registerProfilePage.getElement(
        registerProfilePage.nextButton,
      );
    });

    await step(
      "Verify Next button is disabled before accepting terms",
      async () => {
        await registerProfilePage.expectElementState(nextButton, "disabled");
      },
    );

    await step("Accept terms and verify Next button enabled", async () => {
      await registerProfilePage.verifyAndAcceptTerms();

      await registerProfilePage.expectElementState(nextButton, "enabled");
    });

    await step("Submit registration", async () => {
      await registerProfilePage.click(registerProfilePage.nextButton);
    });

    await step("Verify error messages for empty fields", async () => {
      await registerProfilePage.assertErrorMessagesForEmptyFields();
    });

    await step("go back and again open registration screen", async () => {
      await registerProfilePage.clickBackBtn();
      await loginPage.click(loginPage.createAccountOrRegisterProfile);
    });

    await step(
      "Fill registration form with already registered email",
      async () => {
        await registerProfilePage.addUserName(LoginData.email);

        allureReporter.addAttachment(
          "Registered Email",
          LoginData.email,
          "text/plain",
        );

        await registerProfilePage.fillPasswordFields(RegisterData.password);

        await registerProfilePage.fillFirstAndLastNameWithGenerated();

        await registerProfilePage.verifyAndSelectGender(
          RegisterData.allGenderOptions[0],
        );

        await registerProfilePage.selectOrganisation(RegisterData.organisation);

        await registerProfilePage.scrollDown();

        await registerProfilePage.addPhoneNumber(RegisterData.phoneNumber);

        await driver.hideKeyboard();
      },
    );

    await step("Get Next button element", async () => {
      nextButton = await registerProfilePage.getElement(
        registerProfilePage.nextButton,
      );
    });

    await step(
      "Verify Next button is disabled before accepting terms",
      async () => {
        await registerProfilePage.expectElementState(nextButton, "disabled");
      },
    );

    await step("Accept terms and verify Next button enabled", async () => {
      await registerProfilePage.verifyAndAcceptTerms();
      await registerProfilePage.expectElementState(nextButton, "enabled");
    });

    await step(
      "Submit registration and validate used email error popup",
      async () => {
        await registerProfilePage.click(registerProfilePage.nextButton);
        await registerProfilePage.validateUsedEmailPopup();
        await registerProfilePage.clickBackBtn();
      },
    );
  });

  it("[TC-G10] Guest creates a new account", async () => {
    allureReporter.addFeature("Guest Persona Flow");
    allureReporter.addStory("TC-G10 - Guest creates a new account");
    allureReporter.addSeverity("critical");

    uniqueEmail = generateUniqueEmail();

    await step("Verify welcome screen is visible", async () => {
      await loginPage.waitUntilVisibleWithRetry(loginPage.loginButton, 5);
    });

    await step("Open registration screen", async () => {
      await loginPage.click(loginPage.createAccountOrRegisterProfile);
    });

    await step("Verify registration screen elements", async () => {
      await registerProfilePage.assertElementDisplayed(
        registerProfilePage.backButton,
      );

      await registerProfilePage.assertElementDisplayed(
        registerProfilePage.createAccountOrRegisterProfile,
      );

      await registerProfilePage.assertTextContains(
        registerProfilePage.createAccountOrRegisterProfile,
        RegisterData.registerHeading,
      );
    });

    await step("Fill registration form", async () => {
      await registerProfilePage.addUserName(uniqueEmail);

      allureReporter.addAttachment(
        "Registered Email",
        uniqueEmail,
        "text/plain",
      );

      await registerProfilePage.fillPasswordFields(RegisterData.password);

      await registerProfilePage.fillFirstAndLastNameWithGenerated();

      await registerProfilePage.verifyAndSelectGender(
        RegisterData.allGenderOptions[0],
      );

      await registerProfilePage.selectOrganisation(RegisterData.organisation);

      await registerProfilePage.scrollDown();

      await registerProfilePage.addPhoneNumber(RegisterData.phoneNumber);

      await driver.hideKeyboard();
    });

    await step("Get Next button element", async () => {
      nextButton = await registerProfilePage.getElement(
        registerProfilePage.nextButton,
      );
    });

    await step(
      "Verify Next button is disabled before accepting terms",
      async () => {
        await registerProfilePage.expectElementState(nextButton, "disabled");
      },
    );

    await step("Accept terms and verify Next button enabled", async () => {
      await registerProfilePage.verifyAndAcceptTerms();

      await registerProfilePage.expectElementState(nextButton, "enabled");
    });

    await step("Submit registration", async () => {
      await registerProfilePage.click(registerProfilePage.nextButton);

      await registerProfilePage.verifyAndSelectRegisterProfile(
        RegisterData.noOption,
      );
    });

    await step("Verify user lands on Home screen", async () => {
      await homePage.verifyHomeScreenElements();
    });
    // await step("Logout user", async () => {
    //   await loginPage.logoutUser();
    //   await loginPage.gotoLoginTab();
    // });
  });
});
