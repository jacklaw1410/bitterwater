<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect, userEvent, within } from 'storybook/test';
  import Header from './Header.svelte';

  const { Story } = defineMeta({
    title: 'Layout/Header',
    component: Header,
    tags: ['autodocs'],
  });
</script>

<Story
  name="Header"
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const logo = canvas.getByRole('link', { name: 'Bitter Water' });
    await expect(logo).toBeInTheDocument();
    await expect(logo).toHaveAttribute('href', '/');

    const home = canvas.getByRole('link', { name: 'Home' });
    await expect(home).toBeInTheDocument();
    await expect(home).toHaveAttribute('href', '/');

    const gallery = canvas.getByRole('link', { name: 'Gallery' });
    await expect(gallery).toBeInTheDocument();
    await expect(gallery).toHaveAttribute('href', '/gallery');

    const toggle = canvas.getByRole('button', { name: /toggle theme/i });
    await expect(toggle).toBeInTheDocument();

    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialIcon = isDarkMode ? '🌙' : '☀️';
    const toggledIcon = isDarkMode ? '☀️' : '🌙';

    await expect(toggle).toHaveTextContent(initialIcon);
    await userEvent.click(toggle);
    await expect(toggle).toHaveTextContent(toggledIcon);
    await userEvent.click(toggle);
    await expect(toggle).toHaveTextContent(initialIcon);
  }}
/>
