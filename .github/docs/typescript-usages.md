---
description: Outlines the best practices and conventions for using TypeScript, focusing on strictness, type safety, immutability, and code documentation using JSDoc.
---

# TypeScript Project Practices

This document outlines best practices and conventions for using TypeScript within this project to ensure type safety, maintainability, and code quality.

## General Guidelines

1. **Strictness**: Aim for the strictest possible TypeScript configuration (`tsconfig.json`) to catch errors early. Ensure `strict` mode is enabled.
2. **Type Inference**: Leverage TypeScript's powerful type inference. Explicitly type when inference is insufficient or when defining public APIs.
3. **Interfaces vs. Types**: Prefer `interface` for object shapes that can be implemented by classes. Use `type` for aliases, unions, intersections, and complex utility types.
4. **Immutability**: Favor immutable data structures where possible to prevent unexpected side effects. Use `readonly` properties and array methods that return new arrays.
5. **Utility Types**: Utilize TypeScript's built-in utility types (e.g., `Partial`, `Pick`, `Omit`, `Exclude`, `Record`) to create robust and flexible types.

## Module Organization

1. **Export Types Separately**: Export types and interfaces separately from values when possible, especially in shared modules.
2. **Barrel Files**: Use barrel files (`index.ts`) in directories to consolidate exports, simplifying imports from other modules.

## Type Safety Best Practices

1. **Discriminated Unions**: Use discriminated unions for h andling different states or types of data, improv i ng type safety in conditional logic.
2. **Narrowing**: Employ type narrowing t echniques (e.g., `typeof`, `instanceof`, `in`, custom i i itype guards) to safely work with union types.
3. **Avoid `any`**: Minimize the use of `any`. If a type is unknown, consider `unknown` and narrow it, or provide a specific type assertion with caution.

## Code Documentation

- **JSDoc for Exports**: All exported functions, types, interfaces, and variables should be documented with JSDoc. This provides essential inline context for both human developers and AI agents, explaining the purpose and usage of the code.

## Dependency Management

1. **Evaluation**: Before introducing a new dependency, thoroughly evaluate its benefits against potential costs. Consider factors such as:
   - Bundle size and performance impact.
   - Security vulnerabilities and audit history.
   - Maintenance burden and community support.
   - Licensing compatibility.
   - Alternatives (e.g., native browser APIs, simpler custom implementations).
2. **Permission**: New dependencies should only be added after explicit discussion and permission from the project maintainers or team lead. Document the rationale for its inclusion.
