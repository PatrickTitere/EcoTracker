import type { Badge } from "../lib/api";
import { getBadgeImageUrl } from "../lib/badges";

interface BadgeGridProps {
  badges: Badge[];
}

export function BadgeGrid({ badges }: BadgeGridProps) {
  if (badges.length === 0) {
    return <p className="muted">Noch keine Badges – schließe deine erste Aktivität ab!</p>;
  }

  return (
    <div className="badge-grid">
      {badges.map((badge) => (
        <article
          key={badge.slug}
          className={`badge-card ${badge.earned === false ? "locked" : ""}`}
        >
          <img
            src={getBadgeImageUrl(badge.iconKey)}
            alt={badge.name}
            className="badge-image"
          />
          <h3>{badge.name}</h3>
          <p>{badge.description}</p>
          {badge.earned === false && <span className="badge-lock">Gesperrt</span>}
        </article>
      ))}
    </div>
  );
}