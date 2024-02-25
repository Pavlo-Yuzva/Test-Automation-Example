import { Page } from "@playwright/test";

export class GooglePage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private locators = {
    email: () => this.page.locator('//input[@type="email"]'),
    password: () => this.page.locator('//input[@name="Passwd"]'),
  };

  public async login(username: string, password: string) {
    await this.locators.email().waitFor({ state: "visible" });
    await this.locators.email().fill(username);
    await this.locators.email().press("Enter");

    await this.locators.password().waitFor({ state: "visible" });
    await this.locators.password().fill(password);
    await this.locators.password().press("Enter");
  }
}
