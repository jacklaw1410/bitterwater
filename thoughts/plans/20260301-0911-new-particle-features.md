# Implementation Plan: New Particle Features

## Overview

This document outlines the plan to add new features to the Brownian motion visualizer, including controls for particle size, color, and a toggleable "comet tail" trajectory effect. The implementation will follow the existing modular, test-driven approach.

## Current State Analysis

The existing implementation provides a solid foundation with a clear separation of concerns between the simulation logic, UI controls, and canvas rendering. We will extend this existing architecture to incorporate the new features.

## Desired End State

The Brownian motion visualizer will have three new user-configurable options:

- A slider to control the size of the particles.
- A color picker to change the color of the particles.
- A checkbox to toggle the visibility of a "comet tail" trajectory effect.
  All new features will be covered by updated component and E2E tests.

## Implementation Approach

The implementation will be broken down into four distinct, test-driven phases:

1. **Update Core Logic & State**: Modify the `Particle` interface and the main page's state.
2. **Update Controls Component**: Add the new UI controls and update component tests.
3. **Update Canvas Rendering**: Implement the new visual features in the canvas component.
4. **Update E2E Tests**: Verify the integrated features.

---

## Phase 1: Update Core Logic & State

### Overview

This phase focuses on updating the core data structures and state management to support the new features.

### Changes Required

#### 1. Update Particle Interface

**File**: `src/lib/utils/brownian-motion.ts`
**Changes**: Add `size` and `color` properties to the `Particle` interface and update the `createParticle` function.

```typescript
export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

export function createParticle(
  width: number,
  height: number,
  speed: number,
  size: number,
  color: string,
): Particle {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * speed,
    vy: (Math.random() - 0.5) * speed,
    size,
    color,
  };
}

// updateParticles remains the same
```

#### 2. Update Page State

**File**: `src/routes/brownian-motion/+page.svelte`
**Changes**: Add new state variables for `particleSize`, `particleColor`, and `showTrails`.

```svelte
//...
  let particleCount = $state(100);
  let speed = $state(2);
  let particleSize = $state(2);
  let particleColor = $state('#000000');
  let showTrails = $state(true);
  let isPlaying = $state(true);
//...
  function reset() {
    particles = Array.from({ length: particleCount }, () => createParticle(800, 600, speed, particleSize, particleColor));
  }
//...
<Controls bind:particleCount bind:speed bind:particleSize bind:particleColor bind:showTrails bind:isPlaying onreset={reset} />
<BrownianMotion {particles} {showTrails} />
```

### Success Criteria

#### Automated Verification

- [ ] Unit tests for `brownian-motion.ts` still pass.
- [ ] Type checking passes: `bun check`
- [ ] Linting passes: `bun lint`

---

## Phase 2: Update Controls Component

### Overview

Add the new UI controls to the `Controls.svelte` component and update its tests.

### Changes Required

#### 1. Update Controls Component

**File**: `src/lib/components/brownian-motion/Controls.svelte`
**Changes**: Add a slider for particle size, a color picker, and a checkbox for trails.

```svelte
<script lang="ts">
  let {
    particleCount = $bindable(100),
    speed = $bindable(2),
    particleSize = $bindable(2),
    particleColor = $bindable('#000000'),
    showTrails = $bindable(true),
    isPlaying = $bindable(true),
    onreset,
  } = $props();
</script>

<div class="controls">
  <button onclick={() => (isPlaying = !isPlaying)}>{isPlaying ? 'Pause' : 'Play'}</button>
  <button onclick={onreset}>Reset</button>

  <label>
    Particles: {particleCount}
    <input
      type="range"
      bind:value={particleCount}
      min={10}
      max={500}
      aria-label="Number of particles"
    />
  </label>

  <label>
    Speed: {speed.toFixed(1)}
    <input
      type="range"
      bind:value={speed}
      min={0.5}
      max={10}
      step={0.1}
      aria-label="Particle speed"
    />
  </label>

  <label>
    Size: {particleSize}
    <input type="range" bind:value={particleSize} min={1} max={6} aria-label="Particle size" />
  </label>

  <label>
    Color:
    <input type="color" bind:value={particleColor} aria-label="Particle color" />
  </label>

  <label>
    Show Trails:
    <input type="checkbox" bind:checked={showTrails} aria-label="Show trails" />
  </label>
</div>
```

#### 2. Update Component Test for Controls

**File**: `src/lib/components/brownian-motion/Controls.spec.ts`
**Changes**: Update the test to check for the new controls.

```typescript
//...
it('renders controls with default values', () => {
  render(Controls, { onreset: () => {} });
  //...
  expect(screen.getByLabelText(/Particle size/)).toHaveValue('2');
  expect(screen.getByLabelText(/Particle color/)).toHaveValue('#000000');
  expect(screen.getByLabelText(/Show trails/)).toBeChecked();
});
//...
```

### Success Criteria

#### Automated Verification

- [ ] Component tests pass: `bun test:unit src/lib/components/brownian-motion/Controls.spec.ts`
- [ ] Type checking passes: `bun check`
- [ ] Linting passes: `bun lint`

---

## Phase 3: Update Canvas Rendering

### Overview

Implement the new visual features in the `BrownianMotion.svelte` component.

### Changes Required

#### 1. Update Canvas Component

**File**: `src/lib/components/brownian-motion/BrownianMotion.svelte`
**Changes**: Implement the comet tail effect and use the new particle properties.

```svelte
<script lang="ts">
  import type { Particle } from '$lib/utils/brownian-motion';

  let canvasElement: HTMLCanvasElement;
  let { particles, showTrails }: { particles: Particle[]; showTrails: boolean } = $props();

  $effect(() => {
    const ctx = canvasElement.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvasElement;

    if (showTrails) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(0, 0, width, height);
    } else {
      ctx.clearRect(0, 0, width, height);
    }

    for (const p of particles) {
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
      gradient.addColorStop(0, `${p.color}ff`);
      gradient.addColorStop(0.2, `${p.color}99`);
      gradient.addColorStop(1, `${p.color}00`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
      ctx.fill();
    }
  });
</script>
```

### Success Criteria

#### Automated Verification

- [ ] Type checking passes: `bun check`
- [ ] Linting passes: `bun lint`

#### Manual Verification

- [ ] The new controls correctly influence the particle size, color, and trail visibility.
- [ ] The comet tail effect is visually appealing.

---

## Phase 4: Update E2E Tests

### Overview

Verify the integrated features with an updated E2E test.

### Changes Required

#### 1. Update E2E Test

**File**: `e2e/brownian-motion.test.ts`
**Changes**: Add assertions for the new controls.

```typescript
//...
// Test particle size slider
const sizeSlider = page.getByLabel('Particle size');
await sizeSlider.fill('5');
await expect(page.getByText('Size: 5')).toBeVisible();

// Test color picker
const colorPicker = page.getByLabel('Particle color');
await colorPicker.fill('#ff0000');
// Visual regression test would be ideal here, but for now we just check the control

// Test trails checkbox
const trailsCheckbox = page.getByLabel('Show trails');
await trailsCheckbox.uncheck();
// Visual regression test would be ideal here
//...
```

### Success Criteria

#### Automated Verification

- [ ] All E2E tests pass: `bun test:e2e`

## References

- Related research: `thoughts/research/20260301-1200-new-particle-features.md`
