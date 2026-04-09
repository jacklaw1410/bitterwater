import { expect, test } from '@playwright/test';

import { pauseSVGAnimations } from './utils';

test.describe('Blob Morphing page', () => {
  test('Animation sequences', async ({ page }) => {
    await page.goto('gallery/blob-morphing');

    await expect(page).toHaveTitle('Bitter Water - Blob Morphing');

    const blob = page.getByRole('img', { name: 'Animated blob morphing' });
    await pauseSVGAnimations(blob);
    await expect(blob).toBeVisible();

    const blobList = page.getByRole('list', { name: 'Blobs used in animation' });
    await expect(blobList).toBeVisible();
    await expect(blobList.getByRole('listitem')).toHaveCount(5);

    for (let ix = 1; ix <= 6; ix++) {
      await blob.evaluate(
        (svg, seconds) => {
          (svg as SVGSVGElement).setCurrentTime(seconds);
        },
        0.25 + (ix - 1) * 1,
      );

      const name = `blob-morphing-page-${ix}.png`;
      await expect(page).toHaveScreenshot(name, { fullPage: true, maxDiffPixelRatio: 0.01 });
    }
  });

  test('Playing and pausing animation', async ({ page }) => {
    await page.goto('gallery/blob-morphing');
    const blob = page.getByRole('img', { name: 'Animated blob morphing' });

    await expect(blob).toBeVisible();

    const playButton = page.getByRole('button', { name: 'Play' });
    const pauseButton = page.getByRole('button', { name: 'Pause' });

    await expect(playButton).not.toBeVisible();
    await expect(pauseButton).toBeEnabled();
    await expect(pauseButton).toBeVisible();

    await pauseButton.click();

    const before = await blob.screenshot({
      path: 'test-results/screenshots/blob-morphing-before.png',
    });

    await expect(playButton).toBeVisible();
    await expect(playButton).toBeEnabled();
    await expect(pauseButton).not.toBeVisible();

    await page.waitForTimeout(500);
    const afterPause = await blob.screenshot({
      path: 'test-results/screenshots/blob-morphing-after-pause.png',
      animations: 'disabled',
    });
    expect(afterPause).toEqual(before);

    await playButton.click();

    await expect(playButton).not.toBeVisible();
    await expect(pauseButton).toBeEnabled();
    await expect(pauseButton).toBeVisible();

    await page.waitForTimeout(500);
    const afterResume = await blob.screenshot({
      path: 'test-results/screenshots/blob-morphing-after-resume.png',
    });
    expect(afterResume).not.toEqual(afterPause);
  });

  test('Clicking snapshot button pauses animation and jumps to time', async ({ page }) => {
    await page.goto('gallery/blob-morphing');

    const blob = page.getByRole('img', { name: 'Animated blob morphing' });

    for (let ix = 1; ix <= 5; ix++) {
      const blobButton = page.getByRole('button', { name: `Jump to blob ${ix}` });
      await expect(blobButton).toBeVisible();
      await expect(blobButton).toBeEnabled();

      await blobButton.click();

      const currentTime = await blob.evaluate((svg) => {
        return (svg as SVGSVGElement).getCurrentTime();
      });

      expect(currentTime).toBeCloseTo(0.25 + (ix - 1) * 1, 1);
    }
  });
});
