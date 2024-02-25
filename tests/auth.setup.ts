import { test, expect } from "@playwright/test";
import { LoginPage } from "@src/pages/login/login";
import { MicrosoftPage } from "@src/pages/login/microsoft";
import { identityURL } from "@src/environment/environment";
import { microsoftCreds } from "@src/credentials/credentials";

let token: string;

test("Authentication", async ({ browser }) => {
  const page = await browser.newPage();

  const loginPage = new LoginPage(page);
  const microsoftPage = new MicrosoftPage(page);

  await loginPage.goto();
  await loginPage.selectProvider("microsoft");
  await microsoftPage.login(microsoftCreds.email, microsoftCreds.password);

  const tokenResponse = await page
    .waitForResponse(
      (response) =>
        response.url() === `${identityURL}/auth/accesstoken` &&
        response.status() === 200
    )
    .then(async (response) => (await response.json()) as { token: string });

  token = tokenResponse.token;

  expect(token).toBeDefined();

  process.env.ACCESS_TOKEN = token;
});
