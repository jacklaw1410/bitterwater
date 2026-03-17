import {
  createParticle,
  generateRandomVelocity,
  moveParticles,
  updateParticle,
  type Particle,
} from './utils.js';

const INITIAL_PARTICLE_COUNT = 100;
const INITIAL_SPEED = 3;
const INITIAL_PARTICLE_SIZE = 3;
const INITIAL_PARTICLE_COLOR = '#800000';
const INITIAL_SHOW_TRAILS = true;
const INITIAL_WIDTH = 800;
const INITIAL_HEIGHT = 500;

export const state = $state({
  particleCount: INITIAL_PARTICLE_COUNT,
  speed: INITIAL_SPEED,
  particleSize: INITIAL_PARTICLE_SIZE,
  particleColor: INITIAL_PARTICLE_COLOR,
  showTrails: INITIAL_SHOW_TRAILS,
  playing: true,
  particles: [] as Particle[],
  width: INITIAL_WIDTH,
  height: INITIAL_HEIGHT,
});

export const reset = () => {
  state.particleCount = INITIAL_PARTICLE_COUNT;
  state.speed = INITIAL_SPEED;
  state.particleSize = INITIAL_PARTICLE_SIZE;
  state.particleColor = INITIAL_PARTICLE_COLOR;
  state.showTrails = INITIAL_SHOW_TRAILS;
  state.width = INITIAL_WIDTH;
  state.height = INITIAL_HEIGHT;
};

const update = () => {
  if (state.particleCount < state.particles.length) {
    state.particles.splice(state.particleCount, state.particles.length - state.particleCount);
  } else if (state.particleCount > state.particles.length) {
    for (let i = state.particles.length; i < state.particleCount; i++) {
      state.particles.push(
        createParticle(
          state.width,
          state.height,
          state.speed,
          state.particleSize,
          state.particleColor,
        ),
      );
    }
  }
  for (let i = 0; i < state.particles.length; i++) {
    const { vx, vy } = generateRandomVelocity(state.speed);
    updateParticle(state.particles[i], {
      vx,
      vy,
      size: state.particleSize,
      color: state.particleColor,
    });
  }
};

export const initializeEffects = () => {
  $effect(() => {
    if (!state.playing) return;

    let rid = requestAnimationFrame(function loop() {
      moveParticles(state.particles, state.width, state.height);
      rid = requestAnimationFrame(loop);
    });

    return () => {
      cancelAnimationFrame(rid);
    };
  });

  $effect(() => {
    update();
  });
};
