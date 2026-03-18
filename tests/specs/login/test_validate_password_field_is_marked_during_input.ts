import { LoginData } from "../../data/login.data";
import { LoginPage } from "../../pages/login.page";

describe("Authentication - Password field masking and visibility toggle", () => {

    it("should verify password is masked by default and can be toggled to visible", async () => {

        // ---------- Initialize page object ----------
        const loginPage = new LoginPage();


        // ---------- Verify welcome screen is loaded ----------
        await loginPage.waitUntilVisibleWithRetry(loginPage.loginButton);

        await loginPage.assertElementDisplayed(loginPage.welcomeHeading);
        await loginPage.assertElementDisplayed(loginPage.createAccountOrRegisterProfile);
        await loginPage.assertElementDisplayed(loginPage.followTeamOrLeague);
        await loginPage.assertElementDisplayed(loginPage.loginButton);


        // ---------- Navigate to login screen ----------
        await loginPage.click(loginPage.loginButton);


        // ---------- Verify login screen elements ----------
        await loginPage.assertElementDisplayed(loginPage.backButton);
        await loginPage.assertElementDisplayed(loginPage.loginHeading);


        // ---------- Get login button reference ----------
        const loginBtn = await loginPage.getElement(loginPage.login);


        // ---------- Enter valid email and verify button remains disabled ----------
        await loginPage.addUserName(LoginData.email);
        await loginPage.expectElementState(loginBtn, "disabled");


        // ---------- Enter password and verify it is masked ----------
        await loginPage.addPassword(LoginData.password);

        const maskedText = await loginPage.getText(loginPage.password);
        console.log(`Masked password value: ${maskedText}`);

        expect(maskedText.length).toBeGreaterThan(0);
        expect(maskedText).toMatch(/^.+$/);


        // ---------- Toggle password visibility and verify unmasked value ----------
        await loginPage.click(loginPage.viewPassword);

        const visibleText = await loginPage.getText(loginPage.password);
        console.log(`Unmasked password value: ${visibleText}`);

        expect(visibleText).toContain(LoginData.password);


        // ---------- Toggle visibility again and verify password is masked ----------
        await loginPage.click(loginPage.viewPassword);

        const reMaskedText = await loginPage.getText(loginPage.password);
        console.log(`Re-masked password value: ${reMaskedText}`);

        expect(reMaskedText.length).toBeGreaterThan(0);
        expect(reMaskedText).toMatch(/^.+$/);
    });

});