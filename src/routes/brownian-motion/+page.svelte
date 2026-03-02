<script lang="ts">
  import BrownianMotion from '$lib/components/brownian-motion/BrownianMotion.svelte';
  import Controls from '$lib/components/brownian-motion/Controls.svelte';
  import Statistics from '$lib/components/brownian-motion/Statistics.svelte';
  import {
    createParticle,
    generateRandomVelocity,
    moveParticles,
    updateParticle,
    type Particle,
  } from '$lib/utils/brownian-motion.js';

  const INIITIAL_PARTICLE_COUNT = 100;
  const INITIAL_SPEED = 3;
  const INITIAL_PARTICLE_SIZE = 3;
  const INITIAL_PARTICLE_COLOR = '#800000';
  const INITIAL_SHOW_TRAILS = true;
  const INITIAL_WIDTH = 800;
  const INITIAL_HEIGHT = 500;

  let particleCount = $state(INIITIAL_PARTICLE_COUNT);
  let speed = $state(INITIAL_SPEED);
  let particleSize = $state(INITIAL_PARTICLE_SIZE);
  let particleColor = $state(INITIAL_PARTICLE_COLOR);
  let showTrails = $state(INITIAL_SHOW_TRAILS);
  let isPlaying = $state(true);

  let particles = $state<Particle[]>([]);
  let width = $state(INITIAL_WIDTH);
  let height = $state(INITIAL_HEIGHT);

  const update = () => {
    if (particleCount < particles.length) {
      particles.splice(particleCount, particles.length - particleCount);
    } else if (particleCount > particles.length) {
      for (let i = particles.length; i < particleCount; i++) {
        particles.push(createParticle(width, height, speed, particleSize, particleColor));
      }
    }
    for (let i = 0; i < particles.length; i++) {
      const { vx, vy } = generateRandomVelocity(speed);
      updateParticle(particles[i], {
        vx,
        vy,
        size: particleSize,
        color: particleColor,
      });
    }
  };

  const reset = () => {
    particleCount = INIITIAL_PARTICLE_COUNT;
    speed = INITIAL_SPEED;
    particleSize = INITIAL_PARTICLE_SIZE;
    particleColor = INITIAL_PARTICLE_COLOR;
    showTrails = INITIAL_SHOW_TRAILS;
    width = INITIAL_WIDTH;
    height = INITIAL_HEIGHT;
  };

  $effect(() => {
    if (!isPlaying) return;

    let rid = requestAnimationFrame(function update() {
      moveParticles(particles, width, height);
      rid = requestAnimationFrame(update);
    });

    return () => {
      cancelAnimationFrame(rid);
    };
  });

  $effect(() => {
    update();
  });
</script>

<svelte:head>
  <title>Brownian Motion</title>
</svelte:head>

<h1>Brownian Motion Visualizer</h1>

<Controls
  bind:particleCount
  bind:speed
  bind:particleSize
  bind:particleColor
  bind:showTrails
  bind:isPlaying
  bind:width
  bind:height
  onreset={reset}
/>
<Statistics {particles} />
<BrownianMotion {particles} {showTrails} {particleSize} {particleColor} {width} {height} />
