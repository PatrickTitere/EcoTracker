const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

export interface User {
  id: string;
  email: string;
  displayName: string;
  xp: number;
  level: number;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  category: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  xpReward: number;
  imageUrl?: string | null;
  isActive: boolean;
  scheduledAt: string | null;
  distanceMeters?: number;
  completed: boolean;
  canCheckIn?: boolean;
}

export interface Badge {
  slug: string;
  name: string;
  description: string;
  iconKey: string;
  earned?: boolean;
  earnedAt?: string | null;
}

function readStorage(storage: Storage, key: string): string | null {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

let accessToken: string | null =
  typeof sessionStorage !== "undefined"
    ? readStorage(sessionStorage, "accessToken")
    : null;
let refreshToken: string | null =
  typeof localStorage !== "undefined"
    ? readStorage(localStorage, "refreshToken")
    : null;

export function setTokens(access: string, refresh: string) {
  accessToken = access;
  refreshToken = refresh;
  sessionStorage.setItem("accessToken", access);
  localStorage.setItem("refreshToken", refresh);
}

export function clearTokens() {
  accessToken = null;
  refreshToken = null;
  sessionStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

export function getAccessToken() {
  return accessToken;
}

async function refreshAccessToken(): Promise<boolean> {
  if (!refreshToken) return false;
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  if (!res.ok) return false;
  const data = await res.json();
  accessToken = data.accessToken;
  sessionStorage.setItem("accessToken", data.accessToken);
  return true;
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  let res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (res.status === 401 && refreshToken) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      headers.Authorization = `Bearer ${accessToken}`;
      res = await fetch(`${API_URL}${path}`, { ...options, headers });
    }
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new ApiError(res.status, err.error ?? "Anfrage fehlgeschlagen", err);
  }

  return res.json() as Promise<T>;
}

async function apiFetchForm<T>(path: string, formData: FormData): Promise<T> {
  const headers: Record<string, string> = {};
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  let res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (res.status === 401 && refreshToken) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      headers.Authorization = `Bearer ${accessToken}`;
      res = await fetch(`${API_URL}${path}`, {
        method: "POST",
        headers,
        body: formData,
      });
    }
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new ApiError(res.status, err.error ?? "Anfrage fehlgeschlagen", err);
  }

  return res.json() as Promise<T>;
}

export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export const api = {
  register: (body: { email: string; password: string; displayName: string }) =>
    apiFetch<{ accessToken: string; refreshToken: string; user: User }>(
      "/auth/register",
      { method: "POST", body: JSON.stringify(body) }
    ),

  login: (body: { email: string; password: string }) =>
    apiFetch<{ accessToken: string; refreshToken: string; user: User }>(
      "/auth/login",
      { method: "POST", body: JSON.stringify(body) }
    ),

  me: () =>
    apiFetch<{
      id: string;
      email: string;
      displayName: string;
      xp: number;
      level: number;
      badges: Array<Badge & { earnedAt: string }>;
      completedActivityIds: string[];
    }>("/auth/me"),

  createActivity: (
    body: {
      title: string;
      description: string;
      category: string;
      latitude: number;
      longitude: number;
      radiusMeters: number;
      xpReward: number;
    },
    image?: File | null
  ) => {
    const formData = new FormData();
    formData.append("title", body.title);
    formData.append("description", body.description);
    formData.append("category", body.category);
    formData.append("latitude", String(body.latitude));
    formData.append("longitude", String(body.longitude));
    formData.append("radiusMeters", String(body.radiusMeters));
    formData.append("xpReward", String(body.xpReward));
    if (image) formData.append("image", image);
    return apiFetchForm<Activity>("/activities", formData);
  },

  nearby: (lat: number, lng: number, radiusKm = 5) =>
    apiFetch<{ activities: Activity[] }>(
      `/activities/nearby?lat=${lat}&lng=${lng}&radiusKm=${radiusKm}`
    ),

  activity: (id: string, lat?: number, lng?: number) => {
    const q =
      lat !== undefined && lng !== undefined ? `?lat=${lat}&lng=${lng}` : "";
    return apiFetch<Activity>(`/activities/${id}${q}`);
  },

  complete: (id: string, lat: number, lng: number) =>
    apiFetch<{
      xp: number;
      level: number;
      xpGained: number;
      badgesEarned: Badge[];
      activity: Activity;
    }>(`/activities/${id}/complete`, {
      method: "POST",
      body: JSON.stringify({ lat, lng }),
    }),

  badges: () => apiFetch<{ badges: Badge[] }>("/badges"),
};