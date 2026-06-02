const BADGE_IMAGES: Record<string, string> = {
  seedling: "/badges/seedling.png",
  shield: "/badges/shield.png",
  trash: "/badges/trash.png",
  leaf: "/badges/leaf.png",
  star: "/badges/star.png",
};

export function getBadgeImageUrl(iconKey: string): string {
  return BADGE_IMAGES[iconKey] ?? "/badges/seedling.png";
}