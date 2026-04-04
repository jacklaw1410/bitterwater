import type { Locator } from '@playwright/test';

export const waitForAnimationEnd = async (locator: Locator) => {
  return locator.evaluate((element) =>
    Promise.all(element.getAnimations().map((animation) => animation.finished)),
  );
};
