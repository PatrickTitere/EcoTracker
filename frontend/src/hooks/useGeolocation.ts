import { useEffect, useState } from "react";

export interface GeoPosition {
  lat: number;
  lng: number;
  accuracy: number;
}

type GeoStatus = "loading" | "ready" | "denied" | "unavailable";

export function useGeolocation() {
  const [position, setPosition] = useState<GeoPosition | null>(null);
  const [status, setStatus] = useState<GeoStatus>("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus("unavailable");
      setError("Geolocation wird von diesem Browser nicht unterstützt");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
        setStatus("ready");
        setError(null);
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setStatus("denied");
          setError("Standortzugriff verweigert – bitte in den Browser-Einstellungen erlauben");
        } else {
          setStatus("unavailable");
          setError("Standort konnte nicht ermittelt werden");
        }
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return { position, status, error };
}