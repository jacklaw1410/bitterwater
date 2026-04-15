# Design System - Bitter Water

Personal portfolio showcasing interactive experiments, creative coding. Svelte 5 + SvelteKit.

---

## Brand

### Personality

**Playful, Technical, Precise.** Delight in playfulness while maintaining high-quality execution.

### Aesthetic Direction

**Stripe, but more relaxed and playful.** Organic, less rigid than Swiss-style or corporate designs. Avoid overly serious or dry. Playful `Itim` typeface contrast with technical `Roboto Mono` and vibrant blue brand palette.

### Design Principles

1. **Playful Precision** - Harmonize handwritten charm with technical accuracy
2. **Organic Quality** - Relaxed, organic layouts over rigid grids
3. **Delightful Interaction** - Animations and micro-interactions that spark joy
4. **Functional Transparency** - Codebase is part of portfolio
5. **Accessible Inclusion** - WCAG AA, first-class light and dark modes

---

## Token Architecture

2-tier CSS token system in `static/app.css`.

### Tier 1: Primitives

Absolute values for building custom components.

```css
--brand-500: #3b82f6;
--space-4: 1rem;
--font-sans: 'Itim', cursive;
```

### Tier 2: Semantics

Contextual tokens for consistent theming.

```css
--surface-default: #ffffff;
--text-primary: var(--gray-900);
--action-primary-bg: var(--brand-500);
```

### Dark Mode

Semantic overrides via `[data-theme='dark']`.

```css
[data-theme='dark'] {
  --surface-default: var(--gray-900);
  --text-primary: var(--gray-50);
}
```

---

## Colors

### Brand Palette

Blue primary for actions, branding.

| Token         | Hex       | Usage              |
| ------------- | --------- | ------------------ |
| `--brand-50`  | `#eff6ff` | Light backgrounds  |
| `--brand-100` | `#dbeafe` | Hover states       |
| `--brand-200` | `#bfdbfe` | Borders            |
| `--brand-300` | `#93c5fd` | Disabled           |
| `--brand-400` | `#60a5fa` | Light text on dark |
| `--brand-500` | `#3b82f6` | Primary actions    |
| `--brand-600` | `#2563eb` | Primary hover      |
| `--brand-700` | `#1d4ed8` | Primary active     |
| `--brand-800` | `#1e40af` | Dark mode actions  |
| `--brand-900` | `#1e3a8a` | Dark headers       |

### Gray Scale

Neutral palette for text, surfaces, borders.

| Token        | Hex       | Usage                |
| ------------ | --------- | -------------------- |
| `--gray-50`  | `#f9fafb` | Light backgrounds    |
| `--gray-100` | `#f3f4f6` | Raised surfaces      |
| `--gray-200` | `#e5e7eb` | Borders              |
| `--gray-300` | `#d1d5db` | Disabled borders     |
| `--gray-400` | `#9ca3af` | Disabled text        |
| `--gray-500` | `#6b7280` | Secondary text       |
| `--gray-600` | `#4b5563` | Icons                |
| `--gray-700` | `#374151` | Dark borders         |
| `--gray-800` | `#1f2937` | Dark raised surfaces |
| `--gray-900` | `#111827` | Dark backgrounds     |

### Status Colors

| Token           | Hex       | Usage          |
| --------------- | --------- | -------------- |
| `--success-500` | `#22c55e` | Success states |
| `--warning-500` | `#f59e0b` | Warning states |
| `--error-500`   | `#ef4444` | Error states   |

### Semantic Tokens

```css
/* Surfaces */
--surface-default: #ffffff;
--surface-raised: var(--gray-50);
--surface-overlay: var(--gray-100);

/* Text */
--text-primary: var(--gray-900);
--text-secondary: var(--gray-500);
--text-inverse: #ffffff;
--text-disabled: var(--gray-400);

/* Actions */
--action-primary-bg: var(--brand-500);
--action-primary-hover: var(--brand-400);
--action-primary-active: var(--brand-600);

--action-secondary-hover: var(--gray-200);
--action-ghost-hover: var(--gray-100);

/* Borders */
--border-default: var(--gray-200);
--border-focus: var(--brand-500);

/* Status */
--status-success: var(--success-500);
--status-warning: var(--warning-500);
--status-error: var(--error-500);
```

