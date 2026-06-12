import { test, expect } from '@playwright/test';

// Helper: login and land on inventory page
async function loginAsStandardUser(page: import('@playwright/test').Page) {
  await page.goto('https://www.saucedemo.com/');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: /login/i }).click();
  await expect(page).toHaveURL(/inventory\.html/);
}

// Helper: add first item to cart then go to cart
async function addToCartAndOpen(page: import('@playwright/test').Page) {
  await page.getByRole('button', { name: /add to cart/i }).first().click();
  await page.locator('.shopping_cart_link').click();
  await expect(page).toHaveURL(/cart\.html/);
}

// ── Step 4.1 — Complete checkout (happy path) ─────────────────────────────────
test('complete checkout successfully', async ({ page }) => {
  await loginAsStandardUser(page);
  await addToCartAndOpen(page);

  await page.getByRole('button', { name: /checkout/i }).click();

  await page.getByPlaceholder('First Name').fill('John');
  await page.getByPlaceholder('Last Name').fill('Doe');
  await page.getByPlaceholder('Zip/Postal Code').fill('12345');
  await page.getByRole('button', { name: /continue/i }).click();

  await page.getByRole('button', { name: /finish/i }).click();

  await expect(page.getByText('Thank you for your order!')).toBeVisible();
});

// ── Step 4.2 — Checkout validation: missing info ──────────────────────────────
test('checkout fails if info missing', async ({ page }) => {
  await loginAsStandardUser(page);
  await addToCartAndOpen(page);

  await page.getByRole('button', { name: /checkout/i }).click();

  // Submit without filling any fields
  await page.getByRole('button', { name: /continue/i }).click();

  await expect(page.locator('[data-test="error"]')).toBeVisible();
});
