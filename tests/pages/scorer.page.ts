import { selector } from "../factories/page.factory";
import { LoginPage } from "./login.page";

export class ScorerPage extends LoginPage {
    public teamSheetAlert = selector(
        '~Team Sheet not set',
        '',
        'Team Sheet Alert'
    )

    public matchTimer = selector(
        'android=new UiSelector().descriptionContains("STARTS IN")',
        '',
        'Match Timer'
    );

    public homeTeam = selector(
        '~HR-ASN2Club1-D1-T2',
        '',
        'Home Team'
    );

    public awayTeam = selector(
        '~HR-ASN2Club2-D1-T3',
        '',
        'Away Team'
    );

    public homeTeamSheetTab = selector(
        'android=new UiSelector().descriptionContains("HR-ASN2Club1-D1-T2")',
        '',
        'Home Team Sheet'
    );

    public awayTeamSheetTab = selector(
        'android=new UiSelector().descriptionContains("HR-ASN2Club2-D1-T3")',
        '',
        'Away Team Sheet'
    );

    public selectHomeTeamPlayer = selector(
        '//android.widget.Button[contains(@content-desc, "HR-ASN2Club1")]//android.view.View[2]',
        '',
        'Home Team Player'
    );

    public selectAwayTeamPlayer = selector(
        '//android.widget.Button[contains(@content-desc, "HR-ASN2Club2")]//android.view.View[2]',
        '',
        'Away Team Player'
    );

    public confirmBtn = selector(
        '~Confirm',
        '',
        'Confirm Button'
    );

    public startBtn = selector(
        '~Start',
        '',
        'Start Button'
    );

    public pauseBtn = selector(
        '~Pause',
        '',
        'Pause Button'
    );

    public resumeBtn = selector(
        '~Resume',
        '',
        'Resume Button'
    );

    public borrowPlayerBtn = selector(
        'android=new UiSelector().description("+ Borrow Player")',
        '',
        'Borrow Player Button'
    );

    public validatorName = selector(
        'android=new UiSelector().text("syed shah")',
        '',
        'Validator Name'
    );

    public teamSheetSubmittedMsg = selector(
        'android=new UiSelector().descriptionContains("Teamsheet submitted")',
        '',
        'Team Sheet Submitted Message'
    );

    public confirmStartBtn = selector(
        '~Confirm',
        '',
        'Confirm Start Button'
    );

    public homeTeamScore = selector(
        'android=new UiSelector().className("android.view.View").index(6)',
        '',
        'Home Team Score'
    );

    public awayTeamScore = selector(
        'android=new UiSelector().className("android.view.View").index(7)',
        '',
        'Away Team Score'
    );

    public addHomeTeamScore = selector(
        'android=new UiSelector().className("android.widget.ImageView").instance(2)',
        '',
        'Add Home Team Score'
    );

    public addAwayTeamScore = selector(
        'android=new UiSelector().className("android.widget.ImageView").instance(3)',
        '',
        'Add Away Team Score'
    );

    public undoHomeTeamScoreBtn = selector(
        'android=new UiSelector().description("Undo").instance(0)',
        '',
        'Undo Home Team Score'
    );

    public undoAwayTeamScoreBtn = selector(
        'android=new UiSelector().description("Undo").instance(1)',
        '',
        'Undo Away Team Score'
    );

    public errorPopup = selector(
        'android=new UiSelector().descriptionContains("Sorry").instance(1)',
        '',
        'Error Popup'
    );

    public doneBtn = selector(
        '~Done',
        '',
        'Done Button'
    );

    public matchById = (matchId: string) =>
        selector(
            `android=new UiSelector().descriptionContains("Match ID: ${matchId}")`,
            '',
            `Match with ID ${matchId}`
        );



    async validateScorerScreenElements() {
        await this.waitUntilVisibleWithRetry(this.teamSheetAlert);
        await this.assertElementDisplayed(this.teamSheetAlert);
        // await this.assertElementDisplayed(this.matchTimer);
        await this.assertElementDisplayed(this.homeTeam);
        await this.assertElementDisplayed(this.awayTeam);
    }

    async validateHomeTeamSheetElements() {
        await this.waitUntilVisibleWithRetry(this.homeTeamSheetTab);
        await this.assertElementDisplayed(this.homeTeamSheetTab);
        await this.click(this.homeTeamSheetTab);
        await this.assertElementDisplayed(this.awayTeamSheetTab);
        await this.assertElementDisplayed(this.borrowPlayerBtn)
        await this.assertElementDisplayed(this.validatorName);
    }

