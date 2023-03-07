import { test } from "@playwright/test";

test.describe("Verify GuardianUI.com home page", () => {
  test("Should verify that the target page loads", async ({ page }) => {
    // Setup
    await page.goto("/");
    await page.waitForSelector("text=GuardianUI");
  });
});
