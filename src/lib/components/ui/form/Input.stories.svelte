<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import type { PlayFunction } from 'storybook/internal/types';
  import { expect, userEvent, within } from 'storybook/test';
  import Input from './Input.svelte';

  const { Story } = defineMeta({
    title: 'UI/Input',
    component: Input,
    tags: ['autodocs'],
  });

  const runTest: PlayFunction = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox');

    expect(input).toBeVisible();

    await userEvent.click(input);
    expect(input).toHaveFocus();

    await userEvent.type(input, 'Hello World');
    expect(input).toHaveValue('Hello World');
  };
</script>

<Story name="Default" args={{ placeholder: 'Enter text here...' }} play={runTest} />

<Story
  name="Disabled"
  args={{ disabled: true, placeholder: 'Disabled input' }}
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox');

    expect(input).toBeVisible();
    expect(input).toBeDisabled();
  }}
/>
