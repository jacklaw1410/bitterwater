# Implementation Plan: Brownian Motion Visualizer (v2)

## Overview

This document outlines the plan to create a modular, test-driven Brownian motion simulation visualizer. The feature will be composed of several Svelte components: one for the core simulation logic, one for the canvas rendering, one for UI controls, and a final page to integrate them. The implementation will strictly adhere to Svelte 5 Runes and the project's TDD philosophy.

## Current State Analysis

The codebase is a new SvelteKit project with no existing simulation or canvas visualization components. All components and logic for this feature will be built from scratch.

## Desired End State

A new page at `/brownian-motion` will display the visualizer. It will be composed of distinct components for visualization and controls. Users will be able to start, pause, and reset the simulation, and adjust the number and speed of particles via UI controls. The implementation will be fully tested at unit, component, and E2E levels.

## What We're NOT Doing

- Saving simulation state.
- Advanced visualizations (e.g., particle trails, color coding).
- Support for browsers without HTML5 Canvas.

## Implementation Approach

The implementation will be broken down into five distinct, test-driven phases:

1. **Core Logic & Unit Tests**: Build and validate the standalone simulation engine.
2. **Canvas Component**: Create the visual rendering component.
3. **Controls Component & Component Tests**: Create and test the user interaction component.
4. **Page Integration**: Assemble the components and manage the state.
5. **End-to-End Testing**: Verify the final integrated feature.

---

## Phase 1: Core Logic & Unit Tests

### Overview

This phase focuses on creating and testing the simulation's core logic in isolation.

### Changes Required

#### 1. Simulation Logic

**File**: `src/lib/utils/brownian-motion.ts`
**Changes**: Create a new file to house the pure simulation logic.

```typescript
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
  vy: (Math.random() - 0.5) * speed
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
```

#### 2. Unit Tests for Simulation Logic

**File**: `src/lib/utils/brownian-motion.spec.ts`
**Changes**: Add unit tests to validate the utility functions.

```typescript
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
```

### Success Criteria

#### Automated Verification

- [ ] All unit tests pass: `bun test:unit src/lib/utils/brownian-motion.spec.ts`
- [ ] Type checking passes: `bun check`
- [ ] Linting passes: `bun lint`

---

## Phase 2: Canvas Component

### Overview

Create the Svelte component that will be responsible for rendering the particles on a canvas.

### Changes Required

#### 1. Canvas Component

**File**: `src/lib/components/brownian-motion/BrownianMotion.svelte`
**Changes**: Create the main Svelte component to manage the canvas and render the simulation.

```svelte
<script lang="ts">
 import type { Particle } from '$lib/utils/brownian-motion';

 let canvasElement: HTMLCanvasElement;
 let { particles = $props<Particle[]>(); }

 $effect(() => {
  const ctx = canvasElement.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';

  for (const p of particles) {
   ctx.beginPath();
   ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
   ctx.fill();
  }
 });
</script>

<canvas bind:this={canvasElement} width={800} height={600}></canvas>

<style>
 canvas {
  border: 1px solid #ccc;
  display: block;
 }
</style>
```

### Success Criteria

#### Automated Verification

- [ ] Type checking passes: `bun check`
- [ ] Linting passes: `bun lint`

#### Manual Verification

- [ ] Can be integrated into a story or page without errors.

---

## Phase 3: Controls Component & Component Tests

### Overview

Develop a separate, testable Svelte component for all UI controls.

### Changes Required

#### 1. Controls Component

**File**: `src/lib/components/brownian-motion/Controls.svelte`
**Changes**: Create a new component for the simulation controls.

```svelte
<script lang="ts">
 let {
  particleCount = $bindable(100),
  speed = $bindable(2),
  isPlaying = $bindable(true),
  onreset
 } = $props<{
  particleCount?: number;
  speed?: number;
  isPlaying?: boolean;
  onreset: () => void;
 }>();
</script>

<div class="controls">
    <button onclick={() => isPlaying = !isPlaying}>{isPlaying ? 'Pause' : 'Play'}</button>
    <button onclick={onreset}>Reset</button>

    <label>
        Particles: {particleCount}
        <input type="range" bind:value={particleCount} min={10} max={500} aria-label="Number of particles" />
    </label>

    <label>
        Speed: {speed.toFixed(1)}
        <input type="range" bind:value={speed} min={0.5} max={10} step={0.1} aria-label="Particle speed" />
    </label>
</div>

<style>
    .controls {
        margin-bottom: 1rem;
        display: flex;
        gap: 1rem;
        align-items: center;
        flex-wrap: wrap;
    }
</style>
```

#### 2. Component Test for Controls

**File**: `src/lib/components/brownian-motion/Controls.spec.ts`
**Changes**: Add a component test to verify the UI controls component.

