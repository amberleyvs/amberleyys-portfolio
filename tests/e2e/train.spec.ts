import { expect, test } from "@playwright/test";

test("drag a cat from the platform into a window", async ({ page, isMobile }) => {
  test.skip(isMobile, "desktop drag; mobile is covered by the scroll test");
  await page.goto("/");
  const soot = page.getByRole("button", { name: /^Soot the cat/ });
  const firstWindow = page.locator('[data-window="0"]');
  await soot.scrollIntoViewIfNeeded();

  const from = (await soot.boundingBox())!;
  const to = (await firstWindow.boundingBox())!;
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
  await page.mouse.down();
  await page.mouse.move(to.x + to.width / 2, to.y + to.height / 2, { steps: 12 });
  await page.mouse.up();

  await expect(page.getByRole("status").filter({ hasText: "Soot" })).toHaveText("Soot is in window 1.");
  await expect(soot).toHaveAccessibleName(/in window 1/);
});

test("the train scrolls sideways on phones without widening the page", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile only");
  await page.goto("/");
  const pageWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(pageWidth).toBeLessThanOrEqual(page.viewportSize()!.width);
  const scroller = page.locator('svg[role="group"]').locator("..");
  const { client, scroll } = await scroller.evaluate((el) => ({ client: el.clientWidth, scroll: el.scrollWidth }));
  expect(scroll).toBeGreaterThan(client);
});
