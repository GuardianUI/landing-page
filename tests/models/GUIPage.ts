import { Page } from "@playwright/test";
import { marked } from "marked";
import { readFileSync } from "fs";

export class GUIPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /// Executes a test from a markdown file
  async executeTestFromMarkdown(mdPath: string) {
    const { testTitle, startUrl, steps } = this.parseMarkdown(mdPath);
    console.debug({ testTitle, startUrl, steps });

    // Go to the start url
    console.debug("Loading page from url in user story");
    await this.page.goto(startUrl);

    // Execute the steps
    console.debug("Going through steps in user story");
    for (const step of steps) {
      console.debug(`Step : ${step}`);
      await this.clickElement(step);
    }
  }

  getScreenshotPath() {
    const timestamp = Date.now();
    const screenshotPath = `screenshots/refexp-screenshot-${timestamp}.png`;
    return screenshotPath;
  }

  /// Uses a Referring Expression to find a component on the page
  async findElement(refExp: string, query: { [key: string]: string }) {
    // Take a screenshot of the browser viewport
    const screenshotPath = this.getScreenshotPath();
    const img = await this.page.screenshot({
      path: screenshotPath,
    });

    // Send screenshot and referring expression to GuardianUI AI model
    const centerPoint = await this.refexpModelPredict({
      refexp: refExp,
      screenshot: img,
    });
    console.debug({ screenshotPath, centerPoint });

    // Select component at predicted point
    const refExpMatched = await this.elementAtPoint({
      page: this.page,
      centerPoint: centerPoint,
      query: query,
    });

    return refExpMatched;
  }

  async clickElement(refExp: string) {
    // Take a screenshot of the browser viewport
    const screenshotPath = this.getScreenshotPath();
    const img = await this.page.screenshot({
      path: screenshotPath,
    });

    // Send screenshot and referring expression to GuardianUI AI model
    const centerPoint = await this.refexpModelPredict({
      refexp: refExp,
      screenshot: img,
    });

    // Convert predicted point to viewport coordinates
    const vpSize = await this.page.viewportSize();
    const cpTranslated = {
      x: vpSize?.width ? Math.round(centerPoint.x * vpSize?.width) : 0,
      y: vpSize?.height ? Math.round(centerPoint.y * vpSize?.height) : 0,
    };

    console.debug({ screenshotPath, centerPoint, cpTranslated });

    // Click component at predicted point
    this.page.mouse.click(cpTranslated.x, cpTranslated.y);
  }

  /// Requests the GuardianUI AI model to predict the coordinates of a component
  async refexpModelPredict({ refexp, screenshot }) {
    const b64img = "data:image/png;base64," + screenshot.toString("base64");
    console.debug({ refexp });
    console.debug("image base64:", b64img.substring(0, 100));
    const model_revision = "main";
    const return_annotated_image = false;

    const response = await fetch(
      "https://5pp4oqgidc.execute-api.us-east-1.amazonaws.com/run/predict",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: [
            b64img, // "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==",
            refexp, // "select button xyz",
            model_revision, // "main" or another valid git tag
            return_annotated_image,
          ],
        }),
      }
    );

    if (response.status != 200) {
      console.error("Failed to fetch RefExp Click API", { response });
      const responseBodyText = await response.text();
      console.error({ responseBodyText });
      return undefined;
    }
    // console.debug({ response });

    const rbody = response.body;
    // console.debug({ rbody });

    const j = await response.json();
    const data = j.data;
    return data[1];
  }

  /// Selects a component at the given coordinates that matches an attribute
  async elementAtPoint({ page, centerPoint, query }) {
    const vpSize = await page.viewportSize();
    const cpTranslated = {
      x: vpSize?.width ? Math.round(centerPoint.x * vpSize?.width) : 0,
      y: vpSize?.height ? Math.round(centerPoint.y * vpSize?.height) : 0,
    };
    console.debug({ centerPoint, cpTranslated });
    // use predicted coordinates to verify against known data-testid label
    const match = await page.evaluate(
      ([cp, query]) => {
        const element = document.elementFromPoint(cp.x, cp.y);
        const attr = Object.keys(query)[0];
        const match = element?.getAttribute(attr) === query[attr];
        return match;
      },
      [cpTranslated, query]
    );
    // console.debug({ element });
    return match;
  }

  /// Parses markdown into test title, start url, and steps
  parseMarkdown(mdPath: string) {
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
    const md = readFileSync(mdPath, "utf8");
    marked.parse(md);

    // remove the Go to url step from list of refexp instructions
    steps.shift();

    return { testTitle, startUrl, steps };
  }
}
