import { expect, test } from '@playwright/test';

test('navigation header', async ({ page }) => {
  // Check the home page
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await expect(page).toHaveTitle('Bitter Water - Home');
  await expect(page.getByRole('link', { name: 'Bitter Water', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Home', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Gallery', exact: true })).toBeVisible();

  // Visual regression test for the header
  const header = page.locator('header');
  await expect(header).toHaveScreenshot('navigation-header-initial.png');

  // Check the gallery page
  await page.goto('gallery');
  await page.evaluate(() => document.fonts.ready);
  await expect(page).toHaveTitle('Bitter Water - Gallery');
  await expect(page.getByRole('link', { name: 'Bitter Water', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Home', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Gallery', exact: true })).toBeVisible();
  await expect(header).toHaveScreenshot('navigation-header-gallery.png');

  // Test navigate back to home page
  await page.getByRole('link', { name: 'Home' }).click();
  await page.evaluate(() => document.fonts.ready);
  await expect(page).toHaveURL(/(\/bitterwater|)\//);
  await expect(page).toHaveTitle('Bitter Water - Home');
  await expect(header).toHaveScreenshot('navigation-header-home.png');
});
