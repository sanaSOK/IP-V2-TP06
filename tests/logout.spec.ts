import { test, expect } from '@playwright/test';

test('logout from menu', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  // Login
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: /login/i }).click();

  await expect(page).toHaveURL(/inventory.html/);

  // Open menu
  await page.locator('#react-burger-menu-btn').click();

  // Wait for logout button to be visible and click it
  await page.locator('#logout_sidebar_link').click();

  // Assert we're back on login page
  await expect(page).toHaveURL('https://www.saucedemo.com/');
  await expect(page.getByPlaceholder('Username')).toBeVisible();
  await expect(page.getByPlaceholder('Password')).toBeVisible();
  await expect(page.getByRole('button', { name: /login/i })).toBeVisible();
});
