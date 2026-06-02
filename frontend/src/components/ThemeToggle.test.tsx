import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeToggle } from "./ThemeToggle";
import { renderWithProviders } from "../test/render";

vi.mock("framer-motion", () => ({
  motion: {
    span: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <span {...props}>{children}</span>
    ),
  },
}));

describe("ThemeToggle", () => {
  it("toggles theme on click", async () => {
    const user = userEvent.setup();
    localStorage.clear();
    document.documentElement.setAttribute("data-theme", "dark");

    renderWithProviders(<ThemeToggle />);
    const btn = screen.getByRole("button", { name: "Light Mode aktivieren" });
    expect(btn).toHaveClass("theme-toggle--dark");

    await user.click(btn);
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(screen.getByRole("button", { name: "Dark Mode aktivieren" })).toHaveClass(
      "theme-toggle--light"
    );
  });
});