---
description: Testing overview. TDD philosophy, when to use unit/component/E2E tests.
---

# Testing Strategy

## Philosophy

Test-Driven Development (TDD). Every feature or bug fix must have tests that first fail, then pass.

## When to Use Which Test Type

- **Unit Tests**: Isolated logic (pure functions, utilities, business logic). No UI. Fast, pinpoint issues.
  - Coverage: **near 100%** branches, statements, edge cases.
  - Example: `formatDate(date)` utility.

- **Component Tests**: New/modified Svelte components. Interaction testing — rendering, reactivity, events in simulated browser.
  - Coverage: **moderate to high** — states, prop variations, interaction paths.
  - Example: `Button` component — label, styles, `onClick`, ARIA attributes.

- **E2E Tests**: Critical user flows, integrating components/services. Simulate real user interactions end-to-end.
  - Coverage: **low to moderate** number, **high thoroughness** for critical journeys.
  - Include keyboard navigation, focus management checks.
  - Example: User registration → login → dashboard.
