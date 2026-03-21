# Design System & UI Library Implementation Plan

## Overview

Introduce a Headless UI-based design system using Bits UI v1 and Vanilla CSS. We will establish a robust, comprehensive 3-tier design token architecture, create a clear component hierarchy separating reusable UI atoms from application-specific components, and build our first accessible primitives using Svelte 5 Runes.

## Current State Analysis

- The project uses Svelte 5 and SvelteKit.
- Styling is native CSS using basic CSS variables (`--color-primary`, `--spacing`) defined globally in `static/app.css`. It lacks a structured primitive vs. semantic token hierarchy.
- Theming (Light/Dark mode) is handled via a `theme` Svelte writable in `src/lib/theme.ts` which toggles a `data-theme='dark'` attribute on the `<html>` tag.
- Custom components (`FeatureCard`, `PlayPauseToggle`, `layout/`) currently sit at the root of `src/lib/components/`.
- Storybook v10 is configured and working.

## Desired End State

- A formalized 3-tier design token system in `static/app.css` (Primitives → Semantics → Component Tokens) encompassing all 7 foundational categories: Color, Typography, Dimension, Shape, Elevation, Motion, and Additional Primitives.
- Existing app components moved to `src/lib/components/app/`.
- Reusable UI primitives located in `src/lib/components/ui/`.
- `bits-ui` installed for accessible, headless component logic.
- `Button`, `Input`, `Form Control`, and `Typography` components implemented using Svelte 5 `$props()`, Snippets, and Vanilla CSS class merging.
- A Storybook story specifically documenting the comprehensive design system tokens.

### Key Discoveries

- Bits UI v1 provides unstyled, accessible primitives that rely on `data-*` attributes for state (e.g., `data-state="open"`).
- Svelte 5 replaces `export let`, `<slot>`, and `on:click` with `$props()`, `{#snippet}`, and standard event attributes spread via `...restProps`.
- Industry-standard design systems separate tokens into Primitives (absolute values like `#0F62FE`) and Semantics (contextual values like `color-primary` or `surface-background`).

## What We're NOT Doing

- We are NOT using Tailwind CSS, UnoCSS, or any other utility-class framework.
- We are NOT using `tailwind-merge` or `clsx` for class merging; we will use standard JavaScript arrays/strings.
- We are NOT rewriting the entire application's UI, only setting up the foundation and migrating existing components.

## Implementation Approach

We will build strict Svelte 5 wrapper components around Headless UI primitives (Bits UI) and native HTML elements. Styling will be scoped within the component's native `<style>` block using our global semantic CSS variables.

---

## Phase 1: Formalize Comprehensive 3-Tier Design Tokens

### Overview

Restructure `static/app.css` to follow a strict 3-tier token architecture covering all 7 core token categories: Color, Typography, Dimension, Shape, Elevation, Motion, and Primitives.

### Changes Required

#### 1. CSS Variable Architecture

**File**: `static/app.css`
**Changes**: Add comprehensive scales for all token categories.

```css
:root {
  /* =========================================
     TIER 1: PRIMITIVES (Absolute Values)
     ========================================= */

  /* 1. COLOR PRIMITIVES */
  --gray-50: #f9fafb; /* ... through --gray-900 */
  --brand-50: #eff6ff; /* ... through --brand-900 */
  --success-50: #f0fdf4; /* ... through --success-900 */
  --warning-50: #fffbeb; /* ... through --warning-900 */
  --error-50: #fef2f2; /* ... through --error-900 */

  /* 2. TYPOGRAPHY SCALES */
  --font-sans: 'Itim', cursive; /* Default font */
  --font-mono: 'Roboto Mono', monospace;
  --text-xs: 0.75rem; /* ... through --text-4xl */
  --font-normal: 400; /* ... through --font-bold */
  --line-height-tight: 1.25; /* ... through --line-height-loose */

  /* 3. DIMENSION (Spacing & Sizing) */
  --space-0: 0px;
  --space-1: 0.25rem; /* 4px ... through --space-16 */
  --size-icon-sm: 1rem;
  --size-icon-md: 1.5rem;

  /* 4. SHAPE & RADIUS */
  --radius-none: 0px;
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-full: 9999px;

  /* 5. ELEVATION & DEPTH */
  --shadow-none: none;
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --z-below: -1;
  --z-default: 1;
  --z-dropdown: 40;
  --z-modal: 50;

  /* 6. MOTION & ANIMATION */
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-out-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);

  /* 7. ADDITIONAL PRIMITIVES */
  --opacity-disabled: 0.5;
  --opacity-overlay: 0.8;
  --border-width-thin: 1px;
  --border-width-thick: 2px;
  --screen-md: 768px;
  --screen-lg: 1024px;

  /* =========================================
     TIER 2: SEMANTICS (Contextual/Themed)
     ========================================= */

  /* A. Background / Surface */
  --surface-default: #ffffff;
  --surface-raised: var(--gray-50);
  --surface-overlay: var(--gray-100);

  /* B. Foreground / Text & Icon */
  --text-primary: var(--gray-900);
  --text-secondary: var(--gray-500);
  --text-inverse: #ffffff;
  --text-disabled: var(--gray-400);

  /* C. Border */
  --border-default: var(--gray-200);
  --border-focus: var(--brand-500);

  /* D. Action / Interactive */
  --action-primary-bg: var(--brand-500);
  --action-primary-hover: var(--brand-600);
  --action-primary-active: var(--brand-700);
  --action-disabled-bg: var(--gray-100);

  /* E. Status / Feedback */
  --status-success: var(--success-500);
  --status-warning: var(--warning-500);
  --status-error: var(--error-500);
}

/* Dark Mode Semantic Overrides */
[data-theme='dark'] {
  --surface-default: var(--gray-900);
  --surface-raised: var(--gray-800);
  --surface-overlay: var(--gray-700);

  --text-primary: var(--gray-50);
  --text-secondary: var(--gray-400);
  --text-disabled: var(--gray-600);

  --border-default: var(--gray-700);
  --border-focus: var(--brand-400);

  --action-primary-bg: var(--brand-600);
  --action-primary-hover: var(--brand-500);
  --action-disabled-bg: var(--gray-800);
}
```

