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

    // Draw
    ctx.clearRect(0, 0, size, size);

    // Draw square
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, size, size);

    // Draw circle
    ctx.beginPath();
    ctx.arc(radius, radius, radius, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw darts
    for (const dart of darts) {
      ctx.fillStyle = dart.inCircle ? 'blue' : 'red';
      ctx.beginPath();
      ctx.arc(dart.x * size, dart.y * size, 2, 0, 2 * Math.PI);
      ctx.fill();
    }
  });
</script>

<canvas bind:this={canvas} width={size} height={size}></canvas>
