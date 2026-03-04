---
description: Outlines the project's component-driven architecture, core technologies (Svelte 5, Storybook, Vite, Playwright, Vitest), and standard directory structure.
---

# Architecture

This project follows a component-driven architecture, emphasizing the use of Svelte 5 Runes for reactivity and state management.

## Core Technologies

- **Svelte 5**: The primary UI framework. All new components MUST use Runes (`$state`, `$derived`, `$props`) for reactivity.
- **Storybook**: Used for component development and documentation.
- **Vite**: The build tool.
- **Playwright**: For End-to-End (E2E) testing.
- **Vitest**: For unit and component testing.

## Directory Structure

- `src/routes`: Contains all page-level components.
- `src/lib`: For shared logic, utilities, and services.
- `src/stories`: Contains all Storybook stories and related components.
- `e2e`: Contains all Playwright E2E tests.
