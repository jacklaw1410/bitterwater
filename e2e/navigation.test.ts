import { test, expect } from '@playwright/test';

test('navigation header', async ({ page }) => {
  // Check the home page
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Svelte 101' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Gallery' })).toBeVisible();

  // Visual regression test for the header
  const header = page.locator('header');
  await expect(header).toHaveScreenshot('navigation-header-initial.png');

  // Check the gallery page
  await page.goto('/gallery');
  await expect(page.getByRole('link', { name: 'Svelte 101' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Gallery' })).toBeVisible();
  await expect(header).toHaveScreenshot('navigation-header-gallery.png');

  // Test navigate back to home page
  await page.getByRole('link', { name: 'Home' }).click();
  await expect(page).toHaveURL('/');
  await expect(header).toHaveScreenshot('navigation-header-home.png');
});
