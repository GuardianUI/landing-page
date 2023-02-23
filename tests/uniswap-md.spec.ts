import { test } from "@playwright/test";
import { GUIPage } from "./models/GUIPage";
import { marked } from "marked";
import { readFileSync } from "fs";

test.describe("Walk through a user story", () => {
  let testTitle: string = "";
  let startUrl: string = "";
  let steps: string[] = [];
  // Override function
  const walkTokens = (token) => {
    if (token.type === "heading") {
      testTitle = token.text;
    } else if (token.type === "link") {
      startUrl = token.href;
    } else if (token.type === "list_item") {
      steps.push(token.text);
    }
  };
  marked.use({ walkTokens });
  const md = readFileSync("tests/uniswap-flow.md", "utf8");
  marked.parse(md);
  console.debug({ testTitle, startUrl, steps });

  test(testTitle, async ({ page }) => {
    // Setup
    const guiPage = new GUIPage(page);
    await page.goto(startUrl);
    steps.forEach(async (step) => await guiPage.clickElement(step));
  });
});
