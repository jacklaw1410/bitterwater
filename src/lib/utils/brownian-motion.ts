export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

export const generateRandomVelocity = (speed: number, a: number = 0.7) => {
  const direction = Math.random() * Math.PI * 2;
  // A uniform distribution with mean of 1
  const b = 2 - a;
  const amplitude = (a + (b - a) * Math.random()) * speed;
  return {
    vx: Math.cos(direction) * amplitude,
    vy: Math.sin(direction) * amplitude,
  };
};

export const createParticle = (
  width: number,
  height: number,
  speed: number,
  size: number,
  color: string,
): Particle => {
  const { vx, vy } = generateRandomVelocity(speed);
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx,
    vy,
    size,
    color,
  };
};

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

    if (p.x < 0) p.x = 0;
    else if (p.x > width) p.x = width;

    if (p.y < 0) p.y = 0;
    else if (p.y > height) p.y = height;
  }
};
