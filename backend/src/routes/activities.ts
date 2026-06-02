import express, { Router } from "express";
import { prisma } from "../lib/prisma.js";
import {
  createActivitySchema,
  nearbyQuerySchema,
  completeActivitySchema,
} from "../schemas/activity.js";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";
import { distanceMeters, isWithinRadius } from "../services/geofence.js";
import { addXp, awardBadges, xpToLevel } from "../services/gamification.js";
import { activityImageUpload, publicUploadPath } from "../lib/upload.js";

const router = Router();
router.use(requireAuth);

function formatActivity(
  activity: {
    id: string;
    title: string;
    description: string;
    category: string;
    latitude: number;
    longitude: number;
    radiusMeters: number;
    xpReward: number;
    imageUrl: string | null;
    isActive: boolean;
    scheduledAt: Date | null;
  },
  userLat?: number,
  userLng?: number,
  completed?: boolean
) {
  const distance =
    userLat !== undefined && userLng !== undefined
      ? Math.round(distanceMeters(userLat, userLng, activity.latitude, activity.longitude))
      : undefined;
  return {
    id: activity.id,
    title: activity.title,
    description: activity.description,
    category: activity.category,
    latitude: activity.latitude,
    longitude: activity.longitude,
    radiusMeters: activity.radiusMeters,
    xpReward: activity.xpReward,
    imageUrl: activity.imageUrl,
    isActive: activity.isActive,
    scheduledAt: activity.scheduledAt,
    distanceMeters: distance,
    completed: completed ?? false,
    canCheckIn:
      distance !== undefined && distance <= activity.radiusMeters && !completed,
  };
}

router.post("/", (req: AuthRequest, res, next) => {
  activityImageUpload.single("image")(req, res, (err) => {
    if (err) {
      next(err);
      return;
    }
    handleCreateActivity(req, res);
  });
});

async function handleCreateActivity(req: AuthRequest, res: express.Response) {
  const parsed = createActivitySchema.safeParse({
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    latitude: Number(req.body.latitude),
    longitude: Number(req.body.longitude),
    radiusMeters:
      req.body.radiusMeters !== undefined && req.body.radiusMeters !== ""
        ? Number(req.body.radiusMeters)
        : undefined,
    xpReward:
      req.body.xpReward !== undefined && req.body.xpReward !== ""
        ? Number(req.body.xpReward)
        : undefined,
  });

  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const imageUrl = req.file ? publicUploadPath(req.file.filename) : null;

  const activity = await prisma.activity.create({
    data: { ...parsed.data, isActive: true, imageUrl },
  });

  res.status(201).json(formatActivity(activity));
}

router.get("/nearby", async (req: AuthRequest, res) => {
  const parsed = nearbyQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const { lat, lng, radiusKm } = parsed.data;
  const radiusM = radiusKm * 1000;

  const activities = await prisma.activity.findMany({
    where: { isActive: true },
  });

  const completions = await prisma.activityCompletion.findMany({
    where: { userId: req.user!.userId },
    select: { activityId: true },
  });
  const completedIds = new Set(completions.map((c) => c.activityId));

  const nearby = activities
    .map((a) => {
      const dist = distanceMeters(lat, lng, a.latitude, a.longitude);
      return { activity: a, dist };
    })
    .filter(({ dist }) => dist <= radiusM)
    .sort((a, b) => a.dist - b.dist)
    .map(({ activity, dist }) =>
      formatActivity(activity, lat, lng, completedIds.has(activity.id))
    );

  res.json({ activities: nearby });
});

router.get("/:id", async (req: AuthRequest, res) => {
  const id = String(req.params.id);
  const activity = await prisma.activity.findUnique({
    where: { id },
  });
  if (!activity) {
    res.status(404).json({ error: "Aktivität nicht gefunden" });
    return;
  }

  const completion = await prisma.activityCompletion.findUnique({
    where: {
      userId_activityId: {
        userId: req.user!.userId,
        activityId: activity.id,
      },
    },
  });

  const lat = req.query.lat ? Number(req.query.lat) : undefined;
  const lng = req.query.lng ? Number(req.query.lng) : undefined;

  res.json(
    formatActivity(
      activity,
      lat,
      lng,
      !!completion
    )
  );
});

router.post("/:id/complete", async (req: AuthRequest, res) => {
  const id = String(req.params.id);
  const parsed = completeActivitySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const activity = await prisma.activity.findUnique({
    where: { id },
  });
  if (!activity || !activity.isActive) {
    res.status(404).json({ error: "Aktivität nicht gefunden" });
    return;
  }

  const existing = await prisma.activityCompletion.findUnique({
    where: {
      userId_activityId: {
        userId: req.user!.userId,
        activityId: activity.id,
      },
    },
  });
  if (existing) {
    res.status(409).json({ error: "Aktivität bereits abgeschlossen" });
    return;
  }

  const { lat, lng } = parsed.data;
  if (
    !isWithinRadius(lat, lng, activity.latitude, activity.longitude, activity.radiusMeters)
  ) {
    const dist = Math.round(
      distanceMeters(lat, lng, activity.latitude, activity.longitude)
    );
    res.status(403).json({
      error: "Du bist zu weit von der Aktivität entfernt",
      distanceMeters: dist,
      requiredRadiusMeters: activity.radiusMeters,
    });
    return;
  }

  await prisma.activityCompletion.create({
    data: {
      userId: req.user!.userId,
      activityId: activity.id,
      checkInLat: lat,
      checkInLng: lng,
    },
  });

  const { xp, level } = await addXp(req.user!.userId, activity.xpReward);
  const badgesEarned = await awardBadges(req.user!.userId);

  res.json({
    xp,
    level: xpToLevel(xp),
    xpGained: activity.xpReward,
    badgesEarned,
    activity: formatActivity(activity, lat, lng, true),
  });
});

export default router;