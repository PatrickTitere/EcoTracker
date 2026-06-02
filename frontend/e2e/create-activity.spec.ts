import { test, expect } from "@playwright/test";
import { seedAuthTokens, setupApiMocks } from "./helpers/api-mocks";

test.describe("Create activity", () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
    await seedAuthTokens(page);
  });

  test("renders create form and submits mission", async ({ page }) => {
    await page.goto("/create");
    await expect(page.getByRole("heading", { name: "Mission erstellen" })).toBeVisible();
    await expect(page.getByText("Missionsfoto")).toBeVisible();

    await page.getByRole("textbox", { name: "Titel" }).fill("Neue Test-Mission");
    await page.getByRole("textbox", { name: "Beschreibung" }).fill(
      "Eine lange Beschreibung für die neue Öko-Mission."
    );
    await page.getByRole("button", { name: "HTL" }).click();
    await page.getByRole("button", { name: "Veröffentlichen" }).click();

    await expect(page).toHaveURL(/\/activity\/e2e-new/);
  });
});