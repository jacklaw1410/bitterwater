import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { state } from '../state.svelte';
import Controls from './Controls.svelte';

describe('Controls.svelte', () => {
  it('renders buttons and handles clicks', async () => {
    const user = userEvent.setup();

    render(Controls);

    const startButton = screen.getByRole('button', { name: 'Start' });
    const stopButton = screen.getByRole('button', { name: 'Stop' });
    const resetButton = screen.getByRole('button', { name: 'Reset' });

    expect(startButton).toBeVisible();
    expect(startButton).toBeEnabled();
    expect(stopButton).toBeVisible();
    expect(stopButton).toBeDisabled();
    expect(resetButton).toBeVisible();
    expect(resetButton).toBeEnabled();

    await user.click(startButton);
    expect(state.isRunning).toBe(true);
    expect(startButton).toBeDisabled();
    expect(stopButton).toBeEnabled();
    expect(resetButton).toBeEnabled();

    await user.click(stopButton);
    expect(state.isRunning).toBe(false);
    expect(startButton).toBeEnabled();
    expect(stopButton).toBeDisabled();
    expect(resetButton).toBeEnabled();

    await user.click(resetButton);
    expect(state.isRunning).toBe(false);
    expect(startButton).toBeEnabled();
    expect(stopButton).toBeDisabled();
    expect(resetButton).toBeEnabled();
  });
});
