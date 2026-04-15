---
description: TypeScript best practices. Strictness, type safety, immutability, JSDoc documentation.
---

# TypeScript Project Practices

## General Guidelines

1. **Strictness**: Strictest TypeScript config (`tsconfig.json`). Ensure `strict` mode enabled.
2. **Type Inference**: Leverage inference. Explicitly type when inference insufficient or for public APIs.
3. **Interfaces vs Types**: Prefer `interface` for object shapes. Use `type` for aliases, unions, intersections, utility types.
4. **Immutability**: Favor immutable data structures. Use `readonly` properties, array methods returning new arrays.
5. **Utility Types**: Use built-in utility types (`Partial`, `Pick`, `Omit`, `Exclude`, `Record`).

## Module Organization

1. **Export Separately**: Export types, interfaces separately from values.
2. **Barrel Files**: `index.ts` consolidating exports, simplifying imports.

## Type Safety

1. **Discriminated Unions**: Handle different states/data, improving type safety in conditional logic.
2. **Narrowing**: `typeof`, `instanceof`, `in`, custom type guards for union types.
3. **Avoid `any`**: Minimize. Use `unknown` + narrow, or specific type assertion with caution.
4. **Component Prop Inheritance**:
   - Headless UI wrappers: `type Props = { custom: string } & ButtonRootProps`
   - Native HTML wrappers: `type Props = HTMLAttributes<HTMLDivElement>`

## Code Documentation

- **JSDoc for Exports**: All exported functions, types, interfaces, variables documented with JSDoc.

## Dependency Management

1. **Evaluation**: Before new dependency, evaluate benefits vs costs:
   - Bundle size, performance impact
   - Security vulnerabilities, audit history
   - Maintenance burden, community support
   - Licensing compatibility
   - Alternatives (native browser APIs, simpler implementations)
2. **Permission**: New dependencies only after explicit discussion, permission from maintainers. Document rationale.

## Convention

- Concise arrow functions preferred.
