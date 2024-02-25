import { Page } from "@playwright/test";

export class TenantPage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private locators = {
    tenant: (tenant: string) => this.page.locator("//div").getByText(tenant),
    guide: () =>
      this.page.locator(
        '//div[@role="alertdialog"]//button[@aria-label="Close guide"]'
      ),
  };

  public async selectTenant(tenantName: string) {
    await this.locators.tenant(tenantName).click();
  }
}
