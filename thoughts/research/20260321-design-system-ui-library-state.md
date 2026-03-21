---
date: 2026-03-21T11:11:03+08:00
git_commit: e3b2ff47a9a2cad409304bd8aec89c44f9272046
branch: main
topic: 'Introduce a design system and prepare for implementing a UI library'
tags: [research, codebase, design-system, ui-library, styling]
status: complete
last_updated: 2026-03-21
last_updated_by: Claude (Codebase Researcher)
---

# Research: Introduce a design system and prepare for implementing a UI library

**Date**: 2026-03-21T11:11:03+08:00
**Researcher**: Claude (Codebase Researcher)
**Git Commit**: e3b2ff47a9a2cad409304bd8aec89c44f9272046
**Branch**: main
**Repository**: bitterwater

## Research Question

Introduce a design system and prepare for implementing a UI library.

## Summary

The current project utilizes a bespoke design system implemented through plain CSS variables and Svelte's native scoped styling (`<style>` blocks). There are currently no third-party UI component libraries (e.g., Bits UI, Radix, Flowbite) or utility-first CSS frameworks (e.g., Tailwind CSS, UnoCSS) installed or configured in the repository.

A foundational component library environment is actively maintained using Storybook v10, integrated with Vite, SvelteKit, and Vitest for testing and documentation. Theme management (Light/Dark mode) is handled by a custom Svelte writable store that updates a `data-theme` attribute on the document root, which in turn toggles CSS variable values.

## Detailed Findings

### Dependency and Configuration State

- There are no design system frameworks or CSS utility libraries in `package.json`.
- The configuration files (`svelte.config.js`, `vite.config.ts`) contain no plugins for CSS processing frameworks (like PostCSS for Tailwind).
- A robust Storybook environment is configured (`.storybook/main.ts`, `.storybook/preview.ts`) using `@storybook/sveltekit` and includes addons for accessibility (`@storybook/addon-a11y`), docs (`@storybook/addon-docs`), and Vitest integration (`@storybook/addon-vitest`).

### Global Styling and Design Tokens (`static/app.css`)

- **Typography**: The application imports and uses "Itim" (cursive/display), "Inter" (sans-serif), and "Roboto Mono" (monospace) from Google Fonts.
- **Design Tokens**: Global CSS variables are defined on the `:root` selector.
  - Colors are structured semantically: `--color-primary`, `--color-primary-accent`, `--color-secondary`, `--color-background`, `--color-surface`, `--color-text`, `--color-border`, etc.
  - Sizing/Layout tokens include `--spacing: 1em;` and `--max-width: 60em;`.
- **Theming**: Dark mode overrides are applied via the `[data-theme='dark']` attribute selector, with a fallback to `@media (prefers-color-scheme: dark)`.

### Theme Management (`src/lib/theme.ts`)

- Theme state is managed using a Svelte `writable` store (`theme`).
- It initializes based on `localStorage` or `window.matchMedia('(prefers-color-scheme: dark)')`.
- A subscriber updates the `data-theme` attribute on `document.documentElement` and persists the choice to `localStorage`.
- The `toggleTheme` function toggles between 'light' and 'dark'.

### Current Components (`src/lib/components/`)

- Custom components are located in `src/lib/components` and subdirectories (e.g., `layout/`).
- Existing components include `FeatureCard.svelte`, `PlayPauseToggle.svelte`, and `layout/Header.svelte`.
- Each component implements its own styling within Svelte `<style>` blocks.
- They utilize the global CSS variables (e.g., `var(--color-primary)`, `var(--color-border)`) for consistent coloring and spacing.
- Inline styles are occasionally used for dynamic values via Svelte directives (e.g., `style:--bg-image` in `FeatureCard.svelte` and `style:--icon-size` in `PlayPauseToggle.svelte`).

## Code References

- `package.json:34-72` - Contains dependencies showing Storybook presence but no UI libraries.
- `static/app.css:3-25` - Defines the core design tokens (`:root` CSS variables) for the light theme.
- `static/app.css:27-43` - Defines the dark theme CSS variable overrides based on `[data-theme='dark']`.
- `src/lib/theme.ts:22-31` - Svelte writable store subscription that handles applying the theme to the DOM.
- `src/app.html:9` - Loads the global `app.css` stylesheet.
- `src/lib/components/FeatureCard.svelte:27-80` - Example of scoped CSS component implementation using global CSS variables.
- `.storybook/main.ts:3-13` - Details the current Storybook configuration and addons used for the component library.

## Architecture Documentation

**Styling Architecture**: The application follows a traditional scoped CSS architecture provided by Svelte. Global tokens are established in a single standard CSS file (`static/app.css`) and are consumed by individual Svelte components.

**Component Library Tooling**: Storybook serves as the workbench for component development, as evidenced by `.stories.svelte` files alongside `.svelte` components (e.g., `FeatureCard.stories.svelte`).

**Theme Architecture**: A hybrid user-preference/system-preference architecture. A Svelte store manages the reactive state, syncing with `localStorage` for persistence and the DOM (`data-theme` attribute) for CSS application. CSS variables are redefined when the attribute is present.
