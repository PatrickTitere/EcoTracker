import type { Page, Route } from "@playwright/test";

export const E2E_USER = {
  id: "e2e-user",
  email: "e2e@test.at",
  displayName: "E2E Tester",
  xp: 150,
  level: 2,
};

export const E2E_ACTIVITY = {
  id: "e2e-a1",
  title: "Müllsammel-Truppe Donaukanal",
  description: "Gemeinsam Müll am Donaukanal sammeln.",
  category: "cleanup",
  latitude: 48.2082,
  longitude: 16.3738,
  radiusMeters: 120,
  xpReward: 75,
  imageUrl: "https://images.unsplash.com/photo-1618472387224-7850f329b137?w=800",
  isActive: true,
  scheduledAt: null,
  distanceMeters: 50,
  completed: false,
  canCheckIn: true,
};

export async function seedAuthTokens(page: Page) {
  await page.addInitScript(() => {
    sessionStorage.setItem("accessToken", "e2e-access-token");
    localStorage.setItem("refreshToken", "e2e-refresh-token");
  });
}

export async function setupApiMocks(page: Page) {
  await page.route(/localhost:3001/, async (route: Route) => {
    const url = route.request().url();
    const method = route.request().method();

    if (url.includes("/auth/login") && method === "POST") {
      return route.fulfill({
        json: {
          accessToken: "e2e-access-token",
          refreshToken: "e2e-refresh-token",
          user: E2E_USER,
        },
      });
    }

    if (url.includes("/auth/register") && method === "POST") {
      return route.fulfill({
        json: {
          accessToken: "e2e-access-token",
          refreshToken: "e2e-refresh-token",
          user: E2E_USER,
        },
      });
    }

    if (url.includes("/auth/me") && method === "GET") {
      const auth = route.request().headers().authorization;
      if (!auth?.includes("e2e-access-token")) {
        return route.fulfill({ status: 401, json: { error: "Unauthorized" } });
      }
      return route.fulfill({
        json: {
          ...E2E_USER,
          badges: [],
          completedActivityIds: [],
        },
      });
    }

    if (url.includes("/auth/refresh")) {
      return route.fulfill({ json: { accessToken: "e2e-access-token" } });
    }

    if (url.includes("/activities/nearby") && method === "GET") {
      return route.fulfill({ json: { activities: [E2E_ACTIVITY] } });
    }

    if (url.match(/\/activities\/[^/]+$/) && method === "GET") {
      return route.fulfill({ json: { ...E2E_ACTIVITY, id: "e2e-a1" } });
    }

    if (url.includes("/activities") && method === "POST") {
      return route.fulfill({
        status: 201,
        json: {
          ...E2E_ACTIVITY,
          id: "e2e-new",
          title: "Neue Test-Mission",
          imageUrl: "/uploads/activities/new.jpg",
        },
      });
    }

    if (url.includes("/badges")) {
      return route.fulfill({
        json: {
          badges: [
            {
              slug: "first-step",
              name: "Erster Schritt",
              description: "Erste Aktivität",
              iconKey: "seedling",
              earned: true,
            },
          ],
        },
      });
    }

    return route.fulfill({ status: 404, json: { error: "Not mocked" } });
  });
}