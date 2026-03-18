import {LoginPage} from "./login.page";
import {selector} from "../factories/page.factory";
import {generateUniqueNames} from "../utils/helpers";
import {RegisterData} from "../data/register.data";
export class RegisterProfilePage extends LoginPage {

    public inputFieldByIndex = (index: number) =>
        selector(
            `//android.widget.ScrollView/android.widget.EditText[${index}]`,
            '',
            `Input field at index ${index}`
        )
    public enterTextInFieldByIndex = async (index: number, value: any): Promise<void> => {
        await this.click(this.inputFieldByIndex(index));
        await this.type(this.inputFieldByIndex(index), value)
    }

    public genderDropdown = selector(
        '~Gender',
        '',
        'Gender dropdown trigger'
    )
    public genderOption = (value: string) =>
        selector(
            `~${value}`,
            '',
            `${value} gender option`
        )
    public organisationTrigger = selector(
        '~Select an Organisation',
        '',
        'Organisation trigger'
    )

    public organisationSearchField = selector(
        '//android.widget.EditText',
        '',
        'Organisation search field'
    )
    public organisationResultContains = (value: string) => {
        return selector(
            `//android.widget.Button[contains(@content-desc,"${value}")]`,
            '',
            `${value} organisation result`
        )
    }

    public sponsorsCheckbox = selector(
        '~Would you like to receive special offers from our sponsors including FREE & or discounted items, prize giveaways, news etc',
        '',
        'Sponsors checkbox'
    )

    public termsAndConditions = selector(
        '//android.widget.ScrollView/android.view.View[13]',
        '',
        'Terms and Conditions checkbox'
    )
    public nextButton = selector(
        '~Next',
        '',
        'Next button'
    )
    public registerProfileTitle = selector(
        '~Register your Profile\n(Player, Coach, Referee, Other)',
        '',
        'Register profile title'
    )

    public registerOption = (value: string) =>
        selector(
            `~${value}`,
            '',
            `${value} option`
        )

    async fillPasswordFields(password: string): Promise<void> {
        await this.enterTextInFieldByIndex(2, password)
        await this.enterTextInFieldByIndex(3, password)
    }

    async fillFirstAndLastNameWithGenerated(): Promise<void> {
        const { firstName, lastName } = generateUniqueNames()
        await this.enterTextInFieldByIndex(4, firstName)
        await this.enterTextInFieldByIndex(5, lastName)

    }
    async verifyAndSelectGender(value: string): Promise<void> {
        await this.click(this.genderDropdown)
        for (const option of RegisterData.allGenderOptions) {
            await this.waitUntilVisibleWithRetry(this.genderOption(option))
        }
        if (!RegisterData.allGenderOptions.includes(value)) {
            throw new Error(`Invalid gender option: ${value}`)
        }
        await this.click(this.genderOption(value))
    }
    async selectOrganisation(value: string): Promise<void> {
        await this.click(this.organisationTrigger)
        await this.click(this.organisationSearchField);
        await this.type(this.organisationSearchField, value)
        // wait for result and select
        const option = this.organisationResultContains(value)
        await this.waitUntilVisibleWithRetry(option)
        await this.click(option)
    }
    async addPhoneNumber(number:number): Promise<void> {
        await this.enterTextInFieldByIndex(5, number)

    }
    async verifyAndAcceptTerms(): Promise<void> {
        await this.assertElementDisplayed(this.sponsorsCheckbox)
        await this.assertElementDisplayed(this.termsAndConditions)
        await this.click(this.termsAndConditions)
    }
    async verifyAndSelectRegisterProfile(option: string): Promise<void> {
        await this.waitUntilVisibleWithRetry(this.registerProfileTitle)
        await this.assertElementDisplayed(this.registerOption('Yes'))
        await this.assertElementDisplayed(this.registerOption('No'))
        if (!['Yes', 'No'].includes(option)) {
            throw new Error(`Invalid option: ${option}`)
        }
        await this.click(this.registerOption(option))
    }
}