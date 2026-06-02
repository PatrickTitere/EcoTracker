import { beforeAll, afterAll, afterEach, describe, it, expect } from "vitest";
import { server } from "./msw/server";
import { api, setTokens, clearTokens } from "../lib/api";

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  clearTokens();
});
afterAll(() => server.close());

describe("api integration (MSW)", () => {
  it("fetches nearby activities when authenticated", async () => {
    setTokens("fake-access", "fake-refresh");
    const res = await api.nearby(48.2082, 16.3738);
    expect(res.activities).toHaveLength(1);
    expect(res.activities[0].title).toContain("Müllsammel");
  });

  it("rejects complete when too far (403)", async () => {
    setTokens("fake-access", "fake-refresh");
    await expect(api.complete("a1", 48.0, 16.0)).rejects.toMatchObject({
      status: 403,
    });
  });

  it("creates activity and returns imageUrl", async () => {
    setTokens("fake-access", "fake-refresh");
    const created = await api.createActivity({
      title: "Neue Mission",
      description: "Beschreibung der neuen Mission mit genug Zeichen.",
      category: "cleanup",
      latitude: 48.1987,
      longitude: 16.3579,
      radiusMeters: 100,
      xpReward: 50,
    });
    expect(created.id).toBe("a-new");
    expect(created.imageUrl).toContain("/uploads/activities/");
  });

  it("fetches activity detail with image", async () => {
    setTokens("fake-access", "fake-refresh");
    const detail = await api.activity("a1");
    expect(detail.imageUrl).toContain("unsplash.com");
  });
});