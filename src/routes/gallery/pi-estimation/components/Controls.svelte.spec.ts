import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { state } from '../state.svelte';
import Controls from './Controls.svelte';

describe('Controls.svelte', () => {
  it('renders buttons and handles clicks', async () => {
    const user = userEvent.setup();

    render(Controls);

    let playButton = screen.queryByRole('button', { name: 'Play' });
    let pauseButton = screen.queryByRole('button', { name: 'Pause' });
    let resetButton = screen.queryByRole('button', { name: 'Reset' });

    expect(playButton).toBeVisible();
    expect(playButton).toBeEnabled();
    expect(pauseButton).not.toBeInTheDocument();
    expect(resetButton).toBeVisible();
    expect(resetButton).toBeEnabled();

    await user.click(playButton!);

    playButton = screen.queryByRole('button', { name: 'Play' });
    pauseButton = screen.queryByRole('button', { name: 'Pause' });
    resetButton = screen.queryByRole('button', { name: 'Reset' });

    expect(state.playing).toBe(true);
    expect(playButton).not.toBeInTheDocument();
    expect(pauseButton).toBeVisible();
    expect(pauseButton).toBeEnabled();
    expect(resetButton).toBeVisible();
    expect(resetButton).toBeEnabled();

    await user.click(pauseButton!);

    playButton = screen.queryByRole('button', { name: 'Play' });
    pauseButton = screen.queryByRole('button', { name: 'Pause' });
    resetButton = screen.queryByRole('button', { name: 'Reset' });

    expect(state.playing).toBe(false);
    expect(playButton).toBeVisible();
    expect(playButton).toBeEnabled();
    expect(pauseButton).not.toBeInTheDocument();
    expect(resetButton).toBeVisible();
    expect(resetButton).toBeEnabled();

    await user.click(resetButton!);

    playButton = screen.queryByRole('button', { name: 'Play' });
    pauseButton = screen.queryByRole('button', { name: 'Pause' });
    resetButton = screen.queryByRole('button', { name: 'Reset' });

    expect(state.playing).toBe(false);
    expect(playButton).toBeVisible();
    expect(playButton).toBeEnabled();
    expect(pauseButton).not.toBeInTheDocument();
    expect(resetButton).toBeVisible();
    expect(resetButton).toBeEnabled();
  });
});
