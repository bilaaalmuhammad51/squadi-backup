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