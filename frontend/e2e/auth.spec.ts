import { test, expect } from "@playwright/test";
import { setupApiMocks } from "./helpers/api-mocks";

test.describe("Auth pages", () => {
  test("login page renders in German", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: "Willkommen zurück" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Anmelden" })).toBeVisible();
    await expect(page.getByLabel("E-Mail")).toBeVisible();
  });

  test("register link works", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("link", { name: "Registrieren" }).click();
    await expect(page.getByRole("heading", { name: "Account erstellen" })).toBeVisible();
  });

  test("login redirects to dashboard with mocked API", async ({ page }) => {
    await setupApiMocks(page);
    await page.goto("/login");
    await page.getByLabel("E-Mail").fill("e2e@test.at");
    await page.getByLabel("Passwort").fill("password123");
    await page.getByRole("button", { name: "Anmelden" }).click();
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByText(/E2E Tester/)).toBeVisible();
  });
});