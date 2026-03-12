<script lang="ts">
  import { state, reset } from '../state.svelte';
</script>

<div class="controls">
  <button on:click={() => (state.isRunning = true)} disabled={state.isRunning}>Start</button>
  <button on:click={() => (state.isRunning = false)} disabled={!state.isRunning}>Stop</button>
  <button on:click={reset}>Reset</button>
</div>

<style>
  .controls {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }
</style>
