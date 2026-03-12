import { browser } from '@wdio/globals'

export async function getPlatform(): Promise<'android' | 'ios'> {
    const platformName = String(browser.capabilities.platformName || '').toLowerCase()

    if (platformName.includes('android')) {
        return 'android'
    }

    return 'ios'
}