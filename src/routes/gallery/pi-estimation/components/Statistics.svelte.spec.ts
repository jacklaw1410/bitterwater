import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vite-plus/test';

import Statistics from './Statistics.svelte';

describe('Statistics.svelte', () => {
  it('renders initial statistics', () => {
    render(Statistics, {
      props: {
        totalDarts: 0,
        dartsInsideCircle: 0,
      },
    });

    expect(screen.getByText(/Darts Inside Circle: 0 \/ 0 = 0.0000%/)).toBeInTheDocument();
    expect(screen.getByText(/Estimated π: 0.000000/)).toBeInTheDocument();
  });

  it('calculates and displays pi estimation', () => {
    render(Statistics, {
      props: {
        totalDarts: 1000,
        dartsInsideCircle: 785,
      },
    });

    expect(screen.getByText(/Darts Inside Circle: 785 \/ 1000 = 78.5000%/)).toBeInTheDocument();
    expect(screen.getByText(/Estimated π: 3.140000/)).toBeInTheDocument();
  });
});
