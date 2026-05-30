import { test, expect } from '@playwright/test';

test('sort products by price low to high', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: /login/i }).click();

  await expect(page).toHaveURL(/inventory.html/);
  
  // Click on the sort dropdown
  await page.locator('.product_sort_container').selectOption('lohi');

  // Get all product prices
  const priceElements = page.locator('.inventory_item_price');
  const prices = await priceElements.allTextContents();

  // Extract numeric values from price strings (e.g., "$49.99" -> 49.99)
  const priceValues = prices.map(price => 
    parseFloat(price.replace('$', '').trim())
  );

  // Assert first item price is the lowest
  const firstPrice = priceValues[0];
  const isLowest = priceValues.every(price => firstPrice <= price);
  expect(isLowest).toBe(true);
});
