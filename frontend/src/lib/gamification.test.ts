import { describe, it, expect } from "vitest";
import { xpToLevel, xpProgressInLevel } from "./gamification";

describe("gamification", () => {
  it("xpToLevel matches backend formula", () => {
    expect(xpToLevel(0)).toBe(1);
    expect(xpToLevel(100)).toBe(2);
    expect(xpToLevel(400)).toBe(3);
  });

  it("xpProgressInLevel calculates percent", () => {
    const p = xpProgressInLevel(150);
    expect(p.current).toBe(50);
    expect(p.needed).toBe(300);
    expect(p.percent).toBeGreaterThan(0);
  });
});