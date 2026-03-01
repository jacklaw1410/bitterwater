import { render, screen, cleanup } from '@testing-library/svelte';
import { describe, it, expect, vi, afterEach } from 'vitest';
import Controls from './Controls.svelte';
import userEvent from '@testing-library/user-event';

afterEach(() => cleanup());

describe('Controls.svelte', () => {
  it('renders controls with default values', () => {
    render(Controls, { onreset: () => {} });
    expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument();
    expect(screen.getByLabelText(/Number of particles/)).toHaveValue('100');
    expect(screen.getByLabelText(/Particle speed/)).toHaveValue('2');
  });

  it('fires the reset event when the reset button is clicked', async () => {
    const onResetMock = vi.fn();
    render(Controls, { onreset: onResetMock });
    await userEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(onResetMock).toHaveBeenCalled();
  });
});
