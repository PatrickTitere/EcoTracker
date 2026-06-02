import { test, expect } from "@playwright/test";

test.describe("Protected routes", () => {
  test("dashboard redirects to login when unauthenticated", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });

  test("map redirects to login when unauthenticated", async ({ page }) => {
    await page.goto("/map");
    await expect(page).toHaveURL(/\/login/);
  });

  test("landing stays public", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL("/");
    await expect(page.getByRole("link", { name: "Login" })).toBeVisible();
  });
});