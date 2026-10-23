import { fireEvent, render, screen, within } from "@testing-library/react";
import { Header } from "@/components/layout/Header";
import { currentState, navItems } from "@/lib/nav";

let pathname = "/";
vi.mock("next/navigation", () => ({ usePathname: () => pathname }));

function navs() {
  return screen.getAllByRole("navigation", { name: "Main", hidden: true });
}

const item = (label: string) => navItems.find((navItem) => navItem.label === label)!;

describe("nav items", () => {
  it("all scroll to sections of the Home page", () => {
    expect(navItems.map((navItem) => navItem.href)).toEqual(["/", "/#about", "/#work", "/#off-the-clock"]);
  });
});

describe("currentState", () => {
  it("on Home, marks the section in view as the current location", () => {
    expect(currentState("/", item("Work"), "work")).toBe("location");
    expect(currentState("/", item("About"), "work")).toBeUndefined();
  });

  it("marks nothing on any other page, such as the 404 page", () => {
    expect(currentState("/nope", item("Home"), null)).toBeUndefined();
  });
});

describe("Header", () => {
  it("on Home, marks the section in view", () => {
    pathname = "/";
    render(<Header />);
    const [desktop] = navs();
    expect(within(desktop).getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "location");
    expect(within(desktop).getByRole("link", { name: "Work" })).not.toHaveAttribute("aria-current");
  });
});

describe("MobileMenu", () => {
  function openMenu() {
    pathname = "/";
    render(<Header />);
    const button = screen.getByRole("button", { name: "Menu", hidden: true });
    expect(button).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    return button;
  }

  it("closes after a link is chosen", () => {
    const button = openMenu();
    const mobileNav = document.getElementById("mobile-menu")!;
    expect(mobileNav).not.toHaveAttribute("hidden");
    fireEvent.click(within(mobileNav).getByRole("link", { name: "About", hidden: true }));
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(mobileNav).toHaveAttribute("hidden");
  });

  it("closes on Escape and returns focus to the button", () => {
    const button = openMenu();
    fireEvent.keyDown(document.getElementById("mobile-menu")!, { key: "Escape" });
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveFocus();
  });
});
