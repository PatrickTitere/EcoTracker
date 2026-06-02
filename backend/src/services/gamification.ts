import type { ActivityCategory } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { xpToLevel } from "../lib/xp.js";

export { xpToLevel };

type BadgeCriteria =
  | { type: "completions"; count: number }
  | { type: "category_completions"; category: ActivityCategory; count: number }
  | { type: "level"; level: number };

export async function awardBadges(userId: string): Promise<
  Array<{ slug: string; name: string; description: string; iconKey: string }>
> {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    include: {
      completions: { include: { activity: true } },
      badges: true,
    },
  });

  const earnedBadgeIds = new Set(user.badges.map((b) => b.badgeId));
  const allBadges = await prisma.badge.findMany();
  const newlyEarned: Array<{
    slug: string;
    name: string;
    description: string;
    iconKey: string;
  }> = [];

  for (const badge of allBadges) {
    if (earnedBadgeIds.has(badge.id)) continue;

    const criteria = badge.criteria as BadgeCriteria;
    let earned = false;

    switch (criteria.type) {
      case "completions":
        earned = user.completions.length >= criteria.count;
        break;
      case "category_completions":
        earned =
          user.completions.filter((c) => c.activity.category === criteria.category)
            .length >= criteria.count;
        break;
      case "level":
        earned = user.level >= criteria.level;
        break;
    }

    if (earned) {
      await prisma.userBadge.create({
        data: { userId, badgeId: badge.id },
      });
      newlyEarned.push({
        slug: badge.slug,
        name: badge.name,
        description: badge.description,
        iconKey: badge.iconKey,
      });
    }
  }

  return newlyEarned;
}

export async function addXp(
  userId: string,
  xpReward: number
): Promise<{ xp: number; level: number }> {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { xp: { increment: xpReward } },
  });
  const level = xpToLevel(user.xp);
  if (level !== user.level) {
    await prisma.user.update({
      where: { id: userId },
      data: { level },
    });
  }
  return { xp: user.xp, level };
}