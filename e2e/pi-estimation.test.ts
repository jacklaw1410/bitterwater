import { expect, test } from '@playwright/test';

test('Pi Estimation page', async ({ page }) => {
  await page.goto('gallery/pi-estimation');

  await expect(page).toHaveTitle('Bitter Water - π Estimation');

  await expect(page.getByRole('heading', { name: 'π Estimation' })).toBeVisible();

  await expect(page.getByText('Darts Inside Circle: 0 / 0 = 0.0000%')).toBeVisible();
  await expect(page.getByText('Estimated π: 0.000000')).toBeVisible();

  await page.getByRole('button', { name: 'Play' }).click();

  await page.waitForTimeout(1000);
  await page.screenshot({
    path: 'test-results/screenshots/pi-estimation-page.png',
    fullPage: true,
  });

  await page.getByRole('button', { name: 'Pause' }).click();

  const dartsInsideCircle = await page.getByText(/Darts Inside Circle:/).textContent();
  if (dartsInsideCircle) {
    const totalDarts = dartsInsideCircle.split(' / ')[1].split(' = ')[0];
    const totalDartsNumber = parseInt(totalDarts);
    expect(totalDartsNumber).not.toBeNaN();
    expect(totalDartsNumber).toBeGreaterThan(0);
  } else {
    throw new Error('Darts Inside Circle text not found');
  }

  const piEstimation = await page.getByText(/Estimated π:/).textContent();
  if (piEstimation) {
    expect(parseFloat(piEstimation.split(': ')[1])).toBeGreaterThan(0);
  } else {
    throw new Error('Pi Estimation text not found');
  }

  await page.getByRole('button', { name: 'Reset' }).click();

  await expect(page.getByText('Darts Inside Circle: 0 / 0 = 0.0000%')).toBeVisible();
  await expect(page.getByText('Estimated π: 0.000000')).toBeVisible();
});
