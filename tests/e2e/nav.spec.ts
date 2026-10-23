import { expect, test } from "@playwright/test";

test.describe("desktop nav", () => {
  test.skip(({ isMobile }) => isMobile, "desktop only");

  test("scrolls to sections of Home and fills in the one in view", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Main" });
    await expect(page.getByRole("button", { name: "Menu" })).toBeHidden();
    await expect(nav.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "location");

    await nav.getByRole("link", { name: "Off the clock" }).click();
    await expect(page).toHaveURL(/\/#off-the-clock$/);
    await expect(page.getByRole("heading", { level: 2, name: "Off the clock" })).toBeInViewport();
    await expect(nav.getByRole("link", { name: "Off the clock" })).toHaveAttribute("aria-current", "location");
    await expect(nav.getByRole("link", { name: "Home" })).not.toHaveAttribute("aria-current");

    await nav.getByRole("link", { name: "Home" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toBeInViewport();
    await expect(nav.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "location");
  });

  test("from the 404 page, goes back to the section on Home", async ({ page }) => {
    await page.goto("/nope");
    const nav = page.getByRole("navigation", { name: "Main" });
    await nav.getByRole("link", { name: "About" }).click();
    await expect(page).toHaveURL(/\/#about$/);
    await expect(page.getByRole("heading", { level: 2, name: "A little about me" })).toBeInViewport();
  });

  test("stays at the top while scrolling", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.scrollTo(0, 400));
    await expect(page.getByRole("banner")).toBeInViewport();
  });
});

test.describe("mobile menu", () => {
  test.skip(({ isMobile }) => !isMobile, "mobile only");

  test("opens, navigates and closes", async ({ page }) => {
    await page.goto("/");
    const menuButton = page.getByRole("button", { name: "Menu" });
    const nav = page.getByRole("navigation", { name: "Main" });

    await expect(nav).toBeHidden();
    await expect(page.getByRole("button", { name: "Menu", expanded: false })).toBeVisible();
    await menuButton.click();
    await expect(page.getByRole("button", { name: "Menu", expanded: true })).toBeVisible();
    await expect(nav).toBeVisible();

    await nav.getByRole("link", { name: "Work" }).click();
    await expect(page).toHaveURL(/\/#work$/);
    await expect(page.getByRole("heading", { level: 2, name: "Experience" })).toBeInViewport();
    await expect(nav).toBeHidden();
    await expect(page.getByRole("button", { name: "Menu", expanded: false })).toBeVisible();
  });

  test("menu button is a 44px tap target", async ({ page }) => {
    await page.goto("/");
    const box = await page.getByRole("button", { name: "Menu" }).boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
    expect(box?.width).toBeGreaterThanOrEqual(44);
  });
});

test("skip link moves focus to the main content", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
});
