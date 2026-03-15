import { expect, test } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test('Gallery home page', async ({ page }) => {
  await page.goto('gallery');

  await expect(page).toHaveTitle('Bitter Water - Gallery');

  await expect(page.getByRole('heading', { name: 'Gallery' })).toBeVisible();

  const galleryPath = path.resolve(process.cwd(), 'src/routes/gallery');
  const featureCount = fs
    .readdirSync(galleryPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory()).length;

  const featureCards = page.getByLabel(/^View .* demo$/);
  await expect(featureCards).toHaveCount(featureCount);
  for (const card of await featureCards.all()) {
    await expect(card).toBeVisible();
  }

  await expect(page).toHaveScreenshot('gallery-page.png', { fullPage: true });
});
