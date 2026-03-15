<script module lang="ts">
  export const metadata = {
    title: 'Brownian Motion',
    description:
      'Interactive particle simulation demonstrating Brownian motion with customizable parameters.',
  } as const;
</script>

<script lang="ts">
  import BrownianMotion from './components/BrownianMotion.svelte';
  import Controls from './components/Controls.svelte';
  import Statistics from './components/Statistics.svelte';
  import { state, initializeEffects, reset } from './state.svelte.js';

  initializeEffects();
</script>

<svelte:head>
  <title>Bitter Water - Brownian Motion</title>
</svelte:head>

<h1>Brownian Motion Visualizer</h1>

<Controls
  bind:particleCount={state.particleCount}
  bind:speed={state.speed}
  bind:particleSize={state.particleSize}
  bind:particleColor={state.particleColor}
  bind:showTrails={state.showTrails}
  bind:isPlaying={state.isPlaying}
  bind:width={state.width}
  bind:height={state.height}
  onreset={reset}
/>
<Statistics particles={state.particles} />
<BrownianMotion
  particles={state.particles}
  width={state.width}
  height={state.height}
  showTrails={state.showTrails}
  particleSize={state.particleSize}
  particleColor={state.particleColor}
/>
