import type { Locator } from '@playwright/test';

export const waitForAnimationEnd = async (locator: Locator) => {
  const handle = await locator.elementHandle();
  await handle?.waitForElementState('stable');
  handle?.dispose();
};
