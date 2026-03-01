import { describe, it, expect } from 'vitest';
import { createParticle, updateParticles } from './brownian-motion';

describe('brownian-motion logic', () => {
  it('creates a particle within the specified bounds', () => {
    const particle = createParticle(800, 600, 2);
    expect(particle.x).toBeGreaterThanOrEqual(0);
    expect(particle.x).toBeLessThanOrEqual(800);
    expect(particle.y).toBeGreaterThanOrEqual(0);
    expect(particle.y).toBeLessThanOrEqual(600);
  });

  it('updates particle positions based on their velocity', () => {
    const particle = { x: 10, y: 10, vx: 1, vy: 1 };
    updateParticles([particle], 800, 600);
    expect(particle.x).toBe(11);
    expect(particle.y).toBe(11);
  });

  it('bounces particles off the walls', () => {
    const p1 = { x: -1, y: 10, vx: -1, vy: 1 };
    updateParticles([p1], 800, 600);
    expect(p1.vx).toBe(1);

    const p2 = { x: 801, y: 10, vx: 1, vy: 1 };
    updateParticles([p2], 800, 600);
    expect(p2.vx).toBe(-1);
  });
});
