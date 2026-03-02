export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

export const createParticle = (
  width: number,
  height: number,
  speed: number,
  size: number,
  color: string,
): Particle => {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * speed,
    vy: (Math.random() - 0.5) * speed,
    size,
    color,
  };
}

export const updateParticle = (p: Particle, props: Partial<Particle>) => {
  const { x, y, vx, vy, size, color } = props;
  if (x !== undefined) p.x = x;
  if (y !== undefined) p.y = y;
  if (vx !== undefined) p.vx = vx;
  if (vy !== undefined) p.vy = vy;
  if (size !== undefined) p.size = size;
  if (color !== undefined) p.color = color;
};

export const moveParticles = (particles: Particle[], width: number, height: number) => {
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > width) p.vx *= -1;
    if (p.y < 0 || p.y > height) p.vy *= -1;
  }
}
