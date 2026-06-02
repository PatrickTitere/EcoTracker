import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useGeolocation } from "../hooks/useGeolocation";
import { api } from "../lib/api";
import { xpProgressInLevel } from "../lib/gamification";
import { getBadgeImageUrl } from "../lib/badges";
import { HTL_SPENGERGASSE } from "../lib/locations";
import { ActivityCard } from "../components/ActivityCard";

export function DashboardPage() {
  const { user } = useAuth();
  const { position, status } = useGeolocation();

  const { data: me } = useQuery({ queryKey: ["me"], queryFn: () => api.me() });
  const { data: nearbyYou } = useQuery({
    queryKey: ["nearby", "you", position?.lat, position?.lng],
    queryFn: () => api.nearby(position!.lat, position!.lng, 3),
    enabled: !!position,
  });
  const { data: nearbyHtl } = useQuery({
    queryKey: ["nearby", "htl"],
    queryFn: () => api.nearby(HTL_SPENGERGASSE.lat, HTL_SPENGERGASSE.lng, 1.2),
  });

  const xp = me?.xp ?? user?.xp ?? 0;
  const level = me?.level ?? user?.level ?? 1;
  const progress = xpProgressInLevel(xp);
  const name = me?.displayName ?? user?.displayName ?? "Explorer";
  const nearby = nearbyYou?.activities.filter((a) => !a.completed) ?? [];
  const htl = nearbyHtl?.activities.filter((a) => !a.completed) ?? [];

  return (
    <div className="dash">
      <motion.header
        className="dash-hero"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="dash-kicker">Mission Control</p>
        <h1>
          Hey, <span className="dash-name">{name}</span>
        </h1>
        <p className="dash-tagline">
          {status === "ready"
            ? `${nearby.length} Missionen in Reichweite`
            : "GPS aktivieren für Live-Missionen"}
        </p>
      </motion.header>

      <div className="bento">
        <motion.div
          className="bento-cell bento-level"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <span className="bento-label">Level</span>
          <span className="bento-big">{level}</span>
          <div className="bento-progress">
            <motion.div
              className="bento-progress-fill"
              animate={{ width: `${progress.percent}%` }}
            />
          </div>
          <span className="bento-sub">
            {progress.current}/{progress.needed} XP → {level + 1}
          </span>
        </motion.div>

        <motion.div
          className="bento-cell bento-map-cta"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
        >
          <Link to="/map" className="map-cta-link">
            <div className="map-cta-visual" />
            <div>
              <span className="bento-label">Live</span>
              <strong>Karte öffnen</strong>
              <span className="bento-sub">Check-in mit GPS</span>
            </div>
            <span className="map-cta-arrow">→</span>
          </Link>
        </motion.div>

        <motion.div
          className="bento-cell bento-stat"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="bento-label">XP</span>
          <span className="bento-mid">{xp}</span>
        </motion.div>

        <motion.div
          className="bento-cell bento-stat"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          <span className="bento-label">Done</span>
          <span className="bento-mid">{me?.completedActivityIds.length ?? 0}</span>
        </motion.div>

        <motion.div
          className="bento-cell bento-stat"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span className="bento-label">Badges</span>
          <span className="bento-mid">{me?.badges.length ?? 0}</span>
        </motion.div>

        <motion.div
          className="bento-cell bento-create"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          <Link to="/create">
            <span className="bento-label">Community</span>
            <strong>Mission erstellen</strong>
          </Link>
        </motion.div>
      </div>

      {nearby.length > 0 && (
        <section className="dash-section">
          <div className="dash-section-head">
            <h2>In der Nähe</h2>
            <Link to="/map">Alle</Link>
          </div>
          <div className="mission-scroll">
            {nearby.slice(0, 6).map((a, i) => (
              <ActivityCard key={a.id} activity={a} index={i} />
            ))}
          </div>
        </section>
      )}

      <section className="dash-section dash-htl">
        <div className="dash-section-head">
          <div>
            <h2>HTL Spengergasse</h2>
            <p>{HTL_SPENGERGASSE.address}</p>
          </div>
          <span className="htl-pill">1050</span>
        </div>
        <div className="mission-scroll">
          {htl.slice(0, 8).map((a, i) => (
            <ActivityCard key={a.id} activity={a} index={i} />
          ))}
        </div>
      </section>

      {me && me.badges.length > 0 && (
        <section className="dash-section">
          <h2>Badges</h2>
          <div className="badge-orbit">
            {me.badges.map((b, i) => (
              <motion.img
                key={b.slug}
                src={getBadgeImageUrl(b.iconKey)}
                alt={b.name}
                title={b.name}
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.4 + i * 0.08, type: "spring" }}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}