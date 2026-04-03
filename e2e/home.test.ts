import { expect, test } from '@playwright/test';

test('Home page', async ({ page }) => {
  await page.goto('/');

  await page.evaluate(() => document.fonts.ready);

  await expect(page).toHaveTitle('Bitter Water - Home');

  await expect(page.getByRole('heading', { name: 'Welcome to my digital garden' })).toBeVisible();

  const exploreGalleryButton = page.getByRole('link', {
    name: 'Explore the Gallery',
  });
  await expect(exploreGalleryButton).toBeVisible();
  await expect(exploreGalleryButton).toHaveAttribute('href', /(|\/bitterwater)\/gallery$/);

  await expect(page).toHaveScreenshot('home-page.png', { fullPage: true });
});
