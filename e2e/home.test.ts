import { expect, test } from '@playwright/test';

test('Home page', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Welcome to Svelte 101!' })).toBeVisible();

  await expect(page).toHaveScreenshot('home-page.png', { fullPage: true });
});
