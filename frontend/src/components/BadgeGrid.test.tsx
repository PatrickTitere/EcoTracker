import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BadgeGrid } from "./BadgeGrid";

describe("BadgeGrid", () => {
  it("shows empty message when no badges", () => {
    render(<BadgeGrid badges={[]} />);
    expect(screen.getByText(/Noch keine Badges/)).toBeInTheDocument();
  });

  it("renders badge names and images", () => {
    render(
      <BadgeGrid
        badges={[
          {
            slug: "first-step",
            name: "Erster Schritt",
            description: "Test",
            iconKey: "seedling",
            earned: true,
          },
        ]}
      />
    );
    expect(screen.getByText("Erster Schritt")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Erster Schritt" })).toHaveAttribute(
      "src",
      "/badges/seedling.png"
    );
  });

  it("shows locked state", () => {
    render(
      <BadgeGrid
        badges={[
          {
            slug: "eco-warrior",
            name: "Öko-Krieger",
            description: "5 Aktivitäten",
            iconKey: "shield",
            earned: false,
          },
        ]}
      />
    );
    expect(screen.getByText("Gesperrt")).toBeInTheDocument();
  });
});