import { test, expect } from '@playwright/test';

test('Cover Flow page', async ({ page }) => {
  await page.goto('/cover-flow');

  await expect(page).toHaveTitle('Cover Flow');

  const heading = page.getByRole('heading', { name: 'Cover Flow' });
  await expect(heading).toBeVisible();

  await expect(page).toHaveScreenshot('cover-flow-initial.png');

  const carousel = page.getByRole('region', { name: 'Cover flow of images' });
  await carousel.hover();
  await page.mouse.wheel(500, 0);

  await expect(page).toHaveScreenshot('cover-flow-scrolled.png');
});
