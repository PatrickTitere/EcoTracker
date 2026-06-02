import { test, expect } from "@playwright/test";

test.describe("Landing page", () => {
  test("shows public hero and navigation", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: /EcoMap/i })).toBeVisible();
    await expect(page.getByRole("link", { name: "Login" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Starten", exact: true })).toBeVisible();
  });

  test("theme toggle switches data-theme", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: /Mode aktivieren/i });
    const initial = await page.locator("html").getAttribute("data-theme");
    await toggle.click();
    const next = await page.locator("html").getAttribute("data-theme");
    expect(next).not.toBe(initial);
  });
});