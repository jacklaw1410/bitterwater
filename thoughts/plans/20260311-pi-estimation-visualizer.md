# Pi Estimation Visualizer Implementation Plan

## Overview

This document outlines the plan to implement a new feature: a Pi Estimation Visualizer. This feature will provide an interactive simulation to estimate Pi using the Monte Carlo method, display the results visually on a canvas, and provide real-time statistics.

## Current State Analysis

Based on the research document `thoughts/research/20260309-pi-estimation-visualizer.md`, the existing codebase provides a strong foundation for this new feature. The `brownian-motion` feature serves as a blueprint for the architecture, component structure, and state management.

## Desired End State

A new page at `/pi-estimation` that includes:

- A canvas element that visually represents a square and an inscribed circle.
- When the simulation is running, points (darts) are continuously drawn on the canvas, colored differently based on whether they land inside or outside the circle.
- UI controls to start, stop, and reset the simulation.
- A display of real-time statistics: total darts thrown, darts inside the circle, and the current PI estimation.
- An end-to-end test that verifies the functionality of the page.

### Key Discoveries

- The project uses a consistent structure for creating new pages in the `src/routes` directory.
- The `brownian-motion` feature at `src/routes/brownian-motion/` provides an excellent reference implementation.
- State management is handled effectively with Svelte 5 Runes in a centralized `state.svelte.ts` file.

## What We're NOT Doing

- This feature will not involve any backend logic or data persistence.
- There will be no complex user authentication or authorization.

## Implementation Approach

The implementation will follow the pattern of the existing `brownian-motion` feature. We will create a new set of components for the pi estimation visualizer and manage their state with Svelte 5 Runes.

## Phase 1: State Management

### Overview

Create the central state management file for the simulation using Svelte 5 Runes.

### Changes Required

#### 1. Create `state.svelte.ts`

**File**: `src/routes/pi-estimation/state.svelte.ts`
**Changes**: Define the reactive state for the simulation and include the simulation logic in an `initialize` function.

```typescript
// In a .svelte.ts file, we can use runes directly.

export type Dart = {
  x: number;
  y: number;
  inCircle: boolean;
};

export const state = $state({
  darts: [] as Dart[],
  totalDarts: 0,
  dartsInsideCircle: 0,
  isRunning: false,
});

export const reset = () => {
  state.darts = [];
  state.totalDarts = 0;
  state.dartsInsideCircle = 0;
  state.isRunning = false;
};

export function initialize() {
  $effect(() => {
    if (!state.isRunning) return;

    let frame = requestAnimationFrame(function gameLoop() {
      const x = Math.random();
      const y = Math.random();
      const distance = Math.sqrt((x - 0.5) ** 2 + (y - 0.5) ** 2);
      const inCircle = distance <= 0.5;

      // Create a new array for reactivity
      state.darts = [...state.darts, { x, y, inCircle }];
      state.totalDarts++;
      if (inCircle) {
        state.dartsInsideCircle++;
      }
      frame = requestAnimationFrame(gameLoop);
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  });
}
```

### Success Criteria

#### Automated Verification

- [x] The file `src/routes/pi-estimation/state.svelte.ts` is created and contains the specified code.
- [x] Unit tests for the state management pass.
- [x] Type checking passes: `npm run check`.
- [x] Linting passes: `npm run lint`.

---

## Phase 2: Component Scaffolding

### Overview

Create the file structure for the new components.

### Changes Required

#### 1. Create Component Files

- `src/routes/pi-estimation/components/PiEstimation.svelte`
- `src/routes/pi-estimation/components/Controls.svelte`
- `src/routes/pi-estimation/components/Statistics.svelte`

### Success Criteria

#### Automated Verification

- [x] The files `PiEstimation.svelte`, `Controls.svelte`, and `Statistics.svelte` are created in `src/routes/pi-estimation/components/`.

---

## Phase 3: UI Implementation

### Overview

Build the UI components (Controls and Statistics).

### Changes Required

#### 1. Implement `Controls.svelte`

**File**: `src/routes/pi-estimation/components/Controls.svelte`
**Changes**: Create buttons to start, stop, and reset the simulation. It will import state directly.

```svelte
<script lang="ts">
  import { state, reset } from '../state.svelte';
</script>

<div class="controls">
  <button on:click={() => (state.isRunning = true)} disabled={state.isRunning}>Start</button>
  <button on:click={() => (state.isRunning = false)} disabled={!state.isRunning}>Stop</button>
  <button on:click={reset}>Reset</button>
</div>

<style>
  .controls {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }
</style>
```

#### 2. Implement `Statistics.svelte`

**File**: `src/routes/pi-estimation/components/Statistics.svelte`
**Changes**: It will calculate `piEstimation` internally and receive the other statistics as props.

```svelte
<script lang="ts">
  type Props = {
    totalDarts: number;
    dartsInsideCircle: number;
  };
  let { totalDarts, dartsInsideCircle }: Props = $props();

  const piEstimation = $derived(totalDarts > 0 ? 4 * (dartsInsideCircle / totalDarts) : 0);
</script>

<div class="statistics">
  <p>Total Darts: {totalDarts}</p>
  <p>Darts Inside Circle: {dartsInsideCircle}</p>
  <p>Pi Estimation: {piEstimation.toFixed(5)}</p>
</div>

<style>
  .statistics {
    font-family: monospace;
  }
</style>
```

### Success Criteria

#### Automated Verification

