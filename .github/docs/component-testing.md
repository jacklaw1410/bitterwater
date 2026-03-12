---
description: Specifies the strategy for testing Svelte components using Vitest and Svelte Testing Library, including guidelines on co-location, props testing, and event simulation.
---

# Component Testing Strategy (Vitest)

This document outlines the best practices for writing unit and component tests using Vitest.

## Guiding Principles

We follow the core principles of the Testing Library family:

> The more your tests resemble the way your software is used, the more confidence they can give you.

Our tests should focus on user-centric interactions and verify outcomes from a user's perspective, avoiding implementation details.

## Tools

- **Vitest**: Our primary framework for fast unit and component testing.
- **Svelte Testing Library**: For querying and interacting with Svelte components in tests.
- **`@testing-library/user-event`**: For realistic simulation of user interactions.

## Coverage & Thoroughness

Aim for **moderate to high coverage** of component states, prop variations, and user interaction paths. Focus on the component's public API and how it renders/behaves in isolation.

## Guidelines

- **Co-location**: Component test files (`.svelte.spec.ts`) must be co-located with the Svelte component they test (e.g., `MyComponent.svelte` and `MyComponent.svelte.spec.ts`).
- **Mounting Components**: Use `@testing-library/svelte`'s `render` function to mount components for testing.
- **Querying Elements**:
  - **Prioritize Accessibility**: Use accessibility-based queries to find elements, as it reflects how users and assistive technologies interact with the application.
  - **Query Priority**: 1. `getByRole`: The preferred choice for most elements. 2. `getByLabelText`: Best for form fields. 3. `getByPlaceholderText` 4. `getByText` 5. `getByDisplayValue`
  - **Avoid Implementation Details**: Do not use class names, IDs, or `data-testid` attributes unless absolutely necessary.
- **Simulating User Events**:
  - **Use `user-event`**: Always prefer `@testing-library/user-event` over `fireEvent`. `user-event` simulates full user interactions (e.g., a `click` includes hover, focus, and pointer events), providing more realistic tests.
  - **Setup**: Initialize `user-event` at the beginning of your test.
- **Props Testing**: Verify component rendering and behavior across different prop values.
- **Assertions**: Use `expect` from Vitest and `@testing-library/jest-dom` matchers for clear and semantic assertions (e.g., `expect(element).toBeInTheDocument()`).
- **Snapshot Testing**: Use snapshot testing sparingly for complex UI structures, and ensure snapshots are regularly reviewed and updated.
- **Accessibility**: Include checks for basic accessibility concerns, such as appropriate ARIA attributes for interactive elements.
