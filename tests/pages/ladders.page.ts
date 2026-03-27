import { LoginPage } from "./login.page";
import { selector } from "../factories/page.factory";
import { $ } from "../factories/page.factory";

export class LaddersPage extends LoginPage {

    public laddersTab = selector(
        'android=new UiSelector().descriptionContains("Ladders")',
        '',
        'Ladders Tab'
    )

    public shortTab = selector(
        '~Short',
        '',
        'Short Tab'
    )

    public fullTab = selector(
        '~Full',
        '',
        'Full Tab'
    )

    public formTab = selector(
        '~Form',
        '',
        'Form Tab'
    )

    public rankColumn = selector(
        '~Rank',
        '',
        'Rand column'
    )

    public matchPlayedColumn = selector(
        '~MP',
        '',
        'Match Played column'
    )

    public goalDifferenceColumn = selector(
        '~GD',
        '',
        'Goal difference column'
    )

    public pointsColumn = selector(
        '~PTS',
        '',
        'Points column'
    )

    public winColumn = selector(
        '~W',
        '',
        'Win column'
    )

    public DrawColumn = selector(
        '~D',
        '',
        'Draw column'
    )

    public LostColumn = selector(
        '~L',
        '',
        'Lost column'
    )

    public GoalsForTeamColumn = selector(
        '~GF',
        '',
        'Goals For Team column'
    )

    public GoalsForAgainstTeamColumn = selector(
        '~GF',
        '',
        'Goals For Team column'
    )

    public GoalAverageColumn = selector(
        '~GA%',
        '',
        'Goal average column'
    )

    public lastFiveMatchesResultsColumn = selector(
        '~Latest → Last 5',
        '',
        'Last five matches results column'
    )

    public nextMatchColumn = selector(
        '~Next',
        '',
        'next column'
    )

    public horizontalScrollContainer = selector(
        'android=new UiSelector().className("android.widget.HorizontalScrollView")',
        '',
        'Horizontal scroll container'
    )


    async openLaddersTab(){
        await this.waitUntilVisibleWithRetry(this.laddersTab);
        await this.click(this.laddersTab);
    }

    async openShortLaddersTab(){
        await this.waitUntilVisibleWithRetry(this.shortTab);
        await this.click(this.shortTab);
    }

    async openFullLaddersTab(){
        await this.waitUntilVisibleWithRetry(this.fullTab);
        await this.click(this.fullTab);
    }

    async openFormLaddersTab(){
        await this.waitUntilVisibleWithRetry(this.formTab);
        await this.click(this.formTab);
    }

    async validateShortLaddersTabElements(){
        await this.waitUntilVisibleWithRetry(this.rankColumn);
        await this.assertElementDisplayed(this.rankColumn);
        await this.assertElementDisplayed(this.matchPlayedColumn);
        await this.assertElementDisplayed(this.goalDifferenceColumn);
        await this.assertElementDisplayed(this.pointsColumn);
    }

    async validateFullLaddersTabElements(){
        const container = await $(this.horizontalScrollContainer)
        await this.waitUntilVisibleWithRetry(this.rankColumn);
        await this.assertElementDisplayed(this.rankColumn);
        await this.assertElementDisplayed(this.matchPlayedColumn);
        await this.assertElementDisplayed(this.winColumn);
        await this.assertElementDisplayed(this.DrawColumn);
        await this.assertElementDisplayed(this.LostColumn);
        await this.scrollToElementHorizontal(this.horizontalScrollContainer, "right");
        await this.waitUntilVisibleWithRetry(this.GoalsForTeamColumn);
        await this.assertElementDisplayed(this.GoalsForTeamColumn);
        await this.assertElementDisplayed(this.GoalsForAgainstTeamColumn);
        await this.assertElementDisplayed(this.pointsColumn);
        await this.scrollToElementHorizontal(this.horizontalScrollContainer, "right");
        await this.waitUntilVisibleWithRetry(this.GoalAverageColumn);
        await this.assertElementDisplayed(this.GoalAverageColumn);
        await this.scrollToElementHorizontal(this.horizontalScrollContainer, "right");
        await this.assertElementDisplayed(this.goalDifferenceColumn);
    }

    async validateFormLaddersTabElements(){
        await this.waitUntilVisibleWithRetry(this.rankColumn);
        await this.assertElementDisplayed(this.rankColumn);
        await this.assertElementDisplayed(this.lastFiveMatchesResultsColumn);
        await this.scrollToElementHorizontal(this.horizontalScrollContainer, "right");
        await this.assertElementDisplayed(this.nextMatchColumn);
    }
}