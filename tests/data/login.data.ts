export const LoginData = {
  loginHeading: "Log In",
  email: "shahshahbaz64@gmail.com",
  password: "Connect123",
  manager1Email: "shahshahbaz64+manager1@gmail.com",
  manager2Email: "shahshahbaz64+manager2@gmail.com",
  coachEmail: "shahshahbaz64+coach1@gmail.com",
  refereeEmail: "shahshahbaz64+referee1only@gmail.com",
};

export const emailLoginTestData = {
  emptyEmail: {
    email: "",
    password: "rwkzvo4cd",
  },
};

export const invalidLoginErrorData = {
  invalidUsernameOrPassword: "Incorrect Username or Password",
  cases: [
    {
      name: "unregistered email + valid password",
      email: "notregistered@gmail.com",
      password: "ValidPass123",
    },
    {
      name: "valid email with invalid password",
      email: "dileepvarmau+dev2@gmail.com",
      password: "wrongpass123",
    },
    {
      name: "invalid email with valid password",
      email: "dileepvarmau+invalid@gmail.com",
      password: "rwkzvo4cd",
    },
    {
      name: "both email and password invalid",
      email: "dileepvarmau+invalid@gmail.com",
      password: "wrongpass123",
    },
  ],
};
