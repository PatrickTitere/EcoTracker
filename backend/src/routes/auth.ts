import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import {
  hashPassword,
  verifyPassword,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../services/auth.js";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";
import { xpToLevel } from "../services/gamification.js";

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  displayName: z.string().min(2).max(50),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

router.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const { email, password, displayName } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.status(409).json({ error: "E-Mail bereits registriert" });
    return;
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, passwordHash, displayName },
  });

  const payload = { userId: user.id, email: user.email };
  res.status(201).json({
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      xp: user.xp,
      level: user.level,
    },
  });
});

router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    res.status(401).json({ error: "E-Mail oder Passwort falsch" });
    return;
  }

  const payload = { userId: user.id, email: user.email };
  res.json({
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      xp: user.xp,
      level: user.level,
    },
  });
});

router.post("/refresh", async (req, res) => {
  const token = req.body.refreshToken as string | undefined;
  if (!token) {
    res.status(400).json({ error: "Refresh-Token fehlt" });
    return;
  }
  try {
    const payload = verifyRefreshToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) {
      res.status(401).json({ error: "Benutzer nicht gefunden" });
      return;
    }
    res.json({
      accessToken: signAccessToken({ userId: user.id, email: user.email }),
    });
  } catch {
    res.status(401).json({ error: "Refresh-Token ungültig" });
  }
});

router.get("/me", requireAuth, async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    include: {
      badges: { include: { badge: true }, orderBy: { earnedAt: "desc" } },
      completions: { select: { activityId: true } },
    },
  });
  if (!user) {
    res.status(404).json({ error: "Benutzer nicht gefunden" });
    return;
  }

  res.json({
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    xp: user.xp,
    level: xpToLevel(user.xp),
    badges: user.badges.map((ub) => ({
      slug: ub.badge.slug,
      name: ub.badge.name,
      description: ub.badge.description,
      iconKey: ub.badge.iconKey,
      earnedAt: ub.earnedAt,
    })),
    completedActivityIds: user.completions.map((c) => c.activityId),
  });
});

export default router;