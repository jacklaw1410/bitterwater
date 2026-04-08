import cvModule, { type CV, type Mat } from '@techstark/opencv-js';

/** MIME types that require conversion (not natively supported by browsers or OpenCV) */
export const UNSUPPORTED_IMAGE_TYPES = ['image/heic', 'image/heif', 'image/avif'] as const;

export type UnsupportedImageType = (typeof UNSUPPORTED_IMAGE_TYPES)[number];

/** Check if an image type requires conversion */
export const requiresConversion = (mimeType: string): boolean => {
  return UNSUPPORTED_IMAGE_TYPES.includes(mimeType as UnsupportedImageType);
};

/** Convert unsupported image formats (HEIC, HEIF, AVIF) to PNG blob */
export const convertToSupportedFormat = async (file: File): Promise<Blob> => {
  if (!requiresConversion(file.type)) {
    return file;
  }

  // Dynamic import to avoid SSR issues (heic-to uses WASM)
  const { heicTo } = await import('heic-to');

  const convertedBlob = await heicTo({
    blob: file,
    type: 'image/jpeg',
    quality: 1,
  });

  if (!convertedBlob) {
    throw new Error(`Failed to convert ${file.type} to PNG`);
  }

  return convertedBlob;
};

const MAX_INPUT_DIMENSION = 2048;

const getImageDimensions = (img: HTMLImageElement): { width: number; height: number } => {
  const width = img.naturalWidth;
  const height = img.naturalHeight;
  return { width, height };
};

const computeTargetDimensions = (
  width: number,
  height: number,
): { width: number; height: number } => {
  if (width <= MAX_INPUT_DIMENSION && height <= MAX_INPUT_DIMENSION) {
    return { width, height };
  }
  const ratio = Math.min(MAX_INPUT_DIMENSION / width, MAX_INPUT_DIMENSION / height);
  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
  };
};

export const resizeImage = async (
  blob: Blob,
): Promise<{ blob: Blob; originalWidth: number; originalHeight: number; resized: boolean }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const { width: originalWidth, height: originalHeight } = getImageDimensions(img);
      const { width: targetWidth, height: targetHeight } = computeTargetDimensions(
        originalWidth,
        originalHeight,
      );
      console.log(
        `Resizing image from ${originalWidth}x${originalHeight} to ${targetWidth}x${targetHeight}`,
      );
      if (targetWidth === originalWidth && targetHeight === originalHeight) {
        resolve({
          blob,
          originalWidth,
          originalHeight,
          resized: false,
        });
        return;
      }

      const canvas = new OffscreenCanvas(targetWidth, targetHeight);
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      canvas
        .convertToBlob({ type: 'image/jpeg', quality: 0.92 })
        .then((resizedBlob) => {
          resolve({
            blob: resizedBlob,
            originalWidth,
            originalHeight,
            resized: true,
          });
        })
        .catch(reject);
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(blob);
  });
};

export interface LoadResult {
  src: string;
  originalWidth: number;
  originalHeight: number;
  resized: boolean;
}

/** Load a file as a DataURL, converting unsupported formats if necessary */
export const loadFileAsDataURL = async (file: File): Promise<LoadResult | undefined> => {
  try {
    const blob = await convertToSupportedFormat(file);
    const { blob: processedBlob, originalWidth, originalHeight, resized } = await resizeImage(blob);

    return new Promise<LoadResult>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          src: reader.result as string,
          originalWidth,
          originalHeight,
          resized,
        });
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(processedBlob);
    });
  } catch {
    return undefined;
  }
};

export const getOpenCv = async () => {
  let cv;
  if (cvModule instanceof Promise) {
    cv = await cvModule;
  } else {
    if (cvModule.Mat) {
      cv = cvModule;
    } else {
      await new Promise((resolve) => {
        cvModule.onRuntimeInitialized = () => resolve(undefined);
      });
      cv = cvModule;
    }
  }
  return { cv } as { cv: CV };
};

export type ImageDataArray = Uint8ClampedArray<ArrayBuffer>;

export const trimAndZeroAlpha = (data: ImageDataArray) => {
  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3];
    if (alpha <= 127) {
      data[i] = data[i + 1] = data[i + 2] = data[i + 3] = 0;
    }
  }
};

