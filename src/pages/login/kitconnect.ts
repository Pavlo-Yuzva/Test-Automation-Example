import { Page } from "@playwright/test";

export class KitconnectPage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private locators = {
    email: () =>
      this.page.locator(
        '//div[contains(@class, "lg")]//input[@name="username"]'
      ),
    password: () =>
      this.page.locator(
        '//div[contains(@class, "lg")]//input[@name="password"]'
      ),
    signIn: () =>
      this.page.locator(
        '//div[contains(@class, "lg")]//input[@name="signInSubmitButton"]'
      ),
  };

  public async login(username: string, password: string) {
    await this.locators.email().fill(username);
    await this.locators.password().fill(password);
    await this.locators.signIn().click();
  }
}
