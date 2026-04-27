import allureReporter from "@wdio/allure-reporter";
export const generateInvalidPassword = (length: number, forceExact = false): string => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const pwdLength = !forceExact && Math.random() < 0.25 ? Math.min(length, 5) : length;

    return Array.from({ length: pwdLength }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};
export const generateValidEmailSample = () => {
    const cases = [
        { email: "test@gmail.com", password: "rwkzvo4cd" },
        { email: "DILEEPVARMAU+DEV2@GMAIL.COM", password: "rwkzvo4cd" },
        { email: "dileepvarmau+dev2@gmail.com", password: "rwkzvo4cd" },
    ];

    return cases[Math.floor(Math.random() * cases.length)];
};
export const generateInvalidEmail = (length: number = 5): string => {
    const cases = [
        () => "userexample.com",                         // no @
        () => "user@",                                   // no domain
        () => "@example.com",                            // no username
        () => "user@.com",                               // invalid domain
        () => "user@example",                             // no TLD
        () => "user@@example.com",                        // double @
        () => "user example@com",                         // space inside
        () => 'a'.repeat(300) + '@gmail.com',
    ];

    return cases[Math.floor(Math.random() * cases.length)]();
};
export const generateUniqueEmail = (): string => {
    const randomStr = Math.random().toString(36).slice(2, 10)
    const timestamp = Date.now()

    return `test_qa_${randomStr}_${timestamp}@gmail.com`
}
export const generateUniqueNames = (): { firstName: string; lastName: string } => {
    const randomStr = Math.random().toString(36).slice(2, 6)
    const timestamp = Date.now().toString().slice(-4)

    return {
        firstName: `Test${randomStr}`,
        lastName: `User${timestamp}`
    }
}
export async function step(name: string, action: () => Promise<void>) {
    allureReporter.startStep(name);
    try {
        await action();
        allureReporter.endStep();
    } catch (err) {
        allureReporter.endStep();
        throw err;
    }
}
export function generatePasswordByLength(length: number): string {
    const base = "Abc12345xyz";
    return base.slice(0, length);
}

