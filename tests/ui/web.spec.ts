require("dotenv").config();

import { expect, test } from "@playwright/test";
import { generateName } from "@src/helpers";
import {
  googleCreds,
  kitconnectCreds,
  microsoftCreds,
} from "@src/credentials/credentials";
import { PageManager } from "@src/pages/pageManager";

let pm: PageManager;

test.beforeAll(async (browser) => {
  const page = await browser.context.newPage();
  pm = new PageManager(page);
});

test.describe("Login tests", () => {
  test("It should login via Google", async () => {
    await pm.loginPage.goto();
    await pm.loginPage.selectProvider("google");
    await pm.googlePage.login(googleCreds.email, googleCreds.password);

    await pm.tenantPage.selectTenant(`${process.env.GOOGLE_TENANT_NAME}`);

    //Assert
    await expect(
      pm.page.getByText(`${process.env.GOOGLE_TENANT_NAME}`)
    ).toBeVisible();
  });

  test("It should login via Microsoft", async () => {
    //Action
    await pm.loginPage.goto();
    await pm.loginPage.selectProvider("microsoft");
    await pm.microsoftPage.login(microsoftCreds.email, microsoftCreds.password);

    await pm.tenantPage.selectTenant(`${process.env.MICROSOFT_TENANT_NAME}`);

    //Assert
    await expect(
      pm.page.getByText(`${process.env.MICROSOFT_TENANT_NAME}`)
    ).toBeVisible();
  });

  test("It should login via Kitconnect", async () => {
    await pm.loginPage.goto();
    await pm.loginPage.selectProvider("kitconnect");
    await pm.kitconnectPage.login(
      kitconnectCreds.email,
      kitconnectCreds.password
    );
    await pm.tenantPage.selectTenant(`${process.env.KITCONNECT_TENANT_NAME}`);

    //Assert
    await expect(
      pm.page.getByText(`${process.env.KITCONNECT_TENANT_NAME}`)
    ).toBeVisible();
  });
});

test.describe("Functional tests", () => {
  test.beforeEach(async () => {
    await pm.loginPage.goto();
    await pm.loginPage.selectProvider("google");
    await pm.googlePage.login(googleCreds.email, googleCreds.password);

    await pm.tenantPage.selectTenant(`${process.env.GOOGLE_TENANT_NAME}`);
  });

  test("Create project", async () => {
    //Action
    await pm.homePage.clickOnTab("projects");
    await pm.projectsPage.clickCreate();
    await pm.projectsPage.fillCreateProjectName(generateName());
    await pm.projectsPage.fillCreateProjectDescription(generateName());
    await pm.projectsPage.clickWindowCreate();

    //Assert
    await expect(
      pm.projectsPage.pubLocators.projectCreateSuccess()
    ).toBeVisible();
  });

  test("Rename project", async () => {
    await pm.homePage.clickOnTab("projects");
    await pm.projectsPage.clickCreate();
    await pm.projectsPage.fillCreateProjectName(generateName());
    await pm.projectsPage.fillCreateProjectDescription(generateName());
    await pm.projectsPage.clickWindowCreate();

    //Action
    await pm.homePage.clickOnTab("projects");
    await pm.projectsPage.clickProjectInfo();
    await pm.projectsPage.fillInfoName(generateName());

    //Assert
    await expect(
      pm.projectsPage.pubLocators.projectUpdateSuccess()
    ).toBeVisible();
  });

  test("Create kit", async () => {
    //Action
    await pm.homePage.clickOnTab("kits");
    await pm.kitsPage.createKit(generateName(), generateName());

    //Assert
    await expect(pm.kitsPage.pubLocators.kitCreateSuccess()).toBeVisible();
  });
});
