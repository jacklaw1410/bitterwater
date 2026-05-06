# Testing Strategy

## Unit Tests (Vitest)

- Test pure functions, utilities in `*.spec.ts` files alongside code
- Mock external dependencies (APIs, stores)
- Run via `bunx vp test` or `bun run test:all`

## Component Tests (Storybook)

- Storybook `play` function for interactions
- Import from `storybook/test` (NOT `@testing-library`)
- **Query priority**: `getByRole` > `getByLabelText` > `getByText` > `getByTestId`

## E2E Tests (Playwright)

- Full user journeys in `e2e/*.test.ts`
- Use `page.getByRole()`, `page.getByLabel()`
- Include screenshot snapshots with `expect(page).toHaveScreenshot()`

## Visual Regression

- Platform-specific snapshots: `*-darwin.png`, `*-linux.png`
- Configure tolerance via `maxDiffPixelRatio`

# Verification Checklist

Run in order until all pass:

1. **Format**: `bun run format` (fix formatting)
2. **Lint**: `bun run lint` (check linting)
3. **Type Check**: `bun run check` (svelte-check + TypeScript)
4. **Unit Tests**: `bunx vp test --project client` or `--project server`
5. **Storybook Tests**: `bunx vp test --project storybook`
6. **E2E Tests**: `bun run test:e2e`
7. **Build**: `bun run build` (production build)

# Git Safety Protocol

- **Never force push** to main
- **Never update git config**
- **Never skip hooks** (`--no-verify`)
- **Never destructive commands** (hard reset) without explicit request

# Worktree Management

For multi-file/multi-session tasks or risky refactors:

```bash
# Create
git worktree add ../<name> -b <branch-name>

# Tear down
git worktree remove ../<worktree-name>
git branch -d <branch-name>
rm -rf ../<worktree-name>
```
