export const LoginData = {
    loginHeading: 'Log In',
    email:'shahshahbaz64@gmail.com',
    password: 'Connect123',

}
export const emailLoginTestData = {
    emptyEmail: {
        email: '',
        password: 'rwkzvo4cd'
    },
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