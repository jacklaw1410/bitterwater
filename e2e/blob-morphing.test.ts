import { expect, test } from '@playwright/test';

test('Blob Morphing page', async ({ page, browserName }) => {
  // Speed up test by tuning playback rate, which is controllable in Chromium only
  const playbackRate = browserName === 'chromium' ? 5 : 1;
  const client = await page.context().newCDPSession(page);
  await client.send('Animation.setPlaybackRate', { playbackRate });

  await page.goto('gallery/blob-morphing');

  await expect(page).toHaveTitle('Bitter Water - Blob Morphing');

  await expect(page.getByRole('heading', { name: 'Blob Morphing' })).toBeVisible();

  await expect(page.getByRole('img', { name: 'Animated blob morphing' })).toBeVisible();

  const blobList = page.getByRole('list', { name: 'Blobs used in animation' });
  await expect(blobList).toBeVisible();
  await expect(blobList.getByRole('listitem')).toHaveCount(5);

  const startButton = page.getByRole('button', { name: 'Start' });
  const pauseButton = page.getByRole('button', { name: 'Pause' });
  await expect(startButton).toBeVisible();
  await expect(pauseButton).toBeVisible();

  await expect(startButton).toBeDisabled();
  await expect(pauseButton).toBeEnabled();

  await pauseButton.click();

  await expect(page).toHaveScreenshot('blob-morphing-page-1.png', {
    fullPage: true,
    maxDiffPixelRatio: 0.03,
  });

  const before = await page.screenshot({
    path: 'test-results/screenshots/blob-morphing-before.png',
  });

  await expect(startButton).toBeEnabled();
  await expect(pauseButton).toBeDisabled();

  await page.waitForTimeout(1000 / playbackRate);
  expect(
    await page.screenshot({ path: 'test-results/screenshots/blob-morphing-after.png' }),
  ).toEqual(before);

  for (let ix = 2; ix <= 6; ix++) {
    await startButton.click();

    await expect(startButton).toBeDisabled();
    await expect(pauseButton).toBeEnabled();

    await page.waitForTimeout(1000 / playbackRate);

    await pauseButton.click();

    await expect(page).toHaveScreenshot(`blob-morphing-page-${ix}.png`, {
      fullPage: true,
      maxDiffPixelRatio: 0.018,
    });

    await expect(startButton).toBeEnabled();
    await expect(pauseButton).toBeDisabled();
  }
});