```typescript
import { render, screen } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import Controls from './Controls.svelte';
import userEvent from '@testing-library/user-event';

describe('Controls.svelte', () => {
 it('renders controls with default values', () => {
  render(Controls, { onreset: () => {} });
  expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument();
  expect(screen.getByLabelText(/Number of particles/)).toHaveValue('100');
  expect(screen.getByLabelText(/Particle speed/)).toHaveValue('2');
 });

 it('fires the reset event when the reset button is clicked', async () => {
  const onResetMock = vi.fn();
  render(Controls, { onreset: onResetMock });
  await userEvent.click(screen.getByRole('button', { name: 'Reset' }));
  expect(onResetMock).toHaveBeenCalled();
 });
});
```

### Success Criteria

#### Automated Verification

- [ ] Component tests pass: `bun test:unit src/lib/components/brownian-motion/Controls.spec.ts`
- [ ] Type checking passes: `bun check`
- [ ] Linting passes: `bun lint`

---

## Phase 4: Page Integration

### Overview

Assemble the canvas and controls components onto a new page route and manage the application state.

### Changes Required

#### 1. Route Page

**File**: `src/routes/brownian-motion/+page.svelte`
**Changes**: Create a new page to host and integrate the simulation components.

```svelte
<script lang="ts">
    import BrownianMotion from '$lib/components/brownian-motion/BrownianMotion.svelte';
    import Controls from '$lib/components/brownian-motion/Controls.svelte';
 import { createParticle, updateParticles, type Particle } from '$lib/utils/brownian-motion.js';

    let particleCount = $state(100);
    let speed = $state(2);
    let isPlaying = $state(true);

    let particles = $state<Particle[]>([]);

    function reset() {
        particles = Array.from({ length: particleCount }, () => createParticle(800, 600, speed));
    }

    reset();

    $effect(() => {
        if (!isPlaying) return;

        const animationFrame = requestAnimationFrame(() => {
            updateParticles(particles, 800, 600);
            particles = [...particles];
        });

        return () => {
            cancelAnimationFrame(animationFrame);
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

<Controls bind:particleCount={particleCount} bind:speed={speed} bind:isPlaying={isPlaying} onreset={reset} />
<BrownianMotion {particles} />
```

### Success Criteria

#### Automated Verification

- [ ] Type checking passes: `bun check`
- [ ] Linting passes: `bun lint`

#### Manual Verification

- [ ] Navigate to `/brownian-motion`.
- [ ] The full simulation with controls is visible and functional.
- [ ] All controls correctly influence the simulation.

---

## Phase 5: End-to-End Testing

### Overview

Add a final E2E test to verify the complete feature from a user's perspective, including visual validation of the simulation's state and particle count.

### Changes Required

#### 1. E2E Test for the Page

**File**: `e2e/brownian-motion.test.ts`
**Changes**: Add an E2E test to verify the user flow, visual feedback, and UI state.

```typescript
import { test, expect } from '@playwright/test';

test('Brownian Motion page functions correctly', async ({ page }) => {
 await page.goto('/brownian-motion');
 await expect(page.getByRole('heading', { name: 'Brownian Motion Visualizer' })).toBeVisible();

 const canvas = page.locator('canvas');
 await expect(canvas).toBeVisible();

 // Allow some time for initial rendering
 await page.waitForTimeout(500);

 // Test pause functionality: canvas should not change after a delay
 await page.getByRole('button', { name: 'Pause' }).click();
 await expect(page.getByRole('button', { name: 'Play' })).toBeVisible();
 const pausedCanvas = await canvas.screenshot();
 await page.waitForTimeout(500);
 expect(await canvas.screenshot()).toEqual(pausedCanvas);

 // Test play functionality: canvas should change
 await page.getByRole('button', { name: 'Play' }).click();
 await expect(page.getByRole('button', { name: 'Pause' })).toBeVisible();
 await page.waitForTimeout(500);
 expect(await canvas.screenshot()).not.toEqual(pausedCanvas);

 // Test that changing particle count slider updates the UI label
 const particleSlider = page.getByLabelText('Number of particles');
 await particleSlider.fill('50');
 await expect(page.getByText('Particles: 50')).toBeVisible();

 // Since we cannot count particles on a canvas directly, we verify the control's effect
 // by taking a screenshot before and after resetting the simulation with the new particle count.
 // The two screenshots should be different, confirming the particle count has changed.
 const canvasBeforeReset = await canvas.screenshot();
 await page.getByRole('button', { name: 'Reset' }).click();
 await page.waitForTimeout(500); // Wait for re-render
 expect(await canvas.screenshot()).not.toEqual(canvasBeforeReset);
});
```

### Success Criteria

#### Automated Verification

- [ ] All E2E tests pass: `bun test:e2e`

## References

- Related research: `thoughts/research/20260301-1200-brownian-motion-visualizer.md`
