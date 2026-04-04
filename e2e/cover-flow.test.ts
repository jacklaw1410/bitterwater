import { expect, test } from '@playwright/test';
import { waitForAnimationEnd } from './utils';

test('Cover Flow page', async ({ page }) => {
  await page.goto('gallery/cover-flow');

  await page.evaluate(() => document.fonts.ready);

  await expect(page).toHaveTitle('Bitter Water - Cover Flow');

  const heading = page.getByRole('heading', { name: 'Cover Flow' });
  await expect(heading).toBeVisible();

  const carousel = page.getByRole('list', { name: 'Cover flow of images' });
  await waitForAnimationEnd(carousel);
  await expect(carousel).toBeVisible();

  await expect(page).toHaveScreenshot('cover-flow-initial.png', {
    animations: 'allow',
  });

  await carousel.hover();
  await page.mouse.wheel(500, 0);

  await expect(page).toHaveScreenshot('cover-flow-scrolled.png', {
    animations: 'allow',
  });
});
