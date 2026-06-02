import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useCallback, useRef, useState } from "react";
import type L from "leaflet";
import { useGeolocation } from "../hooks/useGeolocation";
import { api } from "../lib/api";
import { ActivityMap } from "../components/ActivityMap";
import { MapMissionRow } from "../components/map/MapMissionRow";
import { HTL_SPENGERGASSE } from "../lib/locations";

export function MapPage() {
  const { position, status, error: geoError } = useGeolocation();
  const [recenterTrigger, setRecenterTrigger] = useState(0);
  const mapRef = useRef<L.Map | null>(null);
  const onMapReady = useCallback((map: L.Map) => {
    mapRef.current = map;
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["nearby", position?.lat, position?.lng],
    queryFn: () => api.nearby(position!.lat, position!.lng, 5),
    enabled: !!position,
    refetchInterval: 30_000,
  });

  if (status === "loading") {
    return (
      <div className="map-screen map-screen--center">
        <div className="loader" />
        <p>Standort wird geladen…</p>
      </div>
    );
  }

  if (status === "denied" || status === "unavailable") {
    return (
      <div className="map-screen map-screen--center">
        <h2>GPS benötigt</h2>
        <p>{geoError}</p>
        <p className="muted">
          DevTools → Sensors → {HTL_SPENGERGASSE.lat}, {HTL_SPENGERGASSE.lng}
        </p>
        <Link to="/dashboard" className="btn-glow">
          Zurück
        </Link>
      </div>
    );
  }

  if (!position) return null;

  const all = data?.activities ?? [];
  const open = all.filter((a) => !a.completed);
  const live = open.filter((a) => a.canCheckIn);

  return (
    <div className="map-screen">
      <div className="map-split-main">
        <ActivityMap
          userLat={position.lat}
          userLng={position.lng}
          activities={all}
          recenterTrigger={recenterTrigger}
          onMapReady={onMapReady}
        />

        <div className="map-overlay map-overlay--top" aria-hidden />

        <div className="map-hud map-hud--compact">
          <div className="map-hud-actions map-hud-actions--stack">
            <button type="button" className="map-hud-btn" onClick={() => mapRef.current?.zoomIn()} aria-label="Zoom in">
              +
            </button>
            <button type="button" className="map-hud-btn" onClick={() => mapRef.current?.zoomOut()} aria-label="Zoom out">
              −
            </button>
            <button
              type="button"
              className="map-hud-btn"
              onClick={() => setRecenterTrigger((n) => n + 1)}
              aria-label="Zentrieren"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
              </svg>
            </button>
          </div>
        </div>

        <div className="map-legend map-legend--corner">
          <span><i className="legend-dot legend-dot--you" /> Du</span>
          <span><i className="legend-dot legend-dot--mission" /> Mission</span>
        </div>
      </div>

      <aside className="map-split-sidebar">
        <header className="map-sidebar-head">
          <div>
            <div className="map-sidebar-title">
              <span className="map-hud-live" />
              <h2>Missionen</h2>
            </div>
            <p className="map-sidebar-sub">
              {live.length > 0
                ? `${live.length} Check-in bereit · ${open.length} gesamt`
                : `${open.length} im Umkreis`}
            </p>
          </div>
          <Link to="/create" className="btn-glow btn-glow--sm">
            + Neu
          </Link>
        </header>

        <div className="map-sidebar-list">
          {isLoading ? (
            <p className="map-sheet-empty">Scanne Umgebung…</p>
          ) : open.length === 0 ? (
            <p className="map-sheet-empty">Keine offenen Missionen in der Nähe.</p>
          ) : (
            open.map((a) => <MapMissionRow key={a.id} activity={a} />)
          )}
        </div>
      </aside>
    </div>
  );
}