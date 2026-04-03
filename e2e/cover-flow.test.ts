import { expect, test } from '@playwright/test';
import { waitForAnimationEnd } from './utils';

test('Cover Flow page', async ({ page }) => {
  await page.goto('gallery/cover-flow');

  await expect(page).toHaveTitle('Bitter Water - Cover Flow');

  const heading = page.getByRole('heading', { name: 'Cover Flow' });
  await expect(heading).toBeVisible();

  const carousel = page.getByRole('region', { name: 'Cover flow of images' });
  await expect(carousel).toBeVisible();

  await waitForAnimationEnd(carousel);

  await expect(page).toHaveScreenshot('cover-flow-initial.png', {
    animations: 'allow',
  });

  await carousel.hover();
  await page.mouse.wheel(500, 0);

  await waitForAnimationEnd(carousel);

  await expect(page).toHaveScreenshot('cover-flow-scrolled.png', {
    animations: 'allow',
  });
});
