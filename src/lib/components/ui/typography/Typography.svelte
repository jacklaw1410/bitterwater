<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import './Typography.css';

  // Semantic variants map closer to UI intention than raw HTML tags
  type TypographyVariant =
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'lead'
    | 'body'
    | 'large'
    | 'small'
    | 'muted';

  let {
    variant = 'body',
    class: className = '',
    children,
    ...restProps
  }: {
    variant?: TypographyVariant;
  } & HTMLAttributes<HTMLElement> = $props();

  let tag = $derived.by(() => {
    switch (variant) {
      case 'h1':
        return 'h1';
      case 'h2':
        return 'h2';
      case 'h3':
        return 'h3';
      case 'h4':
        return 'h4';
      case 'lead':
        return 'p';
      case 'large':
        return 'div';
      case 'small':
        return 'small';
      case 'muted':
        return 'p';
      default:
        return 'p';
    }
  });

  let classes = $derived(['ui-typography', `ui-typography--${variant}`, className]);
</script>

{#if tag === 'h1'}
  <h1 class={classes} {...restProps}>{@render children?.()}</h1>
{:else if tag === 'h2'}
  <h2 class={classes} {...restProps}>{@render children?.()}</h2>
{:else if tag === 'h3'}
  <h3 class={classes} {...restProps}>{@render children?.()}</h3>
{:else if tag === 'h4'}
  <h4 class={classes} {...restProps}>{@render children?.()}</h4>
{:else if tag === 'p'}
  <p class={classes} {...restProps}>{@render children?.()}</p>
{:else if tag === 'small'}
  <small class={classes} {...restProps}>{@render children?.()}</small>
{:else if tag === 'div'}
  <div class={classes} {...restProps}>{@render children?.()}</div>
{:else}
  <span class={classes} {...restProps}>{@render children?.()}</span>
{/if}
