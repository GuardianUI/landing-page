import { test } from "@playwright/test";
import { GUIPage } from "./models/GUIPage";

test.describe("Walk through a user story", () => {
  test("MD user story demo", async ({ page }) => {
    // Setup
    const guiPage = new GUIPage(page);
    await guiPage.executeTestFromMarkdown("tests/uniswap-flow.md");
  });
});
