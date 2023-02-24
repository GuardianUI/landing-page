import { test } from "@playwright/test";
import { GUIPage } from "./models/GUIPage";
import { marked } from "marked";
import { readFileSync } from "fs";
import { textSpanIntersectsWithPosition } from "typescript";

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
  // remove the Go to url step from list of refexp instructions
  steps.shift();
  console.debug({ testTitle, startUrl, steps });

  test(testTitle, async ({ page }) => {
    // Setup
    const guiPage = new GUIPage(page);
    console.debug("Loading page from url in user story");
    await page.goto(startUrl);
    console.debug("Going through steps in user story");
    for (const step of steps) {
      console.debug(`Step : ${step}`);
      await guiPage.clickElement(steps);
    }
  });
});
