# Bitter Water - Agent Guidelines

This is a Svelte 5 web application using Bun, Vite, and SvelteKit. Review the [project docs](./.github/docs/) for detailed guidelines.

## Design Context

### Users

The primary audience is potential collaborators. The goal is to showcase technical expertise through a portfolio of interactive experiments, creative coding, and a modern web stack (Svelte 5).

### Brand Personality

**Playful, Technical, Precise.** The project aims to evoke "Delight in the playfulness" while maintaining the high-quality execution and precision of a technical portfolio.

### Aesthetic Direction

**Stripe, but more relaxed and playful.** The UI should feel organic and less rigid than traditional "Swiss-style" or corporate designs. It avoids being overly serious or dry, using the playful `Itim` typeface to contrast with the technical `Roboto Mono` and a vibrant blue brand palette.

### Design Principles

1. **Playful Precision**: Harmonize handwritten charm with technical accuracy. Use `Itim` for personality and `Roboto Mono` for technical clarity, backed by a rigorous 3-tier CSS token system.
2. **Organic Quality**: Favor relaxed, organic layouts over rigid grids. Aim for a "looser" version of high-end design systems (like Stripe) that feels approachable yet professional.
3. **Delightful Interaction**: Prioritize animations and micro-interactions that spark joy and curiosity, going beyond simple functional feedback.
4. **Functional Transparency**: The codebase itself is part of the portfolio. Maintain high standards for Svelte 5 Runes, TypeScript strictness, and modular architecture.
5. **Accessible Inclusion**: Ensure general accessibility standards (WCAG AA) and provide a first-class experience in both light and dark modes.

## Build Commands

```bash
# Development
bun dev                    # Start dev server
bun dev --port 3000        # Dev server on specific port

# Build & Preview
bun run build                  # Production build
bun preview                # Preview production build

# Type checking
bun check                  # Run svelte-check + TypeScript checks
bun check:watch           # Watch mode for type checking

# Linting & Formatting
bun lint                   # Run ESLint + Prettier checks
bun format                 # Auto-format code with Prettier

# Testing
bun test:unit              # Run unit tests (Vitest)
bun test:e2e               # Run E2E tests (Playwright)
bun test                   # Run all tests (unit + e2e)

# Storybook
bun storybook             # Start Storybook on port 6006
bun build-storybook        # Build Storybook static site
```

### Running a Single Test

```bash
# Single unit test file
bun test:unit src/routes/gallery/brownian-motion/utils.spec.ts

# Single E2E test
bun test:e2e e2e/home.test.ts

# Single storybook test
bun test:unit --project storybook src/stories/Button.stories.svelte
```

## Code Style

### Formatting (Prettier)

- 2 spaces, no tabs
- Single quotes
- Trailing commas: all
- Print width: 100
- Plugins: `prettier-plugin-organize-imports`, `prettier-plugin-svelte`

### TypeScript

- **Strict mode enabled** - no implicit any
- Prefer `interface` for object shapes, `type` for unions/aliases
- Avoid `any` - use `unknown` and narrow
- Export types separately from values
- Document exports with JSDoc

### Svelte 5 Runes (MANDATORY)

- Use `$state`, `$derived`, `$props`, `$effect` for all reactivity
- Use `$state.raw` for large objects only reassigned (not mutated)
- Prefer inline mutations for deeply reactive `$state` objects (`array.push()`)
- Use `$derived.by` for complex expressions
- Use `$effect` sparingly - prefer event handlers
- Prefer `$inspect.trace()` for debugging reactivity

### Legacy Svelte Features to AVOID

| Old              | Use Instead                |
| ---------------- | -------------------------- |
| `on:click={...}` | `onclick={...}`            |
| `<slot>`         | `{#snippet}` + `{@render}` |
| `export let`     | `$props()`                 |
| `$:`             | `$derived` / `$effect`     |
| `let count = 0`  | `$state(0)`                |
| `class:name`     | `class={clsx}`             |

### Naming Conventions

- Components: PascalCase (`PlayPauseToggle.svelte`)
- Stories: PascalCase (`PlayPauseToggle.stories.svelte`)
- Utils/tests: kebab-case (`utils.spec.ts`, `brownian-motion/`)
- Props/functions: camelCase
- Types/interfaces: PascalCase

### Imports

- Use `$app/state` for page state (SvelteKit 2.1+)
- Use `$lib/` path alias for lib imports
- Organize imports with Prettier plugin

## Testing Strategy

### Unit Tests (Vitest)

- Test pure functions and utilities in `*.spec.ts` files
- Aim for near 100% coverage
- Mock external dependencies
- Location: alongside code being tested

### Component Tests (Storybook)

- Use Storybook interaction tests via `play` function
- Import from `storybook/test` not `@testing-library`
- Query priority: `getByRole` > `getByLabelText` > `getByText` > `getByTestId`
- Location: `*.stories.svelte` files (not `.spec.ts`)

### E2E Tests (Playwright)

- Files in `e2e/` directory, named `*.test.ts`
- Use page-level locators: `page.getByRole()`, `page.getByLabel()`
- Avoid CSS/XPath selectors - prefer accessibility queries
- Include screenshot snapshots with `toMatchSnapshot()`

## Project Documentation

See `.github/docs/` for:

- [ARCHITECTURE.md](./.github/docs/ARCHITECTURE.md) - Tech stack & structure
- [svelte-usages.md](./.github/docs/svelte-usages.md) - Svelte 5 best practices
- [typescript-usages.md](./.github/docs/typescript-usages.md) - TypeScript guidelines
- [TESTING.md](./.github/docs/TESTING.md) - Testing overview
- [unit-testing.md](./.github/docs/unit-testing.md) - Vitest guidelines
- [component-testing.md](./.github/docs/component-testing.md) - Storybook testing
- [e2e-testing.md](./.github/docs/e2e-testing.md) - Playwright guidelines
- [storybook-guidelines.md](./.github/docs/storybook-guidelines.md) - Story structure

## Review Checklist

Before submitting changes:

- [ ] Run `bun check` for type errors
- [ ] Run `bun lint` for linting issues
- [ ] Run `bun test:unit` for unit tests
- [ ] Run `bun test:e2e` for E2E tests
- [ ] Run `bun run build` to verify production build
