import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { api, ApiError } from "../lib/api";
import { useGeolocation } from "../hooks/useGeolocation";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { getBadgeImageUrl } from "../lib/badges";
import { getCategoryMeta } from "../lib/categories";
import { getActivityImage } from "../lib/activityImage";

export function ActivityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { position } = useGeolocation();
  const { refreshUser } = useAuth();
  const queryClient = useQueryClient();
  const [success, setSuccess] = useState<string | null>(null);
  const [completeError, setCompleteError] = useState<string | null>(null);

  const { data: activity, isLoading } = useQuery({
    queryKey: ["activity", id, position?.lat, position?.lng],
    queryFn: () => api.activity(id!, position?.lat, position?.lng),
    enabled: !!id,
  });

  const completeMutation = useMutation({
    mutationFn: () => api.complete(id!, position!.lat, position!.lng),
    onSuccess: async (res) => {
      await refreshUser();
      queryClient.invalidateQueries({ queryKey: ["nearby"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      setCompleteError(null);
      setSuccess(`+${res.xpGained} XP · Level ${res.level}`);
    },
    onError: (err) => {
      setCompleteError(err instanceof ApiError ? err.message : "Check-in fehlgeschlagen");
    },
  });

  if (isLoading || !activity) {
    return (
      <div className="mission-detail">
        <div className="loader" />
      </div>
    );
  }

  const cat = getCategoryMeta(activity.category);
  const canCheckIn = activity.canCheckIn && position && !activity.completed;

  return (
    <motion.div
      className="mission-detail"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="mission-detail-hero">
        <img src={getActivityImage(activity)} alt={activity.title} />
        <div className="mission-detail-hero-overlay" />
        <Link to="/map" className="mission-back">
          ←
        </Link>
        <span className="mission-detail-cat">{cat.label}</span>
        <h1>{activity.title}</h1>
      </div>

      <div className="mission-detail-body">
        <p>{activity.description}</p>

        <div className="mission-detail-grid">
          <div>
            <span>XP</span>
            <strong>+{activity.xpReward}</strong>
          </div>
          <div>
            <span>Radius</span>
            <strong>{activity.radiusMeters}m</strong>
          </div>
          {activity.distanceMeters !== undefined && (
            <div>
              <span>Distanz</span>
              <strong>{activity.distanceMeters}m</strong>
            </div>
          )}
        </div>

        {activity.completed && <div className="flash flash--ok">Mission abgeschlossen</div>}
        {success && <div className="flash flash--ok">{success}</div>}
        {completeError && <div className="flash flash--err">{completeError}</div>}

        {!activity.completed && (
          <motion.button
            type="button"
            className={`btn-glow btn-glow--full ${canCheckIn ? "ready" : ""}`}
            disabled={!canCheckIn || completeMutation.isPending}
            onClick={() => completeMutation.mutate()}
            whileTap={{ scale: 0.97 }}
          >
            {completeMutation.isPending
              ? "Check-in…"
              : canCheckIn
                ? "Mission abschließen"
                : `${activity.distanceMeters ?? "?"}m — näher heran`}
          </motion.button>
        )}

        {completeMutation.data?.badgesEarned.map((b) => (
          <motion.div
            key={b.slug}
            className="badge-unlock-card"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <img src={getBadgeImageUrl(b.iconKey)} alt={b.name} />
            <div>
              <strong>Badge freigeschaltet</strong>
              <p>{b.name}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}