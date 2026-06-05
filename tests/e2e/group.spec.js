const { test, expect } = require('@playwright/test');

test('basic login flow and groups visible', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // adjust selectors to match your login form if different
  await page.fill('input[name="username"]', 'testuser');
  await page.fill('input[name="password"]', 'password');
  await page.click('button[type="submit"]');

  await expect(page.locator('text=Groups')).toBeVisible();
});
