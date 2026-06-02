export const CATEGORY_META: Record<
  string,
  { label: string; color: string; image: string }
> = {
  cleanup: {
    label: "Aufräumen",
    color: "#34d399",
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0fb15?w=400&h=300&fit=crop&q=80",
  },
  planting: {
    label: "Pflanzen",
    color: "#a3e635",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop&q=80",
  },
  repair: {
    label: "Reparatur",
    color: "#38bdf8",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08f7881a?w=400&h=300&fit=crop&q=80",
  },
  education: {
    label: "Workshop",
    color: "#c084fc",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=300&fit=crop&q=80",
  },
};

export function getCategoryMeta(category: string) {
  return (
    CATEGORY_META[category] ?? {
      label: category,
      color: "#94a3b8",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop&q=80",
    }
  );
}