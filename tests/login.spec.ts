import { test, expect } from '@playwright/test';

// ── Step 2.2 — Successful login ───────────────────────────────────────────────
test('login with valid credentials', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: /login/i }).click();

  await expect(page).toHaveURL(/inventory\.html/);
  await expect(page.getByText('Products')).toBeVisible();
});

// ── Step 2.3 — Invalid login ──────────────────────────────────────────────────
test('login fails with wrong password', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('wrong_password');
  await page.getByRole('button', { name: /login/i }).click();

  await expect(page.locator('[data-test="error"]'))
    .toContainText('Username and password do not match');
});

// ── Challenge 1 — Locked out user ────────────────────────────────────────────
test('locked_out_user sees error message', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  await page.getByPlaceholder('Username').fill('locked_out_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: /login/i }).click();

  await expect(page.locator('[data-test="error"]'))
    .toContainText('Sorry, this user has been locked out');
});
