import { LoginPage } from "./login.page";
import { selector } from "../factories/page.factory";

export class SchedulePage extends LoginPage {

    public addTeamBtn = selector(
        'android=new UiSelector().descriptionContains("Add a Team or League").childSelector(new UiSelector().clickable(true))',
        '',
        'Add Team or league Button'
    );

    public searchField = selector(
        '~Add a Team or League',
        '',
        'search field'
    );

    public searchTeam = selector(
        'android=new UiSelector().className("android.widget.EditText")',
        '',
        'search team'
    );

    public selectTeamOrClub = selector(
        'android=new UiSelector().descriptionContains("HR-ASN2Club2")',
        '',
        'select team'
    );

    public searchTeamTab = selector(
        'android=new UiSelector().descriptionContains("Team")',
        '',
        'select team or club'
    );

    public searchLeagueTab = selector(
        'android=new UiSelector().descriptionContains("League")',
        '',
        'select team'
    );

    public selectTeam = selector(
        'android=new UiSelector().descriptionContains("HR-ASN2Club2-D1-T3")',
        '',
        'select team'
    );

    public addToWatchlistBtn = selector(
        'android=new UiSelector().descriptionContains("watchlist")',
        '',
        'add items to watchlist'
    );

    public doneBtn = selector(
        '~Done',
        '',
        'Done button'
    );

    public cancelBtnForSelectedTeam = selector(
        'android=new UiSelector().className("android.widget.Button").instance(2)',
        '',
        'Done button'
    );

    public settingsButton = selector(
        'android=new UiSelector().className("android.widget.ImageView").instance(1)',
        '',
        'Done button'
    );

    public handleUnexpectedPopup = selector(
        'android=new UiSelector().description("Unexpected end of input").instance(1)',
        '',
        'Unexpected Popup'
    );

    public timelineHeading = selector(
        '~Timeline',
        '',
        'Timeline heading'
    );

    public allTabSelector = selector(
        'android=new UiSelector().descriptionContains("All")',
        '',
        'All Tab '
    );

    public firstHalfTab = selector(
        'android=new UiSelector().descriptionContains("1st")',
        '',
        'First half Tab'
    );

    public secondHalfTab = selector(
        'android=new UiSelector().descriptionContains("2nd")',
        '',
        'Second half Tab'
    );

    public scoreBreakdownTab = selector(
        'android=new UiSelector().descriptionContains("Breakdown")',
        '',
        'Score Breakdown Tab Button'
    );

    public scoreDetailsForFirstHalf = selector(
        'android=new UiSelector().descriptionContains("1st")',
        '',
        'Score Details for First half'
    );

    public scoreDetailsForSecondHalf = selector(
        'android=new UiSelector().descriptionContains("2nd")',
        '',
        'Score Details for Second half'
    );

    public playerStatusTab = selector(
        'android=new UiSelector().descriptionContains("Player")',
        '',
        'player Status Tab Button'
    );

    public matchCardById = (matchId: string) =>
        selector(
            `android=new UiSelector().descriptionContains("Match ID: ${matchId}")`,
            '',
            `Match card with ID ${matchId}`
        );

    async cancelSelectedTeamIfNeeded() {
        const button = await this.getElement(this.addTeamBtn, { wait: false })
        const isAddTeamBtn = await button.isExisting();
        if (!isAddTeamBtn) {
            await this.waitUntilVisibleWithRetry(this.settingsButton);
            await this.click(this.settingsButton);
            await this.waitUntilVisibleWithRetry(this.selectTeam);
            await this.assertElementDisplayed(this.cancelBtnForSelectedTeam);
            await this.click(this.cancelBtnForSelectedTeam);
            await this.click(this.doneBtn);
            await this.waitUntilVisibleWithRetry(this.addTeamBtn);
        }
    }

    async searchTeamAndSelect(teamName: string) {
        // ------ search and select club ------
        await this.waitUntilVisibleWithRetry(this.searchField);
        await this.click(this.searchField);
        await this.waitUntilVisibleWithRetry(this.searchTeam);
        await this.click(this.searchTeam);
        await this.type(this.searchTeam, teamName)
        await this.waitUntilVisibleWithRetry(this.selectTeamOrClub);
        await this.click(this.selectTeamOrClub);
        // ------ validte search tab elements ------
        await this.waitUntilVisibleWithRetry(this.searchTeamTab);
        await this.assertElementDisplayed(this.searchTeamTab);
        await this.assertElementDisplayed(this.searchLeagueTab);
        // ------ validte add item to watchlist button shown shen any team is seletected ------
        await this.waitUntilVisibleWithRetry(this.selectTeam)
        await this.click(this.selectTeam);
        await this.assertElementDisplayed(this.addToWatchlistBtn);
        await this.click(this.selectTeam);
        await this.assertElementNotDisplayed(this.addToWatchlistBtn);
        await this.waitUntilVisibleWithRetry(this.selectTeam)
        await this.click(this.selectTeam);
        await this.waitUntilVisibleWithRetry(this.addToWatchlistBtn);
        await this.click(this.addToWatchlistBtn);
        // ------ validate after add to watchlist any team shown as added and click on Done button------
        await this.waitUntilVisibleWithRetry(this.selectTeam)
        await this.waitUntilVisibleWithRetry(this.doneBtn);
        await this.click(this.doneBtn);
        // ------ validte selected team is visible in search tab and its cancel button shown ------
        await this.waitUntilVisibleWithRetry(this.selectTeam);
        await this.assertElementDisplayed(this.selectTeam);
        await this.assertElementDisplayed(this.cancelBtnForSelectedTeam);
        // ------ click on done button ------
        await this.waitUntilVisibleWithRetry(this.doneBtn);
        await this.click(this.doneBtn);
    }

    async openMatchDetailsByID(matchID: string) {
        const matchSelector = this.matchCardById(matchID);
        await this.scrollUntilElementVisible(matchSelector);
        await this.waitUntilVisibleWithRetry(matchSelector);
        await this.click(matchSelector);
        try{
            await this.waitUntilVisibleWithRetry(this.handleUnexpectedPopup);
            await this.click(this.handleUnexpectedPopup);
        }catch{}
    }

    async openAndValidatePlayerStatusTab (){
        await this.waitUntilVisibleWithRetry(this.playerStatusTab);
        await this.click(this.playerStatusTab);
    }

    async openAndValidateScoreBreakdownTab(){
        await this.waitUntilVisibleWithRetry(this.scoreBreakdownTab);
        await this.click(this.scoreBreakdownTab);
        await this.waitUntilVisibleWithRetry(this.scoreDetailsForFirstHalf);
        await this.assertElementDisplayed(this.scoreDetailsForFirstHalf);
        await this.assertElementDisplayed(this.scoreDetailsForSecondHalf);
    }

}