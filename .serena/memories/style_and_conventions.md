# Svelte 5 Runes (MANDATORY)

- Use `$state`, `$derived`, `$props`, `$effect` for ALL reactivity
- Use `$state.raw` for large objects only reassigned (not mutated)
- Prefer inline mutations for deeply reactive `$state` objects (`array.push()`)
- Use `$derived.by` for complex expressions
- Use `$effect` sparingly - prefer event handlers
- Use `$inspect.trace()` for debugging reactivity
- Use `$bindable()` for two-way props

# Legacy Svelte Features to AVOID

| Old              | Use Instead                |
| ---------------- | -------------------------- |
| `on:click={...}` | `onclick={...}`            |
| `<slot>`         | `{#snippet}` + `{@render}` |
| `export let`     | `$props()`                 |
| `$:`             | `$derived` / `$effect`     |
| `let count = 0`  | `$state(0)`                |
| `class:name`     | `class={clsx}`             |

# TypeScript

- **Strict mode** - no implicit any, no `any`
- Prefer `interface` for object shapes, `type` for unions/aliases
- Use `unknown` and narrow types
- Export types separately from values
- Document exports with JSDoc

# Naming Conventions

- Components/Stories: PascalCase (`Button.svelte`, `Button.stories.svelte`)
- Utils/tests: kebab-case (`utils.spec.ts`, `data-fetching/`)
- Props/functions: camelCase
- Types/interfaces: PascalCase

# Formatting (Vite+ Oxfmt)

- 2 spaces, no tabs
- Single quotes
- Trailing commas: all
- Print width: 100
- Sort imports enabled

# CSS & Styling (3-Tier Token System)

**Tier 1 - Primitives**: Absolute values (`--space-4`, `--gray-500`, `--radius-lg`)
**Tier 2 - Semantics**: Contextual tokens (`--surface-default`, `--text-primary`, `--action-primary-bg`)
**Tier 3 - Component Tokens**: Component-specific (apply in component `.svelte` files)

## Token Usage Rules

| Property           | Use Token                   | Example                                           |
| ------------------ | --------------------------- | ------------------------------------------------- |
| Spacing            | `--space-*`                 | `--space-4`, `--space-8`                          |
| Color              | Semantic tokens             | `--surface-default`, `--text-primary`             |
| Radius             | `--radius-lg` or higher     | `--radius-xl` (NEVER `--radius-none`)             |
| Font: Headers      | `--font-sans` (Itim)        | `font-family: var(--font-sans)`                   |
| Font: Code/Numbers | `--font-mono` (Roboto Mono) | `font-family: var(--font-mono)`                   |
| Interactive motion | `--ease-out-bounce`         | `transition: transform 0.2s var(--ease-out-back)` |

# UI Primitives (MANDATORY)

**RULE**: NEVER build primitives from scratch. Import from `bits-ui`.

```svelte
<script>
  import { Menu } from 'bits-ui';
</script>
```

# Accessibility Query Priority

`getByRole` > `getByLabelText` > `getByText` > `getByTestId`
