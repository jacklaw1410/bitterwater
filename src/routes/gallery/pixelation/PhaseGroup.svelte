<script lang="ts">
    import type { Snippet } from 'svelte';
    let { children }: { children: Snippet } = $props();
</script>

<div class="phase-group">
  {@render children()}
</div>

<style>
  .phase-group {
    display: grid;
    justify-items: center;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--space-3);
  }
</style>