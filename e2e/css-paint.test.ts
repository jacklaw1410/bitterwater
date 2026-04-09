import { expect, test } from '@playwright/test';

test('CSS Paint page', async ({ page }) => {
  await page.goto('gallery/css-paint');

  await page.evaluate(() => document.fonts.ready);

  await expect(page).toHaveTitle('Bitter Water - CSS Paint');
  await expect(page.getByRole('heading', { name: 'CSS Paint API' })).toBeVisible();

  await expect(page.getByRole('region', { name: 'Checkerboard' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Punch hole' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Circle' })).toBeVisible();

  await expect(page).toHaveScreenshot('css-paint-page.png', {
    animations: 'disabled',
    fullPage: true,
  });
});
