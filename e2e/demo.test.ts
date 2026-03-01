import { expect, test } from '@playwright/test';

test('home page has expected h1', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Welcome to SvelteKit' })).toBeVisible();

  // Take a screenshot
  await page.screenshot({ path: 'test-results/screenshots/home-page.png', fullPage: true });

  await page.getByRole('link', { name: 'svelte.dev/docs/kit' }).click(); // Example action

  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle');

  await expect(page).toHaveURL('https://svelte.dev/docs/kit/introduction'); // Assert the URL changed

  await page.screenshot({ path: 'test-results/screenshots/after-click.png' });
});
