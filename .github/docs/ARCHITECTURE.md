---
description: Architecture overview. Svelte 5, Storybook, Vite, Playwright, Vitest, directory structure.
---

# Architecture

Component-driven architecture. Svelte 5 Runes for reactivity, state management.

## Core Technologies

- **Svelte 5**: Primary UI framework. All components MUST use Runes (`$state`, `$derived`, `$props`).
- **Bits UI**: Headless UI library for accessible, unstyled component logic.
- **Storybook**: Component development, documentation.
- **Vite**: Build tool.
- **Playwright**: E2E testing.
- **Vitest**: Unit, component testing.

## Design System

3-tier CSS token architecture in `static/app.css`:

1. **Primitives**: Absolute values (`--brand-500: #3b82f6`).
2. **Semantics**: Contextual aliases, supports theming (`--action-primary-bg: var(--brand-500)`).
3. **Component Tokens**: Scoped overrides.

## Directory Structure

- `src/routes`: Page-level components.
- `src/lib/components/ui`: Atomic, reusable UI primitives (Buttons, Inputs). Built with Bits UI + Vanilla CSS.
- `src/lib/components/app`: Application-specific components, complex features.
- `src/lib`: Shared logic, utilities, services.
- `src/stories`: Storybook stories, Design System documentation.
- `e2e`: Playwright E2E tests.
