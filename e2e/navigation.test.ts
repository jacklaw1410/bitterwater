import { test, expect } from '@playwright/test';

test('navigation header', async ({ page }) => {
  // Check the home page
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Svelte 101' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Brownian Motion' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'π Estimation' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Cover Flow' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Blob Morphing' })).toBeVisible();

  // Visual regression test for the header
  const header = page.locator('header');
  await expect(header).toHaveScreenshot('navigation-header-initial.png');

  // Check the Brownian motion page
  await page.goto('/brownian-motion');
  await expect(page.getByRole('link', { name: 'Svelte 101' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Brownian Motion' })).toBeVisible();
  await expect(page.getByRole('link', { name: '\u03C0 Estimation' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Cover Flow' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Blob Morphing' })).toBeVisible();
  await expect(header).toHaveScreenshot('navigation-header-brownian-motion.png');

  // Test navigate back to home page
  await page.getByRole('link', { name: 'Home' }).click();
  await expect(page).toHaveURL('/');
  await expect(header).toHaveScreenshot('navigation-header-home.png');
});
