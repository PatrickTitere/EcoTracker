import { test, expect } from "@playwright/test";
import { seedAuthTokens, setupApiMocks } from "./helpers/api-mocks";

const VIENNA = { latitude: 48.2082, longitude: 16.3738 };

test.describe("Map with geolocation", () => {
  test.beforeEach(async ({ context, page }) => {
    await context.grantPermissions(["geolocation"]);
    await context.setGeolocation(VIENNA);
    await setupApiMocks(page);
    await seedAuthTokens(page);
  });

  test("shows map sidebar with missions", async ({ page }) => {
    await page.goto("/map");
    await expect(page.getByRole("heading", { name: /Missionen/i })).toBeVisible();
    await expect(page.getByText("Müllsammel-Truppe Donaukanal")).toBeVisible();
  });
});