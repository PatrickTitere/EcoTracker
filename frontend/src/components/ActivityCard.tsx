import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Activity } from "../lib/api";
import { getCategoryMeta } from "../lib/categories";
import { getActivityImage } from "../lib/activityImage";

interface ActivityCardProps {
  activity: Activity;
  index?: number;
}

export function ActivityCard({ activity, index = 0 }: ActivityCardProps) {
  const cat = getCategoryMeta(activity.category);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
    >
      <Link
        to={`/activity/${activity.id}`}
        className={`mission-card ${activity.completed ? "is-done" : ""} ${activity.canCheckIn ? "can-checkin" : ""}`}
      >
        <div className="mission-card-img">
          <img src={getActivityImage(activity)} alt={activity.title} loading="lazy" />
          <span className="mission-cat">{cat.label}</span>
        </div>
        <div className="mission-card-body">
          <h3>{activity.title}</h3>
          <div className="mission-meta">
            {activity.distanceMeters !== undefined && (
              <span>{activity.distanceMeters} m</span>
            )}
            <span className="mission-xp">+{activity.xpReward} XP</span>
          </div>
          {activity.canCheckIn && !activity.completed && (
            <span className="mission-live">Live Check-in</span>
          )}
          {activity.completed && <span className="mission-done">Abgeschlossen</span>}
        </div>
      </Link>
    </motion.div>
  );
}