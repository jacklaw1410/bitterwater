# Bitter Water - Agent Guidelines

Svelte 5 web app. Vite+, SvelteKit, Bun package manager. See [.github/docs/](./.github/docs/) for detailed guidelines.

## Coding Principles

Adapted from [Andrej Karpathy's LLM coding guidelines](https://github.com/forrestchang/andrej-karpathy-skills). These reduce common mistakes by biasing toward caution over speed.

### Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

- State assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

**Test:** Every changed line should trace directly to the user's request.

### Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

## First-time Setup

```bash
bun install
bunx playwright install --with-deps
```

## Design Context

### Users

Potential collaborators. Showcase technical expertise via portfolio of interactive experiments, creative coding, modern web stack (Svelte 5).

### Brand Personality

**Playful, Technical, Precise.** Evoke "Delight in the playfulness" while maintaining high-quality execution and precision of technical portfolio.

### Aesthetic Direction

**Stripe, but more relaxed and playful.** Organic, less rigid than Swiss-style or corporate designs. Avoid overly serious or dry. Use playful `Itim` typeface contrast with technical `Roboto Mono` and vibrant blue brand palette.

### Design Principles

1. **Playful Precision**: Harmonize handwritten charm with technical accuracy. Use `Itim` for personality and `Roboto Mono` for technical clarity, backed by rigorous 3-tier CSS token system.
2. **Organic Quality**: Favor relaxed, organic layouts over rigid grids. Aim for "looser" version of high-end design systems (like Stripe) that feels approachable yet professional.
3. **Delightful Interaction**: Prioritize animations and micro-interactions that spark joy and curiosity, going beyond simple functional feedback.
4. **Functional Transparency**: Codebase is part of portfolio. Maintain high standards for Svelte 5 Runes, TypeScript strictness, modular architecture.
5. **Accessible Inclusion**: Ensure WCAG AA standards, first-class experience in both light and dark modes.

## Build Commands

```bash
vp dev                    # Start dev server
vp dev --port 3000        # Dev server on specific port
vp build                  # Production build
vp preview                # Preview production build
vp check                  # Format, lint, type checks
vp lint                   # Linter
vp fmt                    # Auto-format code
vp test                   # Unit tests (Vitest)
vp test --run             # Unit tests once
vp run test:e2e           # E2E tests (Playwright)
vp run storybook          # Storybook on port 6006
vp run build-storybook    # Build Storybook static site
```

### Running Single Test

```bash
vp test src/routes/gallery/brownian-motion/utils.spec.ts
vp test --project storybook src/stories/Button.stories.svelte
```

## Code Style

### Formatting (Vite+ Oxfmt)

- 2 spaces, no tabs
- Single quotes
- Trailing commas: all
- Print width: 100

> Note: Formatting handled by Vite+ (Oxfmt). Config in `vite.config.ts`.

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
- Imports auto-organized by Oxfmt

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

See `.github/docs/`:

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

### When to Create Worktree

Always ask:

> "Worktree or current branch?"

**Create worktree when:**

- Significant changes, multiple sessions
- Risky refactors
- User explicitly requests isolation

**Work directly when:**

- Quick fixes, small changes
- Fast iteration needed
- No risk to main

### Worktree Lifecycle

1. **Create**: `git worktree add ../<name> -b <branch-name>`
2. **Work**: Implement changes
3. **Commit**: Clear commit message
4. **Tear down**:

   ```bash
   git worktree remove ../<worktree-name>
   git branch -d <branch-name>
   rm -rf ../<worktree-name>
   ```

### Git Safety Protocol

- **Never force push** to main
- **Never update git config**
- **Never skip hooks** (--no-verify) unless explicitly requested
- **Never run destructive commands** (hard reset, --force) without explicit request

## Review Checklist

Before submitting changes:

- [ ] `vp check` - type errors
- [ ] `vp lint` - linting issues
- [ ] `vp test` - unit tests
- [ ] `vp run test:e2e` - E2E tests
- [ ] `vp build` - production build
