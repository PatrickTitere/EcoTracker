/** Curated Unsplash images per mission (w=800 for cards). */
export const SEED_ACTIVITY_IMAGES: Record<string, string> = {
  "Müllsammel-Truppe Donaukanal":
    "https://images.unsplash.com/photo-1618472387224-7850f329b137?w=800&h=600&fit=crop&q=80",
  "Stadtpark Wien – Laub & Plastik":
    "https://images.unsplash.com/photo-1532996122724-e3c354a0fb15?w=800&h=600&fit=crop&q=80",
  "Bienenfreundliche Pflanzaktion":
    "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop&q=80",
  "Fahrrad-Reparatur Café":
    "https://images.unsplash.com/photo-1485965120188-e8f994d8352f?w=800&h=600&fit=crop&q=80",
  "Zero Waste Workshop":
    "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&fit=crop&q=80",
  "Donauinsel Cleanup":
    "https://images.unsplash.com/photo-1621451535480-9c8d1d227f44?w=800&h=600&fit=crop&q=80",
  "Kompostieren lernen":
    "https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=800&h=600&fit=crop&q=80",
  "Gemeinschaftsgarten Mariahilf":
    "https://images.unsplash.com/photo-1464226189744-aa900abe88b2?w=800&h=600&fit=crop&q=80",
  "Müllsammel-Aktion Spengergasse":
    "https://images.unsplash.com/photo-1533158326339-7f5d0f6c4123?w=800&h=600&fit=crop&q=80",
  "Schulhof-Grün: Beete pflegen":
    "https://images.unsplash.com/photo-1592155931580-901bb217a9f2?w=800&h=600&fit=crop&q=80",
  "Naschmarkt Umwelt-Patrouille":
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&q=80",
  "Repair-Café Margareten":
    "https://images.unsplash.com/photo-1581092160562-40aa08f7881a?w=800&h=600&fit=crop&q=80",
  "Klima-Workshop HTL":
    "https://images.unsplash.com/photo-1542601906990-bf4e3abb76fb?w=800&h=600&fit=crop&q=80",
  "Wienfluss-Ufer Cleanup":
    "https://images.unsplash.com/photo-1618472387224-7850f329b137?w=800&h=600&fit=crop&q=80",
  "Straßenbäume gießen":
    "https://images.unsplash.com/photo-1542273918-9f79d4f96773?w=800&h=600&fit=crop&q=80",
  "Second Hand & Tauschbörse":
    "https://images.unsplash.com/photo-1520006403909-838d6b92c22e?w=800&h=600&fit=crop&q=80",
  "Reinigung Margaretenpark":
    "https://images.unsplash.com/photo-1604881991720-fa129967f576?w=800&h=600&fit=crop&q=80",
  "Upcycling-Werkstatt":
    "https://images.unsplash.com/photo-1581833971358-2c8b00f2b7b9?w=800&h=600&fit=crop&q=80",
};

const CATEGORY_FALLBACK: Record<string, string> = {
  cleanup:
    "https://images.unsplash.com/photo-1532996122724-e3c354a0fb15?w=800&h=600&fit=crop&q=80",
  planting:
    "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop&q=80",
  repair:
    "https://images.unsplash.com/photo-1581092160562-40aa08f7881a?w=800&h=600&fit=crop&q=80",
  education:
    "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&fit=crop&q=80",
};

export function seedImageForActivity(title: string, category: string): string {
  return (
    SEED_ACTIVITY_IMAGES[title] ??
    CATEGORY_FALLBACK[category] ??
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop&q=80"
  );
}