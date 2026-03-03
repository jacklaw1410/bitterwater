import { render, screen, cleanup } from '@testing-library/svelte';
import { describe, it, expect, afterEach } from 'vitest';
import Header from './Header.svelte';
import userEvent from '@testing-library/user-event';

afterEach(() => cleanup());
describe('Header.svelte', () => {
  it('renders Header with navigation links and theme toggle', async () => {
    render(Header);

    const logo = screen.getByRole('link', { name: 'Svelte 101' });
    expect(logo).toBeInTheDocument();
    expect(logo).toBeVisible();
    expect(logo).toHaveAttribute('href', '/');

    const home = screen.getByRole('link', { name: 'Home' });
    expect(home).toBeInTheDocument();
    expect(home).toBeVisible();
    expect(home).toHaveAttribute('href', '/');

    const brownianMotion = screen.getByRole('link', { name: 'Brownian Motion' });
    expect(brownianMotion).toBeInTheDocument();
    expect(brownianMotion).toBeVisible();
    expect(brownianMotion).toHaveAttribute('href', '/brownian-motion');

    const toggle = screen.getByRole('button', { name: /toggle theme/i });
    expect(toggle).toBeInTheDocument();
    expect(toggle).toHaveTextContent('☀️');
    await userEvent.click(toggle);
    expect(toggle).toHaveTextContent('🌙');
  });
});
