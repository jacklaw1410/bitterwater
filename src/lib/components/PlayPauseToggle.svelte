<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';
  type Props = {
    playing?: boolean;
  } & HTMLButtonAttributes;

  const size = 24;

  let { playing = $bindable(false), ...props }: Props = $props();
  const toggle = () => {
    playing = !playing;
  };
</script>

<button
  type="button"
  onclick={toggle}
  aria-label={playing ? 'Pause' : 'Play'}
  style:--icon-size={size}
  {...props}
>
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    {#if playing}
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    {:else}
      <path d="M8 5v14l11-7z" />
    {/if}
  </svg>
</button>

<style>
  button {
    background: none;
    border: none;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-primary);
    transition: color 0.2s ease;
  }

  button:hover:not(:disabled),
  button:focus:not(:disabled) {
    color: var(--color-primary-accent);

    outline: none;
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
</style>
