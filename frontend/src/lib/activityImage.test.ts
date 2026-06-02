import { describe, it, expect } from "vitest";
import { getActivityImage } from "./activityImage";

describe("getActivityImage", () => {
  it("uses category fallback when no imageUrl", () => {
    const url = getActivityImage({ category: "cleanup" });
    expect(url).toContain("unsplash.com");
  });

  it("prefixes relative upload paths with API URL", () => {
    const url = getActivityImage({
      category: "cleanup",
      imageUrl: "/uploads/activities/test.jpg",
    });
    expect(url).toBe("http://localhost:3001/uploads/activities/test.jpg");
  });

  it("keeps absolute URLs unchanged", () => {
    const absolute = "https://images.unsplash.com/photo-123?w=800";
    expect(getActivityImage({ category: "cleanup", imageUrl: absolute })).toBe(absolute);
  });
});