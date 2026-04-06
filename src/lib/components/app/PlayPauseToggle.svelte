<script lang="ts">
  import Button from '$lib/components/ui/button/Button.svelte';

  import type { HTMLButtonAttributes, MouseEventHandler } from 'svelte/elements';
  type Props = {
    playing?: boolean;
    onplay?: MouseEventHandler<HTMLButtonElement>;
    onpause?: MouseEventHandler<HTMLButtonElement>;
  } & Omit<HTMLButtonAttributes, 'onclick'>;

  const size = 24;

  let { playing = $bindable(false), ...props }: Props = $props();
  const onclick: MouseEventHandler<HTMLButtonElement> = (event) => {
    playing = !playing;
    if (playing) {
      props.onplay?.(event);
    } else {
      props.onpause?.(event);
    }
  };
</script>

<Button
  variant="ghost"
  size="sm"
  onclick={onclick}
  aria-label={playing ? 'Pause' : 'Play'}
  {...props}
>
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    {#if playing}
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    {:else}
      <path d="M8 5v14l11-7z" />
    {/if}
  </svg>
</Button>
