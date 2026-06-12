import { test, expect } from '@playwright/test';

// Helper: login and land on inventory page
async function loginAsStandardUser(page: import('@playwright/test').Page) {
  await page.goto('https://www.saucedemo.com/');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: /login/i }).click();
  await expect(page).toHaveURL(/inventory\.html/);
}

// ── Challenge 2 — Sort products Price: Low → High ─────────────────────────────
test('sort by price low to high — first item has lowest price', async ({ page }) => {
  await loginAsStandardUser(page);

  // Select "Price (low to high)" from the sort dropdown
  await page.locator('[data-test="product-sort-container"]').selectOption('lohi');

  // Collect all price elements
  const priceLocators = page.locator('.inventory_item_price');
  const count = await priceLocators.count();

  // Parse every price into a float
  const prices: number[] = [];
  for (let i = 0; i < count; i++) {
    const text = await priceLocators.nth(i).textContent();
    prices.push(parseFloat(text!.replace('$', '')));
  }

  // The first price should be the minimum of all prices
  const minPrice = Math.min(...prices);
  expect(prices[0]).toBe(minPrice);
});

// ── Challenge 3 — Logout ──────────────────────────────────────────────────────
test('user can logout via the burger menu', async ({ page }) => {
  await loginAsStandardUser(page);

  // Open the side navigation menu
  await page.getByRole('button', { name: 'Open Menu' }).click();

  // Click the logout link
  await page.getByRole('link', { name: /logout/i }).click();

  // Should be back on the login page
  await expect(page).toHaveURL('https://www.saucedemo.com/');
  await expect(page.getByPlaceholder('Username')).toBeVisible();
});
