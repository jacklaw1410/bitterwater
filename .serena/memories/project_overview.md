# Project Purpose

Bitter Water is a personal digital garden and gallery of interactive web experiences, visualizations, and experiments.

# Tech Stack

- **Framework**: Svelte 5 (with Runes: `$state`, `$derived`, `$props`, `$effect`, `$bindable`, `$effect.root`, `$inspect`)
- **Meta-framework**: SvelteKit 2.57
- **Build/Lint/Format**: Vite+ (via `vp` CLI)
- **Package Manager**: Bun
- **UI Libraries**: Bits UI 2.18 (headless UI - MANDATORY for primitives)
- **Media Processing**: OpenCV.js, heic-to
- **Styling**: Native CSS with 3-tier token architecture (Primitives → Semantics → Component Tokens)
- **Testing**: Vitest (Unit/Component via browser), Playwright (E2E), Storybook 10
- **Linting**: oxc, typescript-eslint, unicorn, eslint-plugin-svelte

# Codebase Structure

- `src/routes`: SvelteKit pages and routes
- `src/lib/components/ui`: Atomic UI primitives (from bits-ui)
- `src/lib/components/app`: Application-specific components
- `src/lib`: Shared logic, utilities, services
- `src/stories`: Storybook stories for design system
- `static/app.css`: Global CSS with token system
- `static/`: Static assets
- `e2e/`: Playwright E2E tests (`*.test.ts`)
- `.github/docs`: Project documentation

# Key Constraints

- **RULE**: NEVER build primitives (Dialog, Select, Accordion, Dropdown) from scratch. Use bits-ui.
- **RULE**: NEVER use hardcoded px values. Use `var(--spacing-*)` tokens.
- **RULE**: NEVER use raw hex colors. Use semantic tokens (`var(--color-*)`).
- **RULE**: Interactive elements MUST include motion (`transition: transform 0.2s var(--ease-out-back)`).
