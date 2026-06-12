import { test, expect } from '@playwright/test';

// ── Step 2.1 ─────────────────────────────────────────────────────────────────
test('Sauce Demo homepage loads', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await expect(page).toHaveTitle(/Swag Labs/);
});