    async validateAwayTeamSheetElements() {
        await this.waitUntilVisibleWithRetry(this.awayTeamSheetTab);
        await this.assertElementDisplayed(this.awayTeamSheetTab);
        await this.click(this.awayTeamSheetTab);
        await this.assertElementDisplayed(this.borrowPlayerBtn)
        await this.assertElementDisplayed(this.validatorName);
    }

    async submitHomeTeamPlayersIfNotSubmitted() {
        const element = await this.getElement(this.teamSheetSubmittedMsg);
        const isSubmitted = await element.isExisting();

        if (!isSubmitted) {
            await this.waitUntilVisibleWithRetry(this.selectHomeTeamPlayer);
            await this.assertElementDisplayed(this.selectHomeTeamPlayer);
            await this.click(this.selectHomeTeamPlayer);
            await this.click(this.confirmBtn);
        }
    }

    async submitAwayTeamPlayersIfNotSubmitted() {
        const element = await this.getElement(this.teamSheetSubmittedMsg);
        const isSubmitted = await element.isExisting();

        if (!isSubmitted) {
            await this.waitUntilVisibleWithRetry(this.selectAwayTeamPlayer);
            await this.assertElementDisplayed(this.selectAwayTeamPlayer);
            await this.click(this.selectAwayTeamPlayer);
            await this.click(this.confirmBtn);
        }
    }

    async handleStartOrResumeMatch() {
        const element = await this.getElement(this.startBtn, { wait: false });
        const startBtn = await element.isExisting();
        if (startBtn) {
            await this.waitUntilVisibleWithRetry(this.startBtn);
            await this.click(this.startBtn);
            await this.waitUntilVisibleWithRetry(this.confirmStartBtn);
            await this.click(this.confirmStartBtn);
        } else {
            await this.waitUntilVisibleWithRetry(this.resumeBtn)
            await this.click(this.resumeBtn);
        }
    }

    async getTeamScores(teamName: any) {
        await this.waitUntilVisibleWithRetry(teamName);
        const scores = await this.getElementText(teamName);
        return scores;
    }

    async addTeamScore(scoreButton: any) {
        await this.waitUntilVisibleWithRetry(scoreButton);
        await this.click(scoreButton);
    }

    async undoTeamScore(undoButton: any) {
        await this.waitUntilVisibleWithRetry(undoButton);
        await this.click(undoButton);
    }

    async handleErrorPopup() {
        try {
            await (await this.getElement(this.errorPopup)).isDisplayed()
            await this.click(this.errorPopup);
        } catch { }
    }

    async clickDoneBtn() {
        try {
            await this.waitUntilVisibleWithRetry(this.doneBtn);
            await this.click(this.doneBtn);
        }
        catch { }
    }

    async completeMatchFlowIfNeeded(matchId: string) {
        const matchSelector = this.matchById(matchId);
        const matchCard = await this.getElement(matchSelector, { wait: false });
        const isMatchPending = await matchCard.isExisting();
        if (!isMatchPending) return;
        // Open match
        await this.scrollUntilElementVisible(matchSelector);
        await this.assertElementDisplayed(matchSelector);
        await this.click(matchSelector);
        await this.handleErrorPopup();
        // Validate scorer screen
        await this.validateScorerScreenElements();
        // Handle team sheet
        const alertEl = await this.getElement(this.teamSheetAlert, { wait: false });
        const isVisible = await alertEl.isExisting();
        if (isVisible) {
            await this.click(this.teamSheetAlert);
            await this.validateHomeTeamSheetElements();
            await this.submitHomeTeamPlayersIfNotSubmitted();
            await this.validateAwayTeamSheetElements();
            await this.submitAwayTeamPlayersIfNotSubmitted();
            await this.clickDoneBtn();
        }
        // Start / Resume match
        await this.handleStartOrResumeMatch();
        // Scores handling
        const initialHomeScore = await this.getTeamScores(this.homeTeamScore);
        const initialAwayScore = await this.getTeamScores(this.awayTeamScore);
        await this.addTeamScore(this.addHomeTeamScore);
        const homeScoreAfter = await this.getTeamScores(this.homeTeamScore);
        await this.addTeamScore(this.addAwayTeamScore);
        const awayScoreAfter = await this.getTeamScores(this.awayTeamScore);
        expect(homeScoreAfter).not.toEqual(initialHomeScore);
        expect(awayScoreAfter).not.toEqual(initialAwayScore);
        await this.undoTeamScore(this.undoHomeTeamScoreBtn);
        const homeScoreAfterUndo = await this.getTeamScores(this.homeTeamScore);
        await this.undoTeamScore(this.undoAwayTeamScoreBtn);
        const awayScoreAfterUndo = await this.getTeamScores(this.awayTeamScore);
        expect(homeScoreAfterUndo).toEqual(initialHomeScore);
        expect(awayScoreAfterUndo).toEqual(initialAwayScore);
    }


}