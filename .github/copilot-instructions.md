# Bitter Water Project Guidelines

## Core Principle

This is a Svelte 5 project. Your primary directive is to use Svelte 5 Runes for all reactive code.

## Context

Before starting any complex task, you MUST ground your understanding in our project's documentation:

- **Use Version Control**: Before modifying an existing file, use `git log` on that file to
  understand its history and the rationale behind previous changes.
- [Product Vision](../.github/docs/PRODUCT.md)
- [System Architecture](../.github/docs/ARCHITECTURE.md)
- [Testing Strategy and Rules](../.github/docs/TESTING.md)
  - [Unit Testing Guidelines](../.github/docs/unit-testing.md)
  - [Component Testing Guidelines](../.github/docs/component-testing.md)
  - [E2E Testing Guidelines](../.github/docs/e2e-testing.md)
  - [Visual Regression Testing](../.github/docs/visual-regression-testing.md)
- [Svelte Usages and Best Practices](../.github/docs/svelte-usages.md)
- [TypeScript Usages and Best Practices](../.github/docs/typescript-usages.md)

## Installation

### First-time Setup

After cloning the repository, install dependencies and Playwright browsers:

```bash
# Install dependencies
bun install

# Install Playwright browsers (required for E2E tests)
bunx playwright install --with-deps
```

### Playwright Browsers

Playwright requires browser binaries to run E2E tests. If tests fail with browser-related errors,
reinstall:

```bash
# Install Chromium, Firefox, and WebKit
bunx playwright install --with-deps

# Or install specific browser only
bunx playwright install chromium
```

The project uses Chromium by default in E2E tests.
