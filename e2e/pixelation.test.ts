import path from 'path';

import { expect, test } from '@playwright/test';

const TIMEOUT = 10_000;

test('Pixelation page', async ({ page }) => {
  await page.goto('gallery/pixelation');

  await page.evaluate(() => document.fonts.ready);

  await expect(page).toHaveTitle('Bitter Water - Pixelation');
  await expect(page.getByRole('heading', { name: 'Pixelation' })).toBeVisible();

  await expect(
    page.getByText('Transform any image into pixel art, no matter the resolution.'),
  ).toBeVisible();

  await page.getByText('Processing image...').waitFor({ state: 'hidden', timeout: TIMEOUT });

  await expect(page.getByText('Sample image - try uploading')).toBeVisible();

  const uploadButton = page.getByRole('button', { name: 'Upload' });
  const resetButton = page.getByRole('button', { name: 'Reset' });
  await expect(uploadButton).toBeVisible();
  await expect(uploadButton).toBeEnabled();
  await expect(resetButton).toBeVisible();
  await expect(resetButton).toBeDisabled();

  await expect(page.getByRole('region', { name: 'Input Stage' })).toBeVisible();
  await expect(page.getByRole('img', { name: 'Original input' })).toBeVisible();

  await expect(page.getByRole('region', { name: 'Edge Detection Stage' })).toBeVisible();
  await expect(page.getByLabel('Preprocessed Phase')).toBeVisible();
  await expect(page.getByLabel('Edges Phase')).toBeVisible();
  await expect(page.getByLabel('Closed Phase')).toBeVisible();

  await expect(page.getByRole('region', { name: 'Mesh Analysis Stage' })).toBeVisible();
  await expect(page.getByLabel('Mesh Applied Phase')).toBeVisible();
  await expect(page.getByLabel('Homogeneous Mesh Phase')).toBeVisible();

  await expect(page.getByRole('region', { name: 'Result Stage' })).toBeVisible();
  await expect(page.getByLabel('Downsampled Phase')).toBeVisible();
  await expect(page.getByLabel('Upscaled Phase')).toBeVisible();

  await expect(page).toHaveScreenshot('pixelation-page-processed.png', {
    fullPage: true,
    maxDiffPixelRatio: 0.01,
    timeout: 30_000,
  });

  const fileChooserPromise = page.waitForEvent('filechooser');
  await uploadButton.click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(path.join(process.cwd(), 'static/pixelation/slime.png'));

  await page.getByText('Processing image...').waitFor({ state: 'hidden', timeout: TIMEOUT });

  await expect(page.getByText('Uploaded: slime.png')).toBeVisible();

  await expect(page).toHaveScreenshot('pixelation-page-uploaded.png', {
    fullPage: true,
    maxDiffPixelRatio: 0.01,
    timeout: 30_000,
  });

  await expect(resetButton).toBeEnabled();
  await resetButton.click();

  await page.getByText('Processing image...').waitFor({ state: 'hidden', timeout: TIMEOUT });

  await expect(page.getByText('Sample image - try uploading')).toBeVisible();

  await expect(page).toHaveScreenshot('pixelation-page-reset.png', {
    fullPage: true,
    maxDiffPixelRatio: 0.01,
    timeout: 30_000,
  });
});
