<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { userEvent, within, expect, fn } from 'storybook/test';
  import Button from './Button.svelte';
  import type { PlayFunction } from 'storybook/internal/csf';

  const { Story } = defineMeta({
    title: 'UI/Button',
    component: Button,
    tags: ['autodocs'],
    args: {
      onclick: fn(),
    },
    argTypes: {
      variant: {
        control: { type: 'select' },
        options: ['primary', 'secondary', 'ghost'],
      },
      size: {
        control: { type: 'select' },
        options: ['sm', 'md', 'lg'],
      },
      disabled: { control: 'boolean' },
    },
  });

  const runActiveButtonTest: PlayFunction = async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');

    expect(button).toBeVisible();

    await userEvent.tab();
    expect(button).toHaveFocus();

    await userEvent.click(button);
    expect(args.onclick).toHaveBeenCalled();

    await userEvent.tab();
  };
</script>

<Story name="Primary" args={{ variant: 'primary' }} play={runActiveButtonTest}>Primary Button</Story
>

<Story name="Secondary" args={{ variant: 'secondary' }} play={runActiveButtonTest}
  >Secondary Button</Story
>

<Story name="Ghost" args={{ variant: 'ghost' }} play={runActiveButtonTest}>Ghost Button</Story>

<Story name="Small" args={{ size: 'sm' }} play={runActiveButtonTest}>Small Button</Story>

<Story name="Large" args={{ size: 'lg' }} play={runActiveButtonTest}>Large Button</Story>

<Story
  name="Disabled"
  args={{ disabled: true }}
  play={async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');

    expect(button).toBeVisible();
    expect(button).toBeDisabled();

    await userEvent.click(button);
    expect(args.onclick).not.toHaveBeenCalled();
  }}
>
  Disabled Button
</Story>
