---
description: Provides a high-level overview of the project's Test-Driven Development (TDD) philosophy and gives guidance on when to use unit, component, or end-to-end (E2E) tests.
---

# Project Testing Strategy

This document provides an overview of our project's testing philosophy, tools, and links to more detailed guidelines for specific testing types.

## Philosophy

We follow a Test-Driven Development (TDD) approach. Every new feature or bug fix must be accompanied by tests that first fail and then pass.

## When to Use Which Test Type

To ensure comprehensive and efficient testing, choose the appropriate test type based on the nature of your code changes:

- **Unit Tests**: Use for verifying isolated logic (pure functions, utility modules, business logic) that has no direct UI interaction. These tests are fast and pinpoint issues precisely.
  - **Coverage & Thoroughness**: Aim for **high coverage (near 100%)** of all branches, statements, and edge cases within the isolated unit. Focus on functional correctness, not integration or UI.
  - **Example**: Testing a `formatDate(date)` utility function to ensure it returns correctly formatted strings for various date inputs.
- **Component Tests**: Use when creating new Svelte components or modifying existing ones. These tests verify component rendering, reactivity to props, and emitted events in a simulated browser environment, ensuring UI pieces work as expected.
  - **Coverage & Thoroughness**: Aim for **moderate to high coverage** of component states, prop variations, and user interaction paths. Focus on the component's public API and how it renders/behaves in isolation.
  - **Example**: Testing a `Button` component to ensure it renders the correct label, applies the right styles based on `variant` prop, emits an `onClick` event when clicked, and has appropriate ARIA attributes for accessibility.
- **End-to-End (E2E) Tests**: Employ for critical user flows or when integrating multiple components and services. E2E tests simulate real user interactions across the entire application, validating that the system works correctly from an end-user perspective.
  - **Coverage & Thoroughness**: Aim for **low to moderate coverage** in terms of number of tests, but **high thoroughness** for the most critical user journeys. These tests are slower, so focus on high-value scenarios that, if broken, would severely impact the user. **Include checks for critical accessibility pathways**, such as keyboard navigation through a form or focus management.
  - **Example**: Testing a user registration flow from filling out the form to successful login and navigation to a dashboard, verifying all steps work together.
