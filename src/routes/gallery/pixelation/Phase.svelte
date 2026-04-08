<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    label?: string;
    highlight?: boolean;
    children: Snippet;
  }

  let { label, children }: Props = $props();
</script>

<div class="phase" aria-label={label ? `${label} Phase` : undefined}>
  {#if label}
    <span class="label">{label}</span>
  {/if}
  <div class="canvas-container">
    {@render children()}
  </div>
</div>

<style>
  .phase {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    background: var(--surface-raised);
    padding: var(--space-3);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-default);
    max-width: 500px;
    height: fit-content;
  }

  .label {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    font-weight: var(--font-medium);
    color: var(--text-primary);
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .label::before {
    content: "";
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: var(--radius-full);
    background: var(--brand-400);
  }

  .canvas-container {
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--surface-default);
    border-radius: var(--radius-sm);
    overflow: hidden;
    border: 1px solid var(--border-default);
    background-image: linear-gradient(45deg, var(--surface-overlay) 25%, transparent 25%),
      linear-gradient(-45deg, var(--surface-overlay) 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, var(--surface-overlay) 75%),
      linear-gradient(-45deg, transparent 75%, var(--surface-overlay) 75%);
    background-size: 16px 16px;
    background-position: 0 0, 0 8px, 8px -8px, -8px 0px;
    min-height: 120px;
  }

  :global(.canvas-container canvas),
  :global(.canvas-container img) {
    width: auto;
    height: auto;
    max-width: 100%;
    object-fit: contain;
    display: block;
  }
</style>
