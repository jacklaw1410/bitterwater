import { render } from '@testing-library/svelte';
import { beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import type { Dart } from '../state.svelte';
import PiEstimation from './PiEstimation.svelte';

const mockContext = {
  fillRect: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  fillStyle: '',
  strokeStyle: '',
  lineWidth: 0.5,
  shadowBlur: 0,
};

describe('PiEstimation.svelte', () => {
  beforeEach(() => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(
      () => mockContext as unknown as CanvasRenderingContext2D,
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

    expect(mockContext.fillRect).toHaveBeenCalledWith(0, 0, 500, 500);
    expect(mockContext.arc).toHaveBeenCalledWith(250, 250, 250 - 2, 0, 2 * Math.PI);
    expect(mockContext.stroke).toHaveBeenCalled();
  });

  it('draws darts on the canvas', () => {
    const darts: Dart[] = [
      { x: 0.1, y: 0.1, inCircle: true },
      { x: 0.9, y: 0.9, inCircle: false },
    ];
    render(PiEstimation, { props: { darts } });

    expect(mockContext.fill).toHaveBeenCalledTimes(2);
    expect(mockContext.arc).toHaveBeenCalledWith(50, 50, 2.5, 0, 2 * Math.PI);
    expect(mockContext.arc).toHaveBeenCalledWith(450, 450, 2.5, 0, 2 * Math.PI);
  });
});
