import { Page } from "@playwright/test";

export class KitsPage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public pubLocators = {
    kitCreateSuccess: () => this.page.getByText("Successfully updated kit."),
  };

  private locators = {
    create: () =>
      this.page.locator("//span").getByText("Create", { exact: true }),
    copy: () => this.page.locator("//span").getByText("Copy", { exact: true }),
    kitName: () => this.page.locator('//input[@name="name"]'),
    kitDescription: () => this.page.getByPlaceholder("Description"),
    kit_tags: () => this.page.getByPlaceholder("Enter").getByLabel("Tags"),
    kitSubmit: () =>
      this.page.locator("//button").getByText("create", { exact: true }),

    showArchived: () =>
      this.page.locator('//input[@aria-label="Show Archived"]'),
    tableView: () => this.page.locator('//button[@value="table"]'),
    cardsView: () => this.page.locator('//button[@value="cards"]'),
    info: () => this.page.getByAltText("open right drawer"),
    searchBar: () => this.page.getByPlaceholder("Search"),
  };

  public async viewKitInfo() {
    await this.locators.info().waitFor({ state: "visible" });
    await this.locators.info().click();
  }

  public async selectKit(name: string) {
    await this.page
      .locator("//a")
      .getByText(name)
      .waitFor({ state: "visible" });
    await this.page.locator("//a").getByText(name).click();
  }

  public async searchFor(text: string) {
    await this.locators.searchBar().waitFor({ state: "visible" });
    await this.locators.searchBar().fill(text);
  }

  public async createKit(name: string, description: string) {
    await this.locators.create().click();
    await this.locators.kitName().waitFor({ state: "visible" });
    await this.locators.kitName().fill(name);
    await this.locators.kitDescription().fill(description);
    await this.locators.kitSubmit().click();
  }

  public async copyKit(name: string, description: string) {
    await this.locators.copy().click();
    await this.locators.kitName().waitFor({ state: "visible" });
    await this.locators.kitName().fill(name);
    await this.locators.kitDescription().fill(description);
    await this.locators.kitSubmit().click();
  }
}
