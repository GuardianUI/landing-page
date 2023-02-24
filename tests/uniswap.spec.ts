import { test } from "@playwright/test";
import { GUIPage } from "./models/GUIPage";

test.describe("Navigate Uniswap", () => {
    test("Should navigate Uniswap's app", async ({ page }) => {
        // Setup
        const guiPage = new GUIPage(page);
        await page.goto("https://app.uniswap.org/");

        await guiPage.clickElement(
            "select Get started button at the lower center"
        );

        await guiPage.clickElement(
            "select dropdown menu that says ETH at the upper right"
        );

        await guiPage.clickElement(
            "select the option that says Wrapped Ether"
        );

        await guiPage.clickElement(
            "select the dropdown menu that says Select token in the middle of the screen"
        );

        await guiPage.clickElement(
            "select the option that says Aave"
        );
    })
})