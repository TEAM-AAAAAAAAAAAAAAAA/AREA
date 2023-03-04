import { test, expect } from '@playwright/test';

test('login page has title', async ({ page }) => {
  await page.goto('http://localhost:8081/login');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/AREA/);
});

test('service page has title', async ({ page }) => {
  await page.goto('http://localhost:8081/services');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/AREA/);
});

test('setup page has title', async ({ page }) => {
  await page.goto('http://localhost:8081/setup');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/AREA/);
});

//test('get started link', async ({ page }) => {
//  await page.goto('http://localhost:8081/login');
//
//  // Click the get started link.
//  await page.getByRole('link', { name: 'Get started' }).click();
//
//  // Expects the URL to contain intro.
//  await expect(page).toHaveURL(/.*intro/);
//});
