<script lang="ts">
  import PlayPauseToggle from '$lib/components/app/PlayPauseToggle.svelte';

  type Props = {
    particleCount: number;
    speed: number;
    particleSize: number;
    particleColor: string;
    showTrails: boolean;
    playing: boolean;
    width: number;
    height: number;
    onreset: () => void;
  };

  let {
    particleCount = $bindable(100),
    speed = $bindable(2),
    particleSize = $bindable(2),
    particleColor = $bindable('#000000'),
    showTrails = $bindable(true),
    playing = $bindable(true),
    width = $bindable(800),
    height = $bindable(600),
    onreset,
  }: Props = $props();
</script>

<div class="controls">
  <div class="layer">
    <PlayPauseToggle bind:playing />
    <button style="margin-right: 1em;" onclick={onreset}>Reset</button>
    <label>
      Width:
      <input type="number" bind:value={width} min={100} max={2000} aria-label="Canvas width" />
    </label>
    <label>
      Height:
      <input type="number" bind:value={height} min={100} max={2000} aria-label="Canvas height" />
    </label>
  </div>

  <div class="layer">
    <label>
      Particles: {particleCount}
      <input
        type="range"
        bind:value={particleCount}
        min={10}
        max={500}
        aria-label="Number of particles"
      />
    </label>

    <label>
      Speed: {speed.toFixed(1)}
      <input
        type="range"
        bind:value={speed}
        min={0.5}
        max={10}
        step={0.1}
        aria-label="Particle speed"
      />
    </label>

    <label>
      Size: {particleSize}
      <input type="range" bind:value={particleSize} min={1} max={6} aria-label="Particle size" />
    </label>

    <label>
      Color:
      <input type="color" bind:value={particleColor} aria-label="Particle color" />
    </label>

    <label>
      Show Trails:
      <input type="checkbox" bind:checked={showTrails} aria-label="Show trails" />
    </label>
  </div>
</div>

<style>
  .layer {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  .controls {
    margin-bottom: 1rem;
    display: flex;
    gap: 1rem;
    align-items: center;
    flex-wrap: wrap;
  }
</style>
