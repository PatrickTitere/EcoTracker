import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import type { Activity } from "../lib/api";
import { getCategoryMeta } from "../lib/categories";
import { useTheme } from "../context/ThemeContext";
import "leaflet/dist/leaflet.css";

const TILES = {
  dark: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    filter: "saturate(1.1) contrast(1.05) brightness(0.95)",
  },
  light: {
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    filter: "saturate(0.95) contrast(1.02) brightness(1.02)",
  },
};

function markerHtml(color: string, done: boolean, canCheckIn: boolean) {
  const pulse = canCheckIn && !done ? "pin-pulse" : "";
  return `
    <div class="map-pin ${done ? "is-done" : ""} ${pulse}" style="--pin:${color}">
      <div class="map-pin-head"></div>
      <div class="map-pin-stem"></div>
      <div class="map-pin-shadow"></div>
    </div>
  `;
}

const userIcon = L.divIcon({
  className: "map-user-wrap",
  html: `
    <div class="map-user">
      <div class="map-user-ring"></div>
      <div class="map-user-core"></div>
    </div>
  `,
  iconSize: [44, 44],
  iconAnchor: [22, 22],
});

function ThemeTileLayer() {
  const { theme } = useTheme();
  const t = TILES[theme];
  return (
    <TileLayer
      key={theme}
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
      url={t.url}
    />
  );
}

function MapBridge({ onReady }: { onReady: (map: L.Map) => void }) {
  const map = useMap();
  useEffect(() => {
    onReady(map);
  }, [map, onReady]);
  return null;
}

function MapRecenter({ lat, lng, trigger }: { lat: number; lng: number; trigger: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], map.getZoom() || 15, { duration: 0.8 });
  }, [lat, lng, trigger, map]);
  return null;
}

interface ActivityMapProps {
  userLat: number;
  userLng: number;
  activities: Activity[];
  recenterTrigger: number;
  onMapReady?: (map: L.Map) => void;
}

export function ActivityMap({
  userLat,
  userLng,
  activities,
  recenterTrigger,
  onMapReady,
}: ActivityMapProps) {
  const { theme } = useTheme();
  const tileStyle = { filter: TILES[theme].filter };

  return (
    <div className="map-canvas-wrap" style={tileStyle}>
      <MapContainer
        center={[userLat, userLng]}
        zoom={15}
        className="map-canvas"
        zoomControl={false}
        scrollWheelZoom
      >
        <ThemeTileLayer />
        <MapRecenter lat={userLat} lng={userLng} trigger={recenterTrigger} />
        {onMapReady && <MapBridge onReady={onMapReady} />}
        <Marker position={[userLat, userLng]} icon={userIcon} zIndexOffset={1000}>
          <Popup className="map-leaflet-popup">
            <span className="popup-label">Deine Position</span>
          </Popup>
        </Marker>
        {activities.map((a) => {
          const cat = getCategoryMeta(a.category);
          const icon = L.divIcon({
            className: "map-pin-wrap",
            html: markerHtml(cat.color, a.completed, !!a.canCheckIn),
            iconSize: [36, 48],
            iconAnchor: [18, 46],
          });
          return (
            <Fragment key={a.id}>
              <Circle
                center={[a.latitude, a.longitude]}
                radius={a.radiusMeters}
                pathOptions={{
                  color: cat.color,
                  fillColor: cat.color,
                  fillOpacity: theme === "dark" ? 0.12 : 0.18,
                  weight: 2,
                  opacity: theme === "dark" ? 0.45 : 0.55,
                  dashArray: a.canCheckIn ? undefined : "6 8",
                }}
              />
              <Marker position={[a.latitude, a.longitude]} icon={icon}>
                <Popup className="map-leaflet-popup">
                  <strong>{a.title}</strong>
                  <p>{cat.label} · +{a.xpReward} XP</p>
                  {a.distanceMeters !== undefined && (
                    <span className="popup-dist">{a.distanceMeters} m</span>
                  )}
                  <Link to={`/activity/${a.id}`} className="popup-link">
                    Mission öffnen →
                  </Link>
                </Popup>
              </Marker>
            </Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
}