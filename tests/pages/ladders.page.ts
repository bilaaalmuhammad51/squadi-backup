import { selector } from "../factories/page.factory";
import { SchedulePage } from "./schedule.page";
import { hasFeature } from "../utils/features";

export class LaddersPage extends SchedulePage {
  public laddersTab = selector(
    'android=new UiSelector().descriptionContains("Ladders")',
    '-ios predicate string: name CONTAINS "Ladders"',
    "Ladders Tab",
  );

  public shortTab = selector("~Short", "~Short", "Short Tab");

  public fullTab = selector("~Full", "~Full", "Full Tab");

  public formTab = selector("~Form", "~Form", "Form Tab");

  public rankColumn = selector("~Rank", "~Rank", "Rand column");

  public matchPlayedColumn = selector("~MP", "~MP", "Match Played column");

  public goalDifferenceColumn = selector(
    "~GD",
    "~GD",
    "Goal difference column",
  );

  public pointsColumn = selector("~PTS", "~PTS", "Points column");

  /** Basketball's Short ladder tab shows "P" (Played) instead of MP + GD. */
  public playedColumn = selector("~P", "~P", "Played column");

  public winColumn = selector("~W", "~W", "Win column");

  public DrawColumn = selector("~D", "~D", "Draw column");

  public LostColumn = selector("~L", "~L", "Lost column");

  public GoalsForTeamColumn = selector("~GF", "~GF", "Goals For Team column");

  public GoalsForAgainstTeamColumn = selector(
    "~GA",
    "~GA",
    "Goals For Against Team column",
  );

  public GoalAverageColumn = selector("~GA%", "~GA%", "Goal average column");

  /** Basketball-only Full ladder columns (Byes, Forfeit Won/Lost, For, Against). */
  public byeColumn = selector("~B", "~B", "Bye column");

  public forfeitWinColumn = selector("~FW", "~FW", "Forfeit Win column");

  public forfeitLossColumn = selector("~FL", "~FL", "Forfeit Loss column");

  public forColumn = selector("~F", "~F", "For column");

  public againstColumn = selector("~A", "~A", "Against column");

  public lastFiveMatchesResultsColumn = selector(
    "~Latest → Last 5",
    "~Latest → Last 5",
    "Last five matches results column",
  );

  public nextMatchColumn = selector("~Next", "~Next", "next column");

  public horizontalScrollContainer = selector(
    'android=new UiSelector().className("android.widget.HorizontalScrollView")',
    '(//*[@type="XCUIElementTypeScrollView"])[2]',
    "Horizontal scroll container",
  );

  async openLaddersTab() {
    await this.waitUntilVisibleWithRetry(this.laddersTab);
    await this.click(this.laddersTab);
  }

  async isTeamAddedOrNot(): Promise<boolean> {
    const isNotAdded = await this.isElementVisible(this.addTeamBtn);
    return !isNotAdded;
  }

  async openShortLaddersTab() {
    await this.waitUntilVisibleWithRetry(this.shortTab);
    await this.click(this.shortTab);
  }

  async openFullLaddersTab() {
    await this.waitUntilVisibleWithRetry(this.fullTab);
    await this.click(this.fullTab);
  }

  async openFormLaddersTab() {
    await this.waitUntilVisibleWithRetry(this.formTab);
    await this.click(this.formTab);
  }

  async validateShortLaddersTabElements() {
    await this.waitUntilVisibleWithRetry(this.rankColumn);
    await this.assertElementDisplayed(this.rankColumn);
    if (hasFeature("ladderGoalDifference")) {
      await this.assertElementDisplayed(this.matchPlayedColumn);
      await this.assertElementDisplayed(this.goalDifferenceColumn);
    } else {
      await this.assertElementDisplayed(this.playedColumn);
    }
    await this.assertElementDisplayed(this.pointsColumn);
  }

  async validateFullLaddersTabElements() {
    await this.waitUntilVisibleWithRetry(this.rankColumn);
    await this.assertElementDisplayed(this.rankColumn);

    if (hasFeature("ladderGoalDifference")) {
      // Squadi: Rank, MP, W, D, L, GF, GA, PTS, GA%, GD
      await this.assertElementDisplayed(this.matchPlayedColumn);
      await this.assertElementDisplayed(this.winColumn);
      await this.assertElementDisplayed(this.DrawColumn);
      await this.assertElementDisplayed(this.LostColumn);
      await this.scrollToElementHorizontal(
        this.horizontalScrollContainer,
        "right",
      );
      await this.waitUntilVisibleWithRetry(this.GoalsForTeamColumn);
      await this.assertElementDisplayed(this.GoalsForTeamColumn);
      await this.assertElementDisplayed(this.GoalsForAgainstTeamColumn);
      await this.scrollToElementHorizontal(
        this.horizontalScrollContainer,
        "right",
      );
      await this.assertElementDisplayed(this.pointsColumn);
      await this.waitUntilVisibleWithRetry(this.GoalAverageColumn);
      await this.scrollToElementHorizontal(
        this.horizontalScrollContainer,
        "right",
      );
      await this.assertElementDisplayed(this.GoalAverageColumn);
      await this.assertElementDisplayed(this.goalDifferenceColumn);
    } else {
      // Basketball: Rank, P, W, L, D, B, FW, FL, F, A, PTS, GD
      await this.assertElementDisplayed(this.playedColumn);
      await this.assertElementDisplayed(this.winColumn);
      await this.assertElementDisplayed(this.LostColumn);
      await this.assertElementDisplayed(this.DrawColumn);
      await this.scrollToElementHorizontal(
        this.horizontalScrollContainer,
        "right",
      );
      await this.waitUntilVisibleWithRetry(this.byeColumn);
      await this.assertElementDisplayed(this.byeColumn);
      await this.assertElementDisplayed(this.forfeitWinColumn);
      await this.assertElementDisplayed(this.forfeitLossColumn);
      await this.scrollToElementHorizontal(
        this.horizontalScrollContainer,
        "right",
      );
      await this.waitUntilVisibleWithRetry(this.forColumn);
      await this.assertElementDisplayed(this.forColumn);
      await this.assertElementDisplayed(this.againstColumn);
      await this.scrollToElementHorizontal(
        this.horizontalScrollContainer,
        "right",
      );
      await this.assertElementDisplayed(this.pointsColumn);
      await this.waitUntilVisibleWithRetry(this.goalDifferenceColumn);
      await this.assertElementDisplayed(this.goalDifferenceColumn);
    }
  }

  async validateFormLaddersTabElements() {
    await this.waitUntilVisibleWithRetry(this.rankColumn);
    await this.assertElementDisplayed(this.rankColumn);
    await this.assertElementDisplayed(this.lastFiveMatchesResultsColumn);
    const isHorizontalScrollContainer = await this.isElementVisible(
      this.horizontalScrollContainer,
      2000,
    );
    if (isHorizontalScrollContainer) {
      await this.scrollToElementHorizontal(
        this.horizontalScrollContainer,
        "right",
      );
    }
    await this.assertElementDisplayed(this.nextMatchColumn);
  }
}
