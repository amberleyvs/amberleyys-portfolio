import { expect, test } from "@playwright/test";

test.describe("with motion on", () => {
  test.use({ contextOptions: { reducedMotion: "no-preference" } });
  test.skip(({ isMobile }) => isMobile, "desktop only");

  test("sections fade in once they scroll into view", async ({ page }) => {
    await page.goto("/");
    const offTheClock = page.locator(".reveal").filter({ has: page.getByRole("heading", { name: "Off the clock" }) });
    await expect(offTheClock).not.toHaveAttribute("data-revealed");
    await expect(offTheClock).toHaveCSS("opacity", "0");

    await offTheClock.scrollIntoViewIfNeeded();
    await expect(offTheClock).toHaveAttribute("data-revealed", "");
    await expect(offTheClock).toHaveCSS("opacity", "1");
  });

  test("jumping to a section from the nav fades it in", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Work" }).click();
    const header = page.locator(".reveal").filter({ has: page.getByRole("heading", { name: "Experience", level: 2 }) });
    await expect(header).toHaveAttribute("data-revealed", "");
    await expect(header).toHaveCSS("opacity", "1");
  });

  test("the train rolls in when it scrolls into view", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 500 });
    await page.goto("/");
    const arriving = page.locator('svg[role="group"] [class*="arrive"]');
    await expect(arriving.first()).toHaveCSS("animation-play-state", "paused");

    await page.locator('svg[role="group"]').scrollIntoViewIfNeeded();
    await expect(arriving.first()).toHaveCSS("animation-play-state", "running");
    await expect(arriving).toHaveCount(0, { timeout: 5000 });
  });
});

test.describe("with reduced motion", () => {
  test.skip(({ isMobile }) => isMobile, "desktop only");

  test("nothing is hidden or animated", async ({ page }) => {
    await page.goto("/");
    const offTheClock = page.locator(".reveal").filter({ has: page.getByRole("heading", { name: "Off the clock" }) });
    await expect(offTheClock).toHaveCSS("opacity", "1");
    await expect(page.locator('svg[role="group"] [class*="arrive"]').first()).toHaveCSS("animation-name", "none");
  });
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false, contextOptions: { reducedMotion: "no-preference" } });
  test.skip(({ isMobile }) => isMobile, "desktop only");

  test("every experience entry shows, with no See more button", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("section", { has: page.locator("#experience-heading") });
    await expect(section.getByRole("heading", { level: 3 }).filter({ visible: true })).toHaveCount(7);
    await expect(section.getByRole("button", { name: /See more/ })).toBeHidden();
  });

  test("every section is visible", async ({ page }) => {
    await page.goto("/");
    const offTheClock = page.locator(".reveal").filter({ has: page.getByRole("heading", { name: "Off the clock" }) });
    await offTheClock.scrollIntoViewIfNeeded();
    await expect(offTheClock).toHaveCSS("opacity", "1");
  });
});
