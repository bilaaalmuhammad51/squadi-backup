export type DualSelector = {
    android: string
    ios: string
}

export function selector(android: string, ios: string): DualSelector {
    return { android, ios }
}