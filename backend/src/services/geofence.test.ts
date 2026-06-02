import { describe, it, expect } from "vitest";
import { distanceMeters, isWithinRadius } from "./geofence.js";

describe("geofence", () => {
  it("returns 0 for same coordinates", () => {
    expect(distanceMeters(48.2082, 16.3738, 48.2082, 16.3738)).toBe(0);
  });

  it("detects within radius at Stephansplatz", () => {
    const center = { lat: 48.2082, lng: 16.3738 };
    const nearby = { lat: 48.2085, lng: 16.374 };
    expect(
      isWithinRadius(nearby.lat, nearby.lng, center.lat, center.lng, 100)
    ).toBe(true);
  });

  it("rejects far away coordinates", () => {
    const vienna = { lat: 48.2082, lng: 16.3738 };
    const salzburg = { lat: 47.8095, lng: 13.055 };
    expect(
      isWithinRadius(salzburg.lat, salzburg.lng, vienna.lat, vienna.lng, 200)
    ).toBe(false);
  });
});