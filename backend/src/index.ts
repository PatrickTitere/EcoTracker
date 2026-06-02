import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.js";
import activityRoutes from "./routes/activities.js";
import badgeRoutes from "./routes/badges.js";
import { ensureUploadDirs, UPLOADS_ROOT } from "./lib/upload.js";

const app = express();
const port = Number(process.env.PORT ?? 3001);
const corsOrigin = process.env.CORS_ORIGIN ?? "http://localhost:5173";

ensureUploadDirs();
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json());
app.use("/uploads", express.static(UPLOADS_ROOT));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: "Zu viele Anfragen, bitte später erneut versuchen" },
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authLimiter, authRoutes);
app.use("/activities", activityRoutes);
app.use("/badges", badgeRoutes);

app.use(
  (
    err: Error & { code?: string },
    _req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (err.code === "LIMIT_FILE_SIZE") {
      res.status(400).json({ error: "Bild max. 5 MB" });
      return;
    }
    if (err.message?.includes("Nur JPEG")) {
      res.status(400).json({ error: err.message });
      return;
    }
    next(err);
  }
);

app.listen(port, () => {
  console.log(`Backend läuft auf http://localhost:${port}`);
});