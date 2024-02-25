import { Page } from "@playwright/test";
import { generalURL } from "../../environment/environment";

export class LoginPage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private locators = {
    google: () => this.page.locator('//input[@value="google"]'),
    microsoft: () => this.page.locator('//input[@value="microsoft"]'),
    kitconnect: () => this.page.locator('//input[@value="kitconnect"]'),
    sign_in: () => this.page.locator('//button[@data-action="submit"]'),
  };

  public async goto() {
    await this.page.goto(generalURL);
    await this.page.waitForResponse((response) => response.status() === 200);
    await this.page.waitForLoadState("domcontentloaded");
  }

  public async selectProvider(provider: "google" | "microsoft" | "kitconnect") {
    const providerMap = {
      google: () => this.locators.google(),
      microsoft: () => this.locators.microsoft(),
      kitconnect: () => this.locators.kitconnect(),
    };

    await providerMap[provider]().click();
  }
}
