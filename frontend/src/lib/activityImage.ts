import { getCategoryMeta } from "./categories";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

export function getActivityImage(activity: {
  category: string;
  imageUrl?: string | null;
}): string {
  if (activity.imageUrl) {
    return activity.imageUrl.startsWith("http")
      ? activity.imageUrl
      : `${API_URL}${activity.imageUrl}`;
  }
  return getCategoryMeta(activity.category).image;
}