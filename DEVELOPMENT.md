# Development Setup

## First-time Setup

```bash
bun install
bunx playwright install --with-deps
```

## Build Commands

```bash
bun run dev                    # Start dev server
bun run dev --port 3000        # Dev server on specific port
bun run build                  # Production build
bun run preview                # Preview production build
bun run check                  # Format, lint, type checks
bun run lint                   # Linter
bun run format                 # Auto-format code
bun run test:all               # Run all tests (unit + e2e)
bun run test:e2e               # E2E tests (Playwright)
bun run verify                 # The CI-equivalent gate: toolchain conformance + check + unit tests + build
bun run storybook              # Storybook on port 6006
bun run build-storybook        # Build Storybook static site
```

### Verification (the standard gate)

Before opening a PR — and before every dependency change — run the CI-equivalent gate:

```bash
bun run verify
```

`bun run verify` runs, in order:

1. **Toolchain conformance** — `scripts/check-toolchain.ts` fails fast if the pinned `vite` / `vitest` / `vite-plus` triad (manifest + overrides), the lockfile resolutions, and the CI workflow's global `vite-plus` pin disagree, or if a floating `latest`/range spec was reintroduced. This is the July-outage guard: the triad must move as one unit, pinned exactly, everywhere.
2. **`vp check`** (format + lint) with `CI=1`.

### Dependency notes

- **opencv-js (`@techstark/opencv-js`): 4.x and 5.x are both supported.** OpenCV 5.0 changed the `HoughLinesP` output layout from one row per line (`N×4`) to a single flat row (`1×4N`); the pixelation mesh reader counts lines from the data length, which is layout-agnostic (issue #36). The mesh-sanity canary and the mesh probe (browser test project, real wasm) are the upgrade gates: they must pass with whichever major is installed.

3. **Unit tests** (`vp test --run`) with `CI=1`.
4. **Production build** (`vp build`) with `CI=1`.

So "verified locally" always means "verified like CI". A drifted toolchain fails at step 1 with a message naming expected vs actual versions and the file to fix.

**Always run the project's `vp` (`bunx vp` / `bun run` scripts), never a bare global `vp`.** Since 0.2.x the toolchain is a single-instance design: a global `vp` invocation runs its runner against a _different_ vitest instance than the one spec files import, which crashes server-project suites with `TypeError: Cannot read properties of undefined (reading 'config')`. CI installs the global pin only as the conformance source of truth and runs every step via `bunx vp`.

**Pin policy.** Toolchain entries (`vite`, `vitest`, `vite-plus`) must be exact pins in `devDependencies` and `overrides` — no `latest`, no ranges. The conformance check enforces this; CI runs it in every job.

**Toolchain shape (0.2.x, since #41).** `vite-plus` pins `@voidzero-dev/vite-plus-core` (the `vite` alias) at the same version and bundles `vitest` directly — so `vitest` is the plain package at the version `vite-plus` itself declares (4.1.10), not an alias to a wrapper (the `@voidzero-dev/vite-plus-test` track ended at 0.1.x). `vite-plus/test/browser-playwright` re-exports `@vitest/browser-playwright`, which must be installed at the same version. The conformance check derives the expected `vitest` version from the installed `vite-plus` manifest, so mixed vitest versions stay a hard error.

**`build-storybook` is excluded from `verify`.** It is currently broken upstream (svelte2tsx has no TS 7 support) — do not treat it as a regression of your change.

### Running Single Test

```bash
bunx vp test src/routes/gallery/brownian-motion/utils.spec.ts
bunx vp test --project storybook src/stories/Button.stories.svelte
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

### UI Primitives & Accessibility

- **RULE: NEVER build primitives (Dialog, Select, Accordion, Dropdown) from scratch.**
- You MUST import and use `bits-ui` for complex UI components. Custom accessibility logic will be rejected.

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

- Test pure functions, utilities, and complex logic in `*.spec.ts` files.
- ALWAYS mock external dependencies (APIs, stores).
- Location: Place alongside the code being tested (e.g., `utils.spec.ts` next to `utils.ts`).

### Component Tests (Storybook)

- Use Storybook interaction tests (`play` function) for UI components.
- Import from `storybook/test` (NOT `@testing-library`).
- **Query priority (STRICT):** `getByRole` > `getByLabelText` > `getByText` > `getByTestId`.
- Location: `*.stories.svelte` files.

### E2E Tests (Playwright)

- Test full user journeys and integration points.
- Location: Files in `e2e/` directory, named `*.test.ts`.
- **Query priority (STRICT):** Use `page.getByRole()`, `page.getByLabel()`. NEVER use CSS/XPath selectors.
- Include screenshot snapshots with `expect(page).toHaveScreenshot()`.

### Visual Regression Testing

- Uses platform-specific snapshots (`*-darwin.png`, `*-linux.png`).
- Configure tolerance via `maxDiffPixelRatio` to prevent flaky tests.

## UI & Styling Constraints

**RULE: NEVER use subjective or inline CSS styling. Use deterministic CSS tokens.**

1. **Spacing & Layout:**
   - NEVER use hardcoded pixel values for spacing (`margin`, `padding`, `gap`).
   - YOU MUST use the token scale: `var(--spacing-xs)` through `var(--spacing-xl)`.
   - Avoid rigid grids. Favor flex layouts using `gap: var(--spacing-md)` or similar for "organic" flow.

2. **Colors:**
   - NEVER use raw hex codes (e.g., `#000000`).
   - YOU MUST use the brand palette (e.g., `var(--color-brand-blue)`, `var(--color-bg)`, `var(--color-text)`).

3. **Radii & Borders (The "Playful" Aesthetic):**
   - NEVER use perfectly square corners (`border-radius: 0`) for containers.
   - YOU MUST apply `var(--radius-lg)` or `var(--radius-xl)` to achieve the soft, approachable style.

4. **Typography:**
   - Headers/Display Text MUST use `var(--font-itim)`.
   - Technical Data, Code Blocks, and Numbers MUST use `var(--font-roboto-mono)`.

5. **Interactions:**
   - All interactive elements (buttons, cards) MUST include motion.
   - YOU MUST use: `transition: transform 0.2s var(--ease-out-back);` and `transform: scale(0.98);` on `:active` states.

## Worktree Management

**RULE: Automatically create a worktree for tasks spanning multiple files/sessions or risky refactors. Use the current branch for quick fixes.**

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

- [ ] `bun run check` - type errors
- [ ] `bun run lint` - linting issues
- [ ] `bun run test:all` - unit and E2E tests
- [ ] `bun run build` - production build
