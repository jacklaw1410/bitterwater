<script module lang="ts">
  export const metadata = {
    title: "Pixelation",
    description:
      "Transform any image into pixel art, no matter the resolution.",
  } as const;

  const loadFileAs = async (
    file: File,
    method: "readAsDataURL" | "readAsArrayBuffer",
  ) => {
    return new Promise<string | undefined>((resolve) => {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        resolve(event.target?.result as string | undefined);
      };
      reader[method](file);
    });
  };
  const loadFileAsDataURL = (file: File) => loadFileAs(file, "readAsDataURL");
  // const loadFileAsArrayBuffer = (file: File) => loadFileAs(file, 'readAsArrayBuffer');
</script>

<script lang="ts">
  import { asset } from "$app/paths";
  import Button from "$lib/components/ui/button/Button.svelte";
  import LoadingOverlay from "./LoadingOverlay.svelte";
  import {
    getOpenCv,
    pixelate,
  } from "./utils";
  import type { Mat } from "@techstark/opencv-js";

  const accept = ["image/png", "image/jpeg", "image/webp"].join(",");

  /* oxlint-disable no-unassigned-vars */
  let canvas1: HTMLCanvasElement;
  let canvas2: HTMLCanvasElement;
  let canvas3: HTMLCanvasElement;
  let canvas4: HTMLCanvasElement;
  let canvas5: HTMLCanvasElement;
  let canvas6: HTMLCanvasElement;
  let canvas7: HTMLCanvasElement;
  let img: HTMLImageElement;
  let input: HTMLInputElement;
  /* oxlint-enable no-unassigned-vars */

  const initialFileName = "pikachu.png";
  let files = $state<FileList | undefined>(undefined);
  let loading = $state(true);
  const file = $derived(files?.[0]);
  const displayFileName = $derived(
    file
      ? file.name === initialFileName
        ? "Sample image - try uploading a different one!"
        : `Uploaded: ${file.name}`
      : "No file selected",
  );
  const imageSrc = $derived(
    file && file.type.startsWith("image/")
      // oxlint-disable-next-line
      ? await loadFileAsDataURL(file)
      : undefined,
  );

  const reset = async () => {
    const response = await fetch(asset(`/pixelation/${initialFileName}`));
    const blob = await response.blob();
    const newFile = new File([blob], initialFileName, { type: "image/webp" });
    const dt = new DataTransfer();
    dt.items.add(newFile);
    files = dt.files;
  };

  $effect(() => {
    if (!file) reset();
  });

  const updateCanvases = async () => {
    const { cv } = await getOpenCv();
    const cvimg = cv.imread(img);
    const result = pixelate(cvimg, cv);

    const matToImageData = (mat: Mat) => {
      const rgba = new cv.Mat();
      cv.cvtColor(mat, rgba, cv.COLOR_BGR2RGBA);
      const imageData = new ImageData(new Uint8ClampedArray(rgba.data), rgba.cols, rgba.rows);
      rgba.delete();
      return imageData;
    };

    const phaseData = [
      { canvas: canvas1, mat: result.phase1Preprocessed },
      { canvas: canvas2, mat: result.phase2Edges },
      { canvas: canvas3, mat: result.phase2Closed },
      { canvas: canvas4, mat: result.phase3MeshOverlaid },
      { canvas: canvas5, mat: result.phase3HomogeneousMeshOverlaid },
      { canvas: canvas6, mat: result.phase4Downsampled },
      { canvas: canvas7, mat: result.phase5Result },
    ];

    for (const { canvas, mat } of phaseData) {
      const imageData = matToImageData(mat);
      canvas.width = imageData.width;
      canvas.height = imageData.height;
      canvas.getContext("2d")?.putImageData(imageData, 0, 0);
    }

    for (const { mat } of phaseData) mat.delete();
  };

  $effect(() => {
    if (imageSrc) {
      loading = true;
      requestAnimationFrame(() => {
        requestAnimationFrame(async () => {
          await updateCanvases();
          loading = false;
        });
      });
    }
  });
</script>

<svelte:head>
  <title>Bitter Water - Pixelation</title>
</svelte:head>

<h1>Pixelation</h1>

<p>
  Transform any image into pixel art, no matter the resolution. Inspired by <a href="https://github.com/KennethJAllen/proper-pixel-art" target="_blank">proper-pixel-art</a>.
</p>

<LoadingOverlay message="Processing image..." loading={loading}/>

