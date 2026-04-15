---
description: Specifies the strategy for writing end-to-end (E2E) tests for critical user journeys using Playwright, including conventions for locators, assertions, and snapshot testing.
---

# End-to-End (E2E) Testing Strategy (Playwright)

This document outlines the best practices for writing end-to-end tests using Playwright.

## Tools

- **Playwright**: Our framework for reliable and fast E2E testing across browsers.

## Coverage & Thoroughness

Aim for **low to moderate coverage** in terms of number of tests, but **high thoroughness** for the most critical user journeys. These tests are slower, so focus on high-value scenarios that, if broken, would severely impact the user.

## Guidelines

- **Naming Convention**: All Playwright test files must be named `[feature-name].test.ts` and reside in the `e2e/` directory.
- **Page Navigation**: Use `await page.goto('/your-route')` to navigate to the starting point of your test scenario.
- **Locator Strategy**: Prioritize user-facing locators that reflect how users and assistive technologies perceive the page. This makes tests more resilient to implementation changes. Follow this priority order:
  1. **`page.getByRole()`**: The preferred method. Locate by explicit and implicit accessibility roles (e.g., `'button'`, `'heading'`, `'checkbox'`). Always try to include an accessible name (e.g., `{ name: 'Submit' }`).
  2. **`page.getByLabel()`**: For form controls associated with a label.
  3. **`page.getByPlaceholder()`**: For inputs with placeholder text.
  4. **`page.getByText()`**: For non-interactive elements like `div`, `span`, or `p`.
  5. **`page.getByAltText()`**: For images.
  6. **`page.getByTitle()`**: For elements with a `title` attribute.
- **Test IDs (`page.getByTestId()`)**: Use `data-testid` attributes as a last resort when an element cannot be reliably identified by user-facing attributes. This provides a stable testing contract but is not visible to the user.
- **Avoid Brittle Selectors**: Do not use CSS or XPath locators directly (`page.locator('...')`). They are tied to the DOM structure and can easily break.
- **Semantic HTML First**: Before adding `data-testid`, consider improving HTML semantics (e.g., adding `aria-labelledby` to `<section>` elements) so tests can use `getByRole()` naturally.
- **No Redundant ARIA**: Don't add explicit ARIA attributes that duplicate implicit roles. For example, `<section>` already has implicit `role="region"`. See [ARIA in HTML](https://www.w3.org/TR/html-aria/) for reference.
- **Test Consolidation**: For simple pages, consolidate into a single `test()` case covering title, key content, and screenshots. Multiple test blocks add unnecessary overhead.
- **User Interactions**: Simulate user actions like `click()`, `fill()`, `press()`, etc.
- **Assertions**: Use Playwright's `expect` API for assertions (e.g., `await expect(locator).toBeVisible()`, `await expect(page).toHaveURL(/.*dashboard/)`).
- **Snapshot Testing**: Use `expect(locator).toMatchSnapshot()` for visual regression testing of critical UI elements or full pages. Ensure snapshots are updated when UI changes are intentional.
  - **Visual-Heavy Pages**: For galleries, paint demos, art pages, or any visual feature, use `fullPage: true` to capture the complete rendering.
  - **Static Pages**: Omit `maxDiffPixelRatio` for purely static pages. Only set tolerance for pages with animations or dynamic content (see visual-regression-testing.md for tolerance guidelines).
- **Deterministic Tests**: Ensure tests are deterministic and do not rely on random or unpredictable data. Use fixed test data or mock APIs where necessary.
- **Accessibility**: Include checks for critical accessibility pathways, such as keyboard navigation through a form or focus management.
