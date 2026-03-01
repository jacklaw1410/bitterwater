---
date: 2026-03-01T12:00:00.000Z
git_commit: 2724d6193723ec28f230313d057cd3b191c4e9d8
branch: main
topic: 'Research for new particle controls and trajectory visualization'
tags: [research, brownian-motion, canvas, controls]
status: complete
last_updated: 2026-03-01
---

# Research: New Particle Controls and Trajectory Visualization

**Date**: 2026-03-01
**Git Commit**: 2724d6193723ec28f230313d057cd3b191c4e9d8
**Branch**: main

## Research Question

Investigate the implementation of three new features for the Brownian motion visualizer:

1. Add a control for the size of the particles.
2. Add a control for the color of the particles.
3. Attach a trailing, fading tail to every particle to visualize their trajectory.

## Summary

The implementation of the new controls for particle size and color is straightforward. It will follow the existing pattern for the particle count and speed controls, involving state management in the page component and prop drilling into the controls and canvas components.

The particle trail visualization is a more complex rendering challenge. The recommended approach is to modify the canvas clearing mechanism to create a "fading" effect, rather than clearing the canvas completely on each frame.

## Detailed Findings

### Affected Files

- `src/routes/brownian-motion/+page.svelte`: Will manage the state for the new controls (particle size and color).
- `src/lib/components/brownian-motion/Controls.svelte`: Will contain the new UI elements (a slider for size, a color picker for color).
- `src/lib/components/brownian-motion/BrownianMotion.svelte`: Will be updated to use the new size and color props when rendering particles and to implement the fading trail effect.
- `src/lib/utils/brownian-motion.ts`: Will be updated to include size and color properties in the `Particle` interface.

### Particle Size and Color Controls

The implementation will mirror the existing controls:

1. **State Management** (`+page.svelte`):
   - Add two new `$state` variables: `particleSize` and `particleColor`.
   - Pass these new state variables as bindable props to the `Controls` component.
   - Pass `particleSize` and `particleColor` as props to the `BrownianMotion` component.

2. **UI Controls** (`Controls.svelte`):
   - Add an `<input type="range">` for particle size, similar to the existing sliders.
   - Add an `<input type="color">` for the particle color.
   - These new inputs will be bound to the `particleSize` and `particleColor` props.

3. **Canvas Rendering** (`BrownianMotion.svelte`):
   - Accept the new `particleSize` and `particleColor` props.
   - In the `$effect` loop, set `ctx.fillStyle` to the `particleColor` prop.
   - Use the `particleSize` prop as the radius in the `ctx.arc()` method.

### Fading Particle Trails

This effect can be achieved by modifying the rendering loop in `BrownianMotion.svelte`. Instead of clearing the canvas with `ctx.clearRect()`, we can draw a semi-transparent rectangle over the entire canvas on each frame. A new control will be added to toggle this effect on and off.

**Example Implementation**:

```typescript
// In BrownianMotion.svelte
let { showTrails = $props(true) };

// In the $effect
if (showTrails) {
  // Use this to create a fading effect
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'; // Assuming a white background
  ctx.fillRect(0, 0, width, height);
} else {
  ctx.clearRect(0, 0, width, height);
}

// ... rest of the rendering logic
```

### Comet Tail Effect

To achieve a more visually appealing "comet tail" effect, we can use a `radial-gradient` when drawing the particles. This will create a soft, glowing effect that looks more like a comet.

**Example Implementation**:

```typescript
// In BrownianMotion.svelte's rendering loop
for (const p of particles) {
  const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, particleSize * 2);
  gradient.addColorStop(0, `${particleColor}ff`); // Solid core
  gradient.addColorStop(0.2, `${particleColor}99`); // Inner glow
  gradient.addColorStop(1, `${particleColor}00`); // Transparent outer edge

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(p.x, p.y, particleSize * 2, 0, Math.PI * 2);
  ctx.fill();
}
```

This technique, combined with the fading trail effect, will create a visually appealing animation of glowing particles with fading tails.

## Updated Requirements

Based on user feedback, the new controls should be configured as follows:

- **Particle Size**: A slider with a `min` of 1, a `max` of 6, and a `default` of 2.
- **Particle Trails**: A checkbox or toggle to turn the trail effect on or off.

## Open Questions

- What should the default, min, and max values be for the new particle size slider?
