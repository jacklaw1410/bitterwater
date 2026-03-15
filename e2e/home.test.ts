import { expect, test } from '@playwright/test';

test('Home page', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle('Bitter Water - Home');

  await expect(page.getByRole('heading', { name: 'Welcome to my digital garden' })).toBeVisible();

  await expect(page).toHaveScreenshot('home-page.png', { fullPage: true });
});