---

## Typography

### Typefaces

```css
--font-sans: 'Itim', cursive; /* Display - playful handwritten */
--font-mono: 'Roboto Mono', monospace; /* Mono - technical precision */
```

### Font Stack

| Role    | Font        | Usage                    |
| ------- | ----------- | ------------------------ |
| Display | Itim        | Headlines, brand moments |
| Mono    | Roboto Mono | Code, technical content  |

### Type Scale

| Token         | Size     | Example          |
| ------------- | -------- | ---------------- |
| `--text-xs`   | 0.75rem  | Captions, labels |
| `--text-sm`   | 0.875rem | Secondary text   |
| `--text-base` | 1rem     | Body text        |
| `--text-lg`   | 1.125rem | Large body       |
| `--text-xl`   | 1.25rem  | Small headings   |
| `--text-2xl`  | 1.5rem   | Section headings |
| `--text-3xl`  | 1.875rem | Page headings    |
| `--text-4xl`  | 2.25rem  | Hero headings    |

### Font Weights

| Token             | Value | Usage           |
| ----------------- | ----- | --------------- |
| `--font-normal`   | 400   | Body text       |
| `--font-medium`   | 500   | Emphasized body |
| `--font-semibold` | 600   | Subheadings     |
| `--font-bold`     | 700   | Headlines       |

### Line Heights

| Token                   | Value | Usage             |
| ----------------------- | ----- | ----------------- |
| `--line-height-tight`   | 1.25  | Headlines         |
| `--line-height-normal`  | 1.5   | Body              |
| `--line-height-relaxed` | 1.625 | Long-form content |

---

## Spacing

### Spacing Scale

| Token        | rem     | px  | Usage           |
| ------------ | ------- | --- | --------------- |
| `--space-0`  | 0rem    | 0   | Reset           |
| `--space-1`  | 0.25rem | 4   | Tight gaps      |
| `--space-2`  | 0.5rem  | 8   | Icon gaps       |
| `--space-3`  | 0.75rem | 12  | Small padding   |
| `--space-4`  | 1rem    | 16  | Default padding |
| `--space-5`  | 1.25rem | 20  | Medium padding  |
| `--space-6`  | 1.5rem  | 24  | Section padding |
| `--space-8`  | 2rem    | 32  | Large gaps      |
| `--space-10` | 2.5rem  | 40  | XL gaps         |
| `--space-12` | 3rem    | 48  | Section breaks  |
| `--space-16` | 4rem    | 64  | Hero spacing    |

### Icon Sizes

| Token            | Size   |
| ---------------- | ------ |
| `--size-icon-sm` | 1rem   |
| `--size-icon-md` | 1.5rem |
| `--size-icon-lg` | 2rem   |

---

## Border Radius

| Token           | Value    | Usage                 |
| --------------- | -------- | --------------------- |
| `--radius-none` | 0px      | Sharp edges           |
| `--radius-sm`   | 0.25rem  | Inputs, small buttons |
| `--radius-md`   | 0.375rem | Cards, containers     |
| `--radius-lg`   | 0.5rem   | Large cards, modals   |
| `--radius-full` | 9999px   | Pills, avatars        |

### Usage

- **Buttons**: `--radius-sm`
- **Inputs**: `--radius-sm`
- **Cards**: `--radius-md`
- **Modals**: `--radius-lg`
- **Pills/Tags**: `--radius-full`

---

## Shadows

| Token           | Usage                    |
| --------------- | ------------------------ |
| `--shadow-none` | No shadow                |
| `--shadow-sm`   | Subtle elevation, inputs |
| `--shadow-md`   | Cards, dropdowns         |
| `--shadow-lg`   | Modals, overlays         |

