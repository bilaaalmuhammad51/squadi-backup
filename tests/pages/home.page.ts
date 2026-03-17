import {selector} from "../factories/page.factory";
import {LoginPage} from "./login.page";

export class HomePage extends LoginPage {
    public homeTab = selector(
        '~Home\nTab 1 of 5',
        '',
        'Home Tab'
    )
    public drawsTab = selector(
        '~Draws\nTab 2 of 5',
        '',
        'draws Tab'
    )
    public laddersTab = selector(
        '~Ladders\nTab 3 of 5',
        '',
        'Ladders Tab'
    )
    public welcomeBackHeading = selector(
        '//android.view.View[contains(@content-desc, \'Welcome back\')]',
        '',
        'Welcome Back Heading'
    )
}