export const generateInvalidPassword = (length: number, forceExact = false): string => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const pwdLength = !forceExact && Math.random() < 0.25 ? Math.min(length, 5) : length;

    return Array.from({ length: pwdLength }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
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