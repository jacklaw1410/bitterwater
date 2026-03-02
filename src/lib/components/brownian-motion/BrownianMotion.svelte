<script lang="ts">
  import type { Particle } from '$lib/utils/brownian-motion';

  let canvasElement: HTMLCanvasElement;
  let {
    particles,
    showTrails,
    particleSize,
    particleColor,
    width,
    height,
  }: { particles: Particle[]; showTrails: boolean; particleSize: number; particleColor: string; width: number; height: number } =
    $props();

  $effect(() => {
    const ctx = canvasElement.getContext('2d');
    if (!ctx) return;
    const { width, height } = canvasElement;

    if (showTrails) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(0, 0, width, height);
    } else {
      ctx.clearRect(0, 0, width, height);
    }

    for (const p of particles) {
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, particleSize * 2);
      gradient.addColorStop(0, `${particleColor}ff`);
      gradient.addColorStop(0.2, `${particleColor}99`);
      gradient.addColorStop(1, `${particleColor}00`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(p.x, p.y, particleSize * 2, 0, Math.PI * 2);
      ctx.fill();
    }
  });
</script>

<canvas bind:this={canvasElement} width={width} height={height}></canvas>

<style>
  canvas {
    border: 1px solid #ccc;
    display: block;
  }
</style>
