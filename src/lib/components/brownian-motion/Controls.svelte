<script lang="ts">
  let {
    particleCount = $bindable(100),
    speed = $bindable(2),
    isPlaying = $bindable(true),
    onreset,
  } = $props<{
    particleCount?: number;
    speed?: number;
    isPlaying?: boolean;
    onreset: () => void;
  }>();
</script>

<div class="controls">
  <button onclick={() => (isPlaying = !isPlaying)}>{isPlaying ? 'Pause' : 'Play'}</button>
  <button onclick={onreset}>Reset</button>

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
</div>

<style>
  .controls {
    margin-bottom: 1rem;
    display: flex;
    gap: 1rem;
    align-items: center;
    flex-wrap: wrap;
  }
</style>
