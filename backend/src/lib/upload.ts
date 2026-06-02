import fs from "fs";
import path from "path";
import multer from "multer";
import { randomUUID } from "crypto";

export const UPLOADS_ROOT = path.join(process.cwd(), "uploads");
export const ACTIVITY_UPLOAD_DIR = path.join(UPLOADS_ROOT, "activities");

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export function ensureUploadDirs() {
  fs.mkdirSync(ACTIVITY_UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    ensureUploadDirs();
    cb(null, ACTIVITY_UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
    const safeExt = [".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(ext)
      ? ext === ".jpeg"
        ? ".jpg"
        : ext
      : ".jpg";
    cb(null, `${randomUUID()}${safeExt}`);
  },
});

export const activityImageUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME.has(file.mimetype)) {
      cb(new Error("Nur JPEG, PNG, WebP oder GIF erlaubt"));
      return;
    }
    cb(null, true);
  },
});

export function publicUploadPath(filename: string) {
  return `/uploads/activities/${filename}`;
}