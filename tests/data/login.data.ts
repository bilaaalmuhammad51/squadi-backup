import { App } from "../config/apps";

/**
 * Accounts for the app currently under test. The shape is unchanged so specs
 * keep working; the values now come from the active app profile
 * (tests/config/apps/<app>.app.ts) instead of being hardcoded to Squadi.
 */
export const LoginData = {
  loginHeading: "Log In",
  email: App.accounts.scorer.email,
  password: App.accounts.scorer.password,
  manager1Email: App.accounts.manager1.email,
  manager2Email: App.accounts.manager2.email,
  coachEmail: App.accounts.coach.email,
  refereeEmail: App.accounts.referee.email,
  parentEmail: App.accounts.parent.email,
};

export const namesOfUsers = App.names;

export const emailLoginTestData = {
  emptyEmail: {
    email: "",
    password: "rwkzvo4cd",
  },
};

// App-agnostic: these are all rejected credentials, so they need no real
// records in any environment.
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
