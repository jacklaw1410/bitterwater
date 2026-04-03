import { expect, test } from '@playwright/test';

test('Blob Morphing page', async ({ page }) => {
  await page.clock.install();

  await page.goto('gallery/blob-morphing');

  await expect(page).toHaveTitle('Bitter Water - Blob Morphing');

  await expect(page.getByRole('heading', { name: 'Blob Morphing' })).toBeVisible();

  await expect(page.getByRole('img', { name: 'Animated blob morphing' })).toBeVisible();

  const blobList = page.getByRole('list', { name: 'Blobs used in animation' });
  await expect(blobList).toBeVisible();
  await expect(blobList.getByRole('listitem')).toHaveCount(5);

  const pauseButton = page.getByRole('button', { name: 'Pause' });
  await expect(pauseButton).toBeEnabled();
  await expect(pauseButton).toBeVisible();

  await pauseButton.click();

  await expect(page).toHaveScreenshot('blob-morphing-page-1.png', {
    fullPage: true,
    maxDiffPixelRatio: 0.03,
  });

  const before = await page.screenshot({
    path: 'test-results/screenshots/blob-morphing-before.png',
  });

  const playButton = page.getByRole('button', { name: 'Play' });
  await expect(playButton).toBeVisible();
  await expect(playButton).toBeEnabled();

  await page.clock.fastForward(1000);
  expect(
    await page.screenshot({
      path: 'test-results/screenshots/blob-morphing-after.png',
    }),
  ).toEqual(before);

  for (let ix = 2; ix <= 6; ix++) {
    await playButton.click();

    await expect(playButton).not.toBeVisible();
    await expect(pauseButton).toBeVisible();

    await page.clock.fastForward(1000);

    await pauseButton.click();

    await expect(page).toHaveScreenshot(`blob-morphing-page-${ix}.png`, {
      fullPage: true,
      maxDiffPixelRatio: 0.018,
    });

    await expect(playButton).toBeVisible();
    await expect(pauseButton).not.toBeVisible();
  }
});
