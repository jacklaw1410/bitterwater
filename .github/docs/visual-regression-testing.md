---
description:
  Documents the visual regression testing strategy using Playwright, covering snapshot conventions,
  platform-specific handling, tolerance settings, and best practices.
---

# Visual Regression Testing Strategy

This document describes the visual regression testing practices used in the project for capturing
and comparing screenshots across different platforms.

## Overview

The project uses Playwright's built-in screenshot testing capabilities (`toHaveScreenshot()`) for
visual regression testing. This approach provides:

- **Automatic platform detection**: Playwright automatically generates platform-specific snapshots
  (`*-darwin.png`, `*-linux.png`)
- **Pixel-level comparison**: Configurable tolerance for acceptable visual differences
- **Integration with existing test suite**: No separate test runner required

## Snapshot Directory Structure

Snapshots are stored alongside their test files:

```
e2e/
├── home.test.ts
├── home.test.ts-snapshots/
│   ├── home-page-darwin.png
│   └── home-page-linux.png
├── cover-flow.test.ts
├── cover-flow.test.ts-snapshots/
│   ├── cover-flow-desktop-initial-darwin.png
│   ├── cover-flow-desktop-initial-linux.png
│   ├── cover-flow-desktop-scrolled-darwin.png
│   └── ...
```

## Naming Conventions

### Snapshot Files

- Format: `{description}-{platform}.png`
- Platform suffix: `-darwin.png` (macOS), `-linux.png` (Linux)
- Examples:
  - `home-page-darwin.png`
  - `cover-flow-desktop-initial-linux.png`
  - `blob-morphing-page-1-darwin.png`

### Test Describers

Use descriptive names that convey the test scenario:

```typescript
test.describe('Cover Flow page', () => {
  test('desktop viewport', async ({ page }) => {
    // Snapshot: cover-flow-desktop-initial.png
    await expect(page).toHaveScreenshot('cover-flow-desktop-initial.png');
  });
});
```

## Configuration Options

### Common Options

```typescript
await expect(page).toHaveScreenshot('snapshot-name.png', {
  animations: 'disabled', // Freeze animations for deterministic screenshots
  fullPage: true, // Capture entire scrollable page
  maxDiffPixelRatio: 0.01, // Accept 1% pixel difference
});
```

### Tolerance Guidelines

| Tolerance      | Use Case                          |
| -------------- | --------------------------------- |
| `0.01` (1%)    | Static layouts, minimal animation |
| `0.018` (1.8%) | Slight visual variance expected   |
| `0.03` (3%)    | Animations, complex rendering     |

## Best Practices

### 1. Wait for Fonts

Always wait for fonts to load before taking screenshots:

```typescript
await page.goto('/');
await page.evaluate(() => document.fonts.ready);
await expect(page).toHaveScreenshot('page.png');
```

### 2. Handle Animations

Use `animations: 'disabled'` to freeze animations for deterministic screenshots:

```typescript
await expect(page).toHaveScreenshot('page.png', {
  animations: 'disabled',
});
```

### 3. Test Multiple Viewports

Test critical layouts across different screen sizes:

```typescript
const VIEWPORTS = {
  desktop: { width: 1280, height: 720 },
  tablet: { width: 640, height: 480 },
  mobile: { width: 375, height: 667 },
} as const;

for (const [name, size] of Object.entries(VIEWPORTS)) {
  test(`${name} viewport`, async ({ page }) => {
    await page.setViewportSize(size);
    // ...
  });
}
```

### 4. Test Element State

For component-level screenshots, target specific elements:

```typescript
const header = page.locator('header');
await expect(header).toHaveScreenshot('navigation-header.png');
```

### 5. Control Animation Timing

Use Playwright's virtual clock for deterministic animation testing:

```typescript
await page.clock.install();
await page.goto('gallery/cover-flow');
// Capture initial state
await expect(page).toHaveScreenshot('initial.png');
// Fast-forward animations
await page.clock.fastForward(1000);
await expect(page).toHaveScreenshot('after-animation.png');
```

## Running Tests

### Run All E2E Tests

```bash
vp run test:e2e
```

### Run Specific Test File

```bash
vp run test:e2e -- e2e/home.test.ts
```

### Update Snapshots

**Local development (macOS):**

```bash
vp run test:e2e -- --update-snapshots
```

This generates `*-darwin.png` snapshots.

**CI environment (Linux):**

```bash
vp run test:e2e:ci-snapshot
```

This runs tests in a Docker container to generate `*-linux.png` snapshots.

> **Important**: Both darwin and linux snapshots must be committed together to ensure tests pass on
> all platforms.

## Common Issues

### Snapshot Mismatch Due to Fonts

If screenshots differ due to font rendering:

- Ensure `document.fonts.ready` is awaited
- Use `animations: 'disabled'` for static screenshots

### Animated Content Differences

For pages with animations:

- Use `animations: 'disabled'` to freeze animations for deterministic screenshots
- Use `page.clock.fastForward()` for deterministic timing
- Tolerance should follow the guidelines in the table above (never exceed 3%)

### Platform-Specific Rendering Differences

If darwin and linux snapshots differ significantly:

- Keep both versions (Playwright handles this automatically)
- Set `maxDiffPixelRatio` following the tolerance table above (never exceed 3%)
- Consider if the difference indicates a real bug

## Snapshot Review Checklist

Before committing snapshots:

- [ ] Verify changes are intentional UI updates
- [ ] Check both darwin and linux variants exist
- [ ] Review diff output for unexpected changes
- [ ] Ensure tests pass with new snapshots
- [ ] Add descriptive commit message explaining visual changes
