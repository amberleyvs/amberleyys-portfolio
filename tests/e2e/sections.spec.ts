import { expect, test } from "@playwright/test";

test("a project card opens in a popup and closes again", async ({ page }) => {
  await page.goto("/");
  const work = page.locator("#work");
  const open = work.getByRole("button", { name: "MySawit" });
  const dialog = page.getByRole("dialog", { name: "MySawit" });

  await work.getByRole("listitem").filter({ has: page.getByRole("button", { name: "MySawit" }) }).click();
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText(/microservices architecture/)).toBeVisible();
  await expect(dialog.getByText("Role", { exact: true })).toBeVisible();
  await expect(page).toHaveURL(/\/$/);

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(open).toBeFocused();

  await open.click();
  await dialog.getByRole("button", { name: "Close MySawit" }).click();
  await expect(dialog).toBeHidden();
});

test("clicking outside the popup closes it", async ({ page }) => {
  await page.goto("/");
  await page.locator("#work").getByRole("button", { name: "Movezz" }).click();
  const dialog = page.getByRole("dialog", { name: "Movezz" });
  await expect(dialog).toBeVisible();
  await page.mouse.click(5, 5);
  await expect(dialog).toBeHidden();
});

test("with three projects, there is nothing more to show", async ({ page }) => {
  await page.goto("/");
  const work = page.locator("#projects");
  await expect(work.getByRole("button", { name: /^(MySawit|Movezz|Ride-Hailing Platform)$/ })).toHaveCount(3);
  await expect(work.getByRole("button", { name: /See more/ })).toHaveCount(0);
});

test("Experience shows 3 roles, and See more reveals the rest in place", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("section", { has: page.locator("#experience-heading") });
  const visibleTitles = section.getByRole("heading", { level: 3 }).filter({ visible: true });
  await expect(visibleTitles).toHaveCount(3);

  await section.getByRole("button", { name: /See more/ }).click();
  await expect(visibleTitles).toHaveCount(7);
  await expect(page.locator("[data-first-extra]")).toBeFocused();

  await section.getByRole("button", { name: "See less" }).click();
  await expect(visibleTitles).toHaveCount(3);
});

test("Home is the only page", async ({ page }) => {
  for (const path of ["/about", "/off-the-clock", "/behind", "/contact", "/experience", "/work", "/work/mysawit"]) {
    expect((await page.goto(path))?.status(), path).toBe(404);
  }
});
