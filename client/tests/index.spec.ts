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

test('test services creation', async ({ page }) => {
  await page.goto('http://localhost:8081/services');

  await page.getByRole('button', { name: 'Link Reactions' }).click();
  await page.getByText('Choose service, Choose first service :').click();
  await page.locator('label').filter({ hasText: 'Discord' }).click();
  await page.getByText('Choose reaction, Choose first service\'s reaction :').click();
  await page.locator('label').filter({ hasText: 'postMessage' }).click();
  await page.getByRole('textbox', { name: 'Input first reaction\'s webhook :' }).fill('hey there');
  await page.getByText('Choose service, Choose second service :').click();
  await page.locator('label').filter({ hasText: 'OpenWeatherMap' }).click();
  await page.getByText('Choose reaction, Choose second service\'s reaction :').click();
  await page.locator('label').filter({ hasText: 'fillCurrentWeather' }).click();
  await page.getByRole('textbox', { name: 'Input second reaction\'s webhook :' }).click();
  await page.getByRole('textbox', { name: 'Input second reaction\'s webhook :' }).click();
  await page.getByRole('textbox', { name: 'Input second reaction\'s webhook :' }).fill('cold outside');
  await page.getByRole('textbox', { name: 'Input second reaction\'s webhook :' }).press('Enter');
  await page.getByRole('button', { name: 'Create', exact: true }).click();
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
