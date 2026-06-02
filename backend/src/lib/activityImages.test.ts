import { describe, it, expect } from "vitest";
import { seedImageForActivity, SEED_ACTIVITY_IMAGES } from "./activityImages.js";

describe("seedImageForActivity", () => {
  it("returns dedicated image for known missions", () => {
    const url = seedImageForActivity("Müllsammel-Truppe Donaukanal", "cleanup");
    expect(url).toBe(SEED_ACTIVITY_IMAGES["Müllsammel-Truppe Donaukanal"]);
    expect(url).toContain("unsplash.com");
  });

  it("falls back to category image for unknown titles", () => {
    const url = seedImageForActivity("Unbekannte Mission", "planting");
    expect(url).toContain("unsplash.com");
    expect(url).not.toBe(SEED_ACTIVITY_IMAGES["Müllsammel-Truppe Donaukanal"]);
  });
});