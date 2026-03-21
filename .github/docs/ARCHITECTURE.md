---
description: Outlines the project's component-driven architecture, core technologies (Svelte 5, Storybook, Vite, Playwright, Vitest), and standard directory structure.
---

# Architecture

This project follows a component-driven architecture, emphasizing the use of Svelte 5 Runes for reactivity and state management.

## Core Technologies

- **Svelte 5**: The primary UI framework. All new components MUST use Runes (`$state`, `$derived`, `$props`) for reactivity.
- **Bits UI**: Foundational headless UI library for accessible, unstyled component logic.
- **Storybook**: Used for component development and documentation.
- **Vite**: The build tool.
- **Playwright**: For End-to-End (E2E) testing.
- **Vitest**: For unit and component testing.

## Design System

The project uses a native CSS design system with a **3-tier token architecture** defined in `static/app.css`:

1. **Primitives**: Absolute values (e.g., `--brand-500: #3b82f6`).
2. **Semantics**: Contextual aliases that support theming (e.g., `--action-primary-bg: var(--brand-500)`).
3. **Component Tokens**: Scoped overrides for specific UI elements.

## Directory Structure

- `src/routes`: Contains all page-level components.
- `src/lib/components/ui`: Atomic, reusable UI primitives (Buttons, Inputs, etc.) built with Bits UI and Vanilla CSS.
- `src/lib/components/app`: Application-specific components and complex features.
- `src/lib`: For shared logic, utilities, and services.
- `src/stories`: Contains all Storybook stories and Design System documentation.
- `e2e`: Contains all Playwright E2E tests.
