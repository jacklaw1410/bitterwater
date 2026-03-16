import { expect, test } from '@playwright/test';

test('Brownian Motion page', async ({ page }) => {
  await page.goto('gallery/brownian-motion');

  await expect(page).toHaveTitle('Bitter Water - Brownian Motion');

  await expect(page.getByRole('heading', { name: 'Brownian Motion Visualizer' })).toBeVisible();

  const canvas = page.locator('canvas');
  await expect(canvas).toBeVisible();

  // Allow some time for initial rendering
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'test-results/screenshots/bn-page.png', fullPage: true });

  // Test pause functionality: canvas should not change after a delay
  await page.getByRole('button', { name: 'Pause' }).click();
  await expect(page.getByRole('button', { name: 'Play' })).toBeVisible();
  const pausedCanvas1 = await canvas.screenshot({
    path: 'test-results/screenshots/bn-1-paused.png',
  });
  await page.waitForTimeout(500);
  const pausedCanvas2 = await canvas.screenshot({
    path: 'test-results/screenshots/bn-2-paused-awaited.png',
  });
  expect(pausedCanvas2).toEqual(pausedCanvas1);

  // Test changing particle count update the canvas
  const particleSlider = page.getByLabel('Number of particles');
  await particleSlider.fill('200');
  await expect(page.getByText('Particles: 200')).toBeVisible();
  const pausedCanvas3 = await canvas.screenshot({
    path: 'test-results/screenshots/bn-3-particles-updated.png',
  });
  expect(pausedCanvas3).not.toEqual(pausedCanvas2);

  // Test changing particle size update the canvas
  const sizeSlider = page.getByLabel('Particle size');
  await sizeSlider.fill('5');
  await expect(page.getByText('Size: 5')).toBeVisible();
  const pausedCanvas4 = await canvas.screenshot({
    path: 'test-results/screenshots/bn-4-size-updated.png',
  });
  expect(pausedCanvas4).not.toEqual(pausedCanvas3);

  // Test changing color update the canvas
  const colorPicker = page.getByLabel('Particle color');
  await colorPicker.fill('#00ff00');
  const pausedCanvas5 = await canvas.screenshot({
    path: 'test-results/screenshots/bn-5-color-updated.png',
  });
  expect(pausedCanvas5).not.toEqual(pausedCanvas4);

  // Test changing width update the canvas
  const widthInput = page.getByLabel('Canvas width');
  await widthInput.fill('600');
  const pausedCanvas6 = await canvas.screenshot({
    path: 'test-results/screenshots/bn-6-width-updated.png',
  });
  expect(pausedCanvas6).not.toEqual(pausedCanvas5);

  // Test changing height update the canvas
  const heightInput = page.getByLabel('Canvas height');
  await heightInput.fill('400');
  const pausedCanvas7 = await canvas.screenshot({
    path: 'test-results/screenshots/bn-7-height-updated.png',
  });
  expect(pausedCanvas7).not.toEqual(pausedCanvas6);

  // Test play functionality: canvas should change
  await page.getByRole('button', { name: 'Play' }).click();
  await expect(page.getByRole('button', { name: 'Pause' })).toBeVisible();
  await page.waitForTimeout(500);
  expect(
    await canvas.screenshot({ path: 'test-results/screenshots/bn-8-replayed.png' }),
  ).not.toEqual(pausedCanvas7);

  // Test speed slider
  const speedSlider = page.getByLabel('Particle speed');
  await speedSlider.fill('5');
  await expect(page.getByText('Speed: 5')).toBeVisible();

  // Test trails checkbox
  const trailsCheckbox = page.getByLabel('Show trails');
  await trailsCheckbox.uncheck();
  // Visual regression test would be ideal here

  // Test statistics display
  const positionTable = page.getByRole('table', { name: 'Position statistics' });
  const velocityTable = page.getByRole('table', { name: 'Velocity statistics' });
  await expect(positionTable).toBeVisible();
  await expect(velocityTable).toBeVisible();

  const positionCells = positionTable.locator('code');
  const velocityCells = velocityTable.locator('code');
  await expect(positionCells.nth(0)).toContainText(/^\d+\.\d{4}$/);
  await expect(positionCells.nth(1)).toContainText(/^\d+\.\d{4}$/);
  await expect(velocityCells.nth(0)).toContainText(/^-?\d+\.\d{4}$/); // could be negative
  await expect(velocityCells.nth(1)).toContainText(/^-?\d+\.\d{4}$/); // could be negative
  await expect(velocityCells.nth(2)).toContainText(/^\d+\.\d{4}$/);

  // Since we cannot count particles on a canvas directly, we verify the control's effect
  // by taking a screenshot before and after resetting the simulation with the new particle count.
  // The two screenshots should be different, confirming the particle count has changed.
  const canvasBeforeReset = await canvas.screenshot();
  await page.getByRole('button', { name: 'Reset' }).click();
  await page.waitForTimeout(500); // Wait for re-render
  expect(await canvas.screenshot({ path: 'test-results/screenshots/bn-10-reset.png' })).not.toEqual(
    canvasBeforeReset,
  );
});
