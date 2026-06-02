import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { ActivityCard } from "./ActivityCard";
import { renderWithProviders } from "../test/render";
import type { Activity } from "../lib/api";

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <div {...props}>{children}</div>
    ),
  },
}));

const baseActivity: Activity = {
  id: "a1",
  title: "Müllsammel-Truppe Donaukanal",
  description: "Testbeschreibung für die Mission.",
  category: "cleanup",
  latitude: 48.2082,
  longitude: 16.3738,
  radiusMeters: 100,
  xpReward: 75,
  imageUrl: "https://images.unsplash.com/photo-test?w=800",
  isActive: true,
  scheduledAt: null,
  distanceMeters: 42,
  completed: false,
  canCheckIn: true,
};

describe("ActivityCard", () => {
  it("renders title, XP and mission image", () => {
    renderWithProviders(<ActivityCard activity={baseActivity} />);
    expect(screen.getByRole("heading", { name: baseActivity.title })).toBeInTheDocument();
    expect(screen.getByText("+75 XP")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: baseActivity.title })).toHaveAttribute(
      "src",
      baseActivity.imageUrl
    );
    expect(screen.getByText("Live Check-in")).toBeInTheDocument();
  });

  it("shows completed state", () => {
    renderWithProviders(
      <ActivityCard activity={{ ...baseActivity, completed: true, canCheckIn: false }} />
    );
    expect(screen.getByText("Abgeschlossen")).toBeInTheDocument();
  });
});