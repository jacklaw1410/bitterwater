# End-to-End (E2E) Testing Strategy (Playwright)

This document outlines the best practices for writing end-to-end tests using Playwright.

## Tools

- **Playwright**: Our framework for reliable and fast E2E testing across browsers.

## Coverage & Thoroughness

Aim for **low to moderate coverage** in terms of number of tests, but **high thoroughness** for the most critical user journeys. These tests are slower, so focus on high-value scenarios that, if broken, would severely impact the user.

## Guidelines

- **Naming Convention**: All Playwright test files must be named `[feature-name].test.ts` and reside in the `e2e/` directory.
- **Page Navigation**: Use `await page.goto('/your-route')` to navigate to the starting point of your test scenario.
- **Locator Strategy**: Prefer robust locators based on roles, text, or test IDs (e.g., `page.getByRole('button', { name: 'Submit' })`, `page.getByText('Welcome')`, `page.locator('[data-testid="my-element"]')`). Avoid brittle CSS selectors that rely on implementation details.
- **User Interactions**: Simulate user actions like `click()`, `fill()`, `press()`, etc.
- **Assertions**: Use Playwright's `expect` API for assertions (e.g., `await expect(locator).toBeVisible()`, `await expect(page).toHaveURL(/.*dashboard/)`).
- **Snapshot Testing**: Use `expect(locator).toMatchSnapshot()` for visual regression testing of critical UI elements or full pages. Ensure snapshots are updated when UI changes are intentional.
- **Deterministic Tests**: Ensure tests are deterministic and do not rely on random or unpredictable data. Use fixed test data or mock APIs where necessary.
- **Accessibility**: Include checks for critical accessibility pathways, such as keyboard navigation through a form or focus management.
