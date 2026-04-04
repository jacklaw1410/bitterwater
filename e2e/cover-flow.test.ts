import { expect, test } from '@playwright/test';
import { waitForAnimationEnd } from './utils';

const VIEWPORTS = {
  desktop: { width: 1280, height: 720 },
  tablet: { width: 640, height: 480 },
  mobile: { width: 375, height: 667 },
} as const;

test.describe('Cover Flow page', () => {
  for (const [name, size] of Object.entries(VIEWPORTS)) {
    test(`${name} viewport`, async ({ page }) => {
      await page.setViewportSize(size);
      await page.goto('gallery/cover-flow');

      await page.evaluate(() => document.fonts.ready);

      await expect(page).toHaveTitle('Bitter Water - Cover Flow');

      const heading = page.getByRole('heading', { name: 'Cover Flow' });
      await expect(heading).toBeVisible();

      const carousel = page.getByRole('list', { name: 'Cover flow of images' });
      await waitForAnimationEnd(carousel);
      await expect(carousel).toBeVisible();

      const snapshotName = `cover-flow-${name}-initial.png`;
      await expect(page).toHaveScreenshot(snapshotName, {
        animations: 'allow',
      });

      await carousel.hover();
      await page.mouse.wheel(500, 0);

      await expect(page).toHaveScreenshot(`cover-flow-${name}-scrolled.png`, {
        animations: 'allow',
      });
    });
  }
});
