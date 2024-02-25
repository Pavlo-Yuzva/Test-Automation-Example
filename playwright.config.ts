import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  timeout: 10 * 60 * 300,
  //timeout of expect
  expect: {
    timeout: 20 * 750,
  },
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  /* Configure projects for major browsers */

  projects: [
    { name: "setup", testMatch: /.*\.setup\.ts/ },

    {
      name: "ui",
      testIgnore: ["**/api/**"],
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1920, height: 1080 },
        launchOptions: {
          args: [
            "--disable-blink-features=AutomationControlled",
            "--exclude-switches=enable-automation",
          ],
        },

        headless: true,

        contextOptions: {
          userAgent:
            "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
        },
      },
      dependencies: ["setup"],
    },

    {
      name: "api",
      testMatch: ["**/api/**"],
      use: {
        extraHTTPHeaders: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        },
      },
      dependencies: ["setup"],
    },
  ],
});
