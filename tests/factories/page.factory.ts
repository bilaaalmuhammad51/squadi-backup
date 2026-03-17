export type DualSelector = {
    android: string
    ios: string
    name?: string
}

export function selector(android: string, ios: string,name?: string): DualSelector {
    return { android, ios, name}
}