const ALPHA_THRESHOLD = 127;

export const rgbToLab = (r: number, g: number, b: number): [number, number, number] => {
  let rn = r / 255;
  let gn = g / 255;
  let bn = b / 255;

  rn = rn > 0.04045 ? Math.pow((rn + 0.055) / 1.055, 2.4) : rn / 12.92;
  gn = gn > 0.04045 ? Math.pow((gn + 0.055) / 1.055, 2.4) : gn / 12.92;
  bn = bn > 0.04045 ? Math.pow((bn + 0.055) / 1.055, 2.4) : bn / 12.92;

  const x = (rn * 0.4124 + gn * 0.3576 + bn * 0.1805) / 0.95047;
  const y = (rn * 0.2126 + gn * 0.7152 + bn * 0.0722) / 1.0;
  const z = (rn * 0.0193 + gn * 0.1192 + bn * 0.9505) / 1.08883;

  const fx = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
  const fy = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
  const fz = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;

  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
};

export const colorDistance = (
  lab1: [number, number, number],
  lab2: [number, number, number],
): number => {
  return Math.sqrt(
    Math.pow(lab1[0] - lab2[0], 2) +
      Math.pow(lab1[1] - lab2[1], 2) +
      Math.pow(lab1[2] - lab2[2], 2),
  );
};

const _topOpaqueColors = (
  src: Mat,
  cv: CV,
  alphaThreshold: number,
  topN: number = 5,
): [number, number, number][] => {
  const colorCounts = new Map<string, number>();
  const height = src.rows;
  const width = src.cols;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const alpha = src.data[idx + 3];
      if (alpha < alphaThreshold) continue;

      const r = src.data[idx];
      const g = src.data[idx + 1];
      const b = src.data[idx + 2];
      const key = `${r},${g},${b}`;
      colorCounts.set(key, (colorCounts.get(key) || 0) + 1);
    }
  }

  const sorted = Array.from(colorCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN);

  return sorted.map(([key]) => {
    const [r, g, b] = key.split(',').map(Number);
    return [r, g, b] as [number, number, number];
  });
};

export const pickBackground = (
  commonColors: [number, number, number][],
): [number, number, number] => {
  if (commonColors.length === 0) return [255, 255, 255];

  const labColors = commonColors.map(([r, g, b]) => rgbToLab(r, g, b));

  const candidates: [number, number, number][] = [
    [0, 0, 0],
    [255, 255, 255],
    [255, 0, 0],
    [0, 255, 0],
    [0, 0, 255],
    [255, 255, 0],
    [255, 0, 255],
    [0, 255, 255],
  ];

  let bestBg = [255, 255, 255] as [number, number, number];
  let maxMinDist = 0;

  for (const candidate of candidates) {
    const labCand = rgbToLab(candidate[0], candidate[1], candidate[2]);
    let minDist = Infinity;
    for (const labCommon of labColors) {
      const dist = colorDistance(labCand, labCommon);
      if (dist < minDist) minDist = dist;
    }
    if (minDist > maxMinDist) {
      maxMinDist = minDist;
      bestBg = candidate;
    }
  }

  return bestBg;
};

export function clampAlpha(
  src: Mat,
  cv: CV,
  alphaThreshold: number = ALPHA_THRESHOLD,
  backgroundHex: string | null = null,
): Mat {
  const height = src.rows;
  const width = src.cols;

  let bgRgb: [number, number, number];
  if (backgroundHex === null) {
    const common = _topOpaqueColors(src, cv, alphaThreshold);
    bgRgb = pickBackground(common);
  } else {
    const hex = backgroundHex.replace('#', '');
    bgRgb = [
      parseInt(hex.substring(0, 2), 16),
      parseInt(hex.substring(2, 4), 16),
      parseInt(hex.substring(4, 6), 16),
    ] as [number, number, number];
  }

  const result = new cv.Mat(height, width, cv.CV_8UC4);
  src.copyTo(result);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const alpha = result.data[idx + 3];
      if (alpha < alphaThreshold) {
        result.data[idx] = bgRgb[0];
        result.data[idx + 1] = bgRgb[1];
        result.data[idx + 2] = bgRgb[2];
        result.data[idx + 3] = 255;
      }
    }
  }

  return result;
}

