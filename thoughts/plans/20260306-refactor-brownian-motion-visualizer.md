# Brownian Motion Visualizer Refactoring Implementation Plan

## Overview

This plan details the refactoring of the Brownian motion visualizer. The primary goals are to improve code structure by colocating related files and to make the main page component (`+page.svelte`) leaner by extracting state management and simulation logic into a dedicated Svelte 5 store.

## Current State Analysis

The existing implementation has its state and simulation logic directly within the `+page.svelte` component. While functional, this makes the page component bloated and tightly couples the UI with the business logic. The component files are also scattered in the generic `$lib/components/brownian-motion/` directory instead of being colocated with the feature route. The research document `thoughts/research/20260306-brownian-motion-visualizer-structure.md` provides a detailed breakdown of the current architecture.

## Desired End State

- All Svelte components related to the Brownian motion visualizer will be located in `src/routes/brownian-motion/components/`.
- The core logic will be in `src/routes/brownian-motion/utils.ts`.
- All state and simulation logic will be managed by a new state module at `src/routes/brownian-motion/state.svelte.ts`.
- The `+page.svelte` component will be lean, primarily responsible for importing and using the state, and composing the UI components.
- There will be no functional regressions. The visualizer will behave identically to the user.

### Key Discoveries

- The existing components (`Controls`, `Statistics`, `BrownianMotion`) are purely presentational and receive all data via props, which will make it straightforward to switch them to using a store.
- Svelte 5 runes (`$state`, `$effect`) are already in use, so the transition to a store-based pattern will be consistent with the existing codebase.

## What We're NOT Doing

- Changing the visual appearance or functionality of the simulation.
- Introducing new features.
- Changing the underlying simulation mathematics.

## Implementation Approach

The refactoring will be done in three distinct phases: first, we will colocate all the files. Second, we will create the store and extract all the logic into it. Finally, we will refactor all components to use the store.

## Phase 1: File Relocation

### Overview

In this phase, we will move all the components and utility files related to the Brownian motion visualizer into the `src/routes/brownian-motion/` directory to improve colocation.

### Changes Required

1. **Create new directories**:
   - `src/routes/brownian-motion/components`
2. **Move files**:
   - `mv src/lib/components/brownian-motion/BrownianMotion.svelte src/routes/brownian-motion/components/`
   - `mv src/lib/components/brownian-motion/Controls.svelte src/routes/brownian-motion/components/`
   - `mv src/lib/components/brownian-motion/Statistics.svelte src/routes/brownian-motion/components/`
   - `mv src/lib/utils/brownian-motion.ts src/routes/brownian-motion/utils.ts`
   - `mv src/lib/utils/brownian-motion.spec.ts src/routes/brownian-motion/utils.spec.ts`

### Success Criteria

#### Automated Verification

- [x] All files are moved to their new locations.
- [ ] The application will fail to build at this stage, which is expected.

#### Manual Verification

- [ ] The file structure in the VS Code explorer matches the desired state.

---

## Phase 2: State and Logic Extraction

### Overview

We will create a new state management module (`state.svelte.ts`) that exports a singleton `$state` object. This approach simplifies state management by providing a single, reactive source of truth that can be imported directly into any component, completely eliminating the need for prop drilling.

### Changes Required

1.  **Create `src/routes/brownian-motion/state.svelte.ts`**:

    ```typescript
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
      isPlaying: true,
      particles: [] as Particle[],
      width: INITIAL_WIDTH,
      height: INITIAL_HEIGHT,
    });

    export function reset() {
      state.particleCount = INITIAL_PARTICLE_COUNT;
      state.speed = INITIAL_SPEED;
      state.particleSize = INITIAL_PARTICLE_SIZE;
      state.particleColor = INITIAL_PARTICLE_COLOR;
      state.showTrails = INITIAL_SHOW_TRAILS;
      state.width = INITIAL_WIDTH;
      state.height = INITIAL_HEIGHT;
    }

    function update() {
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
    }

    export function initializeEffects() {
      $effect(() => {
        if (!state.isPlaying) return;

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
    }
    ```

### Success Criteria

#### Automated Verification

- [x] The file `src/routes/brownian-motion/state.svelte.ts` is created with the specified content.
- [x] Unit tests for `utils.ts` should still pass.

#### Manual Verification

- [ ] The state file exports a `state` object and associated functions.

---

## Phase 3: Component Refactoring

### Overview

Now we will update all the components to consume the state directly from the new `state.svelte.ts` module. This will remove all prop drilling and make the components leaner.

### Changes Required

1.  **Refactor `src/routes/brownian-motion/+page.svelte`**:

    ```svelte
    <script lang="ts">
      import BrownianMotion from './components/BrownianMotion.svelte';
      import Controls from './components/Controls.svelte';
      import Statistics from './components/Statistics.svelte';
      import { initializeEffects } from './state.svelte.js';

      initializeEffects();
    </script>

    <svelte:head>
      <title>Brownian Motion</title>
    </svelte:head>

    <h1>Brownian Motion Visualizer</h1>

    <Controls />
    <Statistics />
    <BrownianMotion />
    ```

