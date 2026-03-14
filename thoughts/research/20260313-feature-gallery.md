---
date: 2026-03-13T15:22:18Z
git_commit: d33c3128ea329c82f8f63339f5abc0be1c84d134
branch: main
topic: 'Feature gallery/portfolio routing and layout'
tags: [research, routing, sveltekit, feature-gallery]
status: complete
last_updated: 2026-03-13
last_updated_by: Researcher
---

# Research: Feature gallery/portfolio routing and layout

**Date**: 2026-03-13T15:13:51Z
**Researcher**: Researcher
**Git Commit**: d33c3128ea329c82f8f63339f5abc0be1c84d134
**Branch**: main
**Repository**: svelte101

## Research Question

How can the existing feature pages (Brownian Motion, Pi Estimation, Cover Flow, Blob Morphing) be grouped into a gallery/portfolio?

- Change routing & folder structure
- Tune the visual layout of the site
- Allow continuous addition of new features in the future

## Summary

The app currently implements four independent feature pages as top-level SvelteKit routes (`/brownian-motion`, `/pi-estimation`, `/cover-flow`, `/blob-morphing`). Navigation is provided via a shared `Header` component that renders a nav link for each route. The root layout (`src/routes/+layout.svelte`) wraps all pages with a header and a `<main class="container">` wrapper.

To group these into a gallery, the chosen approach is to:

1. Group feature routes under a shared `/gallery` directory (`src/routes/gallery/<slug>`), so feature URLs become `/gallery/brownian-motion`, `/gallery/pi-estimation`, etc.
2. Implement a gallery landing page at `/gallery` that dynamically discovers available feature pages using `import.meta.glob` (avoiding manual bookkeeping).
3. Use a shared “feature card” component to render each discovered feature entry (title, description, thumbnail, link).

Extensibility is achieved by relying on a convention: each feature is a route directory under `src/routes/gallery/` and exports metadata (title/description/thumbnail) in a way the gallery landing page can discover (e.g., an exported `metadata` object or named export). The gallery can then render cards for every matching route automatically without manual updates.

## Detailed Findings

### Routing Structure (How Pages are Organized)

- **Root layout**: `src/routes/+layout.svelte` renders `<Header />` and wraps content in `<main class="container">`.
- **Home page**: `src/routes/+page.svelte` (route `/`).
- **Feature pages** (each a top-level route):
  - `src/routes/brownian-motion/+page.svelte` → `/brownian-motion`
  - `src/routes/pi-estimation/+page.svelte` → `/pi-estimation`
  - `src/routes/cover-flow/+page.svelte` → `/cover-flow`
  - `src/routes/blob-morphing/+page.svelte` → `/blob-morphing`

Each feature page is implemented as a standard SvelteKit page component, and most include `svelte:head` for a `<title>`.

### Navigation + Header

- Navigation links are defined in `src/lib/components/layout/Header.svelte` via a constant array:
  - `{ id: '/', name: 'Home' }
  - `{ id: '/brownian-motion', name: 'Brownian Motion' }
  - `{ id: '/pi-estimation', name: 'π Estimation' }
  - `{ id: '/cover-flow', name: 'Cover Flow' }
  - `{ id: '/blob-morphing', name: 'Blob Morphing' }
`

- The header uses `$app/state` `page.route.id` to mark the active link.
- The header includes a theme toggle and a decorative curve SVG.

### Layout & Styling

- Global styles are in `static/app.css` and define:
  - CSS variables for colors, typography, and spacing
  - `.container` class used in layout wrapper for max-width and padding
  - base styles for `h1`, `p`, `a`, `button`, etc.

- The root layout (`+layout.svelte`) uses `<main class="container">` to center content.
- Feature pages use plain HTML + components; there is no shared “page section” component beyond the layout container.

### Feature Page Structure (Common Patterns)

#### Brownian Motion (`/brownian-motion`)

- Uses state stored in `src/routes/brownian-motion/state.svelte.ts` (Svelte 5 Runes) and `initializeEffects()`.
- Page composes three components:
  - `Controls.svelte` (binds to state values)
  - `Statistics.svelte` (displays stats)
  - `BrownianMotion.svelte` (renders visualization)

#### Pi Estimation (`/pi-estimation`)

