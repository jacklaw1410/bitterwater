---
description: Visual regression testing strategy using Playwright screenshots. Snapshot conventions, platform handling, tolerance.
---

# Visual Regression Testing Strategy

## Overview

Playwright's `toHaveScreenshot()` provides:

- **Automatic platform detection**: `*-darwin.png`, `*-linux.png`
- **Pixel-level comparison**: Configurable tolerance
- **Integrated test suite**: No separate runner

## Snapshot Directory

Snapshots stored alongside test files:

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
│   └── ...
```

## Naming Conventions

- Format: `{description}-{platform}.png`
- Suffix: `-darwin.png`, `-linux.png`

```typescript
test.describe('Cover Flow page', () => {
  test('desktop viewport', async ({ page }) => {
    await expect(page).toHaveScreenshot('cover-flow-desktop-initial.png');
  });
});
```

## Configuration Options

```typescript
await expect(page).toHaveScreenshot('snapshot-name.png', {
  animations: 'disabled',
  fullPage: true,
  maxDiffPixelRatio: 0.01,
});
```

### Tolerance Guidelines

| Tolerance      | Use Case                          |
| -------------- | --------------------------------- |
| `0.01` (1%)    | Static layouts, minimal animation |
| `0.018` (1.8%) | Slight visual variance            |
| `0.03` (3%)    | Animations, complex rendering     |

## Best Practices

### 1. Wait for Fonts

```typescript
await page.goto('/');
await page.evaluate(() => document.fonts.ready);
await expect(page).toHaveScreenshot('page.png');
```

### 2. Handle Animations

`animations: 'disabled'` freezes animations for deterministic screenshots.

### 3. Test Multiple Viewports

```typescript
const VIEWPORTS = {
  desktop: { width: 1280, height: 720 },
  tablet: { width: 640, height: 480 },
  mobile: { width: 375, height: 667 },
} as const;

for (const [name, size] of Object.entries(VIEWPORTS)) {
  test(`${name} viewport`, async ({ page }) => {
    await page.setViewportSize(size);
  });
}
```

### 4. Test Element State

```typescript
const header = page.locator('header');
await expect(header).toHaveScreenshot('navigation-header.png');
```

### 5. Control Animation Timing

```typescript
await page.clock.install();
await page.goto('gallery/cover-flow');
await expect(page).toHaveScreenshot('initial.png');
await page.clock.fastForward(1000);
await expect(page).toHaveScreenshot('after-animation.png');
```

## Running Tests

```bash
vp run test:e2e
vp run test:e2e -- e2e/home.test.ts
```

### Update Snapshots

> **Warning**: Investigate mismatch root cause first. Update only after confirming:
>
> 1. Change is **intentional**
> 2. New behavior is **correct**
> 3. Change **reviewed and approved**

**Local (macOS):**

```bash
vp run test:e2e -- --update-snapshots
```

**CI (Linux):**

```bash
vp run test:e2e:ci-snapshot
```

> Both darwin + linux snapshots must be committed together.

## Common Issues

### Font Rendering Differences

- Await `document.fonts.ready`
- `animations: 'disabled'` for static screenshots

### Animated Content

- `animations: 'disabled'`
- `page.clock.fastForward()` for deterministic timing
- Tolerance ≤ 3%

### Platform Differences

- Keep both versions (Playwright handles automatically)
- `maxDiffPixelRatio` ≤ 3%
- Check if difference indicates real bug

## Snapshot Review Checklist

- [ ] Investigate WHY snapshot no longer matches
- [ ] Verify change is intentional UI update
- [ ] Check both darwin + linux variants exist
- [ ] Review diff for unexpected changes
- [ ] Ensure tests pass with new snapshots
- [ ] Descriptive commit message for visual changes

> If snapshot fails, don't immediately reach for `--update-snapshots`. Determine if mismatch indicates legitimate issue needing fix in code.
