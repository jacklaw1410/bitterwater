<script lang="ts">
  import BrownianMotion from '$lib/components/brownian-motion/BrownianMotion.svelte';
  import Controls from '$lib/components/brownian-motion/Controls.svelte';
  import {
    createParticle,
    moveParticles,
    updateParticle,
    type Particle,
  } from '$lib/utils/brownian-motion.js';

  let particleCount = $state(100);
  let speed = $state(2);
  let particleSize = $state(2);
  let particleColor = $state('#000000');
  let showTrails = $state(true);
  let isPlaying = $state(true);

  let particles = $state<Particle[]>([]);
  let width = $state(800);
  let height = $state(500);

  const reset = () => {
    if (particleCount < particles.length) {
      particles.splice(particleCount, particles.length - particleCount);
    } else if (particleCount > particles.length) {
      for (let i = particles.length; i < particleCount; i++) {
        particles.push(createParticle(width, height, speed, particleSize, particleColor));
      }
    }
    for (let i = 0; i < particles.length; i++) {
      updateParticle(particles[i], {
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        size: particleSize,
        color: particleColor,
      });
    }
  };

  reset();

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
    reset();
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
<BrownianMotion {particles} {showTrails} {particleSize} {particleColor} width={width} height={height} />
