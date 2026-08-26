import { LoginPage } from "./login.page";
import { selector } from "../factories/page.factory";
import { generateUniqueNames } from "../utils/helpers";
import { RegisterData } from "../data/register.data";
export class RegisterProfilePage extends LoginPage {
  public createAccountOrRegisterProfileHeading = selector(
    "~Create Account or Register Profile",
    "~Create Account or Register Profile",
    "Create Account or Register Profile heading",
  );

  public emailHeading = selector(
    "~Email",
    "~Email",
    "Email heading in registration page",
  );

  public inputFieldByIndex = (index: number) =>
    selector(
      `//android.widget.ScrollView/android.widget.EditText[${index}]`,
      '(//XCUIElementTypeTextField[@name="Enter..."])' + `[${index}]`,
      `Input field at index ${index}`,
    );
  public enterTextInFieldByIndex = async (
    index: number,
    value: any,
  ): Promise<void> => {
    await this.click(this.inputFieldByIndex(index));
    await this.type(this.inputFieldByIndex(index), value);
  };

  public mobileInputField = selector(
    '//android.widget.EditText[contains(@hint,"e.g. ")]',
    "~e.g. 0400123456",
    "Mobile input field in registration page",
  );

  public genderDropdown = selector(
    "~Gender",
    "~Select...",
    "Gender dropdown trigger",
  );
  public genderOption = (value: string) =>
    selector(`~${value}`, `~${value}`, `${value} gender option`);

  public organisationTrigger = selector(
    "~Select an Organisation",
    "~Select an Organisation",
    "Organisation trigger",
  );

  public organisationSearchField = selector(
    "//android.widget.EditText",
    "~Search for club/ assoc/ state",
    "Organisation search field",
  );
  public organisationResultContains = (value: string) => {
    return selector(
      `//android.widget.Button[contains(@content-desc,"${value}")]`,
      `ios predicate string: name CONTAINS "${value}"`,
      `${value} organisation result`,
    );
  };

  public emptyEmailError = selector(
    "~Enter a valid email address",
    "~Enter a valid email address",
    "Empty Email error message",
  );

  public emptyPasswordError = selector(
    '(//android.view.View[@content-desc="Enter at least 8 characters"])[1]',
    "",
    "Empty Password error message",
  );

  public emptyReTypePasswordError = selector(
    '(//android.view.View[@content-desc="Enter at least 8 characters"])[2]',
    "",
    "Empty Re-type Password error message",
  );

  public emptyFirstNameError = selector(
    "~Enter first name",
    "",
    "Empty First Name error message",
  );

  public emptyLastNameError = selector(
    "~Enter last name",
    "",
    "Empty Last Name error message",
  );

  public emptyOrganisationError = selector(
    "~Please select an organisation.",
    "",
    "Empty Organisation error message",
  );

  public sponsorsCheckbox = selector(
    "~Would you like to receive special offers from our sponsors including FREE & or discounted items, prize giveaways, news etc",
    "ios class chain:**/XCUIElementTypeWindow[1]/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther[2]/XCUIElementTypeOther[2]/XCUIElementTypeOther[2]/XCUIElementTypeOther[3]/XCUIElementTypeOther[2]/XCUIElementTypeOther[2]/XCUIElementTypeOther[6]",
    "Sponsors checkbox",
  );

  public termsAndConditions = selector(
    'android=new UiSelector().className("android.view.View").instance(22)',
    "ios class chain:**/XCUIElementTypeWindow[1]/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther[2]/XCUIElementTypeOther[2]/XCUIElementTypeOther[2]/XCUIElementTypeOther[3]/XCUIElementTypeOther[2]/XCUIElementTypeOther[2]/XCUIElementTypeOther[7]",
    "Terms and Conditions checkbox",
  );
  public nextButton = selector("~Next", "~Next", "Next button");

  public registerProfileTitle = selector(
    "~Register your Profile\n(Player, Coach, Referee, Other)",
    "",
    "Register profile title",
  );

