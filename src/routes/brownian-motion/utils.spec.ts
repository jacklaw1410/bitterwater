import { describe, it, expect } from 'vitest';
import { createParticle, moveParticles, updateParticle, type Particle } from './utils.js'; // Updated import path

describe('brownian-motion logic', () => {
  it('creates a particle within the specified bounds', () => {
    const particle = createParticle(800, 600, 2, 2, '#000000');
    expect(particle.x).toBeGreaterThanOrEqual(0);
    expect(particle.x).toBeLessThanOrEqual(800);
    expect(particle.y).toBeGreaterThanOrEqual(0);
    expect(particle.y).toBeLessThanOrEqual(600);
  });

  it("updates a particle's properties correctly", () => {
    const particle: Particle = { x: 10, y: 10, vx: 1, vy: 1, size: 2, color: '#000' };

    updateParticle(particle, { x: 20, y: 20, vx: 2, vy: 2, size: 4, color: '#fff' });
    expect(particle.x).toBe(20);
    expect(particle.y).toBe(20);
    expect(particle.vx).toBe(2);
    expect(particle.vy).toBe(2);
    expect(particle.size).toBe(4);
    expect(particle.color).toBe('#fff');

    updateParticle(particle, { x: 30 });
    expect(particle.x).toBe(30);
    expect(particle.y).toBe(20);
    expect(particle.vx).toBe(2);
    expect(particle.vy).toBe(2);
    expect(particle.size).toBe(4);
    expect(particle.color).toBe('#fff');
  });

  it('moves particle based on their velocity', () => {
    const particle: Particle = { x: 10, y: 10, vx: 1, vy: 1, size: 2, color: '#000' };
    moveParticles([particle], 800, 600);
    expect(particle.x).toBe(11);
    expect(particle.y).toBe(11);
    expect(particle.vx).toBe(1);
    expect(particle.vy).toBe(1);
  });

  it('bounces particles off the walls', () => {
    const p1: Particle = { x: -1, y: 8, vx: -1, vy: 1, size: 2, color: '#000' };
    moveParticles([p1], 10, 10);
    expect(p1.x).toBe(0);
    expect(p1.y).toBe(9);
    expect(p1.vx).toBe(1);
    expect(p1.vy).toBe(1);

    const p2: Particle = { x: 11, y: 8, vx: 1, vy: 1, size: 2, color: '#000' };
    moveParticles([p2], 10, 10);
    expect(p2.x).toBe(10);
    expect(p2.y).toBe(9);
    expect(p2.vx).toBe(-1);
    expect(p2.vy).toBe(1);

    const p3: Particle = { x: 801, y: 8, vx: 1, vy: 1, size: 2, color: '#000' };
    moveParticles([p3], 10, 10);
    expect(p3.x).toBe(10);
    expect(p3.y).toBe(9);
    expect(p3.vx).toBe(-1);
    expect(p3.vy).toBe(1);
  });
});
