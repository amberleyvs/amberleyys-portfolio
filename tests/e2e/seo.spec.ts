import { expect, test } from "@playwright/test";
import site from "../../content/site.json" with { type: "json" };

test.skip(({ isMobile }) => isMobile, "desktop only");

test("Home has title, description, canonical and preview tags", async ({ page }) => {
  const title = `${site.name}, developer`;
  await page.goto("/");
  await expect(page).toHaveTitle(title);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.{40,}/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /^https?:\/\/[^/]+\/?$/);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", title);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /\/og\.png$/);
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute("href", "/favicon-32.png");
});

test("the 404 page asks search engines not to index it", async ({ page }) => {
  await page.goto("/not-a-real-page");
  await expect(page.locator('meta[name="robots"]')).toHaveCount(1);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});

test("preview images and icons are PNG files", async ({ request }) => {
  for (const path of ["/og.png", "/favicon-32.png", "/apple-touch-icon.png"]) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    expect(response.headers()["content-type"], path).toBe("image/png");
  }
});

test("sitemap lists the Home page only", async ({ request }) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap.match(/<loc>/g)).toHaveLength(1);
});

test("robots.txt allows everything and points to the sitemap", async ({ request }) => {
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Allow: /");
  expect(robots).toMatch(/Sitemap: .*\/sitemap\.xml/);
});
