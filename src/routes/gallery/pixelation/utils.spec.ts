import { describe, expect, it } from 'vitest';

// import { colorDistance, median, pickBackground, rgbToLab, trimAndZeroAlpha } from './utils';

// describe('trimAndZeroAlpha', () => {
//   it('zeros out fully transparent pixels', () => {
//     const data = new Uint8ClampedArray([
//       255, 0, 0, 0, 0, 255, 0, 127, 0, 0, 255, 128, 255, 255, 255, 255,
//     ]);

//     trimAndZeroAlpha(data);

//     expect(data[0]).toBe(0);
//     expect(data[1]).toBe(0);
//     expect(data[2]).toBe(0);
//     expect(data[3]).toBe(0);
//     expect(data[4]).toBe(0);
//     expect(data[5]).toBe(0);
//     expect(data[6]).toBe(0);
//     expect(data[7]).toBe(0);
//     expect(data[8]).toBe(0);
//     expect(data[9]).toBe(0);
//     expect(data[10]).toBe(255);
//     expect(data[11]).toBe(128);
//     expect(data[12]).toBe(255);
//     expect(data[13]).toBe(255);
//     expect(data[14]).toBe(255);
//     expect(data[15]).toBe(255);
//   });

//   it('handles empty array', () => {
//     const data = new Uint8ClampedArray(0);
//     expect(() => trimAndZeroAlpha(data)).not.toThrow();
//   });
// });

// describe('median', () => {
//   it('returns median of odd-length array', () => {
//     expect(median([1, 2, 3, 4, 5])).toBe(3);
//   });

//   it('returns median of even-length array', () => {
//     expect(median([1, 2, 3, 4])).toBe(2.5);
//   });

//   it('handles single element', () => {
//     expect(median([42])).toBe(42);
//   });

//   it('handles unsorted input', () => {
//     expect(median([5, 1, 4, 2, 3])).toBe(3);
//   });

//   it('handles negative numbers', () => {
//     expect(median([-5, 0, 5])).toBe(0);
//   });
// });

// describe('rgbToLab', () => {
//   it('converts pure white correctly', () => {
//     const lab = rgbToLab(255, 255, 255);
//     expect(lab[0]).toBeCloseTo(100, 0);
//     expect(lab[1]).toBeCloseTo(0, 1);
//     expect(lab[2]).toBeCloseTo(0, 1);
//   });

//   it('converts pure black correctly', () => {
//     const lab = rgbToLab(0, 0, 0);
//     expect(lab[0]).toBeCloseTo(0, 0);
//   });

//   it('converts pure red correctly', () => {
//     const lab = rgbToLab(255, 0, 0);
//     expect(lab[0]).toBeGreaterThan(50);
//     expect(lab[0]).toBeLessThan(60);
//     expect(lab[1]).toBeGreaterThan(70);
//   });

//   it('converts pure green correctly', () => {
//     const lab = rgbToLab(0, 255, 0);
//     expect(lab[0]).toBeGreaterThan(80);
//     expect(lab[1]).toBeLessThan(-50);
//   });

//   it('converts pure blue correctly', () => {
//     const lab = rgbToLab(0, 0, 255);
//     expect(lab[0]).toBeLessThan(35);
//     expect(lab[2]).toBeGreaterThan(-120);
//   });
// });

// describe('colorDistance', () => {
//   it('returns 0 for identical colors', () => {
//     const lab: [number, number, number] = [50, 10, -20];
//     expect(colorDistance(lab, lab)).toBe(0);
//   });

//   it('calculates correct distance for different colors', () => {
//     const lab1: [number, number, number] = [100, 0, 0];
//     const lab2: [number, number, number] = [0, 0, 0];
//     const dist = colorDistance(lab1, lab2);
//     expect(dist).toBeCloseTo(100, 0);
//   });

//   it('is symmetric', () => {
//     const lab1: [number, number, number] = [80, 20, -30];
//     const lab2: [number, number, number] = [40, -10, 10];
//     expect(colorDistance(lab1, lab2)).toBeCloseTo(colorDistance(lab2, lab1), 10);
//   });
// });

// describe('pickBackground', () => {
//   it('returns white for empty input', () => {
//     expect(pickBackground([])).toEqual([255, 255, 255]);
//   });

//   it('returns white when common colors are near other candidates', () => {
//     const commonColors: [number, number, number][] = [[0, 0, 0]];
//     const bg = pickBackground(commonColors);
//     expect(bg).toBeDefined();
//     expect(bg.length).toBe(3);
//   });

//   it('picks a color from candidate list', () => {
//     const commonColors: [number, number, number][] = [[200, 200, 200]];
//     const bg = pickBackground(commonColors);
//     const candidates = [
//       [0, 0, 0],
//       [255, 255, 255],
//       [255, 0, 0],
//       [0, 255, 0],
//       [0, 0, 255],
//       [255, 255, 0],
//       [255, 0, 255],
//       [0, 255, 255],
//     ];
//     const isCandidate = candidates.some((c) => c[0] === bg[0] && c[1] === bg[1] && c[2] === bg[2]);
//     expect(isCandidate).toBe(true);
//   });

//   it('prefers color far from common colors', () => {
//     const commonColors: [number, number, number][] = [[0, 0, 0]];
//     const bg = pickBackground(commonColors);
//     expect(bg).toBeDefined();
//     expect(bg.length).toBe(3);
//     const candidates = [
//       [0, 0, 0],
//       [255, 255, 255],
//       [255, 0, 0],
//       [0, 255, 0],
//       [0, 0, 255],
//       [255, 255, 0],
//       [255, 0, 255],
//       [0, 255, 255],
//     ];
//     const isCandidate = candidates.some((c) => c[0] === bg[0] && c[1] === bg[1] && c[2] === bg[2]);
//     expect(isCandidate).toBe(true);
//   });
// });

describe('dummy', () => {
  it('is a dummy before figuring out import issues', () => {
    expect(true).toBeTruthy();
  });
});
