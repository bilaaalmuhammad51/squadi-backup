export type DualSelector = {
    android: string
    ios: string
    name?: string
    readonly log: string
}
export function selector(
    android: string,
    ios: string,
    name?: string
): DualSelector {
    return {
        android,
        ios,
        name,
        get log() {
            return name ?? JSON.stringify({ android, ios })
        }
    }
}
export async function $(dual: DualSelector) {
    const selector = driver.isAndroid ? dual.android : dual.ios;
    if (!selector) throw new Error(`No selector defined for platform ${driver.isAndroid ? 'Android' : 'iOS'}`);
    return await browser.$(selector);
}