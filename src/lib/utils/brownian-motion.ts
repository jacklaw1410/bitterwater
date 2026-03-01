export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export function createParticle(width: number, height: number, speed: number): Particle {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * speed,
    vy: (Math.random() - 0.5) * speed,
  };
}

export function updateParticles(particles: Particle[], width: number, height: number) {
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > width) p.vx *= -1;
    if (p.y < 0 || p.y > height) p.vy *= -1;
  }
}
