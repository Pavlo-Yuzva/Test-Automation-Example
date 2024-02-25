import { Page } from "@playwright/test";

export class ProjectsPage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public pubLocators = {
    projectCreateSuccess: () =>
      this.page.getByText("Successfully created a project."),
    projectUpdateSuccess: () =>
      this.page.getByText("Successfully updated a project."),
  };

  private locators = {
    create: () => this.page.locator("//span").getByText("Create"),
    createInWindow: () =>
      this.page.locator("//span").getByText("create", { exact: true }),
    projectName: () =>
      this.page.locator(
        '//div[contains(@class, "Dialog")]//input[@name="name"]'
      ),
    projectDescription: () => this.page.getByPlaceholder("Description"),
    projectTags: () => this.page.getByPlaceholder("Enter").getByLabel("Tags"),
    projectSubmit: () =>
      this.page.locator("//button").getByText("create", { exact: true }),
    showArchived: () =>
      this.page.locator('//input[@aria-label="Show Archived"]'),
    tableView: () => this.page.locator('//button[@value="table"]'),
    cardsView: () => this.page.locator('//button[@value="cards"]'),
    info: () => this.page.getByAltText("open right drawer"),
    searchBar: () => this.page.getByPlaceholder("Search"),
    infoName: () => this.page.locator('//input[@name="name"]'),
    infoDescription: () => this.page.locator('//textarea[@rows="6"]'),
  };

  public async clickCreate() {
    await this.locators.create().waitFor({ state: "visible" });
    await this.locators.create().click();
  }

  public async clickWindowCreate() {
    await this.locators.createInWindow().click();
  }

  public async fillCreateProjectName(name: string) {
    await this.locators.projectName().waitFor({ state: "visible" });
    await this.locators.projectName().fill(name);
  }

  public async fillCreateProjectDescription(description: string) {
    await this.locators.projectDescription().fill(description);
    await this.locators.projectSubmit().click();
  }

  public async clickProjectInfo() {
    await this.locators.info().waitFor({ state: "visible" });
    await this.locators.info().click();
  }

  public async searchFor(text: string) {
    await this.locators.searchBar().waitFor({ state: "visible" });
    await this.locators.searchBar().fill(text);
  }

  public async fillInfoName(name: string) {
    await this.locators.infoName().waitFor({ state: "visible" });
    await this.locators.infoName().fill(name);
    await this.locators.projectName().press("Enter");
  }

  public async fillInfoDescription(description: string) {
    await this.locators.infoDescription().waitFor({ state: "visible" });
    await this.locators.infoDescription().fill(description);
    await this.locators.projectName().press("Enter");
  }
}
