import type { CV, Mat } from '@techstark/opencv-js';
import { describe, expect, it } from 'vite-plus/test';

import {
  getOpenCv,
  phase1_preprocess,
  phase2_detectEdges,
  phase3_detectMesh,
  phase4_downsample,
} from './utils';

/**
 * Mesh-detection probe: reproduces the #36 diagnostic metrics for the pikachu fixture under
 * whichever @techstark/opencv-js version is installed.
 *
 * Recorded baseline (4.12, see #36): edges 135200, closed 303955, 9 lines, pixelSize 14,
 * homogenized 68×61, downsample 60×67. OpenCV 5.0.0 collapses this to 1 line / pixelSize 571 / 2×2
 * — the exact regression this probe exists to surface.
 *
 * Usage: CI=1 vp test --run --project client src/routes/gallery/pixelation/mesh-probe.spec.ts #
 * compare vs baseline CI=1 vp test -u --run --project client
 * src/routes/gallery/pixelation/mesh-probe.spec.ts # re-record baseline Re-record only after the
 * canary (utils.spec.ts) confirms a sane mesh on the new dependency; the probe's range assertions
 * reject the 5.0 signature regardless of the snapshot.
 */

interface MeshMetrics {
  input: string;
  preprocessed: string;
  edgesNonzero: number;
  closedNonzero: number;
  linesFound: number;
  pixelSize: number;
  homogenizedGrid: string;
  downsampleGrid: string;
}

const warmUpHeap = (cv: CV) => {
  const warm = new cv.Mat(4096, 4096, cv.CV_8UC4);
  warm.delete();
};

const measure = async (cv: CV): Promise<{ metrics: MeshMetrics; mats: Mat[] }> => {
  warmUpHeap(cv);
  const img = new Image();
  img.src = '/pixelation/pikachu.png';
  await img.decode();

  const src = cv.imread(img);
  const preprocessed = phase1_preprocess(src, cv);
  const { gray, edges, closed } = phase2_detectEdges(preprocessed, cv);

  const minDim = Math.min(preprocessed.cols, preprocessed.rows);
  const rawLines = new cv.Mat();
  cv.HoughLinesP(
    closed,
    rawLines,
    1,
    Math.PI / 180,
    Math.round(minDim * 0.1),
    Math.round(minDim * 0.05),
    Math.round(minDim * 0.02),
  );

  const mesh = phase3_detectMesh(closed, preprocessed.cols, preprocessed.rows, cv);
  const downsampled = phase4_downsample(
    preprocessed,
    mesh.homogenizedLinesX,
    mesh.homogenizedLinesY,
    cv,
  );

  const metrics: MeshMetrics = {
    input: `${src.cols}×${src.rows}`,
    preprocessed: `${preprocessed.cols}×${preprocessed.rows}`,
    edgesNonzero: cv.countNonZero(edges),
    closedNonzero: cv.countNonZero(closed),
    // 4.x: N rows × 4 cols; 5.x: 1 row × 4N cols — count from the data length
    linesFound: Math.floor(rawLines.data32S.length / 4),
    pixelSize: mesh.pixelSize,
    homogenizedGrid: `${mesh.homogenizedLinesX.length - 1}×${mesh.homogenizedLinesY.length - 1}`,
    downsampleGrid: `${downsampled.cols}×${downsampled.rows}`,
  };

  return {
    metrics,
    mats: [src, preprocessed, gray, edges, closed, rawLines, downsampled],
  };
};

describe('mesh probe (dependency-version metrics, #36)', () => {
  it('records the pikachu mesh metrics against the baseline snapshot', async () => {
    const { cv } = await getOpenCv();
    const { metrics, mats } = await measure(cv);
    try {
      // Range assertions: reject the 5.0.0 collapse (1 line, pixelSize ~571,
      // 2×2 grid) even if the snapshot is stale.
      expect(metrics.linesFound).toBeGreaterThanOrEqual(8);
      expect(metrics.pixelSize).toBeGreaterThanOrEqual(8);
      expect(metrics.pixelSize).toBeLessThanOrEqual(32);
      const [gridCols, gridRows] = metrics.homogenizedGrid.split('×').map(Number);
      expect(gridCols).toBeGreaterThanOrEqual(40);
      expect(gridRows).toBeGreaterThanOrEqual(40);

      expect(metrics).toMatchInlineSnapshot(`
      	{
      	  "closedNonzero": 18530,
      	  "downsampleGrid": "41×48",
      	  "edgesNonzero": 18104,
      	  "homogenizedGrid": "41×48",
      	  "input": "411×481",
      	  "linesFound": 106,
      	  "pixelSize": 20,
      	  "preprocessed": "818×958",
      	}
      `);
    } finally {
      for (const mat of mats) {
        mat.delete();
      }
    }
  }, 30_000);
});
