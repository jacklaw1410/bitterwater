<!-- src/lib/components/PlayPauseToggle.stories.svelte -->
<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import PlayPauseToggle from './PlayPauseToggle.svelte';
  import { expect, within } from 'storybook/test';

  const { Story } = defineMeta({
    title: 'Components/PlayPauseToggle',
    component: PlayPauseToggle,
    tags: ['autodocs'],
    argTypes: {
      playing: { control: 'boolean' },
      disabled: { control: 'boolean' },
    },
  });
</script>

<Story
  name="Paused"
  args={{ playing: false, disabled: false }}
  play={async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Play' });
    await expect(button).toBeVisible();
    await expect(button).toBeEnabled();
    await userEvent.click(button);
    await expect(canvas.getByRole('button', { name: 'Pause' })).toBeVisible();
    await userEvent.click(button);
    await expect(canvas.getByRole('button', { name: 'Play' })).toBeVisible();
    await userEvent.tab();
  }}
/>

<Story
  name="Playing"
  args={{ playing: true, disabled: false }}
  play={async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Pause' });
    await expect(button).toBeVisible();
    await expect(button).toBeEnabled();
    await userEvent.click(button);
    await expect(canvas.getByRole('button', { name: 'Play' })).toBeVisible();
    await userEvent.click(button);
    await expect(canvas.getByRole('button', { name: 'Pause' })).toBeVisible();
    await userEvent.tab();
  }}
/>

<Story
  name="Disabled"
  args={{ playing: false, disabled: true }}
  play={async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Play' });
    await expect(button).toBeVisible();
    await expect(button).toBeDisabled();
    await userEvent.click(button);
    await expect(canvas.getByRole('button', { name: 'Play' })).toBeVisible();
  }}
/>
