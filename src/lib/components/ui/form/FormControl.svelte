<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import Label from './Label.svelte';
  import './FormControl.css';

  let {
    id,
    label,
    error,
    description,
    class: className = '',
    children,
    ...restProps
  }: {
    id: string;
    label: string;
    error?: string;
    description?: string;
  } & HTMLAttributes<HTMLDivElement> = $props();

  let classes = $derived(['ui-form-control', className]);
</script>

<div class={classes} {...restProps}>
  <Label for={id} class="ui-form-control__label">
    {label}
  </Label>

  {#if description}
    <p class="ui-form-control__description">
      {description}
    </p>
  {/if}

  <div class="ui-form-control__control">
    {@render children?.()}
  </div>

  {#if error}
    <p class="ui-form-control__error">
      {error}
    </p>
  {/if}
</div>
