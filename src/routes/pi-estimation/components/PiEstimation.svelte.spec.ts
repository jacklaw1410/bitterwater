import { render } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PiEstimation from './PiEstimation.svelte';
import type { Dart } from '../state.svelte';

const mockContext = {
  clearRect: vi.fn(),
  fillRect: vi.fn(),
  strokeRect: vi.fn(),
  beginPath: vi.fn(),
  arc: vi.fn(),
  stroke: vi.fn(),
  fill: vi.fn(),
  fillStyle: '',
};

describe('PiEstimation.svelte', () => {
  beforeEach(() => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(
      () => mockContext as any,
    );
    vi.clearAllMocks();
  });

  it('renders a canvas', () => {
    const { container } = render(PiEstimation, { props: { darts: [] } });
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('draws the basic structure on the canvas', () => {
    render(PiEstimation, { props: { darts: [] } });

    expect(mockContext.clearRect).toHaveBeenCalled();
    expect(mockContext.fillRect).toHaveBeenCalledWith(0, 0, 500, 500);
    expect(mockContext.strokeRect).toHaveBeenCalledWith(0, 0, 500, 500);
    expect(mockContext.arc).toHaveBeenCalledWith(250, 250, 250, 0, 2 * Math.PI);
    expect(mockContext.stroke).toHaveBeenCalled();
  });

  it('draws darts on the canvas', () => {
    const darts: Dart[] = [
      { x: 0.1, y: 0.1, inCircle: true },
      { x: 0.9, y: 0.9, inCircle: false },
    ];
    render(PiEstimation, { props: { darts } });

    expect(mockContext.fill).toHaveBeenCalledTimes(2);
    expect(mockContext.arc).toHaveBeenCalledWith(50, 50, 2, 0, 2 * Math.PI);
    expect(mockContext.arc).toHaveBeenCalledWith(450, 450, 2, 0, 2 * Math.PI);
  });
});
