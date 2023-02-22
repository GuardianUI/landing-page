import { test, expect } from "@playwright/test";

test.describe("Verify GuardianUI.com home page", () => {
  test("Should verify via a Referring Expression that the target page contains a component", async ({
    page,
  }) => {
    // Setup
    await page.goto("https://www.guardianui.com/");
    // take a screenshot of current view
    const img = await page.screenshot({
      path: "screenshots/refexp-screenshot.png",
    });
    // send screenshot and refexp to GuardianUI Click model
    const centerPoint = await refexpModelPredict({
      refexp: "select GuardianUI logo at the top left",
      screenshot: img,
    });
    // select component at predicted point
    const refExpMatched = await elementAtPoint({
      page,
      centerPoint,
      query: { alt: "GuardianUI" }, // test match with a known attribute value
    });
    await expect(refExpMatched).toBeTruthy();
  });
});

async function refexpModelPredict({ refexp, screenshot }) {
  const b64img = "data:image/png;base64," + screenshot.toString("base64");
  console.debug(b64img.substring(0, 100));
  const response = await fetch(
    "https://guardianui-ui-refexp-click.hf.space/run/predict",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: [
          b64img, // "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==",
          refexp, // "select button xyz",
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
  console.debug({ response });
  const rbody = response.body;
  console.debug({ rbody });
  const j = await response.json();
  const data = j.data;
  // console.debug({ data });
  return data[1];
}

async function elementAtPoint({ page, centerPoint, query }) {
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
  console.debug({ match });
  return match;
}
