# Bitter Water - Agent Guidelines

This is a Svelte 5 web application using Vite+, SvelteKit, and Bun as the package manager. Review the [project docs](./.github/docs/) for detailed guidelines.

## First-time Setup

```bash
# Install dependencies
bun install

# Install Playwright browsers (required for E2E tests)
bunx playwright install --with-deps
```

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
vp dev                    # Start dev server
vp dev --port 3000        # Dev server on specific port

# Build & Preview
vp build                  # Production build
vp preview                # Preview production build

# Type checking
vp check                  # Run format, lint, and type checks

# Linting & Formatting
vp lint                   # Run linter
vp fmt                    # Auto-format code

# Testing
vp test                   # Run unit tests (Vitest)
vp test --run             # Run unit tests once
vp run test:e2e           # Run E2E tests (Playwright)

# Storybook
vp run storybook          # Start Storybook on port 6006
vp run build-storybook    # Build Storybook static site
```

### Running a Single Test

```bash
# Single unit test file
vp test src/routes/gallery/brownian-motion/utils.spec.ts

# Single storybook test
vp test --project storybook src/stories/Button.stories.svelte
```

## Code Style

### Formatting (Vite+ Oxfmt)

- 2 spaces, no tabs
- Single quotes
- Trailing commas: all
- Print width: 100

> Note: Formatting is now handled by Vite+ (Oxfmt). Configuration is in `vite.config.ts`.

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
- Imports are auto-organized by Oxfmt

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
- Include screenshot snapshots with `expect(page).toHaveScreenshot()`
- Visual regression tests use platform-specific snapshots (`*-darwin.png`, `*-linux.png`)
- Configure tolerance with `maxDiffPixelRatio` option

## Project Documentation

See `.github/docs/` for:

- [ARCHITECTURE.md](./.github/docs/ARCHITECTURE.md) - Tech stack & structure
- [svelte-usages.md](./.github/docs/svelte-usages.md) - Svelte 5 best practices
- [typescript-usages.md](./.github/docs/typescript-usages.md) - TypeScript guidelines
- [TESTING.md](./.github/docs/TESTING.md) - Testing overview
- [unit-testing.md](./.github/docs/unit-testing.md) - Vitest guidelines
- [component-testing.md](./.github/docs/component-testing.md) - Storybook testing
- [e2e-testing.md](./.github/docs/e2e-testing.md) - Playwright guidelines
- [visual-regression-testing.md](./.github/docs/visual-regression-testing.md) - Screenshot testing
- [storybook-guidelines.md](./.github/docs/storybook-guidelines.md) - Story structure

## Worktree Management

### When to Create a Worktree

When asked to implement changes, always ask:

> "Should I create a new worktree for this work, or work directly in the current branch?"

**Create a worktree when:**

- Making significant changes that may take multiple sessions
- Experimenting with risky refactors
- The user explicitly requests isolated work

**Work directly in current branch when:**

- Quick fixes or small changes
- User wants fast iteration
- No risk of destabilizing main

### Worktree Lifecycle

1. **Create**: `git worktree add ../<name> -b <branch-name>`
2. **Work**: Implement changes in the worktree
3. **Commit**: Commit changes with clear commit message
4. **Tear down**: After completion or when done, remove the worktree:

   ```bash
   git worktree remove ../<worktree-name>
   git branch -d <branch-name>
   ```

### Git Safety Protocol

- **Never force push** to main
- **Never update git config** during work
- **Never skip hooks** (--no-verify) unless explicitly requested
- **Never run destructive commands** (hard reset, --force) without explicit request

## Review Checklist

Before submitting changes:

- [ ] Run `vp check` for type errors
- [ ] Run `vp lint` for linting issues
- [ ] Run `vp test` for unit tests
- [ ] Run `vp run test:e2e` for E2E tests
- [ ] Run `vp build` to verify production build