export interface Mesh {
  linesX: number[];
  linesY: number[];
}

const clusterLines = (lines: number[], threshold: number = 4): number[] => {
  const sorted = lines.slice().sort((a, b) => a - b);
  if (sorted.length === 0) return [];
  const clustered: number[][] = [[sorted[0]]];
  for (let i = 1; i < sorted.length; i++) {
    const lastCluster = clustered[clustered.length - 1];
    if (sorted[i] - lastCluster[lastCluster.length - 1] <= threshold) {
      lastCluster.push(sorted[i]);
    } else {
      clustered.push([sorted[i]]);
    }
  }
  return clustered.map((clusterItems) => {
    clusterItems.sort((a, b) => a - b);
    return clusterItems[Math.floor(clusterItems.length / 2)];
  });
};

export const detectMeshLines = (
  edges: Mat,
  cv: CV,
  options?: { threshold?: number; minLineLength?: number; maxLineGap?: number },
): Mesh => {
  const lines = new cv.Mat();
  cv.HoughLinesP(
    edges,
    lines,
    1,
    Math.PI / 180,
    options?.threshold || 30,
    options?.minLineLength || 50,
    options?.maxLineGap || 10,
  );

  const height = edges.rows;
  const width = edges.cols;

  const linesX = [0, width - 1];
  const linesY = [0, height - 1];

  if (lines.rows > 0) {
    for (let i = 0; i < lines.rows; i++) {
      const [x1, y1, x2, y2] = lines.data32S.subarray(i * 4, i * 4 + 4);
      const dx = x2 - x1;
      const dy = y2 - y1;
      const angle = Math.abs(Math.atan2(dy, dx));
      const angleThreshold = Math.PI / 12;

      if (angle > Math.PI / 2 - angleThreshold) {
        linesX.push(Math.round((x1 + x2) / 2));
      } else if (angle < angleThreshold) {
        linesY.push(Math.round((y1 + y2) / 2));
      }
    }
  }

  const clusteredLinesX = clusterLines(linesX);
  const clusteredLinesY = clusterLines(linesY);

  lines.delete();
  return { linesX: clusteredLinesX, linesY: clusteredLinesY };
};

const computePixelSize = (linesX: number[], linesY: number[]): number => {
  const gaps: number[] = [
    ...linesX.slice(1).map((line, ix) => line - linesX[ix]),
    ...linesY.slice(1).map((line, ix) => line - linesY[ix]),
  ];
  gaps.sort((a, b) => a - b);

  const p2 = gaps[Math.floor(gaps.length * 0.02)];
  const p98 = gaps[Math.floor(gaps.length * 0.98)];
  let filtered = gaps.filter((g) => g >= p2 && g <= p98);
  if (filtered.length === 0) {
    filtered = gaps;
  }
  return median(filtered);
};

const homogenizeLines = (lines: number[], pixelSize: number): number[] => {
  const gaps = lines.slice(1).map((line, i) => line - lines[i]);
  const completeLines = lines.slice();
  for (let ix = 0; ix < gaps.length; ix++) {
    const gap = gaps[ix];
    const numPixels = Math.round(gap / pixelSize);
    const pixelSizeInGap = gap / numPixels;
    const start = completeLines[ix];
    for (let i = 0; i < numPixels - 1; i++) {
      completeLines.push(start + pixelSizeInGap * (i + 1));
    }
  }

  completeLines.sort((a, b) => a - b);
  return completeLines;
};

export const downsample = (src: Mat, linesX: number[], linesY: number[], cv: CV): Mat => {
  const heightResult = linesY.length - 1;
  const widthResult = linesX.length - 1;

  const result = new cv.Mat(new cv.Size(widthResult, heightResult), cv.CV_8UC4);

  const srcRgba = new cv.Mat();
  cv.cvtColor(src, srcRgba, cv.COLOR_BGR2RGBA);
  for (let i = 0; i < widthResult; i++) {
    for (let j = 0; j < heightResult; j++) {
      const x0 = linesX[i];
      const x1 = linesX[i + 1];
      const y0 = linesY[j];
      const y1 = linesY[j + 1];

      const cell = srcRgba.roi(new cv.Rect(x0, y0, x1 - x0, y1 - y0));

      const color = getModeColor(cell, cv);
      result.data.set([color[0], color[1], color[2], color[3]], (j * widthResult + i) * 4);

      cell.delete();
    }
  }

  cv.cvtColor(result, result, cv.COLOR_RGBA2RGB);
  srcRgba.delete();
  return result;
};

