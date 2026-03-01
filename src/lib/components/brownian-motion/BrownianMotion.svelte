<script lang="ts">
  import type { Particle } from '$lib/utils/brownian-motion';

  let canvasElement: HTMLCanvasElement;
  let { particles }: { particles: Particle[] } = $props();

  $effect(() => {
    const ctx = canvasElement.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';

    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  });
</script>

<canvas bind:this={canvasElement} width={800} height={600}></canvas>

<style>
  canvas {
    border: 1px solid #ccc;
    display: block;
  }
</style>
