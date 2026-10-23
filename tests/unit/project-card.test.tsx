import { fireEvent, render, screen, within } from "@testing-library/react";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { projects, type Project } from "@/lib/content";

const mysawit = projects.find((project) => project.slug === "mysawit")!;

function renderCard(project: Project = mysawit) {
  render(
    <ul>
      <ProjectCard project={project} />
    </ul>,
  );
  return screen.getByRole("button", { name: project.title });
}

describe("ProjectCard", () => {
  it("shows the name, summary and tech stack", () => {
    renderCard();
    expect(screen.getByRole("heading", { level: 3, name: "MySawit" })).toBeInTheDocument();
    expect(screen.getByText(mysawit.summary)).toBeInTheDocument();
    const stack = screen.getByRole("list", { name: "Tech stack" });
    expect(within(stack).getAllByRole("listitem").map((tag) => tag.textContent)).toEqual(mysawit.tags);
  });

  it("opens the details in a popup and closes it", () => {
    const button = renderCard();
    expect(button).toHaveAttribute("aria-haspopup", "dialog");

    fireEvent.click(button);
    const dialog = screen.getByRole("dialog", { name: "MySawit" });
    expect(within(dialog).getByText(mysawit.role)).toBeInTheDocument();
    expect(within(dialog).getByText(mysawit.description)).toBeInTheDocument();

    fireEvent.click(within(dialog).getByRole("button", { name: "Close MySawit" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("links to the project's repositories", () => {
    renderCard();
    const github = screen.getAllByRole("link", { name: /MySawit on GitHub/ })[0];
    expect(github).toHaveAttribute("href", mysawit.links[0].url);
    expect(github).toHaveAttribute("target", "_blank");
  });
});
