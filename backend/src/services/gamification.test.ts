import { describe, it, expect } from "vitest";
import { xpToLevel } from "../lib/xp.js";

describe("xpToLevel", () => {
  it("starts at level 1", () => {
    expect(xpToLevel(0)).toBe(1);
    expect(xpToLevel(99)).toBe(1);
  });

  it("levels up at thresholds", () => {
    expect(xpToLevel(100)).toBe(2);
    expect(xpToLevel(400)).toBe(3);
    expect(xpToLevel(900)).toBe(4);
  });
});