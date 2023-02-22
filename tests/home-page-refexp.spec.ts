import { test, expect } from "@playwright/test";

test.describe("Verify GuardianUI.com home page", () => {
  test("Should verify via a Referring Expression that the target page contains a component", async ({
    page,
  }) => {
    // Setup
    await page.goto("https://www.guardianui.com/");
    // set browser viewport to a deterministic value
    // responsive apps may render different views based on screen size
    await page.waitForSelector("text=GuardianUI");

    // take a screenshot
    // ...
    // send screenshot and refexp to GuardianUI Click model
    // ...
    const img = null;
    // fetch('https://guardianui-ui-refexp-click.hf.space/run/predict')
    const centerPoint = refexpModelPredict({
      refexp: "select GuardianUI logo at the top left",
      screenshot: img,
    });
    // use predicted coordinates to verify against known data-testid label
    const refExpFound = await page.evaluate(
      ([x, y]) => {
        const element = document.elementFromPoint(x, y);
        if (!element) {
          return false;
        }
        const testAttribute = element.getAttribute("data-testid");
        const isJoinCenterButton = "guardianui-logo" === testAttribute;
        return isJoinCenterButton;
      },
      [centerPoint.x, centerPoint.y]
    );
    await expect(refExpFound).toBeTruthy();
  });
});

function refexpModelPredict({ refexp: String, screenshot: bytes }) {
  fetch("https://guardianui-ui-refexp-click.hf.space/run/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: [
        screenshot, // "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==",
        refexp, // "hello world",
      ],
    }),
  })
    .then((r) => r.json())
    .then((r) => {
      let data = r.data;
    });
}