<div class={["pipeline", loading? "loading" : ""]}>
  <section class="stage" aria-labelledby="stage-input-heading">
    <header class="stage-header">
      <div class="stage-badge" aria-hidden="true">0</div>
      <div>
        <h2 id="stage-input-heading">Input Stage</h2>
        <p class="stage-desc">Original image to be pixelated</p>
      </div>
    </header>
    <div class="controls-row">
      <div class="controls">
        <Button size="sm" onclick={() => input.click()}>
          Upload
        </Button>
        <input bind:this={input} hidden {accept} type="file" bind:files />
        <Button size="sm" onclick={reset} disabled={file?.name === initialFileName}>
          Reset
        </Button>
      </div>
      <p class="filename">{displayFileName}</p>
    </div>
    <div class="phase-group single">
      <div class="phase">
        <div class="canvas-container">
          <img bind:this={img} src={imageSrc} alt="Original input" />
        </div>
      </div>
    </div>
  </section>

  <div class="flow-arrow">↓</div>

  <section class="stage" aria-labelledby="stage-detection-heading">
    <header class="stage-header">
      <div class="stage-badge" aria-hidden="true">1</div>
      <div>
        <h2 id="stage-detection-heading">Edge Detection Stage</h2>
        <p class="stage-desc">Preprocessing and edge detection</p>
      </div>
    </header>
    <div class="phase-group">
      <div class="phase" aria-label="Preprocessed Phase">
        <span class="label">Preprocessed</span>
        <div class="canvas-container">
          <canvas bind:this={canvas1}></canvas>
        </div>
      </div>
      <div class="phase" aria-label="Edges Phase">
        <span class="label">Edges</span>
        <div class="canvas-container">
          <canvas bind:this={canvas2}></canvas>
        </div>
      </div>
      <div class="phase" aria-label="Closed Phase">
        <span class="label">Closed</span>
        <div class="canvas-container">
          <canvas bind:this={canvas3}></canvas>
        </div>
      </div>
    </div>
  </section>

  <div class="flow-arrow">↓</div>

  <section class="stage" aria-labelledby="stage-mesh-heading">
    <header class="stage-header">
      <div class="stage-badge" aria-hidden="true">2</div>
      <div>
        <h2 id="stage-mesh-heading">Mesh Analysis Stage</h2>
        <p class="stage-desc">Line detection and homogenization</p>
      </div>
    </header>
    <div class="phase-group">
      <div class="phase" aria-label="Mesh Applied Phase">
        <span class="label">Mesh Applied</span>
        <div class="canvas-container">
          <canvas bind:this={canvas4}></canvas>
        </div>
      </div>
      <div class="phase" aria-label="Homogeneous Mesh Phase">
        <span class="label">Homogeneous Mesh</span>
        <div class="canvas-container">
          <canvas bind:this={canvas5}></canvas>
        </div>
      </div>
    </div>
  </section>

  <div class="flow-arrow">↓</div>

  <section class="stage final-stage" aria-labelledby="stage-result-heading">
    <header class="stage-header">
      <div class="stage-badge" aria-hidden="true">3</div>
      <div>
        <h2 id="stage-result-heading">Result Stage</h2>
        <p class="stage-desc">Downsampling to form the final pixel art</p>
      </div>
    </header>
    <div class="phase-group">
      <div class="phase" aria-label="Downsampled Phase">
        <span class="label">Downsampled</span>
        <div class="canvas-container">
          <canvas bind:this={canvas6}></canvas>
        </div>
      </div>
      <div class="phase highlight" aria-label="Upscaled Phase">
        <span class="label">Upscaled for Display</span>
        <div class="canvas-container">
          <canvas bind:this={canvas7}></canvas>
        </div>
      </div>
    </div>
  </section>
</div>

<style>
  .pipeline {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-2);
    margin-top: var(--space-4);
    margin-bottom: var(--space-8);
    width: 100%;
  }
  
  .pipeline.loading {
    display: none;
  }

  .stage {
    background: var(--surface-default);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-lg);
    padding: var(--space-6);
    box-shadow: var(--shadow-sm);
    width: 100%;
    box-sizing: border-box;
    display: grid;
    grid-gap: var(--space-5);
    transition: var(--duration-normal) var(--ease-in-out), box-shadow var(--duration-normal) var(--ease-in-out);
  }

  .stage:hover {
    box-shadow: var(--shadow-md);
    border-color: var(--border-focus);
  }

  .stage-header {
    margin: var(--space-0);
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }

  .stage-badge {
    background: var(--brand-100);
    color: var(--brand-700);
    font-family: var(--font-mono);
    font-weight: var(--font-bold);
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-full);
    font-size: var(--text-sm);
    flex-shrink: 0;
  }

  .stage h2 {
    font-family: var(--font-sans);
    font-size: var(--text-lg);
    color: var(--text-primary);
    margin: var(--space-0);
    line-height: var(--line-height-tight);
  }

  .stage-desc {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--text-secondary);
    margin: var(--space-0);
  }

  .controls-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-4);
    flex-wrap: wrap;
  }

  .controls {
    display: flex;
    gap: var(--space-2);
  }

  .filename {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--text-secondary);
    margin: 0;
  }

  .phase-group {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--space-3);
  }

  .phase-group.single {
    grid-template-columns: minmax(200px, 500px);
    justify-content: center;
  }

  .phase {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    background: var(--surface-raised);
    padding: var(--space-3);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-default);
  }

  .phase.highlight {
    border-color: var(--brand-400);
    background: var(--surface-default);
    box-shadow: 0 0 0 2px var(--brand-100);
  }

  .phase .label {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    font-weight: var(--font-medium);
    color: var(--text-primary);
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .phase .label::before {
    content: '';
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: var(--radius-full);
    background: var(--brand-400);
  }

  .phase .dimensions {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--text-secondary);
    text-align: center;
  }

  .canvas-container {
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--surface-overlay);
    border-radius: var(--radius-sm);
    overflow: hidden;
    border: 1px solid var(--border-default);
    background-image: linear-gradient(45deg, var(--gray-200) 25%, transparent 25%),
      linear-gradient(-45deg, var(--gray-200) 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, var(--gray-200) 75%),
      linear-gradient(-45deg, transparent 75%, var(--gray-200) 75%);
    background-size: 16px 16px;
    background-position: 0 0, 0 8px, 8px -8px, -8px 0px;
    min-height: 120px;
  }

  canvas, img {
    max-width: 100%;
    height: auto;
    object-fit: contain;
    display: block;
  }

  .flow-arrow {
    color: var(--brand-300);
    font-size: var(--text-lg);
    font-weight: var(--font-bold);
  }

  /* Dark mode adjustments */
  :global([data-theme='dark']) .canvas-container {
    background-image: linear-gradient(45deg, var(--gray-800) 25%, transparent 25%),
      linear-gradient(-45deg, var(--gray-800) 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, var(--gray-800) 75%),
      linear-gradient(-45deg, transparent 75%, var(--gray-800) 75%);
  }
  
</style>
