---
description: E2E test strategy using Playwright. Locators, assertions, snapshot testing.
---

# End-to-End (E2E) Testing Strategy (Playwright)

## Tools

- **Playwright**: Reliable, fast E2E testing across browsers.

## Coverage & Thoroughness

Aim for **low to moderate coverage** in number of tests, but **high thoroughness** for critical user journeys. Focus on high-value scenarios that, if broken, severely impact the user.

## Guidelines

- **Naming**: Test files named `[feature-name].test.ts` in `e2e/` directory.
- **Navigation**: `await page.goto('/your-route')`.
- **Locator Priority**:
  1. **`page.getByRole()`**: Preferred. Locate by explicit/implicit ARIA roles. Always include accessible name.
  2. **`page.getByLabel()`**: Form controls with label.
  3. **`page.getByPlaceholder()`**: Inputs with placeholder text.
  4. **`page.getByText()`**: Non-interactive elements (`div`, `span`, `p`).
  5. **`page.getByAltText()`**: Images.
  6. **`page.getByTitle()`**: Elements with `title` attribute.
- **Test IDs**: `page.getByTestId()` — last resort. Use `data-testid` only when semantic locators unavailable.
- **Semantic HTML First**: Before using `page.locator('...')` or `data-testid`, improve HTML semantics (e.g., `aria-labelledby` on `<section>`) so `getByRole()` works naturally.
- **No Redundant ARIA**: Don't duplicate implicit roles. `<section>` already has implicit `role="region"`. See [ARIA in HTML](https://www.w3.org/TR/html-aria/).
- **Test Consolidation**: For simple pages, single `test()` case covering title, content, screenshots. Multiple test blocks add overhead.
- **User Interactions**: `click()`, `fill()`, `press()`, etc.
- **Assertions**: `expect` API — `await expect(locator).toBeVisible()`, `await expect(page).toHaveURL(...)`.
- **Snapshot Testing**: `expect(locator).toMatchSnapshot()` for visual regression.
  - **Visual-Heavy Pages**: Galleries, paint demos, art pages — use `fullPage: true` to capture complete rendering.
  - **Static Pages**: Omit `maxDiffPixelRatio`. Only set tolerance for animations/dynamic content (see visual-regression-testing.md).
- **Deterministic**: No random/unpredictable data. Use fixed test data or mock APIs.
- **Accessibility**: Include keyboard navigation, focus management checks.