function getModeColor(cell: Mat, _cv: CV): [number, number, number, number] {
  const colorCounts = new Map<string, number>();

  for (let row = 0; row < cell.rows; row++) {
    for (let col = 0; col < cell.cols; col++) {
      const pixel = cell.ucharPtr(row, col);
      // const idx = (row * cell.cols + col) * 4;
      const b = pixel[0];
      const g = pixel[1];
      const r = pixel[2];
      const a = pixel[3];

      // console.log(`Pixel at (${col}, ${row}): RGBA=(${r}, ${g}, ${b}, ${a})`);
      if (a < 128) continue;

      const key = `${r},${g},${b}`;
      colorCounts.set(key, (colorCounts.get(key) || 0) + 1);
    }
  }
  // console.log(cell.data, cell.channels());
  // console.log(`Color counts for cell of size ${cell.cols}x${cell.rows}:`, colorCounts);

  let modeKey = '0,0,0';
  let maxCount = 0;
  for (const [key, count] of colorCounts) {
    if (count > maxCount) {
      maxCount = count;
      modeKey = key;
    }
  }

  const [r, g, b] = modeKey.split(',').map(Number);
  return [r, g, b, 255];
}

export function scaleImageNearest(src: Mat, scaleFactor: number, cv: CV): Mat {
  if (scaleFactor <= 1) return src.clone();

  const newWidth = Math.round(src.cols * scaleFactor);
  const newHeight = Math.round(src.rows * scaleFactor);
  const dst = new cv.Mat();
  cv.resize(src, dst, new cv.Size(newWidth, newHeight), 0, 0, cv.INTER_NEAREST);
  return dst;
}

export interface PixelateOptions {
  numColors?: number;
  initialUpscaleFactor?: number;
  scaleResult?: number;
  transparentBackground?: boolean;
  clampAlphaThreshold?: number;
  backgroundColor?: string | null;
}

export interface PixelateResult {
  phase1Preprocessed: Mat;
  phase2Gray: Mat;
  phase2Edges: Mat;
  phase2Closed: Mat;
  phase2Lines: { linesX: number[]; linesY: number[] };
  phase3MeshOverlaid: Mat;
  phase3HomogeneousMeshOverlaid: Mat;
  phase4Downsampled: Mat;
  phase5Result: Mat;
}

const cropBorder = (cv: CV, src: Mat, by: number): Mat => {
  const startY = by;
  const startX = by;
  const height = src.rows - 2 * by;
  const width = src.cols - 2 * by;
  const rect = new cv.Rect(startX, startY, width, height);
  const cropped = src.roi(rect);
  return cropped;
};

export const median = (arr: number[]): number => {
  const sorted = arr.slice().sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
};

const overlayMesh = (src: Mat, linesX: number[], linesY: number[], cv: CV): Mat => {
  const meshOverlaid = new cv.Mat();
  src.copyTo(meshOverlaid);

  for (let j = 0; j < linesY.length - 1; j++) {
    for (let i = 0; i < linesX.length - 1; i++) {
      const x0 = linesX[i];
      const x1 = linesX[i + 1];
      const y0 = linesY[j];
      const y1 = linesY[j + 1];
      cv.rectangle(
        meshOverlaid,
        new cv.Point(x0, y0),
        new cv.Point(x1, y1),
        new cv.Scalar(192, 192, 192, 255),
        1,
      );
    }
  }
  return meshOverlaid;
};

