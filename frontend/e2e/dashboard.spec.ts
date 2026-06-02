import { test, expect } from "@playwright/test";
import { seedAuthTokens, setupApiMocks } from "./helpers/api-mocks";

test.describe("Dashboard (authenticated)", () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
    await seedAuthTokens(page);
  });

  test("shows user name and nearby mission", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.getByText("E2E Tester")).toBeVisible();
    await expect(page.getByText("Müllsammel-Truppe Donaukanal")).toBeVisible();
  });

  test("navigates to map via dock", async ({ page }) => {
    await page.goto("/dashboard");
    await page.getByRole("navigation", { name: "Navigation" }).getByRole("link", { name: "Karte" }).click();
    await expect(page).toHaveURL(/\/map/);
  });
});