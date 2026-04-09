<script module lang="ts">
  export const metadata = {
    title: 'CSS Paint',
    description: 'Exploring CSS Painting API for programmable backgrounds.',
  } as const;
</script>

<script lang="ts">
  import Typography from '$lib/components/ui/typography/Typography.svelte';
  import { browser } from '$app/environment';
  import workletUrl from './painter.js?url';

  
  const supported = browser && 'paintWorklet' in window.CSS;

  $effect(() => {
    if (supported) {
      window.CSS.paintWorklet.addModule(workletUrl);
    }
  });
</script>

<svelte:head>
  <title>Bitter Water - CSS Paint</title>
</svelte:head>

<div>
  <Typography variant="h1">CSS Paint API</Typography>

  <Typography variant="body">
    The <a href="https://developer.mozilla.org/en-US/docs/Web/API/CSS_Painting_API" target="_blank"
      >CSS Painting API</a
    > allows developers to write JavaScript functions that draw directly into an element's background,
    border, or content. Paint worklets are resolution-independent, run off the main thread, and can
    be parameterized using CSS Custom Properties.
  </Typography>

  {#if supported}
    <div class="gallery">
      <section class="example" aria-labelledby="checkerboard">
        <div>
          <Typography id="checkerboard" variant="h3">Checkerboard</Typography>
          <Typography variant="small">
            <code>background: paint(checkerboard)</code> — draws a checkerboard pattern with size and colours controlled by properties.
          </Typography>
        </div>
        <div class="showcase">
          <div class="paint-box checkerboard"></div>
          <div class="paint-box checkerboard"></div>
          <div class="paint-box checkerboard" data-thumbnail-target></div>
        </div>
      </section>

      <section class="example" aria-labelledby="punch-hole">
        <div>
          <Typography id="punch-hole" variant="h3">Punch hole</Typography>
          <Typography variant="small">
            <code>background: paint(punch-hole)</code> — uses geometry to draw an aspect-ratio-aware circle.
          </Typography>
        </div>
        <div class="showcase">
          <div class="paint-box punch-hole"></div>
          <div class="paint-box punch-hole"></div>
          <div class="paint-box punch-hole"></div>
        </div>
      </section>

      <section class="example" aria-labelledby="circle">
        <div>
          <Typography id="circle" variant="h3">Circle</Typography>
          <Typography variant="small">
            <code>background: paint(circle)</code> — uses geometry to draw an aspect-ratio-aware circle.
          </Typography>
        </div>
        <div class="showcase">
          <div class="paint-box circle"></div>
          <div class="paint-box circle"></div>
          <div class="paint-box circle"></div>
        </div>
      </section>
    </div>
  {:else}
    <div class="unsupported">
      <Typography variant="h3">Not Supported</Typography>
      <Typography variant="body">
        Your browser does not support the CSS Paint API. Try Chrome, Edge, or Opera.
      </Typography>
    </div>
  {/if}
</div>

<style>
  .gallery {
    display: grid;
    gap: var(--space-4);
  }

  .example {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    padding: 0 var(--space-4) var(--space-4);
    background: var(--surface-default);
    border-radius: var(--radius-md);
    border: var(--border-width-thin) solid var(--border-default);
  }

  .showcase {
    display: grid;
    grid-template-columns: repeat(3, 33.33%);
  }

  .paint-box {
    aspect-ratio: 1;
    border-radius: var(--radius-sm);
    border: var(--border-width-thin) solid var(--border-default);

    &.checkerboard {
      background: paint(checkerboard);

      &:nth-child(1) {
        --checker-color-1: #e5e7eb;
        --checker-color-2: #ffffff;
        --checker-size: 8;
      }
      
      &:nth-child(2) {
        --checker-color-1: #fee2e2;
        --checker-color-2: #fecaca;
        --checker-size: 20;
      }
      
      &:nth-child(3) {
        --checker-color-1: #dbeafe;
        --checker-color-2: #bfdbfe;
        --checker-size: 40;
      }
    }

    &.punch-hole {
      background: paint(punch-hole);

      &:nth-child(1) {
        background-color: unset;
        --punch-hole-bg: #06b6d4;
        --punch-hole-size: 16px;
      }

      &:nth-child(2) {
        background-color: #fdf2f8;
        --punch-hole-bg: #ec4899;
        --punch-hole-size: 32px;
      }

      &:nth-child(3) {
        background-color: #fff1f2;
        --punch-hole-bg: #f43f5e;
        --punch-hole-size: 48px;
      }
    }

    &.circle {
      background: paint(circle);

      &:nth-child(1) {
        --circle-color: #3b82f6;
        aspect-ratio: 1;
      }

      &:nth-child(2) {
        --circle-color: #8b5cf6;
        aspect-ratio: 16/9;
      }

      &:nth-child(3) {
        --circle-color: #10b981;
        aspect-ratio: 2/3;
      }
    }
  }

  .unsupported {
    padding: var(--space-6);
    background: var(--status-error);
    border-radius: var(--radius-md);
    text-align: center;
  }
</style>