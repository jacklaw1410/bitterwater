<!-- src/lib/components/PlayPauseToggle.stories.svelte -->
<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import PlayPauseToggle from './PlayPauseToggle.svelte';
  import { expect, fn, within } from 'storybook/test';

  const { Story } = defineMeta({
    title: 'Components/PlayPauseToggle',
    component: PlayPauseToggle,
    tags: ['autodocs'],
    argTypes: {
      playing: { control: 'boolean' },
      disabled: { control: 'boolean' },
    },
    args: {
      onplay: fn(),
      onpause: fn(),
    },
  });
</script>

<Story
  name="Paused"
  args={{ playing: false, disabled: false }}
  play={async ({ args, canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Play' });
    await expect(button).toBeVisible();
    await expect(button).toBeEnabled();
    await userEvent.click(button);
    await expect(canvas.getByRole('button', { name: 'Pause' })).toBeVisible();
    await expect(args.onplay).toHaveBeenCalledTimes(1);
    await expect(args.onpause).toHaveBeenCalledTimes(0);

    await userEvent.click(button);
    await expect(canvas.getByRole('button', { name: 'Play' })).toBeVisible();
    await userEvent.tab();
    await expect(args.onplay).toHaveBeenCalledTimes(1);
    await expect(args.onpause).toHaveBeenCalledTimes(1);
  }}
/>

<Story
  name="Playing"
  args={{ playing: true, disabled: false }}
  play={async ({ args, canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Pause' });
    await expect(button).toBeVisible();
    await expect(button).toBeEnabled();
    await userEvent.click(button);
    await expect(canvas.getByRole('button', { name: 'Play' })).toBeVisible();
    await expect(args.onplay).toHaveBeenCalledTimes(0);
    await expect(args.onpause).toHaveBeenCalledTimes(1);

    await userEvent.click(button);
    await expect(canvas.getByRole('button', { name: 'Pause' })).toBeVisible();
    await userEvent.tab();
    await expect(args.onplay).toHaveBeenCalledTimes(1);
    await expect(args.onpause).toHaveBeenCalledTimes(1);
  }}
/>

<Story
  name="Disabled"
  args={{ playing: false, disabled: true }}
  play={async ({ args, canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Play' });
    await expect(button).toBeVisible();
    await expect(button).toBeDisabled();
    await userEvent.click(button);
    await expect(canvas.getByRole('button', { name: 'Play' })).toBeVisible();
    await expect(args.onplay).toHaveBeenCalledTimes(0);
    await expect(args.onpause).toHaveBeenCalledTimes(0);
  }}
/>
