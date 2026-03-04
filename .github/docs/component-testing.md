---
description: Specifies the strategy for testing Svelte components using Vitest and Svelte Testing Library, including guidelines on co-location, props testing, and event simulation.
---

# Component Testing Strategy (Vitest)

This document outlines the best practices for writing unit and component tests using Vitest.

## Tools

- **Vitest**: Our primary framework for fast unit and component testing.
- **Svelte Testing Library**: For querying and interacting with Svelte components in tests.

## Coverage & Thoroughness

Aim for **moderate to high coverage** of component states, prop variations, and user interaction paths. Focus on the component's public API and how it renders/behaves in isolation.

## Guidelines

- **Co-location**: Component test files (`.svelte.spec.ts`) must be co-located with the Svelte component they test (e.g., `MyComponent.svelte` and `MyComponent.svelte.spec.ts`).
- **Mounting Components**: Use `@testing-library/svelte`'s `render` function to mount components for testing.
- **Props Testing**: Verify component rendering and behavior across different prop values.
- **Event Simulation**: Simulate user interactions (e.g., clicks, input changes) using `@testing-library/svelte`'s `fireEvent`.
- **Assertions**: Use `expect` from Vitest and `@testing-library/jest-dom` matchers for clear and semantic assertions (e.g., `expect(element).toBeInTheDocument()`).
- **Snapshot Testing**: Use snapshot testing sparingly for complex UI structures, and ensure snapshots are regularly reviewed and updated.
- **Accessibility**: Include checks for basic accessibility concerns, such as appropriate ARIA attributes for interactive elements.
