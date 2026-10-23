import { render, screen } from "@testing-library/react";
import Home from "@/app/page";
import { site } from "@/lib/content";

describe("Home page", () => {
  it("has a single h1 with the site name", () => {
    render(<Home />);
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent(site.greeting);
  });

  it("has the sections in the design's order", () => {
    render(<Home />);
    const sectionHeadings = screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);
    expect(sectionHeadings).toEqual([
      "A little about me",
      "Experience",
      "Projects",
      "Off the clock",
    ]);
  });

  it("shows each project as a card that opens a popup", () => {
    render(<Home />);
    expect(screen.getByRole("button", { name: "MySawit" })).toHaveAttribute("aria-haspopup", "dialog");
  });
});
