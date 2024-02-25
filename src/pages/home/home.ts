import { Page } from "@playwright/test";
import { generalURL } from "@src/environment/environment";

export class HomePage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private locators = {
    accountUser: () =>
      this.page.locator(
        '//img[contains(@alt, "user data") and contains(@src, "Account_User")]'
      ),
    signOut: () => this.page.locator("//button").getByText("Sign Out"),
    home: () => this.page.locator('//div[@aria-label="Home"]'),
    projects: () => this.page.locator('//div[@aria-label="Projects"]'),
    kits: () => this.page.locator('//div[@aria-label="Kits"]'),
    desktop: () => this.page.locator('//div[@aria-label="Desktop"]'),
    admin: () => this.page.locator('//div[@aria-label="Admin"]'),
  };

  public async goto() {
    await this.page.goto(generalURL);
  }

  public async signOut() {
    await this.locators.accountUser().click();
    await this.locators.signOut().click();
  }

  public async clickOnTab(
    tab: "home" | "projects" | "kits" | "desktop" | "admin"
  ) {
    const tabMap = {
      home: () => this.locators.home().click(),
      projects: () => this.locators.projects().click(),
      kits: () => this.locators.kits().click(),
      desktop: () => this.locators.desktop().click(),
      admin: () => this.locators.admin().click(),
    };

    await tabMap[tab]();
  }
}
