import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/", async (req: AuthRequest, res) => {
  const badges = await prisma.badge.findMany({ orderBy: { slug: "asc" } });
  const earned = await prisma.userBadge.findMany({
    where: { userId: req.user!.userId },
  });
  const earnedMap = new Map(earned.map((e) => [e.badgeId, e.earnedAt]));

  res.json({
    badges: badges.map((b) => ({
      slug: b.slug,
      name: b.name,
      description: b.description,
      iconKey: b.iconKey,
      earned: earnedMap.has(b.id),
      earnedAt: earnedMap.get(b.id) ?? null,
    })),
  });
});

export default router;