### Shadow Direction

All shadows cast downward for natural depth perception.

---

## Motion

### Duration

| Token               | Value | Usage                |
| ------------------- | ----- | -------------------- |
| `--duration-fast`   | 150ms | Hover states         |
| `--duration-normal` | 300ms | Standard transitions |
| `--duration-slow`   | 500ms | Page transitions     |

### Easing

| Token               | Usage                               |
| ------------------- | ----------------------------------- |
| `--ease-in-out`     | Standard transitions                |
| `--ease-out-bounce` | Playful feedback (buttons, toggles) |

### Animation Principles

1. **Purposeful** - Every animation serves a function
2. **Quick** - Most interactions under 300ms
3. **Playful** - Bounce easing for delight moments
4. **Respectful** - Respect `prefers-reduced-motion`

---

## Z-Index

| Token          | Value | Usage            |
| -------------- | ----- | ---------------- |
| `--z-below`    | -1    | Behind content   |
| `--z-default`  | 1     | Stacking context |
| `--z-dropdown` | 40    | Dropdowns, menus |
| `--z-modal`    | 50    | Modals, overlays |

---

## Dark Mode

Toggle via `data-theme` attribute on `<html>`:

```html
<html data-theme="dark"></html>
```

### What Changes

| Token                 | Light         | Dark          |
| --------------------- | ------------- | ------------- |
| `--surface-default`   | `#ffffff`     | `--gray-900`  |
| `--surface-raised`    | `--gray-50`   | `--gray-800`  |
| `--surface-overlay`   | `--gray-100`  | `--gray-700`  |
| `--text-primary`      | `--gray-900`  | `--gray-50`   |
| `--text-secondary`    | `--gray-500`  | `--gray-400`  |
| `--border-default`    | `--gray-200`  | `--gray-600`  |
| `--action-primary-bg` | `--brand-500` | `--brand-600` |

---

## Component Guidelines

### Composition Strategy

Two patterns:

1. **bits-ui Wrappers** - Accessible primitives (Button, form controls)
2. **Custom Components** - Project-specific UI (Typography, FeatureCard)

### When to Use bits-ui

bits-ui provides WAI-ARIA compliance, keyboard navigation, focus management, tested accessibility.

Use for: `Button`, `Input`, `Select`, `Dropdown`, `Dialog`

### When to Build Custom

Build custom when:

- bits-ui doesn't have the component
- Need specific styling not achievable via CSS
- Project-specific behavior

Examples: `Typography`, `FeatureCard`, `PlayPauseToggle`

### Button Pattern

```svelte
<script lang="ts">
  import { Button as BitsButton } from 'bits-ui';
  import './Button.css';

  let { variant = 'primary', size = 'md', ... }: ButtonProps = $props();
</script>

<BitsButton.Root class={classes} {...restProps}>
  {@render children?.()}
</BitsButton.Root>
```

### Typography Pattern

```svelte
<script lang="ts">
  let { variant = 'body', ... }: TypographyProps = $props();

  let tag = $derived.by(() => {
    // Map semantic variant to HTML tag
  });
</script>

<svelte:element this={tag} class={classes}>
  {@render children?.()}
</svelte:element>
```

---

## File Structure

```
src/
├── lib/
│   └── components/
│       └── ui/
│           ├── button/      # bits-ui wrapper
│           ├── typography/  # Custom semantic component
│           └── form/        # Form controls (Input, Label)
└── stories/
    └── DesignSystem/        # Token documentation
        ├── 1. Primitives/   # Color, Typography, Spacing, Radius, Shadows
        └── 2. Semantics/     # Semantic color tokens

static/
└── app.css                  # Design tokens
```

---

## References

- Tokens: `static/app.css`
- Theme store: `src/lib/theme.ts`
- Components: `src/lib/components/ui/`
- Stories: `src/stories/DesignSystem/`
