# Testing

- **Unit Tests (Vitest)**: Pure functions and utilities in `*.spec.ts` files. Aim for near 100% coverage.
- **Component Tests (Storybook)**: Storybook interaction tests using the `play` function. Use `getByRole` > `getByLabelText` > `getByText`.
- **E2E Tests (Playwright)**: Located in `e2e/`, named `*.test.ts`. Use page-level locators (e.g., `page.getByRole()`).

# Quality Check Procedures

Before completing any task, ensure the following commands are run:

1. **Linting**: `bun lint` (ESLint + Prettier).
2. **Formatting**: `bun format` (Auto-format with Prettier).
3. **Type Checking**: `bun check` (svelte-check + TypeScript).
4. **Unit Tests**: `bun test:unit` (Vitest).
5. **E2E Tests**: `bun test:e2e` (Playwright).
6. **Build Verification**: `bun run build` (Production build verification).

# Verification Strategy

- For significant changes, run the full test suite (`bun test`).
- Always run `bun check` and `bun lint` to maintain code standards.
- If a production build fails, fix all issues before finalizing.
