<script lang="ts">
  type Props = {
    particleCount: number;
    speed: number;
    particleSize: number;
    particleColor: string;
    showTrails: boolean;
    isPlaying: boolean; // Re-introducing isPlaying as a bindable prop
    onreset: () => void;
  };

  // Using `let` for bindable props allows them to be updated by the parent
  // and allows internal modification when handled by a function.
  let {
    particleCount = $bindable(100),
    speed = $bindable(2),
    particleSize = $bindable(2),
    particleColor = $bindable('#000000'),
    showTrails = $bindable(true),
    isPlaying = $bindable(true), // Now a bindable prop with a default
    onreset,
  }: Props = $props(); // Correct type annotation for $props()

  // Encapsulate the toggle logic to ensure correct mutation of the bindable prop
  function togglePlayPause() {
    isPlaying = !isPlaying; // This directly updates the bindable prop
  }
</script>

<div class="controls">
  <button onclick={togglePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
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

<style>
  .controls {
    margin-bottom: 1rem;
    display: flex;
    gap: 1rem;
    align-items: center;
    flex-wrap: wrap;
  }
</style>
