import { describe, it, expect } from "vitest";
import { publicUploadPath } from "./upload.js";

describe("publicUploadPath", () => {
  it("returns uploads path for activity images", () => {
    expect(publicUploadPath("abc-123.jpg")).toBe("/uploads/activities/abc-123.jpg");
  });
});