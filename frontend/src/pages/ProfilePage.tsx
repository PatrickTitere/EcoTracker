import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../lib/api";
import { xpProgressInLevel } from "../lib/gamification";
import { getBadgeImageUrl } from "../lib/badges";

export function ProfilePage() {
  const { data: me } = useQuery({ queryKey: ["me"], queryFn: () => api.me() });
  const { data: allBadges } = useQuery({ queryKey: ["badges"], queryFn: () => api.badges() });

  if (!me) return <div className="profile-v2"><div className="loader" /></div>;

  const progress = xpProgressInLevel(me.xp);
  const earned = new Set(me.badges.map((b) => b.slug));

  return (
    <div className="profile-v2">
      <motion.div
        className="profile-head-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="profile-avatar-lg">{me.displayName.charAt(0)}</div>
        <div>
          <h1>{me.displayName}</h1>
          <p>{me.email}</p>
        </div>
        <div className="profile-level-tag">LV {me.level}</div>
      </motion.div>

      <div className="profile-xp-card">
        <div className="profile-xp-top">
          <span>{me.xp} XP</span>
          <span>{progress.percent}%</span>
        </div>
        <div className="bento-progress">
          <motion.div className="bento-progress-fill" animate={{ width: `${progress.percent}%` }} />
        </div>
        <span className="bento-sub">
          {progress.current}/{progress.needed} bis Level {me.level + 1}
        </span>
      </div>

      <div className="profile-stats-row">
        <div>
          <strong>{me.completedActivityIds.length}</strong>
          <span>Missionen</span>
        </div>
        <div>
          <strong>{me.badges.length}</strong>
          <span>Badges</span>
        </div>
        <Link to="/create" className="btn-glow btn-glow--sm">
          + Mission
        </Link>
      </div>

      <section className="dash-section">
        <h2>Alle Badges</h2>
        <div className="badge-wall">
          {(allBadges?.badges ?? []).map((b, i) => {
            const has = earned.has(b.slug);
            return (
              <motion.div
                key={b.slug}
                className={`badge-wall-item ${has ? "earned" : ""}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <img src={getBadgeImageUrl(b.iconKey)} alt={b.name} />
                <span>{b.name}</span>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}