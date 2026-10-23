import { expect, test } from "@playwright/test";

test.describe("photo placement", () => {
  test("desktop shows the photo in the hero only", async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop only");
    await page.goto("/");
    await expect(page.getByLabel("Introduction").locator("figure")).toBeVisible();
    await expect(page.locator("section[aria-labelledby='about-heading'] figure")).toBeHidden();
  });

  test("mobile shows the photo in About only", async ({ page, isMobile }) => {
    test.skip(!isMobile, "mobile only");
    await page.goto("/");
    await expect(page.getByLabel("Introduction").locator("figure")).toBeHidden();
    await expect(page.locator("section[aria-labelledby='about-heading'] figure")).toBeVisible();
  });
});

test("See my work scrolls to Experience, clear of the sticky nav", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "See my work" }).click();
  await expect(page).toHaveURL(/#work$/);
  const heading = page.getByRole("heading", { level: 2, name: "Experience" });
  await expect(heading).toBeInViewport();
  const headerBox = await page.getByRole("banner").boundingBox();
  const headingBox = await heading.boundingBox();
  expect(headingBox!.y).toBeGreaterThanOrEqual(headerBox!.y + headerBox!.height);
});

test("the hero has LinkedIn, email and GitHub icon links", async ({ page }) => {
  await page.goto("/");
  const contact = page.getByLabel("Introduction").getByRole("list", { name: "Contact" });
  await expect(contact.getByRole("link", { name: /^Email/ })).toHaveAttribute("href", /^mailto:/);
  for (const name of [/LinkedIn/, /GitHub/]) {
    const link = contact.getByRole("link", { name });
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
  }
  for (const link of await contact.getByRole("link").all()) {
    const box = await link.boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(44);
    expect(box!.width).toBeGreaterThanOrEqual(44);
  }
});
