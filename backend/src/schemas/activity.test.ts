import { describe, it, expect } from "vitest";
import {
  createActivitySchema,
  nearbyQuerySchema,
  completeActivitySchema,
} from "./activity.js";

describe("createActivitySchema", () => {
  it("accepts valid payload", () => {
    const result = createActivitySchema.safeParse({
      title: "Test Mission",
      description: "Eine gültige Beschreibung mit genug Text.",
      category: "cleanup",
      latitude: 48.1987,
      longitude: 16.3579,
      radiusMeters: 100,
      xpReward: 50,
    });
    expect(result.success).toBe(true);
  });

  it("rejects short title", () => {
    const result = createActivitySchema.safeParse({
      title: "ab",
      description: "Eine gültige Beschreibung mit genug Text.",
      category: "cleanup",
      latitude: 48.2,
      longitude: 16.3,
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid category", () => {
    const result = createActivitySchema.safeParse({
      title: "Test Mission",
      description: "Eine gültige Beschreibung mit genug Text.",
      category: "invalid",
      latitude: 48.2,
      longitude: 16.3,
    });
    expect(result.success).toBe(false);
  });
});

describe("nearbyQuerySchema", () => {
  it("coerces query strings to numbers", () => {
    const result = nearbyQuerySchema.safeParse({
      lat: "48.2082",
      lng: "16.3738",
      radiusKm: "3",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.lat).toBe(48.2082);
      expect(result.data.radiusKm).toBe(3);
    }
  });
});

describe("completeActivitySchema", () => {
  it("requires lat and lng", () => {
    expect(completeActivitySchema.safeParse({ lat: 48.2 }).success).toBe(false);
    expect(
      completeActivitySchema.safeParse({ lat: 48.2, lng: 16.3 }).success
    ).toBe(true);
  });
});