2.  **Refactor `src/routes/brownian-motion/components/Controls.svelte`**:

    ```svelte
    <script lang="ts">
      import { state, reset } from '../state.svelte.js';
    </script>

    <div class="controls">
      <div class="layer">
        <button onclick={() => (state.isPlaying = !state.isPlaying)}
          >{state.isPlaying ? 'Pause' : 'Play'}</button
        >
        <button style="margin-right: 1em;" onclick={reset}>Reset</button>
        <label>
          Width:
          <input
            type="number"
            bind:value={state.width}
            min={100}
            max={2000}
            aria-label="Canvas width"
          />
        </label>
        <label>
          Height:
          <input
            type="number"
            bind:value={state.height}
            min={100}
            max={2000}
            aria-label="Canvas height"
          />
        </label>
      </div>

      <div class="layer">
        <label>
          Particles: {state.particleCount}
          <input
            type="range"
            bind:value={state.particleCount}
            min={10}
            max={500}
            aria-label="Number of particles"
          />
        </label>

        <label>
          Speed: {state.speed.toFixed(1)}
          <input
            type="range"
            bind:value={state.speed}
            min={0.5}
            max={10}
            step={0.1}
            aria-label="Particle speed"
          />
        </label>

        <label>
          Size: {state.particleSize}
          <input
            type="range"
            bind:value={state.particleSize}
            min={1}
            max={6}
            aria-label="Particle size"
          />
        </label>

        <label>
          Color:
          <input type="color" bind:value={state.particleColor} aria-label="Particle color" />
        </label>

        <label>
          Show Trails:
          <input type="checkbox" bind:checked={state.showTrails} aria-label="Show trails" />
        </label>
      </div>
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

3.  **Refactor `src/routes/brownian-motion/components/Statistics.svelte`**:

    ```svelte
    <script lang="ts">
      import { state } from '../state.svelte.js';

      const particles = $derived(state.particles);
      const xbar = $derived(particles.reduce((acc, cur) => acc + cur.x, 0) / particles.length);
      const ybar = $derived(particles.reduce((acc, cur) => acc + cur.y, 0) / particles.length);
      const vxbar = $derived(particles.reduce((acc, cur) => acc + cur.vx, 0) / particles.length);
      const vybar = $derived(particles.reduce((acc, cur) => acc + cur.vy, 0) / particles.length);
      const vbar = $derived(
        particles.reduce((acc, cur) => acc + Math.sqrt(cur.vx ** 2 + cur.vy ** 2), 0) /
          particles.length,
      );
    </script>

    {#if particles.length > 0}
      <div class="container">
        <table aria-label="Position statistics">
          <tbody>
            <tr>
              <td><span class="bar">x</span></td>
              <td class="value"><code>{xbar.toFixed(4)}</code></td>

              <td><span class="bar">y</span></td>
              <td class="value"><code>{ybar.toFixed(4)}</code></td>
            </tr>
          </tbody>
        </table>

        <table aria-label="Velocity statistics">
          <tbody>
            <tr>
              <td><span class="bar">v<sub>x</sub></span></td>
              <td class="value"><code>{vxbar.toFixed(4)}</code></td>

              <td><span class="bar">v<sub>y</sub></span></td>
              <td class="value"><code>{vybar.toFixed(4)}</code></td>

              <td><span class="bar">v</span></td>
              <td class="value"><code>{vbar.toFixed(4)}</code></td>
            </tr>
          </tbody>
        </table>
      </div>
    {:else}
      <p>No particles to display statistics.</p>
    {/if}

    <style>
      .container {
        display: flex;
        flex-direction: row;
        gap: 1em;
        margin-bottom: 1em;
      }
      .bar {
        border-top: 1px solid currentColor;
      }
      code {
        font-size: 0.8em;
      }
      td.value {
        width: 80px;
      }
    </style>
    ```

4.  **Refactor `src/routes/brownian-motion/components/BrownianMotion.svelte`**:

    ```svelte
    <script lang="ts">
      import { state } from '../state.svelte.js';

      let canvasElement: HTMLCanvasElement;

      $effect(() => {
        const ctx = canvasElement.getContext('2d');
        if (!ctx) return;
        const { width, height } = canvasElement;

        if (state.showTrails) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
          ctx.fillRect(0, 0, width, height);
        } else {
          ctx.clearRect(0, 0, width, height);
        }

        for (const p of state.particles) {
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, state.particleSize * 2);
          gradient.addColorStop(0, `${state.particleColor}ff`);
          gradient.addColorStop(0.2, `${state.particleColor}99`);
          gradient.addColorStop(1, `${state.particleColor}00`);

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(p.x, p.y, state.particleSize * 2, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    </script>

    <canvas bind:this={canvasElement} width={state.width} height={state.height}></canvas>

    <style>
      canvas {
        border: 1px solid #ccc;
        display: block;
      }
    </style>
    ```

### Success Criteria

#### Automated Verification

- [ ] `vite build` completes successfully.
- [ ] All unit tests pass.

#### Manual Verification

- [ ] The Brownian motion visualizer is fully functional and interactive at `/brownian-motion`.
- [ ] All controls (particles, speed, size, color, trails, dimensions, play/pause, reset) work as expected.
- [ ] There are no visual or functional regressions compared to the original implementation.

## Testing Strategy

### Unit Tests

- The existing unit tests for `brownian-motion.ts` (now `utils.ts`) should be updated to reflect the new file path and will continue to cover the core simulation logic.

### Manual Testing Steps

1. Navigate to `/brownian-motion`.
2. Verify the simulation starts automatically.
3. Interact with each slider and control, confirming that the simulation updates in real-time.
4. Use the "Pause" and "Play" buttons to control the animation.
5. Use the "Reset" button to return the simulation to its initial state.
6. Toggle the "Show Trails" checkbox to verify the background clearing behavior.

## References

- Related research: `thoughts/research/20260306-brownian-motion-visualizer-structure.md`
