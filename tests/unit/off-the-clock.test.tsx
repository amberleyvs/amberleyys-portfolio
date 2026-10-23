import { render, screen } from "@testing-library/react";
import { OffTheClock } from "@/components/off-the-clock/OffTheClock";
import { offTheClock } from "@/lib/content";

describe("OffTheClock", () => {
  it("shows every item at once, in order", () => {
    render(<OffTheClock />);
    const titles = screen.getAllByRole("heading", { level: 3 }).map((heading) => heading.textContent);
    expect(titles).toEqual(offTheClock.items.map((item) => item.title));
    for (const item of offTheClock.items) expect(screen.getByText(item.line)).toBeInTheDocument();
  });

  it("links to the reading list on Notion", () => {
    render(<OffTheClock />);
    expect(screen.getByRole("link", { name: /reading list on Notion/ })).toHaveAttribute(
      "href",
      expect.stringContaining("notion.site"),
    );
  });
});
