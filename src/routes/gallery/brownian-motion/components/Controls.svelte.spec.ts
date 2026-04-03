import { cleanup, render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vite-plus/test';
import Controls from './Controls.svelte';

afterEach(() => cleanup());
describe('Controls.svelte', () => {
  it('renders controls with default values', () => {
    render(Controls, {
      particleCount: 100,
      speed: 2,
      particleSize: 2,
      particleColor: '#000000',
      showTrails: true,
      playing: true,
      width: 800,
      height: 600,
      onreset: () => {},
    });
    expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument();
    expect(screen.getByLabelText(/Number of particles/)).toHaveValue('100');
    expect(screen.getByLabelText(/Particle speed/)).toHaveValue('2');
    expect(screen.getByLabelText(/Particle size/)).toHaveValue('2');
    expect(screen.getByLabelText(/Particle color/)).toHaveValue('#000000');
    expect(screen.getByLabelText(/Show trails/)).toBeChecked();
  });

  it('fires the reset event when the reset button is clicked', async () => {
    const onResetMock = vi.fn();
    render(Controls, {
      particleCount: 100,
      speed: 2,
      particleSize: 2,
      particleColor: '#000000',
      showTrails: true,
      playing: true,
      width: 800,
      height: 600,
      onreset: onResetMock,
    });
    await userEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(onResetMock).toHaveBeenCalled();
  });
});
