import { test, expect } from "@playwright/test";

const pages = [
  { path: "/", title: "Riveo Health" },
  { path: "/platform", title: "Riveo Health" },
  { path: "/platform/patient-interaction", title: "Riveo Health" },
  { path: "/platform/revenue-intelligence", title: "Riveo Health" },
  { path: "/platform/ai-engine", title: "Riveo Health" },
  { path: "/platform/analytics", title: "Riveo Health" },
  { path: "/platform/integrations", title: "Riveo Health" },
  { path: "/solutions", title: "Riveo Health" },
  { path: "/solutions/hospitals", title: "Riveo Health" },
  { path: "/solutions/practices", title: "Riveo Health" },
  { path: "/solutions/rcm", title: "Riveo Health" },
  { path: "/solutions/billing", title: "Riveo Health" },
  { path: "/about", title: "Riveo Health" },
  { path: "/careers", title: "Riveo Health" },
  { path: "/why-riveo", title: "Riveo Health" },
  { path: "/partners", title: "Riveo Health" },
  { path: "/contact", title: "Riveo Health" },
  { path: "/newsroom", title: "Riveo Health" },
  { path: "/demo", title: "Riveo Health" },
  { path: "/support", title: "Riveo Health" },
  { path: "/security", title: "Riveo Health" },
  { path: "/login", title: "Riveo Health" },
  { path: "/blog", title: "Riveo Health" },
  { path: "/privacy", title: "Riveo Health" },
  { path: "/terms", title: "Riveo Health" },
  { path: "/hipaa", title: "Riveo Health" },
];

for (const page of pages) {
  test(`${page.path} loads successfully`, async ({ page: p }) => {
    const response = await p.goto(page.path, { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBeLessThan(400);
    await expect(p).toHaveTitle(new RegExp(page.title));
  });
}

test("homepage has hero section", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator("h1")).toContainText("Revenue");
});

test("homepage navigation works", async ({ page }) => {
  await page.goto("/");
  const demoLink = page.locator('a[href="/demo"]').first();
  await expect(demoLink).toBeVisible();
});

test("demo page has form", async ({ page }) => {
  await page.goto("/demo");
  await expect(page.getByRole("button", { name: "Request My Demo" })).toBeVisible();
  await expect(page.locator('input[type="email"]').first()).toBeVisible();
});

test("blog page loads posts", async ({ page }) => {
  await page.goto("/blog");
  const articles = page.locator("article, [class*='rounded-2xl']").first();
  await expect(articles).toBeVisible();
});

test("404 page works", async ({ page }) => {
  const response = await page.goto("/nonexistent-page");
  expect(response?.status()).toBe(404);
});
