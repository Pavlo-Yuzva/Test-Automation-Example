import { Page } from "@playwright/test";

export class MicrosoftPage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private locators = {
    email: () => this.page.locator('//input[@type="email"]'),
    password: () => this.page.locator('//input[@name="passwd"]'),
    staySigned: () => this.page.locator('//button[@id="declineButton"]'),
  };

  public async login(username: string, password: string) {
    await this.locators.email().fill(username);
    await this.locators.email().press("Enter");

    await this.locators.password().fill(password);
    await this.locators.password().press("Enter");

    await this.locators.staySigned().click();
  }
}
