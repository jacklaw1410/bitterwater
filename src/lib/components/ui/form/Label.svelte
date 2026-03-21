<script lang="ts">
  import { Label as BitsLabel } from 'bits-ui';
  import type { LabelRootProps } from 'bits-ui';
  import type { Snippet } from 'svelte';
  import './Label.css';

  let {
    class: className = '',
    children,
    ...restProps
  }: {
    class?: string;
    children?: Snippet;
  } & LabelRootProps = $props();

  let classes = $derived(['ui-label', className]);
</script>

<BitsLabel.Root class={classes} {...restProps}>
  {@render children?.()}
</BitsLabel.Root>
