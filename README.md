# EcoMap Wien

Öko-Aktivitäten auf der Karte – Pokémon-Go-Style mit GPS-Check-in, XP, Level und Badges.

## Stack

- **Backend:** Node.js, Express, Prisma, PostgreSQL, JWT
- **Frontend:** Vite, React, Leaflet, TanStack Query
- **Tests:** Vitest, Testing Library, MSW, Playwright

## Voraussetzungen

- Node.js 20+
- Docker (für PostgreSQL)

## Setup

```bash
# 1. PostgreSQL starten
docker compose up -d

# 2. Abhängigkeiten (im Projektroot)
npm install

# 3. Backend-Umgebung
cp .env.example backend/.env
# JWT-Secrets anpassen für Produktion

# 4. Datenbank
npm run db:migrate -w backend
npm run db:seed -w backend

# 5. Frontend-Umgebung
echo 'VITE_API_URL=http://localhost:3001' > frontend/.env

# 6. Entwicklungsserver (Backend + Frontend)
npm run dev
```

- Frontend: http://localhost:5173  
- Backend: http://localhost:3001  

## Demo-Daten (Wien)

**18 Aktivitäten** an zwei Hotspots:

- **Wien Mitte** (Stephansplatz, `48.2082, 16.3738`)
- **HTL Spengergasse** (`48.1987, 16.3579`) – 10 Aktionen in der Nähe (Müllsammel Spengergasse, Schulhof-Grün, Naschmarkt-Patrouille, …)

Eingeloggte Nutzer können unter **Erstellen** (`/create`) eigene Aktivitäten anlegen.

### GPS für lokale Tests

In Chrome DevTools → **Sensors** → Location: Custom → `48.2082, 16.3738` (Wien).

Playwright setzt dieselbe Position automatisch in E2E-Tests.

## Badges

Badge-Icons wurden mit Grok Imagine erzeugt und liegen unter `frontend/public/badges/`:

| iconKey   | Datei           |
|-----------|-----------------|
| seedling  | seedling.png    |
| shield    | shield.png      |
| trash     | trash.png       |
| leaf      | leaf.png        |
| star      | star.png        |

## Tests

```bash
# Backend
npm run test -w backend

# Frontend (Unit + Integration)
npm run test -w frontend

# E2E (Frontend-Dev-Server wird gestartet)
npm run test:e2e -w frontend
```

## API (Auszug)

| Route | Beschreibung |
|-------|----------------|
| `POST /auth/register` | Registrierung |
| `POST /auth/login` | Login |
| `GET /activities/nearby?lat=&lng=` | Aktivitäten im Umkreis |
| `POST /activities` | Neue Aktivität erstellen (auth) |
| `POST /activities/:id/complete` | Check-in mit `{ lat, lng }` |
| `GET /badges` | Alle Badges |

Check-in ist nur möglich, wenn die Distanz ≤ `radiusMeters` der Aktivität (Haversine, serverseitig).