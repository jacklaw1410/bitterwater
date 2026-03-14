import { test, expect } from '@playwright/test';
import { fail } from 'assert';

test('Pi Estimation page', async ({ page }) => {
  await page.goto('/gallery/pi-estimation');

  await expect(page.getByRole('heading', { name: 'π Estimation' })).toBeVisible();

  // Initial state
  await expect(page.getByText('Darts Inside Circle: 0 / 0 = 0.0000%')).toBeVisible();
  await expect(page.getByText('Estimated π: 0.000000')).toBeVisible();

  // Start the simulation
  await page.getByRole('button', { name: 'Start' }).click();

  // Wait for the simulation to run
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: 'test-results/screenshots/pi-estimation-page.png',
    fullPage: true,
  });

  // Stop the simulation
  await page.getByRole('button', { name: 'Stop' }).click();

  // Check that the statistics have updated
  const dartsInsideCircle = await page.getByText(/Darts Inside Circle:/).textContent();
  if (dartsInsideCircle) {
    const totalDarts = dartsInsideCircle.split(' / ')[1].split(' = ')[0];
    const totalDartsNumber = parseInt(totalDarts);
    expect(totalDartsNumber).not.toBeNaN();
    expect(totalDartsNumber).toBeGreaterThan(0);
  } else {
    fail('Darts Inside Circle text not found');
  }

  const piEstimation = await page.getByText(/Estimated π:/).textContent();
  if (piEstimation) {
    expect(parseFloat(piEstimation.split(': ')[1])).toBeGreaterThan(0);
  } else {
    fail('Pi Estimation text not found');
  }

  await page.getByRole('button', { name: 'Reset' }).click();

  // Check that the statistics have been reset
  await expect(page.getByText('Darts Inside Circle: 0 / 0 = 0.0000%')).toBeVisible();
  await expect(page.getByText('Estimated π: 0.000000')).toBeVisible();
});
