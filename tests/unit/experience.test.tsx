import { fireEvent, render, screen, within } from "@testing-library/react";
import { Experience } from "@/components/experience/Experience";
import { formatDates } from "@/components/experience/Timeline";
import { experience } from "@/lib/content";

const entryTitles = () => screen.getAllByRole("heading", { level: 3 }).map((heading) => heading.textContent);

describe("formatDates", () => {
  it("writes ranges in plain English", () => {
    expect(formatDates({ start: "January 2026", end: "October 2026" })).toBe("January 2026 to October 2026");
    expect(formatDates({ start: "August 2026", end: null })).toBe("August 2026 - Present");
  });
});

describe("Experience on Home", () => {
  it("lists every role newest first, with no schools", () => {
    render(<Experience />);
    expect(entryTitles()).toEqual(experience.roles.map((role) => role.title));
    expect(entryTitles()).not.toContain("Bachelor of Computer Science");
  });

  it("shows each role's organization and what was done there", () => {
    render(<Experience />);
    const [first] = experience.roles;
    const firstRole = screen.getAllByRole("listitem").find((item) => item.textContent?.includes(first.title))!;
    expect(within(firstRole).getByText(first.org)).toBeInTheDocument();
    expect(within(firstRole).getByText(first.points[0])).toBeInTheDocument();
  });

  it("has a See more button that expands and collapses the list", () => {
    render(<Experience />);
    const hidden = experience.roles.length - 3;
    const button = screen.getByRole("button", { name: `See more: ${hidden} more` });
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveAttribute("aria-controls", "experience-timeline");

    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(button).toHaveAccessibleName("See less");
    expect(document.activeElement).toHaveTextContent(experience.roles[3].title);

    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("links to the resume PDF in a new tab", () => {
    render(<Experience />);
    const link = screen.getByRole("link", { name: /download resume/i });
    expect(link).toHaveAttribute("href", "/resume.pdf");
    expect(link).toHaveAttribute("target", "_blank");
  });
});
