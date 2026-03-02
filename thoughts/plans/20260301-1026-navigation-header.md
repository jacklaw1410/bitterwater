# Implementation Plan: Navigation Header and Site-wide Styling

## Overview

This document outlines the plan to implement a site-wide navigation header, a footer, and a global styling theme to create a more polished and consistent user experience across the application.

## Current State Analysis

The research phase has identified that the main layout file (`src/routes/+layout.svelte`) is the correct place to implement the site-wide layout changes. A global stylesheet (`src/app.css`) has been created and linked in `src/app.html`, and new `Header.svelte` and `Footer.svelte` components have been created in `src/lib/components/layout`.

## Desired End State

All pages in the application will share a consistent header. The header will provide navigation between the home page and the Brownian motion visualizer. The overall site will have a modern, professional look and feel, defined by the new global stylesheet. The new navigation functionality will be covered by E2E tests.

## Implementation Approach

The implementation will be broken down into three phases:

1. **Finalize Components and Styling**: Ensure the new components and global styles are complete.
2. **Integrate into Layout**: Update the main layout to use the new components and structure.
3. **E2E Testing**: Create a new E2E test to verify the navigation.

---

## Phase 1: Finalize Components and Styling

### Overview

This phase focuses on ensuring the new components and global styles are complete and correct. We will also perform a cost-benefit analysis of using a third-party component library.

### Cost-Benefit Analysis: Third-Party vs. Custom Components

**Option 1: Custom Components (Current Approach)**

- **Pros**:
  - Full control over markup, styling, and behavior.
  - No new dependencies, keeping the bundle size minimal.
  - Aligns with the project's current "build from scratch" approach.
- **Cons**:
  - Requires more time to build and test each component.
  - We are responsible for accessibility and cross-browser compatibility.

**Option 2: Third-Party Component Library (e.g., `shadcn-svelte`, `bits-ui`)**

- **Pros**:
  - Faster development time, as many components are pre-built.
  - Accessibility and best practices are often built-in.
  - `shadcn-svelte` and `bits-ui` are unstyled, providing a good balance of customization and pre-built logic.
- **Cons**:
  - Adds new dependencies and a learning curve.
  - May introduce a level of abstraction that makes customization more difficult.
  - Potential for bundle size increase.

**Recommendation**:
Given the small scope of the current task (a simple header and layout), the overhead of adding a new component library is likely not justified. The current approach of creating custom components is sufficient. For future, more complex features, a component library should be re-evaluated.

### Changes Required

#### 1. Global Stylesheet

**File**: `src/app.css`
**Changes**: No changes are required. The file has been created and contains the necessary CSS variables and body styles.

#### 2. Header Component

**File**: `src/lib/components/layout/Header.svelte`
**Changes**: No changes are required. The file has been created and contains the necessary markup and styles for the navigation header.

### Success Criteria

#### Automated Verification

- [ ] Type checking passes: `bun check`
- [ ] Linting passes: `bun lint`

---

## Phase 2: Integrate into Layout

### Overview

This phase integrates the new components into the main layout file and ensures the new global styles are applied correctly.

### Changes Required

#### 1. Update Main Layout

**File**: `src/routes/+layout.svelte`
**Changes**: The file has been updated to include the `Header` and `Footer` components and a more structured layout. No further changes are required.

### Success Criteria

#### Automated Verification

- [ ] Type checking passes: `bun check`
- [ ] Linting passes: `bun lint`

#### Manual Verification

- [ ] The header and footer are visible on all pages.
- [ ] The navigation links in the header work correctly.
- [ ] The global styles are applied correctly.

---

## Phase 3: E2E Testing

### Overview

Create a new E2E test file to verify the navigation functionality.

### Changes Required

#### 1. Create E2E Test

**File**: `e2e/navigation.test.ts`
**Changes**: Create a new E2E test to verify that the header is present on all pages and that the navigation links work correctly.

```typescript
import { test, expect } from '@playwright/test';

test('navigation header', async ({ page }) => {
  // Check the home page
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Svelte 101' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Brownian Motion' })).toBeVisible();

  // Visual regression test for the header
  const header = page.locator('header');
  await expect(header).toHaveScreenshot('navigation-header.png');

  // Check the Brownian motion page
  await page.goto('/brownian-motion');
  await expect(page.getByRole('link', { name: 'Svelte 101' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Brownian Motion' })).toBeVisible();

  // Test navigation
  await page.getByRole('link', { name: 'Home' }).click();
  await expect(page).toHaveURL('/');
});
```

### Success Criteria

#### Automated Verification

- [ ] All E2E tests pass: `bun test:e2e`

## References

- Related research: `thoughts/research/20260301-1200-navigation-header.md`
