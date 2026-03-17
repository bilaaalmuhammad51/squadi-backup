export const LoginData = {
    loginHeading: 'Log In',
    email:'dileepvarmauu+dev2@gmail.com',
    password: 'rwkzvo4cd',

}
export const invalidLoginData = {
    // Password length validation
    shortPasswords: [
        'abc12',
        'abc123',
        'abc1234',
        'abc12345'
    ],
    invalidPasswords: [
        'rwkzvo4ce',
        'rwkzvo4c1',
        'rwkzvo4c',
        'rwkzvo4cdx',
        'RWKZVO4CD',
    ]
};
export const emailLoginTestData = {
    emptyEmail: {
        email: '',
        password: 'rwkzvo4cd'
    },

    invalidEmails: [
        { email: 'abc123', password: 'rwkzvo4cd' },                 // no @
        { email: 'test@com', password: 'rwkzvo4cd' },                // incomplete domain
        { email: 'test.com', password: 'rwkzvo4cd' },                // missing @
        { email: '@gmail.com', password: 'rwkzvo4cd' },              // missing local part

        { email: ' test@gmail.com', password: 'rwkzvo4cd' },         // leading space
        { email: 'test@gmail.com ', password: 'rwkzvo4cd' },         // trailing space
        { email: 'test @gmail.com', password: 'rwkzvo4cd' },         // internal space

        { email: 'test@@gmail.com', password: 'rwkzvo4cd' },         // multiple @
        { email: 'test@gmail', password: 'rwkzvo4cd' },              // missing extension

        { email: 'te<>st@gmail.com', password: 'rwkzvo4cd' },        // invalid characters
        { email: 'test#gmail.com', password: 'rwkzvo4cd' },          // invalid format

        { email: 'a'.repeat(300) + '@gmail.com', password: 'rwkzvo4cd' } // very long email
    ],

    validEmailSamples: [
        { email: 'test@gmail.com', password: 'rwkzvo4cd' },
        { email: 'DILEEPVARMAU+DEV2@GMAIL.COM', password: 'rwkzvo4cd' }, // uppercase + alias
        { email: 'dileepvarmau+dev2@gmail.com', password: 'rwkzvo4cd' }  // lowercase + alias
    ]
};
export const invalidLoginErrorData = {
    invalidUsernameOrPassword: "Invalid username or password",
    cases: [
        {
            name: "unregistered email + valid password",
            email: "notregistered@gmail.com",
            password: "ValidPass123"
        },
        {
            name: "valid email with invalid password",
            email: "dileepvarmau+dev2@gmail.com",
            password: "wrongpass123"
        },
        {
            name: "invalid email with valid password",
            email: "dileepvarmau+invalid@gmail.com",
            password: "rwkzvo4cd"
        },
        {
            name: "both email and password invalid",
            email: "dileepvarmau+invalid@gmail.com",
            password: "wrongpass123"
        }
    ]
};