import { fireEvent, render, screen } from "@testing-library/react";
import { TrainScene } from "@/components/hero/TrainScene";
import { train } from "@/lib/content";

function cat(name: string) {
  return screen.getByRole("button", { name: new RegExp(`^${name} the cat`) });
}

describe("TrainScene", () => {
  it("starts with every cat from content/train.json in its place", () => {
    render(<TrainScene />);
    expect(screen.getAllByRole("button", { name: / the cat, / })).toHaveLength(5);
    expect(cat("Mochi")).toHaveAccessibleName(/in window 2/);
    expect(cat("Biscuit")).toHaveAccessibleName(/on the roof/);
    expect(cat("Soot")).toHaveAccessibleName(/on the platform/);
  });

  it("has no extra controls, just a short caption", () => {
    render(<TrainScene />);
    expect(screen.queryByRole("button", { name: /reset|toot/i })).not.toBeInTheDocument();
    expect(screen.getByText(train.caption)).toBeInTheDocument();
  });

  it("tells keyboard and screen reader users how to move a cat", () => {
    render(<TrainScene />);
    expect(cat("Mochi")).toHaveAccessibleName(/Drag, or use the arrow keys to move\./);
  });

  it("moves a cat with the arrow keys and announces it", () => {
    render(<TrainScene />);
    fireEvent.keyDown(cat("Mochi"), { key: "ArrowRight" });
    expect(cat("Mochi")).toHaveAccessibleName(/in window 3/);
    expect(screen.getByRole("status")).toHaveTextContent("Mochi is in window 3.");

    fireEvent.keyDown(cat("Mochi"), { key: "ArrowUp" });
    expect(cat("Mochi")).toHaveAccessibleName(/on the roof/);

    fireEvent.keyDown(cat("Mochi"), { key: "ArrowDown" });
    expect(screen.getByRole("status")).toHaveTextContent("Mochi is on the platform.");
  });

  it("skips windows that already have a cat", () => {
    render(<TrainScene />);
    for (const expected of [3, 4, 5, 7]) {
      fireEvent.keyDown(cat("Soot"), { key: "ArrowRight" });
      expect(cat("Soot")).toHaveAccessibleName(new RegExp(`in window ${expected}`));
    }
  });
});
