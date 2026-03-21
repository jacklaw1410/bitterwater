<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import type { PlayFunction } from 'storybook/internal/types';
  import { expect, userEvent, within } from 'storybook/test';
  import FormControl from './FormControl.svelte';
  import Input from './Input.svelte';

  const { Story } = defineMeta({
    title: 'UI/FormControl',
    component: FormControl,
    tags: ['autodocs'],
  });

  const runTest: PlayFunction = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox');
    expect(input).toBeVisible();
    await userEvent.type(input, 'CoolUser99');
    expect(input).toHaveValue('CoolUser99');
  };
</script>

<Story
  name="Default"
  args={{
    id: 'email-1',
    label: 'Email Address',
    description: 'We will never share your email with anyone else.',
  }}
  play={runTest}
>
  <Input id="email-1" type="email" placeholder="Enter your email" />
</Story>

<Story
  name="With Error"
  args={{
    id: 'email-2',
    label: 'Email Address',
    error: 'Please enter a valid email address.',
  }}
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox');

    expect(input).toBeVisible();

    await userEvent.click(input);
    expect(input).toHaveFocus();

    await userEvent.type(input, 'hello@example.com');
    expect(input).toHaveValue('hello@example.com');
  }}
>
  <Input id="email-2" type="email" />
</Story>
