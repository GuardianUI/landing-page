import { test, expect } from "@playwright/test";
import { GUIPage } from "./models/GUIPage";

test.describe("Verify GuardianUI.com home page", () => {
  test("Should verify via a Referring Expression that the target page contains a component", async ({
    page,
  }) => {
    // Setup
    const guiPage = new GUIPage(page);
    await page.goto("https://www.guardianui.com/");

    // Select element using a Referring Expression
    const refExpMatched = await guiPage.findElement(
      "select join waitlist button under frontend text",
      { "data-testid": "join-waitlist-button-hero" }
    );

    // Expect element to exist
    await expect(refExpMatched).toBeTruthy();
  });
});
