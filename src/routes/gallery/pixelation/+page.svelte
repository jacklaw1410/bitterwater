<script module lang="ts">
  export const metadata = {
    title: "Pixelation",
    description:
      "Transform any image into pixel art, no matter the resolution.",
  } as const;
</script>

<script lang="ts">
  import { asset } from "$app/paths";
  import Button from "$lib/components/ui/button/Button.svelte";
  import Typography from "$lib/components/ui/typography/Typography.svelte";
  import type { Mat } from "@techstark/opencv-js";
  import FlowArrow from "./FlowArrow.svelte";
  import LoadingOverlay from "./LoadingOverlay.svelte";
  import Phase from "./Phase.svelte";
  import PhaseGroup from "./PhaseGroup.svelte";
  import Stage from "./Stage.svelte";
  import { getOpenCv, loadFileAsDataURL, pixelate } from "./utils";

  const accept = [
    "image/png",
    "image/jpeg",
    "image/webp",
    "image/heic",
    "image/heif",
    "image/avif",
  ].join(",");

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
  let error = $state<string | undefined>(undefined);
  const file = $derived(files?.[0]);
  const displayFileName = $derived(
    file
      ? file.name === initialFileName
        ? "Sample image - try uploading a different one!"
        : `Uploaded: ${file.name}`
      : "No file selected",
  );
  let imageSrc = $state<string | undefined>(undefined);
  let resizedInfo = $state<string | undefined>(undefined);

  $effect(() => {
    if (!file || !file.type.startsWith("image/")) {
      imageSrc = undefined;
      error = undefined;
      resizedInfo = undefined;
      return;
    }
    error = undefined;
    loadFileAsDataURL(file).then((result) => {
      if (result) {
        imageSrc = result.src;
        error = undefined;
        resizedInfo = result.resized
          ? `Auto-resized from ${result.originalWidth}×${result.originalHeight}`
          : undefined;
      } else {
        error = `Could not load ${file.name}. Try a different file.`;
        resizedInfo = undefined;
      }
    });
  });

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

<div class={["pipeline", loading ? "loading" : ""]}>
  <Stage badge={0} heading="Input Stage" description="Original image to be pixelated">
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
      <p class="filename">{displayFileName} {#if resizedInfo}({resizedInfo}){/if}</p>
    </div>
    {#if error}<Typography variant="muted">{error}</Typography>{/if}
    <PhaseGroup>
      <Phase>
        <img bind:this={img} src={imageSrc} alt="Original input" />
      </Phase>
    </PhaseGroup>
  </Stage>

  <FlowArrow />

  <Stage badge={1} heading="Edge Detection Stage" description="Preprocessing and edge detection">
    <PhaseGroup>
      <Phase label="Preprocessed">
        <canvas bind:this={canvas1}></canvas>
      </Phase>
      <Phase label="Edges">
        <canvas bind:this={canvas2}></canvas>
      </Phase>
      <Phase label="Closed">
        <canvas bind:this={canvas3}></canvas>
      </Phase>
    </PhaseGroup>
  </Stage>

  <FlowArrow />

  <Stage badge={2} heading="Mesh Analysis Stage" description="Line detection and homogenization">
    <PhaseGroup>
      <Phase label="Mesh Applied">
        <canvas bind:this={canvas4}></canvas>
      </Phase>
      <Phase label="Homogeneous Mesh">
        <canvas bind:this={canvas5} data-thumbnail-target></canvas>
      </Phase>
    </PhaseGroup>
  </Stage>

  <FlowArrow />

  <Stage badge={3} heading="Result Stage" description="Downsampling to form the final pixel art">
    <PhaseGroup>
      <Phase label="Downsampled">
        <canvas bind:this={canvas6}></canvas>
      </Phase>
      <Phase label="Upscaled" highlight>
        <canvas bind:this={canvas7}></canvas>
      </Phase>
    </PhaseGroup>
  </Stage>
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
</style>
