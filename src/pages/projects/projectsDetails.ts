import { Page } from "@playwright/test";

export default class ProjectsDetails {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private locators = {
    manage: () =>
      this.page.locator("//span").getByText("Manage", { exact: true }),
    info: () => this.page.getByAltText("open right drawer"),
  };

  public async viewKitInfo() {
    await this.locators.info().waitFor({ state: "visible" });
    await this.locators.info().click();
  }
}
