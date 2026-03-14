<script lang="ts">
  import type { Dart } from '../state.svelte';

  type Props = {
    darts: Dart[];
  };
  let { darts }: Props = $props();

  let canvas: HTMLCanvasElement;
  const size = 500;
  const radius = size / 2;

  $effect(() => {
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = 'hsl(210, 30%, 15%)';
    ctx.fillRect(0, 0, size, size);

    // Grid
    ctx.strokeStyle = 'hsla(210, 30%, 35%, 0.5)';
    ctx.lineWidth = 0.5;
    const step = 25;
    for (let i = step; i < size; i += step) {
      // vertical
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, size);
      ctx.stroke();
      // horizontal
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(size, i);
      ctx.stroke();
    }

    // Draw circle
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(radius, radius, radius - 2, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw darts
    for (const dart of darts) {
      ctx.fillStyle = dart.inCircle ? 'hsl(210, 100%, 70%)' : 'hsl(330, 70%, 50%)';
      ctx.beginPath();
      ctx.arc(dart.x * size, dart.y * size, 2.5, 0, 2 * Math.PI);
      ctx.fill();
    }
  });
</script>

<canvas bind:this={canvas} width={size} height={size}></canvas>