- Uses state stored in `src/routes/pi-estimation/state.svelte.ts` (Svelte 5 Runes) and `initialize()`.
- Page composes three components:
  - `Controls.svelte`
  - `Statistics.svelte`
  - `PiEstimation.svelte`

#### Cover Flow (`/cover-flow`)

- Single `+page.svelte` file with no subcomponents.
- Uses a `ul`/`li` list styled with CSS to create a carousel effect.
- Uses `$effect` from Svelte runtime to scroll into view on mount.

#### Blob Morphing (`/blob-morphing`)

- Single `+page.svelte` file.
- Uses inline SVG + `<animate>` on `<path>`; provides pause/resume controls.

### Tests & Coverage

- Unit test for home page: `src/routes/page.svelte.spec.ts`.
- Component tests exist for `Header.svelte` (via `Header.svelte.spec.ts`) and several feature components under `src/routes/brownian-motion/components` and `src/routes/pi-estimation/components`.
- E2E tests exist for each feature page in `e2e/` (e.g., `e2e/pi-estimation.test.ts`, `e2e/blob-morphing.test.ts`).

## Code References

- `src/routes/+layout.svelte` — shared layout wrapping all pages
- `src/lib/components/layout/Header.svelte` — navigation bar listing all features
- `static/app.css` — global styling and layout variables
- `src/routes/brownian-motion/+page.svelte` — feature page structure (controls + visualization)
- `src/routes/pi-estimation/+page.svelte` — feature page structure (controls + visualization)
- `src/routes/cover-flow/+page.svelte` — standalone carousel page + CSS
- `src/routes/blob-morphing/+page.svelte` — standalone SVG animation page

## Architecture Documentation (Current Patterns)

### Routing & Pages

- Uses SvelteKit file-based routing: each directory under `src/routes/` with `+page.svelte` becomes a route.
- No nested layouts or group layouts are currently used beyond the root `+layout.svelte`.

### Shared Layout + Navigation

- Root layout (`+layout.svelte`) is minimal: it includes `Header` and a `main.container` wrapper.
- Navigation is hard-coded in `Header.svelte` as an array of route objects.

### State Management

- Feature pages that require state use Svelte 5 Runes (`state.svelte.ts` files) and initialize via explicit calls (`initializeEffects()`, `initialize()`).

### Styling

- Global CSS is in `static/app.css`, with variables for theme and typography.
- Components and pages use local `<style>` blocks as needed.

## Related Research

- `thoughts/research/20260309-pi-estimation-visualizer.md` — discusses architecture and state patterns used for pi estimation.
- `thoughts/research/20260301-1200-navigation-header.md` — likely contains notes about the header nav structure.

## Open Questions

- None — the plan is to use a shared “feature card” component and move the existing feature routes under `/gallery/<slug>`.

---

## Potential Gallery/Portfolio Approaches (Descriptive)

### Chosen Approach — `/gallery` + Dynamic Discovery

- Group feature routes under `src/routes/gallery/` so URL paths become:
  - `/gallery/brownian-motion`
  - `/gallery/pi-estimation`
  - `/gallery/cover-flow`
  - `/gallery/blob-morphing`

- Create a gallery landing page at `src/routes/gallery/+page.svelte`.
  - This page uses `import.meta.glob` to discover all feature route modules in `src/routes/gallery/*/+page.svelte`.
  - Each feature route exports a small metadata object (e.g., `export const metadata = { title, description, thumbnail };`) so the gallery can render a card for it.

- Implement a shared `FeatureCard` component (e.g., `src/lib/components/FeatureCard.svelte`) that renders:
  - Title
  - Description
  - Thumbnail (or placeholder)
  - Link to the feature route

- Update the header navigation in `src/lib/components/layout/Header.svelte` to include a single `Gallery` link (`/gallery`).

- Because routes are now grouped under `/gallery`, existing top-level feature URLs will change. If preserving old URLs is needed, a redirect layer can be added (e.g., `src/routes/brownian-motion/+page.server.ts` redirecting to `/gallery/brownian-motion`).

---

## Next Steps (if desired)

1. Decide whether feature URLs should stay at the top-level or be grouped under `/features`.
2. Decide whether navigation should continue to hard-code feature routes (like today), or be driven by a shared manifest.
3. If a gallery page is desired, choose a visual layout strategy (cards, grid, list, etc.) and define required metadata (title/description/icon/thumbnail).

---

_End of research document._
