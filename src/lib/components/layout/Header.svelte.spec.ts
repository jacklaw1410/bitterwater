import { render, screen, cleanup } from '@testing-library/svelte';
import { describe, it, expect, vi, afterEach } from 'vitest';
import Header from './Header.svelte';
import userEvent from '@testing-library/user-event';

afterEach(() => cleanup());
describe('Header.svelte', () => {
  it('renders Header', () => {
    render(Header);

    const header = screen.getByRole('link', { name: 'Svelte 101' });
    expect(header).toBeInTheDocument();
    expect(header).toBeVisible();
    expect(header).toHaveAttribute('href', '/');

    const home = screen.getByRole('link', { name: 'Home' });
    expect(home).toBeInTheDocument();
    expect(home).toBeVisible();
    expect(home).toHaveAttribute('href', '/');

    const brownianMotion = screen.getByRole('link', { name: 'Brownian Motion' });
    expect(brownianMotion).toBeInTheDocument();
    expect(brownianMotion).toBeVisible();
    expect(brownianMotion).toHaveAttribute('href', '/brownian-motion');
  });
});
