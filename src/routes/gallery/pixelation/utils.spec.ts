import type { CV, Mat } from '@techstark/opencv-js';
import { describe, expect, it } from 'vite-plus/test';

import {
  getOpenCv,
  phase1_preprocess,
  phase2_detectEdges,
  phase3_detectMesh,
  pixelate,
} from './utils';

// Synthetic checkerboard: 8x8 flat-color cells inside a dark border.
//
// Design constraints (each one learned the hard way):
// - Flat binary cells alone are invisible to the pipeline: its median-based
//   Canny thresholds (low = 0.67*median, high = 1.33*median) can never mark a
//   50/50 black/white image's edges as *strong* (median = light value => high
//   >= 255), producing a false 1-cell mesh. The 20px dark border drops the
//   median to ~30 so cell-boundary gradients (225) are well above `high`.
// - Noisy cells were rejected too: speckle edges make HoughLinesP return
//   ~1000 lines, and opencv.js's HoughLinesP output views go stale when the
//   wasm heap grows to fit the output, so the pipeline reads garbage. Flat
//   cells keep the output to ~20 lines (no heap growth) and the test warmups
//   the heap beforehand as a belt-and-braces guard.
const CHECKERBOARD_CELLS = 8;
const CHECKERBOARD_SIZE = 400;
const CHECKERBOARD_BORDER = 20;

const makeCheckerboard = (cv: CV): Mat => {
  const gray = new cv.Mat(CHECKERBOARD_SIZE, CHECKERBOARD_SIZE, cv.CV_8UC1);
  const inner = CHECKERBOARD_SIZE - 2 * CHECKERBOARD_BORDER;
  const cell = inner / CHECKERBOARD_CELLS;
  const data = gray.data;
  for (let row = 0; row < CHECKERBOARD_SIZE; row += 1) {
    for (let col = 0; col < CHECKERBOARD_SIZE; col += 1) {
      let value = 0;
      if (
        row >= CHECKERBOARD_BORDER &&
        row < CHECKERBOARD_BORDER + inner &&
        col >= CHECKERBOARD_BORDER &&
        col < CHECKERBOARD_BORDER + inner
      ) {
        const dark =
          (Math.floor((row - CHECKERBOARD_BORDER) / cell) +
            Math.floor((col - CHECKERBOARD_BORDER) / cell)) %
            2 ===
          0;
        value = dark ? 30 : 255;
      }
      data[row * CHECKERBOARD_SIZE + col] = value;
    }
  }
  const bgra = new cv.Mat();
  cv.cvtColor(gray, bgra, cv.COLOR_GRAY2BGRA);
  gray.delete();
  return bgra;
};

// Pre-grow the wasm heap so no allocation inside the pipeline (upscale, Canny,
// morphology, HoughLinesP output) triggers a realloc that would stale opencv.js
// typed-array views on earlier Mats. A 64MB Mat forces the heap to a size that
// the pipeline's few-MB allocations never exceed.
const warmUpHeap = (cv: CV) => {
  const warm = new cv.Mat(4096, 4096, cv.CV_8UC4);
  warm.delete();
};

/**
 * Mesh-sanity assertions shared by the live canary and the regression fixture. Known-good meshes:
 * 8x8 / pixelSize ~90 (checkerboard), 60x67 / 14 (pikachu). The OpenCV 5.0.0 HoughLinesP regression
 * (tracked in issue #36) collapses the mesh to 1-2 cells with pixelSize ~571 on the same inputs —
 * orders of magnitude outside these ranges, so the canary fails loudly instead of a screenshot
 * diff.
 */
const expectSaneMesh = (
  homogenizedLinesX: number[],
  homogenizedLinesY: number[],
  pixelSize: number,
) => {
  const gridCols = homogenizedLinesX.length - 1;
  const gridRows = homogenizedLinesY.length - 1;
  expect(gridCols).toBeGreaterThanOrEqual(4);
  expect(gridCols).toBeLessThanOrEqual(64);
  expect(gridRows).toBeGreaterThanOrEqual(4);
  expect(gridRows).toBeLessThanOrEqual(64);
  expect(pixelSize).toBeGreaterThanOrEqual(4);
  expect(pixelSize).toBeLessThanOrEqual(128);
};

describe('pixelation mesh sanity (dependency-upgrade canary)', () => {
  it('detects a sane mesh on a synthetic checkerboard with the real OpenCV wasm', async () => {
    const { cv } = await getOpenCv();
    warmUpHeap(cv);
    const src = makeCheckerboard(cv);
    const preprocessed = phase1_preprocess(src, cv);
    const { gray, edges, closed } = phase2_detectEdges(preprocessed, cv);
    try {
      const mesh = phase3_detectMesh(closed, preprocessed.cols, preprocessed.rows, cv);
      expectSaneMesh(mesh.homogenizedLinesX, mesh.homogenizedLinesY, mesh.pixelSize);
    } finally {
      src.delete();
      preprocessed.delete();
      gray.delete();
      edges.delete();
      closed.delete();
    }
  }, 30_000);

  it('preserves a sane grid and aspect ratio end-to-end through pixelate()', async () => {
    const { cv } = await getOpenCv();
    warmUpHeap(cv);
    const src = makeCheckerboard(cv);
    const result = pixelate(src, cv);
    try {
      expect(result.phase4Downsampled.cols).toBeGreaterThanOrEqual(4);
      expect(result.phase4Downsampled.cols).toBeLessThanOrEqual(64);
      expect(result.phase4Downsampled.rows).toBeGreaterThanOrEqual(4);
      expect(result.phase4Downsampled.rows).toBeLessThanOrEqual(64);

      const srcRatio = src.cols / src.rows;
      const resultRatio = result.phase5Result.cols / result.phase5Result.rows;
      expect(Math.abs(resultRatio - srcRatio)).toBeLessThan(0.1);
    } finally {
      src.delete();
      result.phase1Preprocessed.delete();
      result.phase2Gray.delete();
      result.phase2Edges.delete();
      result.phase2Closed.delete();
      result.phase3MeshOverlaid.delete();
      result.phase3HomogeneousMeshOverlaid.delete();
      result.phase4Downsampled.delete();
      result.phase5Result.delete();
    }
  }, 30_000);

  it('rejects the OpenCV 5.0.0 regression signature (1 line found, pixelSize ~571)', () => {
    // From the #28 investigation: identical Canny/morphology input, OpenCV 5.0
    // HoughLinesP finds 1 line vs 9 on 4.x, so the mesh stays at the image
    // borders and pixelSize jumps to ~571 (479x410 input).
    expect(() => expectSaneMesh([0, 479], [0, 410], 571)).toThrow();
  });
});
