import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useGeolocation } from "./useGeolocation";

describe("useGeolocation", () => {
  const watchPosition = vi.fn();
  const clearWatch = vi.fn();

  beforeEach(() => {
    watchPosition.mockImplementation(() => 1);
    clearWatch.mockImplementation(() => undefined);
    Object.defineProperty(globalThis.navigator, "geolocation", {
      value: { watchPosition, clearWatch },
      configurable: true,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("starts in loading state", () => {
    const { result } = renderHook(() => useGeolocation());
    expect(result.current.status).toBe("loading");
  });

  it("updates position on success", async () => {
    watchPosition.mockImplementation((success: PositionCallback) => {
      success({
        coords: { latitude: 48.2082, longitude: 16.3738, accuracy: 10 },
      } as GeolocationPosition);
      return 1;
    });

    const { result } = renderHook(() => useGeolocation());

    await waitFor(() => {
      expect(result.current.status).toBe("ready");
    });
    expect(result.current.position?.lat).toBe(48.2082);
  });
});