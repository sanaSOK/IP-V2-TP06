import { test, expect } from '@playwright/test';

// Helper: log in before each test
async function login(page: any) {
  await page.goto('https://www.saucedemo.com/');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: /login/i }).click();
  await expect(page).toHaveURL(/inventory\.html/);
}

// ── Logout — Successful logout ─────────────────────────────────────────────────
test('user can logout and is redirected to login page', async ({ page }) => {
  await login(page);

  // Open the burger menu
  await page.getByRole('button', { name: /open menu/i }).click();

  // Click the logout link
  await page.getByRole('link', { name: /logout/i }).click();

  // Should be back on the login page
  await expect(page).toHaveURL('https://www.saucedemo.com/');
  await expect(page.getByPlaceholder('Username')).toBeVisible();
});

// ── Logout — Cannot access inventory after logout ──────────────────────────────
test('user cannot access inventory after logout', async ({ page }) => {
  await login(page);

  // Logout
  await page.getByRole('button', { name: /open menu/i }).click();
  await page.getByRole('link', { name: /logout/i }).click();

  // Try to navigate directly to inventory
  await page.goto('https://www.saucedemo.com/inventory.html');

  // Should be redirected back to login page
  await expect(page).toHaveURL('https://www.saucedemo.com/');
  await expect(page.getByPlaceholder('Username')).toBeVisible();
});
