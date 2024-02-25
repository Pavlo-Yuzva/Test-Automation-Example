import { Page, expect } from "@playwright/test";

export class AdminPage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private locators = {
    disable: () => this.page.getByText("Disable", { exact: true }),
    delete: () => this.page.getByText("Delete", { exact: true }),
    membersTab: () => this.page.locator('//div[@aria-label="Members"]'),
    invitesTab: () => this.page.locator('//div[@aria-label="Invites"]'),
    subscriptionTab: () =>
      this.page.locator('//div[@aria-label="Subscription"]'),
    settingsTab: () => this.page.locator('//div[@aria-label="Settings"]'),
    invite: () =>
      this.page.locator("//span").getByText("Invite", { exact: true }),
    resend: () =>
      this.page.locator("//span").getByText("Resend", { exact: true }),
    email: () => this.page.locator('//input[@type="email"]'),
    creatorOption: () =>
      this.page.locator('//input[contains(@value, "creator")]'),
    consumerOption: () =>
      this.page.locator('//input[contains(@value, "consumer")]'),
    submitInvite: () => this.page.locator('//button[@type="submit"]'),
    inviteSuccessMessage: () =>
      this.page.getByText("Successfully created inventation.", { exact: true }),
    invitedMember: () => this.page.locator('//div[@ref="eCheckbox"]'),
  };

  public async switchTabTo(
    tab: "members" | "invites" | "subscription" | "settings"
  ) {
    const tabMap = {
      members: () => this.locators.membersTab(),
      invites: () => this.locators.invitesTab(),
      subscription: () => this.locators.subscriptionTab(),
      settings: () => this.locators.settingsTab(),
    };

    await tabMap[tab]().click();
  }

  public async sendInvite(whom: string, role: "creator" | "consumer") {
    await this.locators.invite().waitFor({ state: "visible" });
    await this.locators.invite().click();

    await this.locators.email().waitFor({ state: "visible" });
    await this.locators.email().fill(whom);
    await this.locators.email().press("a");

    const roleMap = {
      creator: () => this.locators.creatorOption(),
      consumer: () => this.locators.consumerOption(),
    };

    await roleMap[role]().click();

    await this.locators.submitInvite().click();
  }

  public async resendInvite() {
    try {
      await this.locators.resend().click({ timeout: 5000 });
      await expect(this.locators.inviteSuccessMessage()).toBeVisible({
        timeout: 2000,
      });
    } catch {
      await this.sendInvite(
        (Math.random() * 9999).toString() + "@mail.abc",
        "creator"
      );

      await this.locators.resend().click();
      await expect(this.locators.inviteSuccessMessage()).toBeVisible();

      await this.locators.resend().click({ timeout: 5000 });
      await expect(this.locators.inviteSuccessMessage()).toBeVisible();
    }
  }
}
