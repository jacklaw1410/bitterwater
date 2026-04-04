<script lang="ts">
  import PlayPauseToggle from '$lib/components/app/PlayPauseToggle.svelte';
  import { state, reset } from '../state.svelte';
</script>

<div class="controls">
  <PlayPauseToggle bind:playing={state.playing} />
  <button onclick={reset}>Reset</button>
</div>

<style>
  .controls {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
</style>
