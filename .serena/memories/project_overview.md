# Project Purpose

Bitter Water is a personal digital garden and gallery of interactive web experiences, visualizations, and experiments.

# Tech Stack

- **Framework**: Svelte 5 (with Runes: `$state`, `$derived`, `$props`, `$effect`)
- **Meta-framework**: SvelteKit
- **Runtime**: Bun
- **Bundler**: Vite
- **UI Libraries**: Bits UI (headless UI)
- **Styling**: Native CSS with a 3-tier token architecture (Primitives, Semantics, Component Tokens)
- **Testing**: Vitest (Unit), Playwright (E2E), Storybook (Interaction tests)
- **Documentation/Workbench**: Storybook
- **Linting/Formatting**: ESLint, Prettier (with `prettier-plugin-organize-imports`, `prettier-plugin-svelte`)
- **Type Checking**: TypeScript (Strict mode)

# Codebase Structure

- `src/routes`: SvelteKit pages and routes.
- `src/lib/components/ui`: Atomic, reusable UI primitives (Buttons, Inputs, etc.).
- `src/lib/components/app`: Application-specific components and complex features.
- `src/lib`: Shared logic, utilities, and services.
- `src/stories`: Storybook stories and Design System documentation.
- `static`: Static assets and global CSS (`app.css`).
- `e2e`: Playwright E2E tests.
- `.github/docs`: Detailed project documentation.

# Development Environment

- **OS**: Darwin (macOS)
- **Package Manager**: Bun
