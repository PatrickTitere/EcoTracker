import { PrismaClient, ActivityCategory } from "@prisma/client";
import { seedImageForActivity } from "../src/lib/activityImages.js";

const prisma = new PrismaClient();

/** Stephansplatz / Wien Mitte */
const WIEN_MITTE = {
  lat: parseFloat(process.env.SEED_CENTER_LAT ?? "48.2082"),
  lng: parseFloat(process.env.SEED_CENTER_LNG ?? "16.3738"),
};

/** HTL Spengergasse, 1050 Wien */
const HTL_SPENGER = { lat: 48.1987, lng: 16.3579 };

function at(base: { lat: number; lng: number }, dLat: number, dLng: number) {
  return { latitude: base.lat + dLat, longitude: base.lng + dLng };
}

const activities = [
  // —— Wien Mitte ——
  {
    title: "Müllsammel-Truppe Donaukanal",
    description:
      "Gemeinsam Müll am Donaukanal sammeln. Handschuhe und Säcke werden gestellt.",
    category: ActivityCategory.cleanup,
    ...at(WIEN_MITTE, 0.002, 0.003),
    radiusMeters: 120,
    xpReward: 75,
  },
  {
    title: "Stadtpark Wien – Laub & Plastik",
    description: "Öko-Aktion im Stadtpark: Laub zusammenfegen und Plastik einsammeln.",
    category: ActivityCategory.cleanup,
    ...at(WIEN_MITTE, -0.004, 0.002),
    radiusMeters: 100,
    xpReward: 60,
  },
  {
    title: "Bienenfreundliche Pflanzaktion",
    description:
      "Heimische Wildblumen pflanzen – gut für Bienen und Schmetterlinge.",
    category: ActivityCategory.planting,
    ...at(WIEN_MITTE, 0.003, -0.002),
    radiusMeters: 80,
    xpReward: 90,
  },
  {
    title: "Fahrrad-Reparatur Café",
    description:
      "Bring dein Fahrrad mit – ehrenamtliche Mechaniker helfen bei kleinen Reparaturen.",
    category: ActivityCategory.repair,
    ...at(WIEN_MITTE, -0.002, -0.004),
    radiusMeters: 50,
    xpReward: 50,
  },
  {
    title: "Zero Waste Workshop",
    description:
      "Kurzworkshop: weniger Müll im Alltag. Tipps für Einkauf und Haushalt.",
    category: ActivityCategory.education,
    ...at(WIEN_MITTE, 0.001, 0.001),
    radiusMeters: 60,
    xpReward: 40,
  },
  {
    title: "Donauinsel Cleanup",
    description: "Große Sammelaktion auf der Donauinsel – Familien willkommen.",
    category: ActivityCategory.cleanup,
    ...at(WIEN_MITTE, -0.006, 0.005),
    radiusMeters: 150,
    xpReward: 100,
  },
  {
    title: "Kompostieren lernen",
    description: "Einführung in Kompostierung für Balkon und Garten.",
    category: ActivityCategory.education,
    ...at(WIEN_MITTE, 0.005, 0.004),
    radiusMeters: 70,
    xpReward: 45,
  },
  {
    title: "Gemeinschaftsgarten Mariahilf",
    description: "Mithelfen beim Unkraut jäten und Gemüsebeete pflegen.",
    category: ActivityCategory.planting,
    ...at(WIEN_MITTE, -0.003, -0.001),
    radiusMeters: 90,
    xpReward: 80,
  },

  // —— HTL Spengergasse & Umgebung ——
  {
    title: "Müllsammel-Aktion Spengergasse",
    description:
      "Aufräumen rund um die HTL Spengergasse – ideal für Schulteams nach dem Unterricht.",
    category: ActivityCategory.cleanup,
    ...at(HTL_SPENGER, 0.0003, 0.0002),
    radiusMeters: 100,
    xpReward: 70,
  },
  {
    title: "Schulhof-Grün: Beete pflegen",
    description:
      "Gemeinsam Beete und Grünflächen am Schulgelände herrichten – Handschuhe werden gestellt.",
    category: ActivityCategory.planting,
    ...at(HTL_SPENGER, -0.0002, 0.0004),
    radiusMeters: 80,
    xpReward: 85,
  },
  {
    title: "Naschmarkt Umwelt-Patrouille",
    description:
      "Kurze Sammelrunde vom HTL bis zum Naschmarkt – Fokus auf Plastik und Zigarettenstummel.",
    category: ActivityCategory.cleanup,
    ...at(HTL_SPENGER, 0.0015, 0.002),
    radiusMeters: 120,
    xpReward: 65,
  },
  {
    title: "Repair-Café Margareten",
    description:
      "Kleingeräte und Fahrräder reparieren statt wegwerfen – Werkzeug vor Ort.",
    category: ActivityCategory.repair,
    ...at(HTL_SPENGER, -0.001, -0.0008),
    radiusMeters: 60,
    xpReward: 55,
  },
  {
    title: "Klima-Workshop HTL",
    description:
      "Schüler:innen-Workshop: CO₂-Fußabdruck berechnen und Alltagstipps mitnehmen.",
    category: ActivityCategory.education,
    ...at(HTL_SPENGER, 0.0001, -0.0003),
    radiusMeters: 50,
    xpReward: 50,
  },
  {
    title: "Wienfluss-Ufer Cleanup",
    description:
      "Gemeinsame Aktion am Wienfluss – vom 5. Bezirk aus in ~10 Minuten erreichbar.",
    category: ActivityCategory.cleanup,
    ...at(HTL_SPENGER, -0.002, 0.001),
    radiusMeters: 130,
    xpReward: 90,
  },
  {
    title: "Straßenbäume gießen",
    description:
      "Bei Hitze Bäume in der Spengergasse und Umgebung wässern – Eimer am Treffpunkt.",
    category: ActivityCategory.planting,
    ...at(HTL_SPENGER, 0.0008, -0.0012),
    radiusMeters: 90,
    xpReward: 60,
  },
  {
    title: "Second Hand & Tauschbörse",
    description:
      "Kleidung und Bücher tauschen statt neu kaufen – nachhaltiger Konsum für die Schule.",
    category: ActivityCategory.education,
    ...at(HTL_SPENGER, 0.001, 0.0005),
    radiusMeters: 70,
    xpReward: 45,
  },
  {
    title: "Reinigung Margaretenpark",
    description:
      "Park in Gehweite der HTL: Müllsammeln und Wege von Laub befreien.",
    category: ActivityCategory.cleanup,
    ...at(HTL_SPENGER, -0.0015, 0.0018),
    radiusMeters: 110,
    xpReward: 75,
  },
  {
    title: "Upcycling-Werkstatt",
    description:
      "Aus Abfall Materialien für Projekte bauen – perfekt für HTL-Technik-Klassen.",
    category: ActivityCategory.repair,
    ...at(HTL_SPENGER, 0.0005, 0.001),
    radiusMeters: 55,
    xpReward: 70,
  },
];