  public usedEmailPopup = selector(
    "~A user with that email address already exists.",
    "",
    "Used Email popup",
  );

  public registerOption = (value: string) =>
    selector(`~${value}`, "", `${value} option`);

  async fillPasswordFields(password: string): Promise<void> {
    if (driver.isAndroid) await this.enterTextInFieldByIndex(2, password);
    await this.hideKeyboardSafely();
    await this.click(this.createAccountOrRegisterProfileHeading);
    await this.enterTextInFieldByIndex(3, password);
    await this.hideKeyboardSafely();
    await this.click(this.createAccountOrRegisterProfileHeading);
  }

  async fillFirstAndLastNameWithGenerated(): Promise<void> {
    const { firstName, lastName } = generateUniqueNames();
    console.log("Generated First Name:", firstName);
    console.log("Generated Last Name:", lastName);
    await this.scrollUntilElementVisible(this.inputFieldByIndex(4));
    await this.enterTextInFieldByIndex(4, firstName);
    await this.scrollUntilElementVisible(this.inputFieldByIndex(5));
    await this.enterTextInFieldByIndex(5, lastName);
    await this.click(this.createAccountOrRegisterProfileHeading);
  }
  async verifyAndSelectGender(value: string): Promise<void> {
    await this.scrollUntilElementVisible(this.genderDropdown);
    await this.click(this.genderDropdown);
    for (const option of RegisterData.allGenderOptions) {
      await this.waitUntilVisibleWithRetry(this.genderOption(option));
    }
    if (!RegisterData.allGenderOptions.includes(value)) {
      throw new Error(`Invalid gender option: ${value}`);
    }
    await this.click(this.genderOption(value));
  }
  async selectOrganisation(value: string): Promise<void> {
    await this.click(this.organisationTrigger);
    await this.click(this.organisationSearchField);
    await this.type(this.organisationSearchField, value);
    // wait for result and select
    const option = this.organisationResultContains(value);
    await this.waitUntilVisibleWithRetry(option);
    await this.click(option);
  }
  async addPhoneNumber(number: string): Promise<void> {
    // await this.enterTextInFieldByIndex(4, number);
    await this.click(this.mobileInputField);
    await this.type(this.mobileInputField, number);
  }

  async assertErrorMessagesForEmptyFields(): Promise<void> {
    await this.scrollUntilElementVisible(this.emptyEmailError);
    await this.click(this.createAccountOrRegisterProfileHeading);
    await this.assertElementDisplayed(this.emptyEmailError);
    await this.assertElementDisplayed(this.emptyPasswordError);
    await this.assertElementDisplayed(this.emptyReTypePasswordError);
    await this.scrollUntilElementVisible(this.emptyFirstNameError);
    await this.assertElementDisplayed(this.emptyFirstNameError);
    await this.assertElementDisplayed(this.emptyLastNameError);
    await this.scrollUntilElementVisible(this.emptyOrganisationError);
    await this.assertElementDisplayed(this.emptyOrganisationError);
  }

  async verifyAndAcceptTerms(): Promise<void> {
    await this.assertElementDisplayed(this.sponsorsCheckbox);
    await this.assertElementDisplayed(this.termsAndConditions);
    await this.click(this.termsAndConditions);
  }

  async validateUsedEmailPopup(): Promise<void> {
    await this.waitUntilVisibleWithRetry(this.usedEmailPopup);
    await this.assertElementDisplayed(this.usedEmailPopup);
    await this.click(this.okButton);
  }

  async verifyAndSelectRegisterProfile(option: string): Promise<void> {
    await this.waitUntilVisibleWithRetry(this.registerProfileTitle);
    await this.assertElementDisplayed(this.registerOption("Yes"));
    await this.assertElementDisplayed(this.registerOption("No"));
    if (!["Yes", "No"].includes(option)) {
      throw new Error(`Invalid option: ${option}`);
    }
    await this.click(this.registerOption(option));
  }
}