export const phase1_preprocess = (srcImage: Mat, cv: CV, initialUpscaleFactor: number = 2): Mat => {
  const srcRgba = new cv.Mat();
  cv.cvtColor(srcImage, srcRgba, cv.COLOR_BGR2RGBA);

  let upscaled = srcRgba;
  if (initialUpscaleFactor > 1) {
    upscaled = scaleImageNearest(srcRgba, initialUpscaleFactor, cv);
    srcRgba.delete();
  }

  const preprocessed = cropBorder(cv, upscaled, 2);

  return preprocessed;
};

export interface Phase2Result {
  gray: Mat;
  edges: Mat;
  closed: Mat;
}

export const phase2_detectEdges = (src: Mat, cv: CV): Phase2Result => {
  const clamped = clampAlpha(src, cv);

  const gray = new cv.Mat();
  cv.cvtColor(clamped, gray, cv.COLOR_BGR2GRAY);

  const v = median(Array.from(gray.data));
  const sigma = 0.33;
  const low_thresh = Math.round(Math.max(0, (1.0 - sigma) * v));
  const high_thresh = Math.round(Math.min(255, (1.0 + sigma) * v));

  const edges = new cv.Mat();
  cv.Canny(gray, edges, low_thresh, high_thresh);

  const kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(5, 5));
  const closed = new cv.Mat();
  cv.morphologyEx(edges, closed, cv.MORPH_CLOSE, kernel);
  kernel.delete();

  return { gray, edges, closed };
};

export interface Phase3Result {
  linesX: number[];
  linesY: number[];
  homogenizedLinesX: number[];
  homogenizedLinesY: number[];
  pixelSize: number;
}

export const phase3_detectMesh = (
  edges: Mat,
  imageWidth: number,
  imageHeight: number,
  cv: CV,
): Phase3Result => {
  const options = {
    threshold: Math.round(Math.min(imageWidth, imageHeight) * 0.1),
    minLineLength: Math.round(Math.min(imageWidth, imageHeight) * 0.05),
    maxLineGap: Math.round(Math.min(imageWidth, imageHeight) * 0.02),
  };
  const { linesX, linesY } = detectMeshLines(edges, cv, options);

  const pixelSize = computePixelSize(linesX, linesY);
  const homogenizedLinesX = homogenizeLines(linesX, pixelSize);
  const homogenizedLinesY = homogenizeLines(linesY, pixelSize);

  return { linesX, linesY, homogenizedLinesX, homogenizedLinesY, pixelSize };
};

export const phase4_downsample = (
  src: Mat,
  homogenizedLinesX: number[],
  homogenizedLinesY: number[],
  cv: CV,
): Mat => {
  return downsample(src, homogenizedLinesX, homogenizedLinesY, cv);
};

export const phase5_finalize = (downsampled: Mat, originalHeight: number, cv: CV): Mat => {
  const downsampleFactor = Math.round(originalHeight / downsampled.rows);
  return scaleImageNearest(downsampled, downsampleFactor, cv);
};

export const pixelate = (srcImage: Mat, cv: CV, options: PixelateOptions = {}): PixelateResult => {
  const { initialUpscaleFactor = 2 } = options;

  const preprocessed = phase1_preprocess(srcImage, cv, initialUpscaleFactor);
  const { gray, edges, closed } = phase2_detectEdges(preprocessed, cv);
  const { linesX, linesY, homogenizedLinesX, homogenizedLinesY } = phase3_detectMesh(
    closed,
    preprocessed.cols,
    preprocessed.rows,
    cv,
  );

  const meshOverlaid = overlayMesh(preprocessed, linesX, linesY, cv);
  const homogeneousMeshOverlaid = overlayMesh(
    preprocessed,
    homogenizedLinesX,
    homogenizedLinesY,
    cv,
  );

  const downsampled = phase4_downsample(preprocessed, homogenizedLinesX, homogenizedLinesY, cv);
  const result = phase5_finalize(downsampled, srcImage.rows, cv);

  return {
    phase1Preprocessed: preprocessed,
    phase2Gray: gray,
    phase2Edges: edges,
    phase2Closed: closed,
    phase2Lines: { linesX, linesY },
    phase3MeshOverlaid: meshOverlaid,
    phase3HomogeneousMeshOverlaid: homogeneousMeshOverlaid,
    phase4Downsampled: downsampled,
    phase5Result: result,
  };
};
