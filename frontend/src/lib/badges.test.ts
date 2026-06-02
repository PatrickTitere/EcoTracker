import { describe, it, expect } from "vitest";
import { getBadgeImageUrl } from "./badges";

describe("getBadgeImageUrl", () => {
  it("returns path for known icon keys", () => {
    expect(getBadgeImageUrl("seedling")).toBe("/badges/seedling.png");
    expect(getBadgeImageUrl("star")).toBe("/badges/star.png");
  });

  it("falls back to seedling for unknown keys", () => {
    expect(getBadgeImageUrl("unknown")).toBe("/badges/seedling.png");
  });
});