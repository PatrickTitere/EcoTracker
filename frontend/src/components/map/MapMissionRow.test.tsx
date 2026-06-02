import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { MapMissionRow } from "./MapMissionRow";
import { renderWithProviders } from "../../test/render";
import type { Activity } from "../../lib/api";

const activity: Activity = {
  id: "a2",
  title: "Bienenfreundliche Pflanzaktion",
  description: "Wildblumen pflanzen.",
  category: "planting",
  latitude: 48.2082,
  longitude: 16.3738,
  radiusMeters: 80,
  xpReward: 90,
  imageUrl: "/uploads/activities/seed.jpg",
  isActive: true,
  scheduledAt: null,
  distanceMeters: 120,
  completed: false,
  canCheckIn: true,
};

describe("MapMissionRow", () => {
  it("renders mission info and upload image URL", () => {
    renderWithProviders(<MapMissionRow activity={activity} />);
    expect(screen.getByText(activity.title)).toBeInTheDocument();
    expect(screen.getByText("120 m")).toBeInTheDocument();
    expect(screen.getByText("+90 XP")).toBeInTheDocument();
    expect(screen.getByText("Live")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: activity.title })).toHaveAttribute(
      "src",
      "http://localhost:3001/uploads/activities/seed.jpg"
    );
  });
});