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

test('setup page has title sync', async ({ page }) => {
  await page.goto('http://localhost:8081/setup');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/AREA/);
});

test('tests services discord', async ({ page }) => {
  await page.goto('http://localhost:8081/services');
  await page.locator('label').filter({ hasText: 'postMessage' }).click();
  await page.getByText('Post a message to Discord').click();
  await page.locator('ion-card').filter({ hasText: 'DiscordpostMessagepostMeetingpostListpostMessagepostMessagePost a message to Dis' }).getByRole('button', { name: 'Activate' }).click();
  await page.locator('#ion-sel-2-lbl').click();
});

  test('tests services teams', async ({ page }) => {
  await page.goto('http://localhost:8081/services');
  await page.locator('label').filter({ hasText: 'postMeeting' }).click();
  await page.getByText('Post a meeting to Teams').click();
  await page.locator('ion-card').filter({ hasText: 'TeamScriptpostMessagepostMeetingpostIssuepostMeetingpostMeetingPost a meeting to' }).getByRole('button', { name: 'Activate' }).click();
  await page.locator('#ion-sel-3-lbl').click();
});

  test('tests services github', async ({ page }) => {
  await page.goto('http://localhost:8081/services');
  await page.locator('label').filter({ hasText: 'createIssue' }).click();
  await page.getByText('Create a new issue').click();
  await page.locator('#ion-sel-4-lbl').click();
});

  test('tests services weather', async ({ page }) => {
  await page.goto('http://localhost:8081/services');
  await page.locator('label').filter({ hasText: 'fillCurrentWeather' }).click();
  await page.getByText('Fill current weather').click();
  await page.locator('#ion-sel-5-lbl').click();
});

  test('tests services calendar', async ({ page }) => {
  await page.goto('http://localhost:8081/services');
  await page.locator('label').filter({ hasText: 'postCalendarEvent' }).click();
  await page.getByText('Post an event to google calendar').click();
  await page.locator('#ion-sel-6-lbl').click();
});

  test('tests services htb', async ({ page }) => {
  await page.goto('http://localhost:8081/services');
  await page.locator('label').filter({ hasText: 'getOSProgress' }).click();
  await page.getByText('Get my progress.').click();
  await page.locator('ion-card').filter({ hasText: 'HackTheBoxgetProfilegetOSProgressgetOSProgressgetOSProgressGet my progress.Activ' }).getByRole('button', { name: 'Activate' }).click();
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
