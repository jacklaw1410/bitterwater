import type { Locator } from '@playwright/test';

export const waitForAnimationEnd = async (locator: Locator) => {
  return locator.evaluate((element) =>
    Promise.all(element.getAnimations().map((animation) => animation.finished)),
  );
};

export const pauseSVGAnimations = async (locator: Locator) => {
  return locator.evaluate((element) => {
    (element as SVGSVGElement).pauseAnimations();
  });
};

export const unpauseSVGAnimations = async (locator: Locator) => {
  return locator.evaluate((element) => {
    (element as SVGSVGElement).unpauseAnimations();
  });
};
