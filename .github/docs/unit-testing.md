---
description: Unit testing strategy using Vitest for pure functions and utilities. High coverage, mocking.
---

# Unit Testing Strategy (Vitest)

Test isolated logic — functions, classes, modules — without UI components or DOM interaction.

## Philosophy

Unit tests focus on smallest testable parts in isolation. Verify correctness of individual logical units.

## Tools

- **Vitest**: Fast unit testing framework.

## Coverage

Aim for **high coverage (near 100%)** — all branches, statements, edge cases. Focus on functional correctness.

## Guidelines

1. **Scope**: Non-component JS/TS logic only. For Svelte components, see `component-testing.md`.
2. **Isolation**: Mock external dependencies (API calls, modules, globals). Test only the unit under test.
3. **Naming**: `[module-name].test.ts` or `[function-name].test.ts` alongside code, or in `__tests__/` for larger modules.
4. **Assertions**: `expect` from Vitest. Focus on input-output correctness, edge cases.
5. **Pure Functions**: Prioritize. Easier to test in isolation.
