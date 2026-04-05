<script lang="ts">
  import { Button as BitsButton } from 'bits-ui';
  import type { ButtonRootProps } from 'bits-ui';
  import './Button.css';

  type ButtonVariant = 'primary' | 'secondary' | 'ghost';
  type ButtonSize = 'sm' | 'md' | 'lg';

  export type ButtonProps = {
    variant?: ButtonVariant;
    size?: ButtonSize;
  } & ButtonRootProps;

  let {
    variant = 'primary',
    size = 'md',
    class: className = '',
    children,
    ...restProps
  }: ButtonProps = $props();

  let classes = $derived(['ui-button', `ui-button--${variant}`, `ui-button--${size}`, className]);
</script>

<BitsButton.Root class={classes} {...restProps}>
  {@render children?.()}
</BitsButton.Root>
