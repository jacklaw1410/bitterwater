import { test, expect } from '@playwright/test';

test('Brownian Motion page functions correctly', async ({ page }) => {
  await page.goto('/brownian-motion');
  await expect(page.getByRole('heading', { name: 'Brownian Motion Visualizer' })).toBeVisible();

  const canvas = page.locator('canvas');
  await expect(canvas).toBeVisible();

  // Allow some time for initial rendering
  await page.waitForTimeout(500);

  // Test pause functionality: canvas should not change after a delay
  await page.getByRole('button', { name: 'Pause' }).click();
  await expect(page.getByRole('button', { name: 'Play' })).toBeVisible();
  const pausedCanvas = await canvas.screenshot({ path: 'test-results/screenshots/bn-1-paused.png' });
  await page.waitForTimeout(500);
  expect(await canvas.screenshot({ path: 'test-results/screenshots/bn-2-paused-awaited.png' })).toEqual(pausedCanvas);

  // Test play functionality: canvas should change
  await page.getByRole('button', { name: 'Play' }).click();
  await expect(page.getByRole('button', { name: 'Pause' })).toBeVisible();
  await page.waitForTimeout(500);
  expect(await canvas.screenshot({ path: 'test-results/screenshots/bn-3-played.png' })).not.toEqual(pausedCanvas);

  // Test that changing particle count slider updates the UI label
  const particleSlider = page.getByLabel('Number of particles');
  await particleSlider.fill('50');
  await expect(page.getByText('Particles: 50')).toBeVisible();

  // Since we cannot count particles on a canvas directly, we verify the control's effect
  // by taking a screenshot before and after resetting the simulation with the new particle count.
  // The two screenshots should be different, confirming the particle count has changed.
  const canvasBeforeReset = await canvas.screenshot();
  await page.getByRole('button', { name: 'Reset' }).click();
  await page.waitForTimeout(500); // Wait for re-render
  expect(await canvas.screenshot({ path: 'test-results/screenshots/bn-4-reset.png' })).not.toEqual(canvasBeforeReset);
});
