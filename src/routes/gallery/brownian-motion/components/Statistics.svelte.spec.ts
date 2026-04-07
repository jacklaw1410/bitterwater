import { cleanup, render, screen, within } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vite-plus/test';

import type { Particle } from '../utils';
import Statistics from './Statistics.svelte';

afterEach(() => cleanup());
describe('Statistics.svelte', () => {
  it('renders Statistics', () => {
    const particles: Particle[] = [
      { x: 10, y: 10, vx: 1, vy: 1, size: 2, color: '#000' },
      { x: 20, y: 20, vx: 2, vy: 2, size: 4, color: '#fff' },
      { x: 30, y: 30, vx: 3, vy: 3, size: 6, color: '#ccc' },
    ];
    render(Statistics, { particles });

    const positionTable = screen.getByRole('table', {
      name: 'Position statistics',
    });
    expect(positionTable).toBeInTheDocument();
    expect(positionTable).toBeVisible();
    const positionCells = within(positionTable).getAllByRole('cell');
    expect(positionCells).toHaveLength(4);
    const [xHeader, xValue, yHeader, yValue] = positionCells.map((cell) => cell.textContent);
    expect(xHeader).toEqual('x');
    expect(xValue).toEqual('20.0000');
    expect(yHeader).toEqual('y');
    expect(yValue).toEqual('20.0000');

    const velocityTable = screen.getByRole('table', {
      name: 'Velocity statistics',
    });
    expect(velocityTable).toBeInTheDocument();
    expect(velocityTable).toBeVisible();
    const velocityCells = within(velocityTable).getAllByRole('cell');
    expect(velocityCells).toHaveLength(6);
    const [vxHeader, vxValue, vyHeader, vyValue, vHeader, vValue] = velocityCells.map(
      (cell) => cell.textContent,
    );
    expect(vxHeader).toEqual('vx');
    expect(vxValue).toEqual('2.0000');
    expect(vyHeader).toEqual('vy');
    expect(vyValue).toEqual('2.0000');
    expect(vHeader).toEqual('v');
    expect(vValue).toEqual('2.8284');
  });
});
