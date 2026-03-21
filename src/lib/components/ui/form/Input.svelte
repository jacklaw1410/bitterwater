<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';
  import './Input.css';

  let {
    value = $bindable(''),
    class: className = '',
    ...restProps
  }: {
    value?: string | number | string[] | undefined | null;
  } & Omit<HTMLInputAttributes, 'value'> = $props();

  let classes = $derived(['ui-input', className]);
</script>

<input bind:value class={classes} {...restProps} />
