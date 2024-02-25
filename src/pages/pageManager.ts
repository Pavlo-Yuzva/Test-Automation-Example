import { Page } from "@playwright/test";
import { AdminPage } from "@pages/admin/admin";
import { DesktopPage } from "@pages/desktop/desktop";
import { HomePage } from "@pages/home/home";
import { KitsPage } from "@pages/kits/kits";
import { LoginPage } from "@pages/login/login";
import { GooglePage } from "@pages/login/google";
import { MicrosoftPage } from "@pages/login/microsoft";
import { KitconnectPage } from "@pages/login/kitconnect";
import { ProjectsPage } from "@pages/projects/projects";
import ProjectsDetails from "@pages/projects/projectsDetails";
import { TenantPage } from "./login/tenant";

export class PageManager {
  page: Page;
  readonly adminPage: AdminPage;
  readonly desktopPage: DesktopPage;
  readonly homePage: HomePage;
  readonly kitsPage: KitsPage;
  readonly loginPage: LoginPage;
  readonly googlePage: GooglePage;
  readonly microsoftPage: MicrosoftPage;
  readonly kitconnectPage: KitconnectPage;
  readonly projectsPage: ProjectsPage;
  readonly projectsDetailsPage: ProjectsDetails;
  readonly tenantPage: TenantPage;

  constructor(page: Page) {
    this.page = page;
    this.adminPage = new AdminPage(this.page);
    this.desktopPage = new DesktopPage(this.page);
    this.homePage = new HomePage(this.page);
    this.kitsPage = new KitsPage(this.page);
    this.loginPage = new LoginPage(this.page);
    this.googlePage = new GooglePage(this.page);
    this.microsoftPage = new MicrosoftPage(this.page);
    this.kitconnectPage = new KitconnectPage(this.page);
    this.projectsPage = new ProjectsPage(this.page);
    this.projectsDetailsPage = new ProjectsDetails(this.page);
    this.tenantPage = new TenantPage(this.page);
  }
}
