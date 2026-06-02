import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken, type TokenPayload } from "../services/auth.js";

export interface AuthRequest extends Request {
  user?: TokenPayload;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Nicht authentifiziert" });
    return;
  }
  try {
    req.user = verifyAccessToken(header.slice(7));
    next();
  } catch {
    res.status(401).json({ error: "Token ungültig oder abgelaufen" });
  }
}