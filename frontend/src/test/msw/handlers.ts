import { http, HttpResponse } from "msw";

const API = "http://localhost:3001";

export const handlers = [
  http.get(`${API}/auth/me`, () =>
    HttpResponse.json({
      id: "u1",
      email: "test@example.com",
      displayName: "Tester",
      xp: 100,
      level: 2,
      badges: [],
      completedActivityIds: [],
    })
  ),

  http.get(`${API}/activities/nearby`, () =>
    HttpResponse.json({
      activities: [
        {
          id: "a1",
          title: "Müllsammel-Truppe Donaukanal",
          description: "Test",
          category: "cleanup",
          latitude: 48.2082,
          longitude: 16.3738,
          radiusMeters: 100,
          xpReward: 75,
          imageUrl: "https://images.unsplash.com/photo-1618472387224-7850f329b137?w=800",
          isActive: true,
          scheduledAt: null,
          distanceMeters: 50,
          completed: false,
          canCheckIn: true,
        },
      ],
    })
  ),

  http.post(`${API}/activities/:id/complete`, async ({ request }) => {
    const body = (await request.json()) as { lat: number; lng: number };
    if (body.lat < 48.2) {
      return HttpResponse.json(
        { error: "Du bist zu weit von der Aktivität entfernt" },
        { status: 403 }
      );
    }
    return HttpResponse.json({
      xp: 175,
      level: 2,
      xpGained: 75,
      badgesEarned: [
        {
          slug: "first-step",
          name: "Erster Schritt",
          description: "Erste Aktivität",
          iconKey: "seedling",
        },
      ],
      activity: { id: "a1", completed: true },
    });
  }),

  http.post(`${API}/activities`, async () =>
    HttpResponse.json(
      {
        id: "a-new",
        title: "Neue Mission",
        description: "Beschreibung der neuen Mission.",
        category: "cleanup",
        latitude: 48.1987,
        longitude: 16.3579,
        radiusMeters: 100,
        xpReward: 50,
        imageUrl: "/uploads/activities/mock.jpg",
        isActive: true,
        scheduledAt: null,
        completed: false,
      },
      { status: 201 }
    )
  ),

  http.get(`${API}/activities/:id`, () =>
    HttpResponse.json({
      id: "a1",
      title: "Müllsammel-Truppe Donaukanal",
      description: "Test",
      category: "cleanup",
      latitude: 48.2082,
      longitude: 16.3738,
      radiusMeters: 100,
      xpReward: 75,
      imageUrl: "https://images.unsplash.com/photo-1618472387224-7850f329b137?w=800",
      isActive: true,
      scheduledAt: null,
      completed: false,
      canCheckIn: true,
    })
  ),
];