- [x] The components `Controls.svelte` and `Statistics.svelte` are implemented as specified.
- [x] Unit tests for the components pass.
- [x] Type checking passes: `npm run check`.
- [x] Linting passes: `npm run lint`.

---

## Phase 4: Canvas Implementation

### Overview

Implement the canvas visualization for the simulation.

### Changes Required

#### 1. Implement `PiEstimation.svelte`

**File**: `src/routes/pi-estimation/components/PiEstimation.svelte`
**Changes**: Create the canvas and render the simulation using `$effect` for the game loop. It will import state directly.

```svelte
<script lang="ts">
  import type { Dart } from '../state.svelte';

  type Props = {
    darts: Dart[];
  };
  let { darts }: Props = $props();

  let canvas: HTMLCanvasElement;
  const size = 500;
  const radius = size / 2;

  $effect(() => {
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    // Draw
    ctx.clearRect(0, 0, size, size);

    // Draw square
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, size, size);

    // Draw circle
    ctx.beginPath();
    ctx.arc(radius, radius, radius, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw darts
    for (const dart of darts) {
      ctx.fillStyle = dart.inCircle ? 'blue' : 'red';
      ctx.beginPath();
      ctx.arc(dart.x * size, dart.y * size, 2, 0, 2 * Math.PI);
      ctx.fill();
    }
  });
</script>

<canvas bind:this={canvas} width={size} height={size}></canvas>
```

### Success Criteria

#### Automated Verification

- [x] The component `PiEstimation.svelte` is implemented as specified.
- [x] Unit tests for the component pass.
- [x] Type checking passes: `npm run check`.
- [x] Linting passes: `npm run lint`.

---

## Phase 5: Page Assembly

### Overview

Assemble the components into the main page.

### Changes Required

#### 1. Implement `+page.svelte`

**File**: `src/routes/pi-estimation/+page.svelte`
**Changes**: Initialize the simulation effects and pass state down to child components as props.

```svelte
<script lang="ts">
  import PiEstimation from './components/PiEstimation.svelte';
  import Controls from './components/Controls.svelte';
  import Statistics from './components/Statistics.svelte';
  import { state, initialize } from './state.svelte';

  initialize();
</script>

<h1>Pi Estimation</h1>

<Controls />
<Statistics totalDarts={state.totalDarts} dartsInsideCircle={state.dartsInsideCircle} />
<PiEstimation darts={state.darts} />
```

### Success Criteria

#### Automated Verification

- [x] The file `src/routes/pi-estimation/+page.svelte` is implemented as specified.
- [x] Type checking passes: `npm run check`.
- [x] Linting passes: `npm run lint`.

#### Manual Verification

- [ ] The page `/pi-estimation` loads and displays correctly.
- [ ] The simulation starts, stops, and resets as expected.
- [ ] The statistics update in real-time.

---

## Phase 6: End-to-End Testing

### Overview

Add a Playwright test to ensure the feature works as expected.

### Changes Required

#### 1. Create `pi-estimation.test.ts`

**File**: `e2e/pi-estimation.test.ts`
**Changes**: Add a new Playwright test for the pi estimation page.

```typescript
import { test, expect } from '@playwright/test';

test('pi estimation page functions correctly', async ({ page }) => {
  await page.goto('/pi-estimation');

  await expect(page.locator('h1')).toHaveText('Pi Estimation');

  // Initial state
  await expect(page.locator('.statistics')).toContainText('Total Darts: 0');
  await expect(page.locator('.statistics')).toContainText('Pi Estimation: 0.00000');

  // Start the simulation
  await page.click('button:has-text("Start")');

  // Wait for the simulation to run
  await page.waitForTimeout(1000);

  // Stop the simulation
  await page.click('button:has-text("Stop")');

  // Check that the statistics have updated
  const totalDarts = await page.locator('.statistics p:has-text("Total Darts")').textContent();
  expect(parseInt(totalDarts.split(': ')[1])).toBeGreaterThan(0);

  const piEstimation = await page.locator('.statistics p:has-text("Pi Estimation")').textContent();
  expect(parseFloat(piEstimation.split(': ')[1])).toBeGreaterThan(0);

  // Reset the simulation
  await page.click('button:has-text("Reset")');

  // Check that the statistics have been reset
  await expect(page.locator('.statistics')).toContainText('Total Darts: 0');
  await expect(page.locator('.statistics')).toContainText('Pi Estimation: 0.00000');
});
```

### Success Criteria

#### Automated Verification

- [x] The file `e2e/pi-estimation.test.ts` is created as specified.
- [x] The end-to-end tests pass: `npm run test:e2e`.

---

## Phase 7: Update Header Navigation

### Overview

Add a link to the new `/pi-estimation` page in the main header component to make it accessible to users.

### Changes Required

#### 1. Update `Header.svelte`

**File**: `src/lib/components/layout/Header.svelte`
**Changes**: Add a new navigation link to the Pi Estimation page.

```svelte
<nav>
  <a href="/">Home</a>
  <a href="/brownian-motion">Brownian Motion</a>
  <a href="/pi-estimation">Pi Estimation</a>
</nav>
```

### Success Criteria

#### Automated Verification

- [x] The link to `/pi-estimation` is present in `src/lib/components/layout/Header.svelte`.
- [x] The navigation test for the header is updated and passes.

#### Manual Verification

- [ ] The "Pi Estimation" link is visible in the header on all pages.
- [ ] Clicking the link navigates the user to the `/pi-estimation` page.
