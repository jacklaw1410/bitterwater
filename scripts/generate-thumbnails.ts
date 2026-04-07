import { mkdir, readdir } from 'fs/promises';
import { join } from 'path';

import { chromium } from '@playwright/test';

const THUMBNAIL_DIR = './static/thumbnails';
const BASE_URL = 'http://localhost:5173';

const generateThumbnails = async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await mkdir(THUMBNAIL_DIR, { recursive: true });

  const dirents = await readdir('./src/routes/gallery', { withFileTypes: true });

  for (const dirent of dirents) {
    if (dirent.isDirectory()) {
      const name = dirent.name;
      const url = `${BASE_URL}/gallery/${name}`;
      const outputPath = join(THUMBNAIL_DIR, `${name}.jpeg`);

      try {
        await page.goto(url, { waitUntil: 'networkidle' });

        const targetElement = await page.$('[data-thumbnail-target]');
        if (targetElement) {
          await targetElement.screenshot({ path: outputPath, type: 'jpeg', quality: 80 });
        } else {
          await page.screenshot({ path: outputPath, fullPage: true, type: 'jpeg', quality: 80 });
        }
        console.log(`Generated thumbnail for ${name} at ${outputPath}`);
      } catch (error) {
        console.error(`Failed to generate thumbnail for ${name}:`, error);
        throw error;
      }
    }
  }

  await browser.close();
};

generateThumbnails().catch((error) => {
  console.error('Error generating thumbnails:', error);
  process.exit(1);
});
