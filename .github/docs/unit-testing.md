---
description: Specifies the strategy for writing isolated unit tests for non-component logic (pure functions, utilities) using Vitest, with a focus on high coverage and mocking dependencies.
---

# Unit Testing Strategy (Vitest) for Non-Component Logic

This document outlines the best practices for writing isolated unit tests for pure JavaScript/TypeScript logic, utility functions, and business logic, explicitly excluding Svelte components.

## Philosophy

Unit tests focus on the smallest testable parts of our codebase (functions, classes, modules) in isolation, **without any UI components or DOM interaction**. The goal is to verify the correctness of individual logical units.

## Tools

- **Vitest**: Our primary framework for fast unit testing.

## Coverage & Thoroughness

Aim for **high coverage (near 100%)** of all branches, statements, and edge cases within the isolated unit. Focus on functional correctness, not integration or UI.

## Guidelines

1. **Scope**: Unit tests are strictly for non-component JavaScript/TypeScript logic. For Svelte components, refer to `component-testing.md`.
2. **Isolation**: Test units in complete isolation. Mock any external dependencies (e.g., API calls, modules, global objects) to ensure the test only verifies the unit under test.
3. **Naming Convention**: Unit test files should typically be named `[module-name].test.ts` or `[function-name].test.ts` and reside alongside the code they test, or in a dedicated `__tests__` directory if preferred for larger modules.
4. **Assertions**: Use `expect` from Vitest for clear and concise assertions. Focus on input-output correctness and edge cases.
5. **Pure Functions**: Prioritize unit testing pure functions, as they are easier to test in isolation.
