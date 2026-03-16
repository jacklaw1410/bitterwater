import { expect, test } from '@playwright/test';

test('Cover Flow page', async ({ page }) => {
  await page.goto('gallery/cover-flow');

  await expect(page).toHaveTitle('Bitter Water - Cover Flow');

  const heading = page.getByRole('heading', { name: 'Cover Flow' });
  await expect(heading).toBeVisible();

  await expect(page).toHaveScreenshot('cover-flow-initial.png', {
    animations: 'allow',
  });

  const carousel = page.getByRole('region', { name: 'Cover flow of images' });
  await carousel.hover();
  await page.mouse.wheel(500, 0);

  await page.waitForTimeout(500);
  await expect(page).toHaveScreenshot('cover-flow-scrolled.png', {
    animations: 'allow',
  });
});
