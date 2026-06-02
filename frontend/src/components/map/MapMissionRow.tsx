import { Link } from "react-router-dom";
import type { Activity } from "../../lib/api";
import { getCategoryMeta } from "../../lib/categories";
import { getActivityImage } from "../../lib/activityImage";

interface MapMissionRowProps {
  activity: Activity;
}

export function MapMissionRow({ activity }: MapMissionRowProps) {
  const cat = getCategoryMeta(activity.category);

  return (
    <Link
      to={`/activity/${activity.id}`}
      className={`map-mission-row ${activity.canCheckIn ? "is-live" : ""} ${activity.completed ? "is-done" : ""}`}
    >
      <div className="map-mission-row-img">
        <img src={getActivityImage(activity)} alt={activity.title} />
        <span className="map-mission-row-dot" style={{ background: cat.color }} />
      </div>
      <div className="map-mission-row-body">
        <span className="map-mission-row-cat">{cat.label}</span>
        <strong>{activity.title}</strong>
        <div className="map-mission-row-meta">
          {activity.distanceMeters !== undefined && <span>{activity.distanceMeters} m</span>}
          <span className="map-mission-row-xp">+{activity.xpReward} XP</span>
        </div>
      </div>
      {activity.canCheckIn && !activity.completed && (
        <span className="map-mission-row-badge">Live</span>
      )}
      <span className="map-mission-row-chevron">›</span>
    </Link>
  );
}