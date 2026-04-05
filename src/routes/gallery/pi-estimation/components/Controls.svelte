<script lang="ts">
  import PlayPauseToggle from '$lib/components/app/PlayPauseToggle.svelte';
  import Button from '$lib/components/ui/button/Button.svelte';
  import { state, reset } from '../state.svelte';
</script>

<div class="controls">
  <PlayPauseToggle bind:playing={state.playing} />
  <Button variant="secondary" size="sm" onclick={reset}>Reset</Button>
</div>

<style>
  .controls {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
</style>
