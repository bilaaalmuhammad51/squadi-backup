import { selector } from "../factories/page.factory";
import { LoginPage } from "./login.page";

export class HomePage extends LoginPage {
    public homeTab = selector(
        '~Home\nTab 1 of 5',
        '~Home\nTab 1 of 5',
        'Home Tab'
    )
    public drawsTab = selector(
        '~Draws\nTab 2 of 5',
        '~Draws\nTab 2 of 5',
        'draws Tab'
    )
    public laddersTab = selector(
        '~Ladders\nTab 3 of 5',
        '~Ladders\nTab 3 of 5',
        'Ladders Tab'
    )
    public liveScores = selector(
        '~Live Scores',
        '~Live Scores',
        'live scores'
    )
    public addTeamOrLeague = selector(
        '~Add a Team or League\nto your watchlist to get started\nAdd a Team or League',
        '~Add a Team or League\nto your watchlist to get started\nAdd a Team or League',
        'add team or league'
    )
    public welcomeBackHeading = selector(
        '//android.view.View[contains(@content-desc, \'Welcome back\')]',
        '',
        'Welcome Back Heading'
    )
    public drawsBtn = selector(
        'android=new UiSelector().descriptionContains("Draws")',
        '',
        'Draws Button'
    )
    public matchById = (matchId: string) =>
        selector(
            `android=new UiSelector().descriptionContains("Match ID: ${matchId}")`,
            '',
            `Match with ID ${matchId}`
        );

    async verifyHomeScreenElements() {
        await this.waitUntilVisibleWithRetry(this.liveScores);
        await this.assertElementDisplayed(this.homeTab);
        await this.assertElementDisplayed(this.liveScores);
        await this.scrollDown();
        await this.assertElementDisplayed(this.addTeamOrLeague);
        await this.assertElementDisplayed(this.drawsTab);
        await this.assertElementDisplayed(this.laddersTab);
    }

    async loginFlow(email:string, password:string) {
        await this.waitUntilVisibleWithRetry(this.loginButton);
        await this.assertElementDisplayed(this.welcomeHeading);
        await this.click(this.loginButton);
        await this.assertElementDisplayed(this.rememberPassword);
        await this.assertElementDisplayed(this.forgotPassword); 
        await this.addUserName(email);
        await this.addPassword(password);
        await this.click(this.login);
        await this.waitUntilVisibleWithRetry(this.homeTab);
        await this.assertElementDisplayed(this.homeTab);
        await this.assertElementDisplayed(this.drawsTab);
        await this.assertElementDisplayed(this.laddersTab);
    };

    async openShoduleTab() {
        await this.waitUntilVisibleWithRetry(this.drawsBtn);
        await this.click(this.drawsBtn);
    }

}