### Success Criteria

#### Automated Verification

- [x] CSS compiles correctly: `bun run build`

#### Manual Verification

- [x] Inspect the DOM in the browser to ensure the new CSS variables are present on the `:root` element.

---

## Phase 2: Component Reorganization & Infrastructure

### Overview

Reorganize existing components to make room for the new UI library and install necessary dependencies.

### Changes Required

1. **Move App Components**: Move `FeatureCard`, `PlayPauseToggle`, and `layout/` into `src/lib/components/app/`. Update references in `src/routes/+layout.svelte` and Storybook.
2. **Install Dependencies**: Run `bun add bits-ui`.

### Success Criteria

#### Automated Verification

- [x] Type checking passes: `bun check`
- [x] Unit tests pass: `bun test:unit`
- [x] Storybook builds successfully: `bun build-storybook`

#### Manual Verification

- [x] Ensure the dev server runs (`bun dev`) and the existing layout and components still render correctly.

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 3: Implement UI Wrappers, Form Composition, & Typography

### Overview

Build the foundational atomic UI components, a Typography component, and demonstrate component composition with a Form Control wrapper, utilizing the new semantic tokens (e.g. `--action-primary-bg`, `--status-error`, `--duration-fast`). Ensure interactivity is tested via Storybook.

### Changes Required

1. **Button** (`src/lib/components/ui/button/Button.svelte`):
   - Wrap `BitsButton.Root` and implement Svelte 5 `$props()`.
   - Support `variant` (primary, secondary, ghost) and `size`. Apply hover states using `--action-primary-hover` and transitions using `--duration-fast`.
   - Write interaction tests (`Button.stories.svelte`) using `play` function from `storybook/test` to verify click handling and focus.

2. **Typography** (`src/lib/components/ui/typography/Typography.svelte`):
   - Create a reusable text component for consistent rendering of headings and body copy.
   - Support `variant` (e.g. h1, h2, h3, p, span, small) and map them to their respective HTML tags and `--text-*` size tokens.

3. **Form Control Composition** (`src/lib/components/ui/form/`):
   - Create `Label.svelte`: A styled `<label>` mapping to typography semantics (`--text-secondary`).
   - Create `FieldWrapper.svelte`: A layout component linking a Label, Input, and Error Message together. Display error messages using `--status-error`.
   - Create `Input.svelte`: Wrap a standard HTML `<input>`. Apply semantic focus rings (`--border-focus`) and disabled states (`--opacity-disabled`).
   - Write interaction tests (`Input.stories.svelte`) to verify typing, focus, and error states.

### Success Criteria

#### Automated Verification

- [x] Type checking passes: `bun check`
- [x] Storybook interaction tests pass: `bun test:unit --project storybook`
- [x] Storybook builds successfully: `bun build-storybook`

---

## Phase 4: Storybook Integration & Documentation

### Overview

Document the new components and the underlying design system tokens.

### Changes Required

1. **Design System Documentation** (`src/stories/DesignSystem.stories.svelte`):
   - Implement a comprehensive Storybook story that visually renders the Color palettes, Typography scales, Spacing scales, Radius scales, and Shadow scales by reading the CSS variables directly from `app.css`.
2. **Component Stories** (`Button.stories.svelte`, `Input.stories.svelte`, `Typography.stories.svelte`, `FormControl.stories.svelte`):
   - Show all variants, sizes, focus rings, disabled states, and the composed form field with error states.

### Success Criteria

#### Automated Verification

- [x] Storybook tests pass: `bun test:unit --project storybook`
- [x] Storybook builds successfully: `bun build-storybook`

#### Manual Verification

- [x] Open Storybook (`bun storybook`) and visually verify the Design System documentation page correctly renders all 7 categories of tokens.
- [x] Verify Button and Input components in Storybook change correctly when the theme is toggled.
