import { Page, expect } from "@playwright/test";
import * as fs from "fs";

const downloadPath = "files/downloads";

export class DesktopPage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private locators = {
    download: () => this.page.getByAltText("DownloadURL"),
  };

  public async downloadInstaller() {
    await this.locators.download().click();

    await (
      await this.page.waitForEvent("download", { timeout: 30000 })
    ).saveAs(downloadPath);

    expect(fs.existsSync(downloadPath)).toBeTruthy();
  }
}