const badges = [
  {
    slug: "first-step",
    name: "Erster Schritt",
    description: "Erste Öko-Aktivität abgeschlossen.",
    iconKey: "seedling",
    criteria: { type: "completions", count: 1 },
  },
  {
    slug: "eco-warrior",
    name: "Öko-Krieger",
    description: "5 Aktivitäten abgeschlossen.",
    iconKey: "shield",
    criteria: { type: "completions", count: 5 },
  },
  {
    slug: "cleanup-hero",
    name: "Aufräumheld",
    description: "3 Cleanup-Aktivitäten abgeschlossen.",
    iconKey: "trash",
    criteria: { type: "category_completions", category: "cleanup", count: 3 },
  },
  {
    slug: "green-thumb",
    name: "Grüner Daumen",
    description: "2 Pflanz-Aktivitäten abgeschlossen.",
    iconKey: "leaf",
    criteria: { type: "category_completions", category: "planting", count: 2 },
  },
  {
    slug: "level-5",
    name: "Level 5 Meister",
    description: "Level 5 erreicht.",
    iconKey: "star",
    criteria: { type: "level", level: 5 },
  },
  {
    slug: "htl-local",
    name: "Spengergasse Local",
    description: "3 Aktivitäten nahe HTL Spengergasse abgeschlossen.",
    iconKey: "shield",
    criteria: { type: "completions", count: 3 },
  },
];

async function main() {
  await prisma.activityCompletion.deleteMany();
  await prisma.userBadge.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.badge.deleteMany();

  for (const badge of badges) {
    await prisma.badge.create({ data: badge });
  }

  for (const activity of activities) {
    await prisma.activity.create({
      data: {
        ...activity,
        imageUrl: seedImageForActivity(activity.title, activity.category),
      },
    });
  }

  const htlCount = activities.filter(
    (a) =>
      Math.abs(a.latitude - HTL_SPENGER.lat) < 0.01 &&
      Math.abs(a.longitude - HTL_SPENGER.lng) < 0.01
  ).length;

  console.log(
    `Seeded ${activities.length} activities (${htlCount} near HTL Spengergasse) and ${badges.length} badges`
  );
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());